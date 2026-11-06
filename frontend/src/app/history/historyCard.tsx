import React, {useState} from 'react';
import {OrderHistoryType} from "@/app/history/types";
import {formatToUserTimezone, numberFormat} from "@/app/utils";
import {ReloadOutlined, CaretDownOutlined, CaretUpOutlined} from '@ant-design/icons';
import {orderRepeat} from "@/app/history/api";
import {useRouter} from "next/navigation";

export function HistoryCard(props: OrderHistoryType) {
    const router = useRouter();
    const [more, setMore] = useState<boolean>(false);

    const handleClickOrderRepeat = async () => {
        await orderRepeat(props.products.map(product => {return {product_id: product.product.id, count: product.count}}))
        return router.replace("/basket")
    }

    return (
        <div className="flex flex-col w-full bg-[#111111] rounded-[32px] py-4 px-5 font-sans text-[16px] leading-4 text-white">
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2 font-medium">
                    <p>Заказ №{props.id}</p>
                    <p className="text-[#E1C272]">{numberFormat(props.amount)}₽</p>
                </div>
                <button className="flex items-center gap-1.5 py-2 px-2.5 bg-[#191919] text-xs leading-3 rounded-xl"
                        onClick={handleClickOrderRepeat}
                >
                    <ReloadOutlined style={{ fontSize: 12 }} />
                    Повторить
                </button>
            </div>
            <div className="flex w-full items-center text-xs leading-3 gap-1 text-[#757575] mt-1">
                <p>{props.address} |</p><p>{formatToUserTimezone(props.created_at, true, false)}</p>
            </div>
            {
                !more ?
                    <div className="flex w-full items-center flex-wrap gap-x-7 gap-y-3 mt-5">
                        {props.products.map((product, index) => <img src={product.product.image} alt="" style={{height: 50}} key={index}/>)}
                    </div>
                    :
                    <div className="flex w-full flex-col mt-5 gap-3">
                        {props.products.map((product, index) => (
                            <div className="flex w-full flex-col border-b-[0.5px] border-[#202020] pb-3" key={index}>
                                <div className="flex w-full items-start gap-3">
                                    <div
                                        className="relative flex w-1/3 items-center justify-center p-3 bg-[#171717] rounded-2xl overflow-hidden">
                                        <img src={product.product.image} alt="" style={{height: 100, zIndex: 99}}/>
                                        <div className="absolute bg-white bg-opacity-20 rounded-full w-1/3 h-1/3 blur-md"/>
                                    </div>
                                    <div className="flex flex-col w-2/3 justify-between h-full">
                                        <div className="flex flex-col w-full gap-2 pt-0.5">
                                            <p className="text-[14px] leading-[14px] capitalize font-medium">{product.product.balloon ? `Пищевая закись азота ${product.product.size}` : product.product.name}</p>
                                            <div className="flex w-full items-center">
                                                {
                                                    product.trade !== null && (
                                                        product.trade
                                                            ?
                                                            <div className="flex items-center justify-center py-1 px-2 text-xs leading-3 font-medium rounded-[8px] border border-blue-500 text-blue-500">
                                                                <p>Обмен</p>
                                                            </div>
                                                            :
                                                            <div className="flex items-center justify-center py-1 px-2 text-xs leading-3 font-medium rounded-[8px] border border-green-500 text-green-500">
                                                                <p>Покупка</p>
                                                            </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end text-xs font-medium text-[#E1C272]">
                                            <p>{product.count} шт • {numberFormat(product.price)}₽</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
            }
            <button className="flex w-full items-center text-xs leading-3 justify-end mt-3 gap-1 text-[#757575]"
                    onClick={() => {setMore(prevState => !prevState)}}
            >
                <p>Подробнее</p>{more ? <CaretUpOutlined /> : <CaretDownOutlined/>}
            </button>
        </div>
    );
}