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
import {createOrder} from "@/app/basket/api";
import {DeliveryType} from "@/app/basket/types";
import {Spin} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';


type Props = {
    amountFinal: number;
    amountSale: number;
    upToLevel: boolean;
    deliveryType: DeliveryType;
    promoCode: string;
    createOrder: (result: boolean) => void;
}

export function OrderCreateDrawer(props: Props) {
    const userStore = userPersistStore()

    const [comment, setComment] = useState<string>('')
    const [phoneNumber, setPhoneNumber] = useState<string>(userStore.phoneNumber)
    const [name, setName] = useState<string>(userStore.firstName)

    const [id, setId] = useState<number>(0)
    const [addressName, setAddressName] = useState<string>("Новый адрес")
    const [address, setAddress] = useState<string>("")
    const [entrance, setEntrance] = useState<string>("")
    const [flat, setFlat] = useState<string>("")
    const [level, setLevel] = useState<string>("")
    const [doorPhone, setDoorPhone] = useState<string>("")

    const [disabled, setDisabled] = useState<boolean>(false)

    const handleCreateOrder = async () => {
        const result = await createOrder({
            comment: comment,
            up_to_level: props.upToLevel,
            delivery_type: props.deliveryType,
            promo_code: props.promoCode,
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
            trade: null
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

    const [paddingBottom, setPaddingBottom] = useState<number>(0);

    const onFocus = () => {
        setPaddingBottom(300);
    }
    const onBlur = () => {
        setPaddingBottom(0);
    }

    return (
        <div className="flex flex-col w-full items-center font-sans justify-between h-full" style={{paddingBottom: paddingBottom}}>
            <div className="flex w-full items-center flex-col">
                <div
                    className="flex font-sans w-full items-center gap-2 text-[16px] leading-4 text-white font-medium px-3">
                    <ProfileOblickIcon color={"#FFFFFF"} width={16} height={16}/><p>Контактные данные</p>
                </div>
                <div className={`flex flex-col w-full items-center bg-[#111111] rounded-[32px] px-6 py-6 mt-3 gap-6`}>
                    <CustomInput placeholder={"Как к вам обращаться"} value={name} setValue={setName} dopMargin/>
                    <SimplePhoneNumberInput value={phoneNumber} setValue={setPhoneNumber} onFocus={onFocus} onBlur={onBlur}/>
                </div>
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
                <div className="flex items-center w-full mt-3">
                    <CommentInput value={comment} setValue={setComment} onFocus={onFocus} onBlur={onBlur}/>
                </div>
            </div>
            <div className="flex items-center flex-col w-full">
                <div className="flex items-center justify-between w-full mt-5 text-[#E1C272] px-4">
                    <p className="text-[16px] leading-4 font-bold">К оплате:</p>
                    <div className="flex items-end gap-1">
                        {props.amountSale !== 0 && <p className="text-xs leading-3 font-normal line-through text-[#757575]">{numberFormat(props.amountFinal + props.amountSale)}₽</p>}
                        <p className="text-[16px] leading-4 font-medium">{numberFormat(props.amountFinal)}₽</p>
                    </div>
                </div>
                {
                    phoneNumber.length === 13
                        ? <button
                            className="flex items-center justify-center gap-2 w-full text-[16px] leading-5 mt-5 bg-[#E1C272] text-black font-medium font-sans rounded-3xl py-4"
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
                        <>
                        <button
                                className="flex items-center justify-center gap-2 w-full text-[16px] leading-5 mt-5 bg-[#E1C272] text-black font-medium font-sans rounded-3xl py-4 opacity-30"
                            >
                                <VerificationIcon color={"#000000"} width={16} height={16}/> <p>Создать заказ</p>
                            </button>
                            <p className="font-sans text-xs leading-3 mt-1 text-[#757575]">Укажите свой номер телефона</p>
                        </>

                }
            </div>
        </div>
    );
}
