'use client'

import React, {useEffect, useState} from 'react';
import {error, numberFormat} from "@/app/utils";
import {Drawer} from "@/app/components/drawer";
import {BasketIcon} from "@/app/icons/basketIcon";
import {ProductType} from "@/app/home/types";
import {basketPersistStore} from "@/store/persistBasketStore";
import {MinusIcon} from "@/app/icons/minusIcon";
import {PlusIcon} from "@/app/icons/plusIcon";
import {addBasketProduct, changeCountBasketProduct, deleteBasketProduct} from "@/app/basket/api";
import {message, ConfigProvider, Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {ChangeBasketType} from "@/app/basket/types";
import {FullCardProduct} from "@/app/home/components/fullCardProduct";
import {OneClickPay} from "@/app/basket/components/oneClickPay";

type Props = ProductType & {
    priceInMKAD: number;
    priceOutMKAD: number;
    priceUpToLevel: number;
    minOrderAmount: number;
}

export function CardProduct(props: Props) {
    const basketStore = basketPersistStore()
    const [messageApi, contextHolder] = message.useMessage()
    const [disabled, setDisabled] = React.useState<boolean>(false)
    const [openDrawer, setOpenDrawer] = useState<boolean>(false)
    const [openDrawerBuyOnClick, setOpenDrawerBuyOnClick] = useState<boolean>(false)
    const [inBasket, setInBasket] = useState(basketStore.products.filter(product => product.product.id === props.id).length > 0)


    useEffect(() => {
        setInBasket(basketStore.products.filter(product => product.product.id === props.id).length > 0)
    }, [])

    const handleClickOpenDrawer = () => {
        setOpenDrawer(false)
        setOpenDrawerBuyOnClick(false)
        Telegram.WebApp.HapticFeedback.impactOccurred("light")
    }

    const addProductInBasket = async () => {
        Telegram.WebApp.HapticFeedback.impactOccurred("light")
        const basketProduct = await addBasketProduct(props.id)
        if (!basketProduct) return error(messageApi, "Товар не был добавлен, попробуйте позже")
        basketStore.addProduct(basketProduct);
        setInBasket(true)
    }

    const handleClickInBasket = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        setDisabled(true)
        await addProductInBasket()
        setDisabled(false)
    }

    const changeCountProductInBasket = async (change: ChangeBasketType) => {
        Telegram.WebApp.HapticFeedback.impactOccurred("light")
        const basketProduct = basketStore.products.filter(basketProduct => basketProduct.product.id === props.id)[0]
        if (change === "minus") {
            if (basketProduct.count <= 1) {
                setInBasket(false)
                basketStore.deleteProduct(basketProduct.id)
                await deleteBasketProduct(basketProduct.id)
            } else {
                basketStore.minusProductCount(basketProduct.id)
                await changeCountBasketProduct(basketProduct.id, "minus")
            }
        } else {
            basketStore.plusProductCount(basketProduct.id)
            await changeCountBasketProduct(basketProduct.id, "plus")
        }
    }

    const handleClickChangeCountProduct = async (event: React.MouseEvent, change: ChangeBasketType) => {
        event.stopPropagation();
        setDisabled(false)
        await changeCountProductInBasket(change)
        setDisabled(false)
    }

    const handleCreateOrder = (result: boolean) => {
        Telegram.WebApp.HapticFeedback.notificationOccurred("success")
        setOpenDrawerBuyOnClick(false)
        if (result) {
            Telegram.WebApp.showPopup({
                title: "Спасибо за заказ!",
                message: "В ближайшее время вам перезвонит оператор для уточнения данных.",
                buttons: [
                    {type: "close"}
                ]
            })
        }
    }

    return (
        <>
            <ConfigProvider theme={{components: {Message: {contentBg: '#222', colorText: '#FFF', borderRadiusLG: 999}}}}>
                {contextHolder}
            </ConfigProvider>
            <div
                className="relative flex flex-col w-full items-center rounded-[28px] bg-[#111111] py-3 px-2 font-sans overflow-hidden cursor-pointer"
                onClick={() => setOpenDrawer(true)}>
                {props.hit && <div
                    className="absolute flex items-center justify-center left-0 top-0 bg-[#E1C272] rounded-full w-[30px] h-[30px] text-black text-[10px] leading-[10px] font-bold mt-3 ml-3">
                    <p>ХИТ</p>
                </div>}
                <div
                    className="absolute flex items-center justify-center right-0 top-0 rounded-full w-[30px] h-[30px] text-[#757575] text-[10px] leading-[10px] font-bold mt-3 mr-3">
                    <p>{props.size}</p>
                </div>
                <div className="relative flex w-full items-center justify-center">
                    <div className="absolute bg-white bg-opacity-15 rounded-full w-1/2 h-1/2 blur-xl"/>
                    <img src={props.image} alt="" style={{zIndex: 50, height: 160}}/>
                </div>
                <div className="flex flex-col items-center w-full h-[64px] mt-3 gap-3">
                    <p className="text-center text-[14px] leading-[14px] font-semibold text-white w-full px-2">{props.name}</p>
                    <p className="text-left text-[12px] leading-[12px] font-normal text-[#757575] w-full pl-[2px] text-ellipsis line-clamp-2">
                        {props.description}
                    </p>
                </div>
                <div className="flex items-center mt-2 w-full gap-1">
                    <button
                        className="w-full bg-[#202020] rounded-xl font-semibold text-xs leading-3 py-2 border-[0.5px] border-[#202020] text-[#E1C272]">
                        {numberFormat(props.price)}₽
                    </button>
                    <button
                        className="w-full bg-[#202020] font-semibold rounded-xl text-xs leading-3 py-2 border-[0.5px] border-[#E1C272]"
                        onClick={() => setOpenDrawerBuyOnClick(true)}>
                        Купить
                    </button>
                </div>
                {
                    !inBasket ?
                        <button
                            className="flex items-center justify-center w-full bg-[#E1C272] text-black font-semibold rounded-2xl text-[14px] leading-[14px] px-3 py-3.5 mt-2"
                            disabled={disabled}
                            onClick={handleClickInBasket}
                        >
                            {
                                disabled
                                    ? <Spin size={"small"} indicator={<LoadingOutlined spin style={{
                                        color: 'black',
                                        width: 14,
                                        height: 14
                                    }}/>}/>
                                    : <>В корзину</>
                            }
                        </button>
                        :
                        <button
                            className="w-full flex items-center justify-between bg-[#E1C272] text-black font-semibold rounded-2xl text-[14px] leading-[14px] mt-2">
                            <span className="h-full px-3 py-3.5"
                                  onClick={(event) => handleClickChangeCountProduct(event, "minus")}>
                                <MinusIcon width={14} color={"#000000"}/>
                            </span>
                            <span className="flex items-center gap-1 py-3.5">
                                <BasketIcon color={"#000000"} width={14} height={14}/>
                                {basketStore.products.filter(product => product.product.id === props.id)[0].count}
                            </span>
                            <span className="h-full px-3 py-3.5"
                                  onClick={(event) => handleClickChangeCountProduct(event, "plus")}>
                                <PlusIcon width={14} height={14} color={"#000000"}/>
                            </span>
                        </button>
                }
            </div>
            {openDrawer && <Drawer open={openDrawer} setOpen={handleClickOpenDrawer}>
                <FullCardProduct {...props} disabled={disabled} inBasket={inBasket}
                                 handleClickInBasket={handleClickInBasket}
                                 handleClickChangeCountProduct={handleClickChangeCountProduct}
                                 priceInMKAD={props.priceInMKAD} priceOutMKAD={props.priceOutMKAD}
                                 priceUpToLevel={props.priceUpToLevel} minOrderAmount={props.minOrderAmount}/>
            </Drawer>}
            {openDrawerBuyOnClick && <Drawer open={openDrawerBuyOnClick} setOpen={handleClickOpenDrawer}>
                <OneClickPay products={[props]} createOrder={handleCreateOrder} priceInMKAD={props.priceInMKAD}
                             priceOutMKAD={props.priceOutMKAD} priceUpToLevel={props.priceUpToLevel}
                             minOrderAmount={props.minOrderAmount}/>
            </Drawer>}
        </>
    );
}