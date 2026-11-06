'use client'

import React, { useState, useRef, useEffect } from 'react';
import {CustomInput} from "@/app/components/customInput";
import {AddressType} from "@/app/profile/types";
import {error, success} from "@/app/utils"
import {message, ConfigProvider} from 'antd';
import {createAddress, deleteAddress, updateAddress} from "@/app/profile/api";
import {userPersistStore} from "@/store/persistUserStore";

type Props = {
    id: number;
    name: string;
    address: string;
    entrance: string | null;
    flat: string | null;
    level: string | null;
    door_phone: string | null;
    selected: boolean;
    autoFocus?: boolean;
    onDelete: () => void;
    onSave: () => void;
    showManageButtons?: boolean;
    handleClickSelectAddress?: () => void;
}

export function AddressBaseComponent(props: Props) {
    const [messageApi, contextHolder] = message.useMessage()
    const store = userPersistStore()

    const [isHolding, setIsHolding] = useState(false);
    const [isActionTriggered, setIsActionTriggered] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [showManageButtons, setShowManageButtons] = useState<boolean>(props.showManageButtons ?? false);
    const [disabledComponent, setDisabledComponent] = useState<boolean>(false)

    const [name, setName] = useState<string>(props.name);
    const [address, setAddress] = useState<string>(props.address);
    const [entrance, setEntrance] = useState<string>(props.entrance+"");
    const [flat, setFlat] = useState<string>(props.flat+"");
    const [level, setLevel] = useState<string>(props.level+"");
    const [doorPhone, setDoorPhone] = useState<string>(props.door_phone+"");

    useEffect(() => {
        if (!props.autoFocus) {
            if (name !== props.name || address !== props.address || entrance !== props.entrance || flat !== props.flat || level !== props.level || doorPhone !== props.door_phone) {
                setShowManageButtons(true);
            }
            else {
                setShowManageButtons(false);
            }
        }
    }, [name, address, entrance, flat, level, doorPhone]);

    const handleMouseDown = () => {
        setIsHolding(true);
        timeoutRef.current = setTimeout(() => {
            Telegram.WebApp.HapticFeedback.selectionChanged()
            setIsActionTriggered(true);
            setShowManageButtons(prevState => !prevState);
        }, 500);
    };

    const handleMouseUp = () => {
        setIsHolding(false);
        clearTimeout(timeoutRef.current!);
        if(!isActionTriggered) {}
        setIsActionTriggered(false);
    };

    const handleMouseLeave = () => {
        setIsHolding(false);
        clearTimeout(timeoutRef.current!);
        setIsActionTriggered(false);
    };

    const handleClickSave = () => {
        if (!name || name === "") {
            return error(messageApi, "Укажите название для адреса")
        }
        else if (!address || address === "") {
            return error(messageApi, "Напишите ваш город, улицу и дом")
        }
        setDisabledComponent(true);
        Telegram.WebApp.HapticFeedback.notificationOccurred("success")
        createAddress({name: name, address: address, entrance: entrance, flat: flat, level: level, door_phone: doorPhone}).then(r => {
            store.addAddress(r)
            store.changeSelectedAddressId(r.id)
            props.onSave()
            setDisabledComponent(false);
            success(messageApi, "Новый адрес успешно создан!")
        })
    }

    const handleClickSelectAddress = () => {
        if (props.handleClickSelectAddress) {
            props.handleClickSelectAddress()
        }
    }

    const handleUpdateAddress = () => {
        if (!name || name === "") {
            return error(messageApi, "Укажите название для адреса")
        }
        else if (!address || address === "") {
            return error(messageApi, "Напишите ваш город, улицу и дом")
        }
        Telegram.WebApp.HapticFeedback.notificationOccurred("success")
        setDisabledComponent(true);
        const newAddress: AddressType = {id: props.id, name: name, address: address, entrance: entrance, flat: flat, level: level, door_phone: doorPhone}
        store.updateAddress(newAddress)
        updateAddress(newAddress).then(() => {
            setDisabledComponent(false);
            setShowManageButtons(false);
            success(messageApi, "Данные успешно обновлены!")
        })
    }

    const handleDeleteAddress = () => {
        Telegram.WebApp.HapticFeedback.notificationOccurred("success")
        setDisabledComponent(true);
        deleteAddress(props.id).then(r => {
            success(messageApi, `Адрес "${name}" удален!`)
            store.changeSelectedAddressId(r)
            setDisabledComponent(false);
            store.deleteAddress(props.id)
        })
    }

    return (
        <div className={`flex flex-col mt-3 w-full items-center rounded-[32px] ${isHolding ? 'bg-[#0F0F0F]' : 'bg-[#111111]'} px-6 pt-4 gap-3 select-none`}>
            <ConfigProvider theme={{components: {Message: {contentBg: '#222', colorText: '#FFF', borderRadiusLG: 999}}}}>
                {contextHolder}
            </ConfigProvider>
            <div className="w-full flex items-center justify-between">
                <CustomInput placeholder={"Название"} placeholderMove simpleStyle value={name} setValue={setName} autoFocus={props.autoFocus} disabled={disabledComponent} maxLength={32}/>
                {!props.autoFocus && <div className={`w-[18px] h-[18px] border-[5px] ${props.selected ? 'border-[#E1C272]' : 'border-[#202020] bg-[#202020]'} rounded-full`} onClick={handleClickSelectAddress}/>}
            </div>
            <div className="flex flex-col w-full mt-1">
                <div className="flex w-full">
                    <CustomInput placeholder={"Город, улица, дом"} placeholderMove value={address} setValue={setAddress} disabled={disabledComponent}/>
                </div>
                <div className="w-full flex items-center gap-3 mt-6">
                    <div className="flex items-center gap-3 w-full">
                        <CustomInput placeholder={"Подъезд"} value={entrance} setValue={setEntrance} disabled={disabledComponent}/>
                    </div>
                    <div className="flex items-center gap-3 w-full">
                        <CustomInput placeholder={"Квартира или офис"} value={flat} setValue={setFlat} disabled={disabledComponent}/>
                    </div>
                </div>
                <div className="w-full flex items-center gap-3 mt-6">
                    <div className="flex items-center gap-3 w-full">
                        <CustomInput placeholder={"Этаж"} value={level} setValue={setLevel} disabled={disabledComponent}/>
                    </div>
                    <div className="flex items-center gap-3 w-full">
                        <CustomInput placeholder={"Домофон"} value={doorPhone} setValue={setDoorPhone} disabled={disabledComponent}/>
                    </div>
                </div>
            </div>
            {
                showManageButtons &&
                <div className="w-full flex items-center justify-between gap-1 mt-1 text-[16px] leading-4">
                    <button
                        className={`w-full text-center py-3.5 bg-transparent font-normal border ${disabledComponent ? 'text-red-900 border-red-900' : 'text-red-500 border-red-500'} rounded-2xl`}
                        onClick={props.autoFocus ? props.onDelete : handleDeleteAddress}
                        disabled={disabledComponent}
                    >
                        Удалить
                    </button>
                    <button
                        className={`w-full text-center py-3.5 font-semibold rounded-2xl border ${disabledComponent ? 'bg-green-900 border-green-900 text-gray-300 cursor-not-allowed' : 'bg-green-600 border-green-600 text-white cursor-pointer'}`}
                        onClick={props.autoFocus ? handleClickSave : handleUpdateAddress}
                        disabled={disabledComponent}
                    >
                        Сохранить
                    </button>
                </div>
            }
            <div className="w-full flex items-center justify-center pb-3 pt-2"
                 onMouseDown={!props.showManageButtons ? handleMouseDown : undefined}
                 onMouseUp={!props.showManageButtons ? handleMouseUp : undefined}
                 onMouseLeave={!props.showManageButtons ? handleMouseLeave : undefined}
                 onTouchStart={!props.showManageButtons ? handleMouseDown : undefined}
                 onTouchEnd={!props.showManageButtons ? handleMouseUp : undefined}
                 onTouchCancel={!props.showManageButtons ? handleMouseLeave : undefined}
            >
                <div className="h-1 w-14 rounded-full bg-[#2E2E2E]"/>
            </div>
        </div>
    );
}