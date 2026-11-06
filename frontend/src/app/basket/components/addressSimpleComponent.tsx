'use client'

import React, {useEffect, useState} from 'react';
import {CustomInput} from "@/app/components/customInput";
import {Select, ConfigProvider} from "antd";
import {CaretDownOutlined} from "@ant-design/icons";
import {userPersistStore} from "@/store/persistUserStore";

type Props = {
    id: number;
    setId: React.Dispatch<React.SetStateAction<number>>;
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    address: string;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
    entrance: string;
    setEntrance: React.Dispatch<React.SetStateAction<string>>;
    flat: string;
    setFlat: React.Dispatch<React.SetStateAction<string>>;
    level: string;
    setLevel: React.Dispatch<React.SetStateAction<string>>;
    doorPhone: string;
    setDoorPhone: React.Dispatch<React.SetStateAction<string>>;
    onFocus: () => void;
    onBlur: () => void;
}

export function AddressSimpleComponent(props: Props) {
    const [disabledComponent, setDisabledComponent] = useState<boolean>(false)
    const userStore = userPersistStore.getState()
    const {name, setName, address, setAddress, entrance, setEntrance, flat, setFlat, level, setLevel, doorPhone, setDoorPhone, id, setId} = props;
    const [options, setOptions] = useState(userStore.addresses.map(address =>  ({value: address.id, label: address.name})))

    useEffect(() => {
        setOptions(userStore.addresses.map(address =>  ({value: address.id, label: address.name})))
    }, [userStore.addresses]);

    const handleChangeAddress = (value: number) => {
        userStore.addresses.forEach((address) => {
            if (address.id === value) {
                setId(address.id);
                setAddress(address.address);
                setEntrance(address.entrance+"");
                setFlat(address.flat+"");
                setLevel(address.level+"");
                setDoorPhone(address.door_phone+"");
            }
        })
    }

    return (
        <div className={`flex flex-col w-full items-center rounded-3xl bg-[#111111] px-3 pt-4 pb-6 gap-3 select-none`}>
            <ConfigProvider theme={{
                components:
                    {
                        Select: {
                            colorBgContainer: 'transparent',
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
                            fontSize: 16
                        },
                    }
            }}>
                <div className={`w-full flex items-center ${!props.id || userStore.addresses.length <= 1 ? 'px-3' : ''}`}>
                    {
                        props.id
                            ?
                            userStore.addresses.length > 1
                                ?
                                    <Select
                                        value={id}
                                        options={options}
                                        onChange={handleChangeAddress}
                                        size='middle'
                                        style={{width: "100%"}}
                                        suffixIcon={
                                            <CaretDownOutlined
                                                style={{fontSize: '14px', color: "#E1C272"}}
                                            />
                                        }
                                    />
                                :
                                <CustomInput placeholder={"Название"} placeholderMove simpleStyle value={name} setValue={setName} disabled={disabledComponent} maxLength={32} onFocus={props.onFocus} onBlur={props.onBlur}/>
                            :
                            <CustomInput placeholder={"Новый адрес"} placeholderMove simpleStyle value={name} setValue={setName} disabled={disabledComponent} maxLength={32} onFocus={props.onFocus} onBlur={props.onBlur}/>

                    }
                </div>
            </ConfigProvider>
            <div className="flex flex-col w-full px-3">
                <div className="flex w-full">
                    <CustomInput placeholder={"Город, улица, дом"} maxLength={256} placeholderMove value={address} setValue={setAddress} disabled={disabledComponent} onFocus={props.onFocus} onBlur={props.onBlur}/>
                </div>
                <div className="w-full flex items-center gap-3 mt-6">
                    <div className="flex items-center gap-3 w-full">
                        <CustomInput placeholder={"Подъезд"} maxLength={256} value={entrance} setValue={setEntrance} disabled={disabledComponent} onFocus={props.onFocus} onBlur={props.onBlur}/>
                    </div>
                    <div className="flex items-center gap-3 w-full">
                        <CustomInput placeholder={"Квартира или офис"} maxLength={256} value={flat} setValue={setFlat} disabled={disabledComponent} onFocus={props.onFocus} onBlur={props.onBlur}/>
                    </div>
                </div>
                <div className="w-full flex items-center gap-3 mt-6">
                    <div className="flex items-center gap-3 w-full">
                        <CustomInput placeholder={"Этаж"} maxLength={256} value={level} setValue={setLevel} disabled={disabledComponent} onFocus={props.onFocus} onBlur={props.onBlur}/>
                    </div>
                    <div className="flex items-center gap-3 w-full">
                        <CustomInput placeholder={"Домофон"} maxLength={256} value={doorPhone} setValue={setDoorPhone} disabled={disabledComponent} onFocus={props.onFocus} onBlur={props.onBlur}/>
                    </div>
                </div>
            </div>
        </div>
    );
}