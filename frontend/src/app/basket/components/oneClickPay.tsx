'use client'

import React, {useEffect, useState} from 'react';
import {ProfileOblickIcon} from "@/app/icons/profileOblickIcon";
import {CustomInput} from "@/app/components/customInput";
import {HomeIcon} from "@/app/icons/homeIcon";
import {AddressSimpleComponent} from "@/app/basket/components/addressSimpleComponent";
import {CommentInput} from "@/app/basket/components/commentInput";
import {VerificationIcon} from "@/app/icons/verificationIcon";
import {userPersistStore} from "@/store/persistUserStore";
import {SimplePhoneNumberInput} from "@/app/basket/components/simplePhoneNumberInput";
import {numberFormat} from "@/app/utils";
import {createOrder, getDataForOrders} from "@/app/basket/api";
import {DeliveryType, PromoCodeSimpleType} from "@/app/basket/types";
import {Spin, message, ConfigProvider, Switch, Select} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';
import {PromoInput} from "@/app/basket/components/promoInput";
import {SignalFilled, ClockCircleFilled, DollarOutlined, CaretDownOutlined} from "@ant-design/icons";
import {ProductBalloonType, ProductType} from "@/app/home/types";


type Props = {
    products: ProductType[] | ProductBalloonType[];
    createOrder: (result: boolean) => void;
    priceInMKAD: number;
    priceOutMKAD: number;
    priceUpToLevel: number;
    minOrderAmount: number;
    trade?: boolean;
}

