import React, {useState} from 'react';
import {BasketType, ProductForBasketType} from "@/app/basket/types";
import {basketPersistStore} from "@/store/persistBasketStore";
import {MinusIcon} from "@/app/icons/minusIcon";
import {PlusIcon} from "@/app/icons/plusIcon";
import {TrashIcon} from "@/app/icons/trashIcon";
import {numberFormat} from "@/app/utils";
import {changeCountBasketProduct, deleteBasketProduct} from "@/app/basket/api";

export function BasketProductCard(props: BasketType) {
    const basketStore = basketPersistStore();

    const handleClickChangeCountProduct = async (event: React.MouseEvent, change: "minus" | "plus") => {
        event.stopPropagation();
        Telegram.WebApp.HapticFeedback.impactOccurred("light")
        if (change === "minus") {
            if (basketStore.products.filter(product => product.id === props.id)[0].count <= 1) {
                basketStore.deleteProduct(props.id)
                await deleteBasketProduct(props.id)

            }
            else {
                basketStore.minusProductCount(props.id)
                await changeCountBasketProduct(props.id, "minus")
            }
        }
        else {
            basketStore.plusProductCount(props.id)
            await changeCountBasketProduct(props.id, "plus")
        }
    }

    const deleteProduct = async () => {
        Telegram.WebApp.HapticFeedback.impactOccurred("light")
        basketStore.deleteProduct(props.id)
        await deleteBasketProduct(props.id)
    }

    return (
        <div className="relative flex w-full bg-[#111111] pl-3 pr-5 py-5 rounded-3xl font-sans overflow-hidden">
            {!props.product.active && <div
                className="absolute flex inset-0 bg-black bg-opacity-75 w-full h-full items-center justify-center text-[16px] leading-4 font-semibold"
                style={{zIndex: 60}}>
                <p>Нет в наличии</p>
            </div>}
            <div className="relative flex items-center justify-center w-1/4">
                <img src={props.product.image} alt={""} style={{zIndex: 50, height: 100}}/>
            </div>
            <div className="flex flex-col h-full justify-between w-1/2 ml-3">
                <p className="text-[14px] leading-[14px] text-white font-medium">{props.trade === null ? props.product.name : "Пищевая закись азота"}</p>
                <div className="flex w-full items-center">
                    <p className="text-[14px] leading-[14px] text-[#757575] font-medium">{props.product.size}</p>
                    {
                        props.trade !== null && (
                            props.trade
                                ?
                                <div className="flex items-center justify-center py-1 px-2 text-xs leading-3 font-medium rounded-[8px] border border-blue-500 ml-3 text-blue-500">
                                    <p>Обмен</p>
                                </div>
                                :
                                <div className="flex items-center justify-center py-1 px-2 text-xs leading-3 font-medium rounded-[8px] border border-green-500 ml-3 text-green-500">
                                    <p>Покупка</p>
                                </div>
                        )
                    }
                </div>

                <div
                    className="flex w-3/4 items-center bg-[#181818] rounded-xl justify-between text-[14px] leading-[14px]">
                    <span className="h-full py-3 px-3 flex items-center cursor-pointer" onClick={(event) => handleClickChangeCountProduct(event, "minus")}>
                        <MinusIcon width={14} height={3}/>
                    </span>
                    <span className="flex items-center gap-2 py-3">{basketStore.products.filter(product => product.id === props.id)[0].count} шт.</span>
                    <span className="h-full p-3 px-3 flex items-center cursor-pointer" onClick={(event) => handleClickChangeCountProduct(event, "plus")}>
                        <PlusIcon width={14} height={14}/>
                    </span>
                </div>
            </div>
            <div className="flex flex-col h-full w-1/4 items-end justify-between">
                <span onClick={deleteProduct} className="cursor-pointer" style={{zIndex: 70}}><TrashIcon color={props.product.active ? "#5B5B5B" : "#FFFFFF"} /></span>
                <div className="flex flex-col items-end">
                    {props.product.old_price
                        ?
                        <p className="text-[12px] leading-[12px] text-[#5B5B5B] mb-1 line-through">{numberFormat(props.product.old_price * props.count)}₽</p>
                        : null
                    }
                    <p className="text-[#E1C272] text-[16px] leading-[16px] font-medium">{numberFormat((props.trade && props.product.price_trade ? props.product.price_trade : props.product.price) * props.count)}₽</p>
                </div>
            </div>
        </div>
    );
}