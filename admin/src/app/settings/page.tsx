'use client'

import React, {useEffect, useState} from 'react';
import {LoadingOutlined} from "@ant-design/icons";
import {mainHook} from "@/app/hooks/main";
import {CustomInput} from "@/app/components/customInput";
import {message, ConfigProvider, Spin} from 'antd';
import {getDataForOrders, updateSystemData} from "@/app/settings/api";
import {error, success} from "@/app/utils";
import {LoadingComponent} from "@/app/components/loading";

export default function SettingsPage() {
    mainHook("/settings")
    const [messageApi, contextHolder] = message.useMessage()

    const [priceInMKAD, setPriceInMKAD] = useState<string>("")
    const [priceOutMKAD, setPriceOutMKAD] = useState<string>("")
    const [priceUpToLevel, setPriceUpToLevel] = useState<string>("")
    const [minOrderAmount, setMinOrderAmount] = useState<string>("")

    const [disabled, setDisabled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        getDataForOrders().then(r => {
            r.forEach((value) => {
                if (value.name === "price_in_MKAD") setPriceInMKAD(value.value)
                else if (value.name === "price_out_MKAD") setPriceOutMKAD(value.value)
                else if (value.name === "price_up_to_level") setPriceUpToLevel(value.value)
                else if (value.name === "min_order_amount") setMinOrderAmount(value.value)
            })
            setLoading(false);
        })
    }, [])

    const handleClickSave = async () => {
        setDisabled(true);
        if (/^\d+$/.test(priceInMKAD) && /^\d+$/.test(priceOutMKAD) && /^\d+$/.test(priceUpToLevel) && /^\d+$/.test(minOrderAmount)) {
            await updateSystemData({
                price_in_MKAD: Number(priceInMKAD),
                price_out_MKAD: Number(priceOutMKAD),
                price_up_to_level: Number(priceUpToLevel),
                min_order_amount: Number(minOrderAmount)
            })
            success(messageApi, "Данные успешно обновлены")
        }
        else {
            error(messageApi, "Данные должны быть числовые")
        }
        setDisabled(false);
    }

    if (loading) return <main><LoadingComponent/></main>
    return (
        <main>
            <ConfigProvider theme={{components: {Message: {contentBg: '#F2F2F2', colorText: '#141414'}}}}>
                {contextHolder}
            </ConfigProvider>
            <div className="flex flex-col w-full h-full pt-3">
                <div className="flex w-full items-center pl-5 gap-3 font-sans">
                    <h1 className="text-[20px] leading-5 font-semibold text-black">Настройки</h1>
                </div>
                <div
                    className="flex flex-col items-center w-full h-full rounded-[32px] bg-[#FFFFFF] mt-5 overflow-scroll pt-10 pb-5 px-10">
                    <div className="flex items-center w-full justify-between gap-3">
                        <CustomInput placeholder={"Цена доставки по МКАД"} value={priceInMKAD}
                                     setValue={setPriceInMKAD}/>
                        <CustomInput placeholder={"Цена доставки за МКАД"} value={priceOutMKAD}
                                     setValue={setPriceOutMKAD}/>
                    </div>
                    <div className="flex items-center w-full justify-between gap-3 mt-10">
                        <CustomInput placeholder={"Цена подъема на этаж"} value={priceUpToLevel}
                                     setValue={setPriceUpToLevel}/>
                        <CustomInput placeholder={"Минимальная сумма заказа"} value={minOrderAmount}
                                     setValue={setMinOrderAmount}/>
                    </div>
                    <button className="flex items-center w-1/2 justify-center mt-10 bg-blue-500 rounded-2xl py-4 text-white font-medium text-[16px] leading-4"
                            disabled={disabled}
                            onClick={handleClickSave}
                    >
                        {
                            disabled
                                ? <Spin indicator={<LoadingOutlined spin style={{
                                    color: 'white',
                                    width: 16,
                                    height: 16
                                }}/>}/>
                                : <p>Обновить данные</p>
                        }
                    </button>
                </div>
            </div>
        </main>
    );
}