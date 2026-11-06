'use client'

import React, {useState, useEffect} from 'react';
import {mainHook} from "@/app/hooks/main";
import {CardProduct} from "@/app/home/components/cardProduct";
import {Footer} from "@/app/components/footer";
import {getProductsOthers, getProductsBalloon} from "@/app/home/api";
import {FirstHeaderHome} from "@/app/home/components/firstHeaderHome";
import {error, numberFormat} from "@/app/utils";
import {addBasketProduct, changeCountBasketProduct, deleteBasketProduct, getDataForOrders} from "@/app/basket/api";
import {ProductBalloonType, ProductType} from "@/app/home/types";
import {VerificationIcon} from "@/app/icons/verificationIcon";
import {BasketIcon} from "@/app/icons/basketIcon";
import {LightningIcon} from "@/app/icons/lightningIcon";
import {Spin, message, ConfigProvider} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {basketPersistStore} from "@/store/persistBasketStore";
import {MinusIcon} from "@/app/icons/minusIcon";
import {PlusIcon} from "@/app/icons/plusIcon";
import {ChangeBasketType} from "@/app/basket/types";
import {Drawer} from "@/app/components/drawer";
import {OneClickPay} from "@/app/basket/components/oneClickPay";
import {Loading} from "@/app/components/loading";


