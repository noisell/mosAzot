import React, {useEffect, useState} from 'react';
import {ProductType} from "@/app/products/types";
import {CustomInput} from "@/app/components/customInput";
import {Switch, Modal, Input, message, ConfigProvider, Spin} from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import {changeProduct, changeProductImage, deleteProduct} from "@/app/products/api";
import {success} from "@/app/utils";
import {TrashIcon} from "@/app/icons/trashIcon";

export function CardProduct(props: ProductType & {callback: (data: ProductType) => void, callbackDelete: (id: number) => void}) {
    const [messageApi, contextHolder] = message.useMessage()

    const [price, setPrice] = useState<string>(props.price+"");
    const [oldPrice, setOldPrice] = useState<string>(props.old_price ? props.old_price+"" : "");
    const [priceTrade, setPriceTrade] = useState<string>(props.price_trade ? props.price_trade+"" : "");
    const [size, setSize] = useState<string>(props.size);
    const [active, setActive] = useState<boolean>(props.active);
    const [hit, setHit] = useState<boolean>(props.hit);
    const [name, setName] = useState<string>(props.name);
    const [image, setImage] = useState<string>(props.image);
    const [description, setDescription] = useState<string>(props.description);
    const [balloon, setBalloon] = useState<boolean>(props.balloon);

    const [dataSaveShow, setDataSaveShow] = useState<boolean>(false);

    const [isModalImageOpen, setIsModalImageOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        if (
            Number(price.trim()) !== props.price
            || oldPrice.trim() !== (props.old_price ? props.old_price+"" : "")
            || priceTrade.trim() !== (props.price_trade ? props.price_trade+"" : "")
            || size.trim() !== props.size
            || description.trim() !== props.description
            || active !== props.active
            || hit !== props.hit
            || name.trim() !== props.name
        ) {
            setDataSaveShow(true);
        } else setDataSaveShow(false);
    }, [price, oldPrice, size, active, hit, name, priceTrade, description]);

    const handleOkImage = async () => {
        setConfirmLoading(true);
        await changeProductImage({product_id: props.id, image: image});
        setIsModalImageOpen(false);
        setConfirmLoading(false);
        success(messageApi, "Изображение успешно обновлено")
    }
    const handleCancelImage = () => {
        setIsModalImageOpen(false);
    };

    const handleUpdateProduct = async () => {
        setConfirmLoading(true);
        await changeProduct({
            product_id: props.id,
            name: name.trim(),
            price: Number(price),
            old_price: oldPrice ? Number(oldPrice) : null,
            price_trade: priceTrade ? Number(priceTrade) : null,
            size: size.trim(),
            description: description.trim(),
            hit: hit,
            active: active,
        })
        props.callback({
            id: props.id,
            name: name.trim(),
            price: Number(price),
            old_price: oldPrice ? Number(oldPrice) : null,
            size: size.trim(),
            hit: hit,
            active: active,
            image: image.trim(),
            description: description.trim(),
            price_trade: oldPrice ? Number(oldPrice) : null,
            balloon: balloon,
        })
        setConfirmLoading(false);
        setDataSaveShow(false);
        success(messageApi, "Данные товара успешно обновлены")
    }

    const [showModalDelete, setShowModalDelete] = useState(false);
    const handleDeleteProduct = () => setShowModalDelete(true);
    const handleOkDeleteProduct = async () => {
        setConfirmLoading(true);
        await deleteProduct(props.id);
        props.callbackDelete(props.id);
        setShowModalDelete(false);
        setConfirmLoading(false);
    }
    const handleCancelDeleteProduct = () => setShowModalDelete(false);

    return (
        <div className="flex w-full items-center font-sans">
            <ConfigProvider theme={{components: {Message: {contentBg: '#F2F2F2', colorText: '#141414'}}}}>
                {contextHolder}
            </ConfigProvider>
            <div className="flex items-center w-1/6 justify-center py-3 rounded-3xl cursor-pointer" style={{background: "#efefef"}} onClick={() => setIsModalImageOpen(true)}>
                <img src={image} alt="" style={{height: 130}}/>
            </div>
            <div className="flex flex-col h-full pl-3 w-5/6 justify-between">
                <div className="flex w-full items-center justify-between font-medium text-[16px] leading-4">
                    {!balloon ?
                        <CustomInput placeholder={"Название"} value={name} setValue={setName} simpleStyle/>
                        :
                        <p>Пищевая закись азота • {size}</p>
                    }
                    <div className="flex items-center gap-3">
                        <button
                            className={`flex min-w-[100px] items-center justify-center py-2 rounded-xl text-xs leading-3 bg-green-500 text-white font-medium text-nowrap ${dataSaveShow ? 'opacity-100' : 'opacity-0'}`}
                            onClick={handleUpdateProduct}
                            disabled={confirmLoading}
                        >
                            {
                                confirmLoading
                                    ? <Spin size={"small"} indicator={<LoadingOutlined spin style={{
                                        color: 'white',
                                        width: 12,
                                        height: 12
                                    }}/>}/>
                                    : <p>Сохранить</p>
                            }

                        </button>
                        <span onClick={handleDeleteProduct} className={"cursor-pointer"}><TrashIcon color={"#a30000"}/></span>
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex w-1/2 items-center mt-6 gap-3">
                    {!balloon ?
                        <div className="flex w-full items-center text-xs leading-3 gap-2">
                            <CustomInput placeholder={"Описание товара"} value={description} setValue={setDescription}/>
                        </div>
                        : <CustomInput placeholder={"Цена обмена"} value={priceTrade} setValue={setPriceTrade}/>
                    }
                    </div>
                    <div className="flex w-1/2 items-center mt-6 gap-3">
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
                    <div className="flex items-center w-full text-[14px] leading-[14px] mt-3 gap-5">
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
            </div>
            <Modal title="Изменение фотографии" open={isModalImageOpen} onOk={handleOkImage}
                   onCancel={handleCancelImage} confirmLoading={confirmLoading}>
                <div className="flex w-full items-center">
                    <Input value={image} onChange={(e) => setImage(e.currentTarget.value)}
                           placeholder={"Ссылка на изображение"} style={{width: "100%"}}/>
                </div>
            </Modal>
            <Modal title="Вы уверены?" open={showModalDelete} onOk={handleOkDeleteProduct}
                   onCancel={handleCancelDeleteProduct} confirmLoading={confirmLoading}>
                <p>Удалив товар он пропадет из корзин и историй заказов пользователей</p>
            </Modal>
        </div>
    );
}