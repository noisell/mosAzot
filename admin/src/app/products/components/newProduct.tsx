import React, {useState} from 'react';
import {ProductType} from "@/app/products/types";
import {CustomInput} from "@/app/components/customInput";
import {Switch, Modal, Input, message, ConfigProvider, Select} from "antd";
import {createProduct} from "@/app/products/api";
import {error, success} from "@/app/utils";

type Props = {
    showModalNewProducts: boolean;
    setShowModalNewProducts: React.Dispatch<React.SetStateAction<boolean>>;
    callback: (product: ProductType) => void;
}

export function NewProduct(props: Props) {
    const [messageApi, contextHolder] = message.useMessage()
    const {showModalNewProducts, setShowModalNewProducts, callback} = props;

    const [disabled, setDisabled] = useState<boolean>(false);

    const [price, setPrice] = useState<string>("");
    const [oldPrice, setOldPrice] = useState<string>("");
    const [priceTrade, setPriceTrade] = useState<string>("");
    const [size, setSize] = useState<string>("");
    const [active, setActive] = useState<boolean>(true);
    const [hit, setHit] = useState<boolean>(false);
    const [balloon, setBalloon] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const handleOk = async () => {
        // --
        if (balloon) {
            if (!priceTrade) return error(messageApi, "Добавьте цену обмена");
        } else {
            if (!name) return error(messageApi, "Введите название товара");
            if (!description) return error(messageApi, "Добавьте описание товару");
        }
        if (!image) return error(messageApi, "Добавьте изображение");
        if (!price) return error(messageApi, "Добавьте цену");
        if (!price) return error(messageApi, "Добавьте объем или вес или кол-во");
        setDisabled(true);
        const product = await createProduct({
            name: name,
            price: Number(price),
            old_price: oldPrice ? Number(oldPrice) : null,
            price_trade: priceTrade ? Number(priceTrade) : null,
            size: size,
            image: image,
            hit: hit,
            active: active,
            balloon: balloon,
            description: description,
        })
        callback(product);
        setName("");
        setPrice("");
        setOldPrice("");
        setPriceTrade("");
        setSize("");
        setImage("");
        setDescription("");
        setHit(false);
        setActive(true);
        setBalloon(true);
        // --
        setDisabled(false);
        setShowModalNewProducts(false);
    }

    const handleCancel = () => {
        setShowModalNewProducts(false);
    }

    return (
        <Modal title="Создание товара" open={showModalNewProducts} onOk={handleOk} onCancel={handleCancel} confirmLoading={disabled}>
            <div className="flex flex-col w-full font-sans">
                <ConfigProvider theme={{
                    components:
                        {
                            Message: {contentBg: '#F2F2F2', colorText: '#141414'},
                            Select: {
                                colorBgContainer: 'transparent',
                                colorBorder: 'transparent',
                                colorText: '#000000',
                                colorTextDisabled: '#757575',
                                colorTextPlaceholder: '#757575',

                                colorPrimary: 'transparent',
                                colorBgElevated: '#FFF',

                                controlOutlineWidth: 0,
                                colorPrimaryHover: 'transparent',
                                paddingSM: 0,
                            },
                        }
                }}>
                    {contextHolder}

                </ConfigProvider>
                <div
                    className="flex w-full items-center gap-1 text-xs leading-3 bg-blue-200 rounded-2xl p-1 font-medium">
                    <div
                        className={`flex w-full items-center justify-center py-3 rounded-2xl ${!balloon ? "bg-blue-500 text-white" : "bg-blue-200 text-blue-600 cursor-pointer"}`}
                        onClick={() => setBalloon(false)}
                    >
                        <p>Аксессуар</p>
                    </div>
                    <div
                        className={`flex w-full items-center justify-center py-3 rounded-2xl ${balloon ? "bg-blue-500 text-white" : "bg-blue-200 text-blue-600 cursor-pointer"}`}
                        onClick={() => setBalloon(true)}
                    >
                        <p>Баллон</p>
                    </div>
                </div>
                {!balloon && <div
                    className="flex w-full items-center mt-5">
                    <CustomInput placeholder={"Название"} value={name} setValue={setName}/>
                </div>}
                {!balloon && <div
                    className="flex w-full items-center mt-5">
                    <CustomInput placeholder={"Описание"} value={description} setValue={setDescription}/>
                </div>}
                <div className="flex w-full items-center mt-5">
                    <CustomInput placeholder={"Ссылка на изображение"} value={image} setValue={setImage}/>
                </div>
                {balloon && <div className="flex w-full items-center mt-5">
                    <CustomInput placeholder={"Цена обмена"} value={priceTrade} setValue={setPriceTrade}/>
                </div>}
                <div className="flex w-full items-center mt-5 gap-3">
                    <div className="flex w-1/3 items-center gap-1">
                        <CustomInput placeholder={"Цена"} value={price} setValue={setPrice}/>
                    </div>
                    <div className="flex w-1/3 items-center gap-1">
                        <CustomInput placeholder={"Старая цена"} value={oldPrice} setValue={setOldPrice}/>
                    </div>
                    <div className="flex w-1/3 items-center gap-1">
                        <CustomInput placeholder={"Объем или кол-во"} value={size} setValue={setSize}/>
                    </div>
                </div>
                <div className="flex items-center w-full text-[14px] leading-[14px] mt-5 gap-5">
                    <div className={`flex items-center gap-2 ${active ? "text-blue-700" : "text-[#757575]"}`}>
                        <Switch value={active} onChange={() => setActive(!active)}/>
                        <p>В наличии</p>
                    </div>
                    {!balloon && <div className={`flex items-center gap-2 ${hit ? "text-blue-700" : "text-[#757575]"}`}>
                        <Switch value={hit} onChange={() => setHit(!hit)}/>
                        <p>Хит</p>
                    </div>}
                </div>
            </div>
        </Modal>
    );
}