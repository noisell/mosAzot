import React, {useState} from 'react';
import {PromoCodeType} from "@/app/promo/types";
import {CustomInput} from "@/app/components/customInput";
import {TrashIcon} from "@/app/icons/trashIcon";
import {formatToUserTimezone} from "@/app/utils";
import {deletePromoCode} from "@/app/promo/api";

type Props = {callback: (id: number) => void} & PromoCodeType

export function PromoCodeCard(props: Props) {

    const handleDeletePromoCode = async () => {
        props.callback(props.id)
        await deletePromoCode(props.id)
    }
    return (
        <div className="flex items-center w-full bg-[#efefef] rounded-2xl pb-4 pt-6 px-6 text-[16px] leading-4 gap-3">
            <div className="flex items-center w-1/4">
                <CustomInput placeholder={"Промокод"} value={props.name} setValue={() => {
                }}/>
            </div>
            <div className="flex items-center w-1/4">
                <CustomInput placeholder={"Сумма скидки"} value={props.amount < 0 ? `${Math.abs(props.amount)}%` : props.amount + "₽"} setValue={() => {
                }}/>
            </div>
            <div className="flex items-center w-1/4">
                <CustomInput placeholder={"Кол-во активаций"} value={props.count ? props.count+"" : "Не задано"} setValue={() => {
                }}/>
            </div>
            <div className="flex items-center w-1/4">
                <CustomInput placeholder={"Действует до"} value={props.date ? formatToUserTimezone(props.date, true, false)  : "Не задано"} setValue={() => {}}/>
            </div>
            <span onClick={handleDeletePromoCode} className={"cursor-pointer -mt-2 pl-2"}><TrashIcon color={"#a30000"}/></span>
        </div>
    );
}