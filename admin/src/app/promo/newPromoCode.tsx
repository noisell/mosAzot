import React, {useState} from 'react';
import {Modal, message, ConfigProvider} from "antd";
import {CustomInput} from "@/app/components/customInput";
import {error} from "@/app/utils";
import {createPromoCode} from "@/app/promo/api";
import {PromoCodeType} from "@/app/promo/types";

type Props = {
    showModalNewPromoCode: boolean;
    setShowModalNewPromoCode: React.Dispatch<React.SetStateAction<boolean>>;
    callback: (promoCode: PromoCodeType) => void;
}

export function NewPromoCode(props: Props) {
    const [messageApi, contextHolder] = message.useMessage()
    const [disabled, setDisabled] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [count, setCount] = useState<string>("");
    const [date, setDate] = useState<string>("");


    const handleOk = () => {
        setAmount(prevState => prevState.trim())
        if (!name) return error(messageApi, "Введите название промокода")
        if (!amount) return error(messageApi, "Введите сумму скидки")
        if (Number(amount.replaceAll("%", "")) <= 0 || isNaN(Number(amount.replaceAll("%", "")))) return error(messageApi, "Введите корректную сумму скидки")
        if (!count && !date) return error(messageApi, "Введите кол-во активаций или дату окончания")
        if (!date && (Number(count) <= 0 || isNaN(Number(count)))) return error(messageApi, "Введите корректное кол-во активаций")
        setDisabled(true);
        createPromoCode({name: name.toUpperCase().replaceAll(" ", ""), amount: amount.includes("%") ? -Number(amount.replaceAll("%", "")) : Number(amount), count: Number(count), date: date ? date : null}).then((id) => {
            if (id === 0) {
                setDisabled(false);
                return error(messageApi, "Проверьте корректность данных");
            }
            props.callback({id: id, name: name.toUpperCase().replaceAll(" ", ""), amount: amount.includes("%") ? -Number(amount.replaceAll("%", "")) : Number(amount), count: Number(count), date: date ? date : null});
            setName("");
            setAmount("");
            setCount("");
            setDate("");
            props.setShowModalNewPromoCode(false);
            setDisabled(false);
        })
    }

    const handleCancel = () => props.setShowModalNewPromoCode(false);

    return (
        <Modal title="Создание промокода" open={props.showModalNewPromoCode} onOk={handleOk} onCancel={handleCancel}
               confirmLoading={disabled}>
            <ConfigProvider theme={{components:
                    {Message: {contentBg: '#F2F2F2', colorText: '#141414'}
                    }}}>
                {contextHolder}
            </ConfigProvider>
            <div className="flex items-center mt-6">
                <CustomInput placeholder={"Промокод *"} value={name} setValue={setName} maxLength={256}/>
            </div>
            <div className="flex items-center mt-6">
                <CustomInput placeholder={"Сумма скидки *"} value={amount} setValue={setAmount}/>
            </div>
            <div className="flex items-center mt-6">
                <CustomInput placeholder={"Кол-во активаций"} value={count} setValue={setCount}/>
            </div>
            <div className="flex items-center mt-6">
                <CustomInput placeholder={"Дата окончания"} value={date} setValue={setDate}/>
            </div>
            <p className="text-xs leading-3 text-black font-sans mt-1">Формат [YEAR-MM-DD]T[hh:mm], например 2025-02-28T18:30 (англ. T разделяет дату и время)</p>
        </Modal>
    );
}