export default function Page() {
    mainHook("/home")
    const basketStore = basketPersistStore()

    const [messageApi, contextHolder] = message.useMessage()
    const [productsBalloon, setProductsBalloon] = useState<ProductBalloonType[]>([]);
    const [productsOthers, setProductsOthers] = useState<ProductType[]>([]);
    const [currentPage, setCurrentPage] = useState<"balloon" | "others">("balloon");
    const [currentAction, setCurrentAction] = useState<"buy" | "trade">("buy")
    const [activeBalloon, setActiveBalloon] = useState<ProductBalloonType>();

    const [priceInMKAD, setPriceInMKAD] = useState<number>(0)
    const [priceOutMKAD, setPriceOutMKAD] = useState<number>(0)
    const [priceUpToLevel, setPriceUpToLevel] = useState<number>(0)
    const [minOrderAmount, setMinOrderAmount] = useState<number>(0)
    const [openDrawerBuyOnClick, setOpenDrawerBuyOnClick] = useState<boolean>(false)

    const handleClickOpenDrawer = () => {
        setOpenDrawerBuyOnClick(false)
        Telegram.WebApp.HapticFeedback.impactOccurred("light")
    }

    useEffect(() => {
        getDataForOrders().then(r => {
            r.forEach((value) => {
                if (value.name === "price_in_MKAD") setPriceInMKAD(Number(value.value))
                else if (value.name === "price_out_MKAD") setPriceOutMKAD(Number(value.value))
                else if (value.name === "price_up_to_level") setPriceUpToLevel(Number(value.value))
                else if (value.name === "min_order_amount") setMinOrderAmount(Number(value.value))
            })
        })
        getProductsBalloon().then(r => {
            setProductsBalloon(r.sort((a, b) => a.id - b.id));
            if (r.length > 0) {
                setActiveBalloon(r[0]);
                if (basketStore.products.filter(product => product.product.id === r[0].id).filter(product => product.trade === (currentAction === "trade")).length > 0) setInBasket(true);
                else setInBasket(false);
            }
        })
    }, []);

    const handleChangePage = (page: "balloon" | "others") => {
        Telegram.WebApp.HapticFeedback.impactOccurred("light")
        setCurrentPage(page)
        if (page === "others" && productsOthers.length <= 0) {
            getProductsOthers().then(r => setProductsOthers(r))
        }
    }

    const handleChangeActiveBalloon = (balloon: ProductBalloonType) => {
        Telegram.WebApp.HapticFeedback.impactOccurred("light")
        if (basketStore.products.filter(product => product.product.id === balloon.id).filter(product => product.trade === (currentAction === "trade")).length > 0) setInBasket(true);
        else setInBasket(false);
        setActiveBalloon(balloon)
    }

    const handleChangeAction = (action: "buy" | "trade") => {
        Telegram.WebApp.HapticFeedback.impactOccurred("light")
        if (activeBalloon === undefined) {return}
        if (basketStore.products.filter(product => product.product.id === activeBalloon.id).filter(product => product.trade === (action === "trade")).length > 0) setInBasket(true);
        else setInBasket(false);
        setCurrentAction(action)
    }

    const [disabled, setDisabled] = useState<boolean>(false);
    const [inBasket, setInBasket] = useState<boolean>(false);

    const handleAddBasket = async () => {
        if (activeBalloon === undefined) {return}
        const basketProduct = await addBasketProduct(activeBalloon.id, currentAction === "trade")
        if (!basketProduct) return error(messageApi, "Товар не был добавлен, попробуйте позже")
        basketStore.addProduct(basketProduct);
        setInBasket(true);
    }

    const handleClickInBasket = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        setDisabled(true)
        await handleAddBasket()
        setDisabled(false)
    }

    const changeCountProductInBasket = async (change: ChangeBasketType) => {
        Telegram.WebApp.HapticFeedback.impactOccurred("light")
        if (activeBalloon === undefined) {return}
        const basketProduct = basketStore.products.filter(basketProduct => basketProduct.product.id === activeBalloon.id)[0]
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

    if (productsBalloon.length <= 0) {
        return <Loading/>
    }

    return (
        <main style={{paddingTop: 0}}>
            <ConfigProvider theme={{components: {Message: {contentBg: '#222', colorText: '#FFF', borderRadiusLG: 999}}}}>
                {contextHolder}
            </ConfigProvider>
            <FirstHeaderHome />
            <div className="flex w-full items-center justify-between bg-[#111111] p-1.5 rounded-2xl gap-1 text-[14px] leading-4 mt-3 font-medium font-sans">
                <div className={`flex w-full items-center cursor-pointer justify-center py-2 ${currentPage === "balloon" ? "rounded-xl bg-[#E1C272] text-black" : "text-[#FFF]"}`} onClick={() => handleChangePage("balloon")}>
                    <p>Закись азота</p>
                </div>
                <div className={`flex w-full items-center cursor-pointer justify-center py-2 ${currentPage === "others" ? "rounded-xl bg-[#E1C272] text-black" : "text-[#FFF]"}`} onClick={() => handleChangePage("others")}>
                    <p>Аксессуары</p>
                </div>
            </div>
            {
                currentPage === "balloon" ?
                    <>
                        <div className="flex flex-col w-full mt-5 bg-[#111111] rounded-3xl pt-3 font-sans">
                            <div className="flex w-full items-start px-5">
                                <div className="flex w-2/3 flex-col justify-between h-full pt-2 pb-3">
                                    <p className="text-[18px] leading-[18px] font-bold">Пищевая закись азота</p>
                                    <p className="text-xs leading-3 font-medium text-[#757575]">
                                        Веселящий газ, или закись азота N2O в баллоне — это развлечение, позволяющее отлично
                                        расслабиться, посмеяться в кругу друзей и даже немного подурачиться, при этом без
                                        алкоголя и запрещенных веществ.
                                    </p>
                                    <div className="flex w-full">
                                        <div
                                            className="flex items-center text-nowrap justify-center gap-1 text-xs leading-3 font-medium text-green-500 border border-green-500 py-1.5 px-2 rounded-full">
                                            <VerificationIcon width={14} height={14} color={"#22C55EFF"}/>
                                            <p>Товар сертифицирован</p>
                                        </div>
                                    </div>
                                    <div className="flex w-full">
                                        <span className="flex items-center pl-1 gap-1">
                                            <p className="text-[#E1C272] font-bold text-[20px] leading-[20px]">
                                                {numberFormat((currentAction === "buy" ? activeBalloon?.price : activeBalloon?.price_trade) ?? 0)}₽
                                            </p>
                                            <p className="text-[#757575] font-medium  text-[16px] leading-[16px]">
                                                • 1 шт
                                            </p>
                                        </span>
                                    </div>
                                </div>
                                <div className="flex w-1/3">
                                    <img src={activeBalloon?.image ?? "/azot.png"} alt={""} width={"100%"}/>
                                </div>
                            </div>
                            <div className="flex flex-col items-center w-full rounded-3xl px-3 pt-3 pb-4 text-[14px] leading-[14px] border border-[#171717]"
                                style={{background: "#0c0c0c"}}>
                                <div className="flex w-full items-center justify-center gap-2 font-medium">
                                    {
                                        productsBalloon.map((item, index) => (
                                            <div key={index}
                                                 onClick={() => handleChangeActiveBalloon(item)}
                                                 className={`flex w-full items-center justify-center p-2 bg-[#111111] cursor-pointer rounded-xl border ${activeBalloon?.id === item.id ? "border-[#E1C272] text-[#E1C272]" : "border-[#252525] text-white"}`}
                                            >
                                                <p>{item.size}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="flex w-full items-center justify-center gap-2 mt-3 font-medium">
                                    <div
                                        onClick={() => handleChangeAction("buy")}
                                        className={`flex w-full items-center justify-center py-2.5 bg-[#111111] rounded-xl border ${currentAction === "buy" ? "border-[#E1C272] text-[#E1C272]" : "border-[#252525] text-white"}`}>
                                        <p>Покупка</p>
                                    </div>
                                    <div
                                        onClick={() => handleChangeAction("trade")}
                                        className={`flex w-full items-center justify-center py-2.5 bg-[#111111] rounded-xl border ${currentAction === "trade" ? "border-[#E1C272] text-[#E1C272]" : "border-[#252525] text-white"}}`}>
                                        <p>Обмен</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full mt-1 font-sans text-[16px] leading-4 font-medium bg-[#0c0c0c] rounded-3xl p-3">
                            <button
                                onClick={() => setOpenDrawerBuyOnClick(true)}
                                className="flex w-full items-center justify-center bg-[#111111] rounded-2xl py-4 gap-2 text-[#E1C272] border border-[#E1C272] text-[16px] leading-4">
                                <LightningIcon width={16} height={16} color={"#E1C272"}/>
                                Купить сейчас
                            </button>
                            {
                                inBasket
                                    ?
                                    <button className="w-full flex items-center justify-between bg-[#E1C272] text-black font-semibold rounded-2xl text-[16px] leading-4 border border-[#E1C272]">
                                        <span className="h-full px-3 py-4" onClick={(event) => handleClickChangeCountProduct(event, "minus")}>
                                            <MinusIcon width={16} color={"#000000"}/>
                                        </span>
                                        <span className="flex items-center gap-1 py-4">
                                            <BasketIcon color={"#000000"} width={16} height={16}/>
                                            {activeBalloon === undefined ? 0 : basketStore.products.filter(product => product.product.id === activeBalloon.id)[0].count}
                                        </span>
                                        <span className="h-full px-3 py-4" onClick={(event) => handleClickChangeCountProduct(event, "plus")}>
                                            <PlusIcon width={16} height={16} color={"#000000"}/>
                                        </span>
                                    </button>
                                    :
                                    <button
                                        className="flex w-full items-center justify-center bg-[#E1C272] text-black rounded-2xl py-4 gap-2 border border-[#E1C272] text-[16px] leading-4"
                                        disabled={disabled}
                                        onClick={handleClickInBasket}
                                    >
                                        {
                                            disabled
                                                ?
                                                <div className="flex w-full items-center justify-center h-4">
                                                    <Spin size={"small"} indicator={<LoadingOutlined spin style={{color: 'black'}}/>}/>
                                                </div>
                                                : <><BasketIcon width={16} height={16} color={"#000"}/> В корзину</>
                                        }
                                    </button>
                            }
                        </div>
                    </>
                    :
                    <>
                        <div className="w-full grid grid-cols-2 items-center gap-1 justify-between pt-4">
                        {productsOthers.map((product, index) => (
                                <CardProduct {...product} key={index} priceInMKAD={priceInMKAD}
                                             priceOutMKAD={priceOutMKAD} priceUpToLevel={priceUpToLevel}
                                             minOrderAmount={minOrderAmount}/>
                            ))}
                        </div>
                        {productsOthers.length < 1 &&
                            <div className="flex flex-col w-full gap-2 pt-4">
                                <div className="w-full grid grid-cols-2 items-center gap-1 justify-between">
                                    {[1, 2, 3, 4, 5, 6].map(number => (<div key={number} className="w-full h-[335px] rounded-[32px] animate-skeleton"/>))}
                                </div>
                            </div>
                        }
                    </>
            }
            {openDrawerBuyOnClick && activeBalloon && <Drawer open={openDrawerBuyOnClick} setOpen={handleClickOpenDrawer}>
                <OneClickPay products={[activeBalloon]} createOrder={handleCreateOrder} priceInMKAD={priceInMKAD}
                             priceOutMKAD={priceOutMKAD} priceUpToLevel={priceUpToLevel}
                             minOrderAmount={minOrderAmount} trade={currentAction === "trade"}/>
            </Drawer>}
            <Footer/>
        </main>
    );
}