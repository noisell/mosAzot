'use client'

import React, { useState, useEffect } from 'react';
import {basketPersistStore} from "@/store/persistBasketStore";
import {DeliveryType, PromoCodeSimpleType} from "@/app/basket/types";
import {getDataForOrders} from "@/app/basket/api";
import {message, ConfigProvider, Select, Switch} from "antd";
import {CaretDownOutlined, SignalFilled, DollarOutlined, ClockCircleFilled, ShoppingFilled} from "@ant-design/icons";
import {BasketProductCard} from "@/app/basket/components/basketProductCard";
import {PromoInput} from "@/app/basket/components/promoInput";
import {numberFormat} from "@/app/utils";
import {Footer} from "@/app/components/footer";
import {Drawer} from "@/app/components/drawer";
import {OrderCreateDrawer} from "@/app/basket/components/orderCreateDrawer";

export function Basket() {
    const basketStore = basketPersistStore()

    const [messageApi, contextHolder] = message.useMessage()

    const [openDrawer, setOpenDrawer] = useState<boolean>(false)
    const [promoCode, setPromoCode] = useState<string>("")
    const [promoCodeData, setPromoCodeData] = useState<PromoCodeSimpleType>()

    const [needUpToLevel, setNeedUpToLevel] = useState<boolean>(false)
    const [priceUpToLevel, setPriceUpToLevel] = useState<number>()

    const [priceInMKAD, setPriceInMKAD] = useState<number>()
    const [priceOutMKAD, setPriceOutMKAD] = useState<number>()
    const [minOrderAmount, setMinOrderAmount] = useState<number>()
    const [delivery, setDelivery] = useState<DeliveryType>("in_MKAD")

    const handleActivationPromoCode = async (promoCode?: PromoCodeSimpleType) => {
        setPromoCodeData(promoCode)
    }
    const handleChangeUpToLevel = (checked: boolean) => {
        Telegram.WebApp.HapticFeedback.impactOccurred("light")
        setNeedUpToLevel(checked);
    };

    const handleChangeDelivery = (value: DeliveryType) => {
        if (delivery === value) return
        Telegram.WebApp.HapticFeedback.impactOccurred("light")
        setDelivery(value);
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
    }, [])

    const [amountProducts, setAmountProducts] = useState<number>(0)
    const [amountActualProducts, setAmountActualProducts] = useState<number>(0)
    const [amountDelivery, setAmountDelivery] = useState<number>(0)
    const [amountSale, setAmountSale] = useState<number>(0)
    const [amountFinal, setAmountFinal] = useState<number>(0)

    useEffect(() => {
        setAmountProducts(
            basketStore.products.reduce((a, b) => {
                return a + (b.product.old_price !== null ? b.product.old_price : (b.trade && b.product.price_trade ? b.product.price_trade : b.product.price)) * b.count
            }, 0)
        )
        setAmountActualProducts(
            basketStore.products.reduce((a, b) => {
                return a + (b.trade && b.product.price_trade ? b.product.price_trade : b.product.price) * b.count
            }, 0)
        )
    }, [basketStore.products]);

    useEffect(() => {
        const promoSale = promoCodeData?.amount === undefined ? 0 : promoCodeData.amount < 0 ? Math.floor(amountActualProducts / 100 * Math.abs(promoCodeData.amount)) : promoCodeData.amount
        setAmountFinal(amountActualProducts - promoSale + amountDelivery)
        setAmountSale(amountProducts - amountActualProducts + promoSale)
    }, [amountActualProducts, promoCodeData, amountDelivery]);

    useEffect(() => {
        setAmountDelivery(
            (delivery === 'in_MKAD' ? (priceInMKAD ?? 0) : (priceOutMKAD ?? 0)) + (needUpToLevel ? (priceUpToLevel ?? 0) : 0)
        )
    }, [delivery, priceInMKAD, priceOutMKAD, needUpToLevel, priceUpToLevel]);

    const handleClickContinue = () => {
        Telegram.WebApp.HapticFeedback.impactOccurred("light")
        setOpenDrawer(true)
    }

    const handleCreateOrder = (result: boolean) => {
        Telegram.WebApp.HapticFeedback.notificationOccurred("success")
        setOpenDrawer(false)
        if (result) {
            basketStore.replaceProducts([])
            Telegram.WebApp.showPopup({
                title: "Спасибо за заказ!",
                message: "В ближайшее время вам перезвонит оператор для уточнения данных.",
                buttons: [
                    {type: "close"}
                ]
            })
        }
    }

    const [paddingBottom, setPaddingBottom] = useState<number>(0);

    const onFocus = () => {
        setPaddingBottom(300);
    }
    const onBlur = () => {
        setPaddingBottom(0);
    }

    return (
        <div className="flex w-full flex-col items-center" style={{paddingBottom: paddingBottom}}>
            <ConfigProvider
                theme={{components: {Message: {contentBg: '#222', colorText: '#FFF', borderRadiusLG: 999}}}}>
                {contextHolder}
            </ConfigProvider>
            <div
                className="flex w-full mt-3 justify-start items-center gap-2 px-3 text-[16px] leading-4 font-bold text-[#FFFFFF]">
                <ShoppingFilled style={{ fontSize: 16, color: "#FFFFFF" }} />
                <p>Товары</p>
            </div>
            <div className="flex w-full flex-col items-center gap-2 mt-3">
                {basketStore.products.map((product) => (
                    <BasketProductCard {...product} />
                ))}
            </div>
            <div className="flex flex-col w-full mt-8 gap-3 font-sans">
                <div className="flex w-full items-center gap-2 px-3 text-[16px] leading-4 font-bold text-[#FFFFFF]">
                    <ClockCircleFilled style={{ fontSize: 16, color: "#FFFFFF" }} />
                    <p>Доставка</p>
                </div>
                <div className="flex w-full flex-col bg-[#111111] rounded-2xl p-3 gap-2">
                    <div className="flex w-full items-center justify-between bg-[#171717] rounded-xl py-1.5 pl-3 pr-1.5"
                         onClick={() => handleChangeDelivery("in_MKAD")}
                    >
                        <div className="flex items-center gap-2 font-medium">
                            <p>В пределах МКАД</p>
                        </div>
                        <div className={`flex items-center gap-2 bg-[#111111] rounded-xl py-1 px-3 ${delivery === 'in_MKAD' ? 'text-[#E1C272]' : 'text-[#757575]'}`}>
                            <p>{priceInMKAD ?? '...'}₽</p>
                            <div className={`w-[18px] h-[18px] border-[5px] ${delivery === 'in_MKAD' ? 'border-[#E1C272]' : 'border-[#171717]'} bg-[#171717] rounded-full`}/>
                        </div>
                    </div>
                    <div className="flex w-full items-center justify-between bg-[#171717] rounded-xl py-1.5 pl-3 pr-1.5"
                         onClick={() => handleChangeDelivery("out_MKAD")}
                    >
                        <div className="flex items-center gap-2 font-medium">
                            <p>За переделы МКАД</p>
                        </div>
                        <div className={`flex items-center gap-2 bg-[#111111] rounded-xl py-1 px-3 ${delivery === 'out_MKAD' ? 'text-[#E1C272]' : 'text-[#757575]'}`}>
                            <p>от {priceOutMKAD ?? '...'}₽</p>
                            <div className={`w-[18px] h-[18px] border-[5px] ${delivery === 'out_MKAD' ? 'border-[#E1C272]' : 'border-[#171717]'} bg-[#171717] rounded-full`}/>
                        </div>
                    </div>
                </div>
            </div>
            <ConfigProvider theme={{
                components:
                    {
                        Select: {
                            colorBgContainer: '#171717',
                            colorBorder: 'transparent',
                            colorText: '#E1C272',
                            colorTextDisabled: '#757575',
                            colorTextPlaceholder: '#757575',
                            borderRadiusLG: 12,
                            borderRadius: 12,
                            colorPrimary: 'transparent',
                            colorBgElevated: '#171717',
                            optionSelectedBg: '#171717',
                            controlOutlineWidth: 0,
                            colorPrimaryHover: 'transparent',
                        },
                        Switch: {
                            colorPrimary: '#E1C272',
                            colorPrimaryHover: '#E1C272',
                            colorTextLightSolid: "#000000",
                            fontSizeSM: 14,
                            handleBg: "#111111",
                            colorTextTertiary: "#171717",
                            colorTextQuaternary: "#171717",
                            lineHeight: 2,
                            handleShadow: "none"
                        }
                    }
            }}>
                <div
                    className="flex w-full items-center mt-2 justify-between text-white text-[16px] leading-4 font-medium bg-[#111111] pl-4 pr-3 py-3 rounded-2xl">
                    <div className="flex items-center gap-2">
                        <SignalFilled style={{fontSize: '14px', color: "#FFFFFF"}}/>
                        <p>Подъем на этаж</p>
                    </div>

                    <Switch checkedChildren={`${priceUpToLevel ?? '...'}₽`} unCheckedChildren="0₽" defaultChecked value={needUpToLevel} onChange={handleChangeUpToLevel}/>
                </div>
                <div
                    className="flex w-full items-center mt-8 justify-between text-white text-[16px] leading-4 font-medium bg-[#111111] pl-4 pr-3 py-2.5 rounded-2xl">
                    <div className="flex items-center gap-2">
                        <DollarOutlined style={{fontSize: '16px', color: "#FFFFFF"}}/>
                        <p>Способ оплаты</p>
                    </div>

                    <Select
                        defaultValue={"online"}
                        options={[
                            {value: 'online', label: 'Предоплата'},
                            {value: 'courier', label: 'Курьеру'},
                        ]}
                        size='middle'
                        suffixIcon={
                            <CaretDownOutlined
                                style={{fontSize: '14px', color: "#E1C272"}}
                            />
                        }
                    />
                </div>
            </ConfigProvider>
            <div
                className="flex w-full mt-2 items-center bg-[#111111] px-4 rounded-2xl py-3 justify-between gap-2 font-sans">
                <PromoInput value={promoCode} setValue={setPromoCode} placeholder={"Промокод"} messageApi={messageApi}
                            onActivating={handleActivationPromoCode} onFocus={onFocus} onBlur={onBlur}/>
                {promoCodeData ?
                    <p className="flex items-center justify-end gap-2 text-[14px] leading-[14px] font-medium text-green-600 text-nowrap">
                        {promoCodeData.amount < 0 ? `${promoCodeData.amount}%` : `-${promoCodeData.amount}₽`}
                    </p>
                    :
                    <p className="flex items-center justify-end gap-2 text-[14px] leading-[14px] font-medium text-[#757575] text-nowrap">
                        0%
                    </p>
                }
            </div>
            <div className="flex flex-col w-full px-2 mt-8 font-sans">
                <p className="text-[16px] leading-4 font-bold">К оплате</p>
                <div className="flex flex-col w-full mt-3 gap-1 pb-3 border-b-[0.5px] border-[#5B5B5B]">
                    <div className="flex items-center justify-between w-full">
                        <p className="text-[14px] leading-4 font-normal text-[#757575]">Товары:</p>
                        <p className="text-[14px] leading-4 font-normal">{numberFormat(amountProducts)}₽</p>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <p className="text-[14px] leading-4 font-normal text-[#757575]">Доставка:</p>
                        <p className="text-[14px] leading-4 font-normal">{numberFormat(amountDelivery)}₽</p>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <p className="text-[14px] leading-4 font-medium text-[#757575]">Скидка:</p>
                        <p className="text-[14px] leading-4 font-medium">{numberFormat(amountSale)}₽</p>
                    </div>
                </div>
                <div className="flex items-center justify-between w-full mt-3 text-[#E1C272]">
                    <p className="text-[16px] leading-4 font-bold">ИТОГО:</p>
                    <p className="text-[16px] leading-4 font-medium">{numberFormat(amountFinal)}₽</p>
                </div>
            </div>
            {amountFinal >= (minOrderAmount ?? 0) ?
                <button
                    className="w-full text-[16px] leading-4 mt-5 bg-[#E1C272] text-black font-semibold  rounded-2xl py-4"
                    onClick={handleClickContinue}
                >
                    Продолжить
                </button>
                :
                <>
                    <button
                        className="w-full text-[16px] leading-4 mt-5 bg-[#E1C272] text-black font-semibold  rounded-2xl py-4 opacity-30"
                        disabled={true}
                    >
                        Продолжить
                    </button>
                    <p className="font-sans text-xs leading-3 mt-1 text-[#757575]">Минимальная сумма заказа • {(minOrderAmount ?? 0)}₽</p>
                </>
            }
            <Footer/>
            <Drawer open={openDrawer} setOpen={setOpenDrawer} fullScreen>
                <OrderCreateDrawer amountFinal={amountFinal} amountSale={amountSale} upToLevel={needUpToLevel} deliveryType={delivery} promoCode={promoCode} createOrder={handleCreateOrder}/>
            </Drawer>
        </div>
    );
}