export function OneClickPay(props: Props) {
    const userStore = userPersistStore()
    const {products, priceInMKAD, priceOutMKAD, priceUpToLevel, minOrderAmount, trade} = props;
    const [messageApi, contextHolder] = message.useMessage()

    const [comment, setComment] = useState<string>('')
    const [phoneNumber, setPhoneNumber] = useState<string>(userStore.phoneNumber)
    const [name, setName] = useState<string>(userStore.firstName)

    const [promoCode, setPromoCode] = useState<string>("")
    const [promoCodeData, setPromoCodeData] = useState<PromoCodeSimpleType>()
    const [needUpToLevel, setNeedUpToLevel] = useState<boolean>(false)

    const [amountFinal, setAmountFinal] = useState<number>(products.reduce((a, b) => {return a + (trade ? (b as ProductBalloonType).price_trade : b.price)}, 0))
    const [amountSale, setAmountSale] = useState<number>(products.reduce((a, b) => {return a + (b.old_price ? b.old_price : (trade ? (b as ProductBalloonType).price_trade : b.price))}, 0) - amountFinal)
    const [delivery, setDelivery] = useState<DeliveryType>("in_MKAD")

    const [id, setId] = useState<number>(0)
    const [addressName, setAddressName] = useState<string>("Новый адрес")
    const [address, setAddress] = useState<string>("")
    const [entrance, setEntrance] = useState<string>("")
    const [flat, setFlat] = useState<string>("")
    const [level, setLevel] = useState<string>("")
    const [doorPhone, setDoorPhone] = useState<string>("")

    const [disabled, setDisabled] = useState<boolean>(false)

    useEffect(() => {
        const amountActualProducts = products.reduce((a, b) => {return a + (trade ? (b as ProductBalloonType).price_trade : b.price)}, 0)
        const promoSale = promoCodeData?.amount === undefined ? 0 : promoCodeData.amount < 0 ? Math.floor(amountActualProducts / 100 * Math.abs(promoCodeData.amount)) : promoCodeData.amount
        setAmountFinal(amountActualProducts + (priceInMKAD ?? 0) + (needUpToLevel ? (priceUpToLevel ?? 0) : 0) - promoSale)
        setAmountSale(products.reduce((a, b) => {return a + (b.old_price ? b.old_price : (trade ? (b as ProductBalloonType).price_trade : b.price))}, 0) - products.reduce((a, b) => {return a + (trade ? (b as ProductBalloonType).price_trade : b.price)}, 0) + promoSale)
    }, []);

    useEffect(() => {
        const amountActualProducts = products.reduce((a, b) => {return a + b.price}, 0)
        const promoSale = promoCodeData?.amount === undefined ? 0 : promoCodeData.amount < 0 ? Math.floor(amountActualProducts / 100 * Math.abs(promoCodeData.amount)) : promoCodeData.amount
        setAmountFinal(products.reduce((a, b) => {return a + (trade ? (b as ProductBalloonType).price_trade : b.price)}, 0) + (delivery === 'in_MKAD' ? (priceInMKAD ?? 0) : (priceOutMKAD ?? 0)) + (needUpToLevel ? (priceUpToLevel ?? 0) : 0) - promoSale)
        setAmountSale(products.reduce((a, b) => {return a + (b.old_price ? b.old_price : (trade ? (b as ProductBalloonType).price_trade : b.price))}, 0) - products.reduce((a, b) => {return a + (trade ? (b as ProductBalloonType).price_trade : b.price)}, 0) + promoSale)
    }, [delivery, promoCodeData, needUpToLevel, priceInMKAD, priceOutMKAD, priceUpToLevel]);

    const handleCreateOrder = async () => {
        const result = await createOrder({
            comment: comment,
            up_to_level: needUpToLevel,
            delivery_type: delivery,
            promo_code: promoCode,
            first_name: name,
            phone_number: Number(phoneNumber.replaceAll(" ", "").trim()),
            address: {
                name: addressName,
                address: address,
                entrance: entrance,
                flat: flat,
                level: level,
                door_phone: doorPhone,
            },
            products: products.map(product => product.id),
            trade: trade ?? null
        })
        props.createOrder(result);
    }

    const handleClickCreateOrder = async () => {
        setDisabled(true);
        Telegram.WebApp.HapticFeedback.impactOccurred("light")
        await handleCreateOrder();
        setDisabled(false);
    }

    useEffect(() => {
        if (userStore.selectedAddressId) {
            userStore.addresses.forEach((address) => {
                if (address.id === userStore.selectedAddressId) {
                    setId(address.id)
                    setAddressName(address.name)
                    setAddress(address.address)
                    setEntrance(address.entrance+"");
                    setFlat(address.flat+"");
                    setLevel(address.level+"");
                    setDoorPhone(address.door_phone+"");
                }
            })
        }
    }, []);

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

    const [paddingBottom, setPaddingBottom] = useState<number>(0);

    const onFocus = () => {
        setPaddingBottom(300);
    }
    const onBlur = () => {
        setPaddingBottom(0);
    }

    return (
        <div className="flex flex-col w-full items-center font-sans justify-between h-full" style={{paddingBottom: paddingBottom}}>
            <ConfigProvider
                theme={{components: {Message: {contentBg: '#222', colorText: '#FFF', borderRadiusLG: 999}}}}>
                {contextHolder}
            </ConfigProvider>
            <div className="flex w-full items-center flex-col">
                <div
                    className="flex font-sans w-full items-center gap-2 text-[16px] leading-4 text-white font-medium px-3">
                    <ProfileOblickIcon color={"#FFFFFF"} width={16} height={16}/><p>Контактные данные</p>
                </div>
                <div className={`flex flex-col w-full items-center bg-[#111111] rounded-3xl px-6 py-6 mt-3 gap-6`}>
                    <CustomInput placeholder={"Как к вам обращаться"} value={name} setValue={setName} dopMargin
                                 onFocus={onFocus} onBlur={onBlur}/>
                    <SimplePhoneNumberInput value={phoneNumber} setValue={setPhoneNumber} onFocus={onFocus}
                                            onBlur={onBlur}/>
                </div>
                <div className="flex flex-col w-full mt-8 gap-3 font-sans">
                    <div
                        className="flex w-full items-center gap-2 px-3 text-[16px] leading-4 font-medium text-[#FFFFFF]">
                        <ClockCircleFilled style={{fontSize: 16, color: "#FFFFFF"}}/>
                        <p>Доставка</p>
                    </div>
                    <div className="flex w-full flex-col bg-[#111111] rounded-2xl p-3 gap-2">
                        <div
                            className="flex w-full items-center justify-between bg-[#171717] rounded-xl py-1.5 pl-3 pr-1.5"
                            onClick={() => handleChangeDelivery("in_MKAD")}
                        >
                            <div className="flex items-center gap-2 font-medium">
                                <p>В пределах МКАД</p>
                            </div>
                            <div
                                className={`flex items-center gap-2 bg-[#111111] rounded-xl py-1 px-3 ${delivery === 'in_MKAD' ? 'text-[#E1C272]' : 'text-[#757575]'}`}>
                                <p>{priceInMKAD ?? '...'}₽</p>
                                <div
                                    className={`w-[18px] h-[18px] border-[5px] ${delivery === 'in_MKAD' ? 'border-[#E1C272]' : 'border-[#171717]'} bg-[#171717] rounded-full`}/>
                            </div>
                        </div>
                        <div
                            className="flex w-full items-center justify-between bg-[#171717] rounded-xl py-1.5 pl-3 pr-1.5"
                            onClick={() => handleChangeDelivery("out_MKAD")}
                        >
                            <div className="flex items-center gap-2 font-medium">
                                <p>За переделы МКАД</p>
                            </div>
                            <div
                                className={`flex items-center gap-2 bg-[#111111] rounded-xl py-1 px-3 ${delivery === 'out_MKAD' ? 'text-[#E1C272]' : 'text-[#757575]'}`}>
                                <p>от {priceOutMKAD ?? '...'}₽</p>
                                <div
                                    className={`w-[18px] h-[18px] border-[5px] ${delivery === 'out_MKAD' ? 'border-[#E1C272]' : 'border-[#171717]'} bg-[#171717] rounded-full`}/>
                            </div>
                        </div>
                    </div>
                </div>
                <ConfigProvider theme={{
                    components:
                        {
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

                        <Switch checkedChildren={`${priceUpToLevel ?? '...'}₽`} unCheckedChildren="0₽" defaultChecked
                                value={needUpToLevel} onChange={handleChangeUpToLevel}/>
                    </div>
                </ConfigProvider>
                <div
                    className="flex font-sans w-full items-center gap-2 text-[16px] leading-4 text-white font-medium px-3 mt-6">
                    <HomeIcon color={"#FFFFFF"} width={16} height={16}/><p>Адрес доставки</p>
                </div>
                <div className="flex items-center w-full mt-3">
                    <AddressSimpleComponent
                        id={id}
                        setId={setId}
                        name={addressName}
                        setName={setAddressName}
                        address={address}
                        setAddress={setAddress}
                        entrance={entrance}
                        setEntrance={setEntrance}
                        flat={flat}
                        setFlat={setFlat}
                        level={level}
                        setLevel={setLevel}
                        doorPhone={doorPhone}
                        setDoorPhone={setDoorPhone}
                        onFocus={onFocus} onBlur={onBlur}
                    />
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
                                zIndexPopup: 999999,
                            }
                        }
                }}>
                    <div
                        className="flex w-full items-center mt-3 justify-between text-white text-[16px] leading-4 font-medium bg-[#111111] pl-4 pr-3 py-2.5 rounded-2xl">
                        <div className="flex items-center gap-2">
                            <DollarOutlined style={{fontSize: '16px', color: "#FFFFFF"}}/>
                            <p>Способ оплаты</p>
                        </div>

                        <Select
                            defaultValue={"onl"}
                            options={[
                                {value: 'onl', label: 'Предоплата'},
                                {value: 'cour', label: 'Курьеру'},
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
                <div className="flex items-center w-full mt-3">
                    <CommentInput value={comment} setValue={setComment} onFocus={onFocus} onBlur={onBlur}/>
                </div>
                <div
                    className="flex w-full mt-2 items-center bg-[#111111] px-4 rounded-2xl py-3.5 justify-between gap-2 font-sans">
                    <PromoInput value={promoCode} setValue={setPromoCode} placeholder={"Промокод"}
                                messageApi={messageApi}
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
            </div>
            <div className="flex items-center flex-col w-full">
                <div className="flex items-center justify-between w-full mt-5 text-[#E1C272] px-4">
                    <p className="text-[16px] leading-4 font-bold">К оплате:</p>
                    <div className="flex items-end gap-1">
                        {amountSale !== 0 &&
                            <p className="text-xs leading-3 font-normal line-through text-[#757575]">{numberFormat(amountFinal + amountSale)}₽</p>}
                        <p className="text-[16px] leading-4 font-medium">{numberFormat(amountFinal)}₽</p>
                    </div>
                </div>
                {
                    amountFinal >= (minOrderAmount ?? 0) && phoneNumber.length === 13
                        ? <button
                            className="flex items-center justify-center gap-2 w-full text-[16px] leading-4 mt-5 bg-[#E1C272] text-black font-medium font-sans rounded-3xl py-4"
                            onClick={handleClickCreateOrder}
                            disabled={disabled}
                        >
                            {
                                disabled
                                    ? <div className="flex w-full items-center justify-center h-4">
                                        <Spin size={"small"} indicator={<LoadingOutlined spin style={{color: 'black'}}/>}/>
                                    </div>
                                    : <><VerificationIcon color={"#000000"} width={16} height={16}/> <p>Создать
                                        заказ</p></>
                            }
                        </button>
                        :
                        phoneNumber.length !== 13 ?
                            <>
                                <button
                                    className="flex items-center justify-center gap-2 w-full text-[16px] leading-5 mt-5 bg-[#E1C272] text-black font-medium font-sans rounded-3xl py-4 opacity-30"
                                >
                                    <VerificationIcon color={"#000000"} width={16} height={16}/> <p>Создать заказ</p>
                                </button>
                                <p className="font-sans text-xs leading-3 mt-1 text-[#757575]">Укажите свой номер
                                    телефона</p>
                            </>
                            :
                            <>
                                <button
                                    className="flex items-center justify-center gap-2 w-full text-[16px] leading-5 mt-5 bg-[#E1C272] text-black font-medium font-sans rounded-3xl py-4 opacity-30"
                                >
                                    <VerificationIcon color={"#000000"} width={16} height={16}/> <p>Создать заказ</p>
                                </button>
                                <p className="font-sans text-xs leading-3 mt-1 text-[#757575]">Минимальная сумма заказа • {(minOrderAmount ?? 0)}₽</p>
                            </>

                }
            </div>
        </div>
    );
}