'use client'

import React, {useState} from 'react';
import {numberFormat} from "@/app/utils";
import {BasketFlashIcon} from "@/app/icons/basketFlashIcon";
import {BasketIcon} from "@/app/icons/basketIcon";
import {MinusIcon} from "@/app/icons/minusIcon";
import {PlusIcon} from "@/app/icons/plusIcon";
import {ProductType} from "@/app/home/types";
import {basketPersistStore} from "@/store/persistBasketStore";
import {Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {ChangeBasketType} from "@/app/basket/types";
import {OneClickPay} from "@/app/basket/components/oneClickPay";
import {Drawer} from "@/app/components/drawer";

type Props = ProductType & {
    disabled: boolean;
    inBasket: boolean;
    handleClickInBasket: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void | Promise<void>;
    handleClickChangeCountProduct: (event: React.MouseEvent, change: ChangeBasketType) => void | Promise<void>;
    isFullScreen?: boolean;
    priceInMKAD: number;
    priceOutMKAD: number;
    priceUpToLevel: number;
    minOrderAmount: number;
}

export function FullCardProduct(props: Props) {
    const basketStore = basketPersistStore();
    const {disabled, inBasket, handleClickInBasket, handleClickChangeCountProduct, isFullScreen} = props;
    const [openDrawerBuyOnClick, setOpenDrawerBuyOnClick] = useState<boolean>(false)

    const handleClickOpenDrawer = () => {
        setOpenDrawerBuyOnClick(false)
        Telegram.WebApp.HapticFeedback.impactOccurred("light")
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

    const handleClickBuyOnClick = () => {
        Telegram.WebApp.HapticFeedback.impactOccurred("light");
        setOpenDrawerBuyOnClick(true);
    }

    return (
        <div className={`flex flex-col w-full h-full items-center font-sans ${isFullScreen ? 'justify-between pb-10' : ''}`}>
            <div className="flex flex-col w-full items-center">
                <div className="relative w-full flex items-center justify-center rounded-[32px] bg-[#111111] p-4">
                    <div className="absolute bg-white bg-opacity-5 rounded-full w-1/2 h-1/2 blur-xl"/>
                    {props.hit && <div
                        className="absolute flex items-center justify-center left-0 top-0 bg-[#E1C272] rounded-full w-[30px] h-[30px] text-black text-[10px] leading-[10px] font-bold mt-5 ml-5">
                        <p>ХИТ</p>
                    </div>}
                    <div
                        className="absolute flex items-center justify-center right-0 top-0 rounded-full w-[30px] h-[30px] text-[#757575] text-[10px] leading-[10px] font-bold mt-5 mr-5">
                        <p>{props.size}</p>
                    </div>
                    <img src={props.image} alt="" style={{zIndex: 50, height: 300}}/>
                </div>
                <p className="mt-5 text-[16px] text-center font-semibold leading-4 text-white uppercase">{props.name}</p>
                <div className="flex flex-col items-center w-full mt-5">
                    {props.old_price
                        ?
                        <p className="text-[14px] leading-[14px] text-[#757575] mb-1 line-through">{props.old_price}₽</p>
                        : null
                    }
                    <p className="text-[#E1C272] text-[22px] leading-[22px] font-semibold">{numberFormat(props.price)}₽</p>
                </div>
                <div className="w-full flex mt-5 text-[14px] font-normal leading-[14px] text-[#757575]">
                    <p className="text-left text-[12px] leading-[12px] font-normal text-[#757575] w-full pl-[2px] text-ellipsis line-clamp-2">
                        {props.description}
                    </p>
                </div>
            </div>
            <div className="flex flex-col w-full items-center mt-5">
                <button onClick={handleClickBuyOnClick} className="flex items-center justify-center gap-2 w-full py-5 text-[16px] leading-4 text-white font-medium rounded-[20px] bg-transparent border border-[#E1C272]">
                    <BasketFlashIcon/> Купить в 1 клик
                </button>
                <button
                    className={`flex items-center ${disabled || !inBasket ? 'justify-center' : 'justify-between'} mt-1 w-full text-[16px] leading-4 text-black font-bold rounded-[20px] bg-[#E1C272] border border-[#E1C272]`}
                    disabled={disabled}
                    onClick={!inBasket ? handleClickInBasket : () => {
                    }}
                >
                    {
                        disabled
                            ?
                            <div className="flex items-center py-5">
                                <Spin indicator={<LoadingOutlined spin style={{color: 'black', width: 16, height: 16}}/>}/>
                            </div>
                            :
                            !inBasket
                                ? <div className="flex items-center gap-2 py-5"><BasketIcon color={"#000000"} width={16} height={16}/> В корзину</div>
                                :
                                <>
                                    <span className="flex items-center h-full py-5 px-5" onClick={(event) => handleClickChangeCountProduct(event, "minus")}>
                                        <MinusIcon width={16} height={3} color={"#000000"}/>
                                    </span>
                                    <span className="flex items-center gap-2 py-5">
                                        <BasketIcon color={"#000000"} width={16} height={16}/>
                                        {basketStore.products.filter(product => product.product.id === props.id)[0].count}
                                    </span>
                                    <span className="flex items-center h-full py-5 px-5" onClick={(event) => handleClickChangeCountProduct(event, "plus")}>
                                        <PlusIcon width={16} height={16} color={"#000000"}/>
                                    </span>
                                </>
                    }
                </button>
            </div>
            <Drawer open={openDrawerBuyOnClick} setOpen={handleClickOpenDrawer}>
                <OneClickPay products={[props]} createOrder={handleCreateOrder} priceUpToLevel={props.priceUpToLevel} priceInMKAD={props.priceInMKAD} priceOutMKAD={props.priceOutMKAD} minOrderAmount={props.minOrderAmount}/>
            </Drawer>
        </div>
    );
}