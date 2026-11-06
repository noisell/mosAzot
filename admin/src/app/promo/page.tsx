'use client'

import React, {useEffect, useState} from 'react';
import {mainHook} from "@/app/hooks/main";
import {PromoCodeType} from "@/app/promo/types";
import {getAllPromoCodes} from "@/app/promo/api";
import {LoadingComponent} from "@/app/components/loading";
import {PromoCodeCard} from "@/app/promo/promoCodeCard";
import {NewPromoCode} from "@/app/promo/newPromoCode";

export default function PromoPage() {
    mainHook("/promo")
    const [promoCodes, setPromoCodes] = useState<PromoCodeType[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [showModalNewPromoCode, setShowModalNewPromoCode] = useState(false);

    useEffect(() => {
        getAllPromoCodes().then(r => {
            setPromoCodes(r);
            setLoading(false);
        })
    }, [])

    const callbackNewPromoCode = (newPromoCode: PromoCodeType) => {
        setPromoCodes(prevState => [...prevState, newPromoCode]);
    }

    const callbackDeletePromoCode = (id: number) => {
        setPromoCodes(prevState => prevState.filter(item => item.id !== id));
    }

    if (loading) return <main><LoadingComponent/></main>;
    return (
        <main>
            <div className="flex flex-col w-full h-full pt-3">
                <div className="flex w-full items-center pl-5 gap-3 font-sans justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-[20px] leading-5 font-semibold text-black">Промокоды</h1>
                        <div
                            className="flex items-center justify-center py-2 px-3 text-[16px] leading-4 font-normal bg-blue-500 text-white rounded-xl">
                            {promoCodes.length} шт
                        </div>
                    </div>
                    <button
                        className="flex ml-auto items-center justify-center py-2 px-5 text-[16px] leading-4 font-normal bg-green-500 text-white rounded-xl"
                        onClick={() => {setShowModalNewPromoCode(true)}}
                    >
                        Создать +
                    </button>
                </div>
                <div className="flex flex-col w-full h-full rounded-[32px] bg-[#FFFFFF] mt-5 overflow-scroll pt-5 px-5 gap-3">
                    {
                        promoCodes.length === 0
                            ? <p>Промокодов пока нет</p>
                            : promoCodes.map(promoCode => <PromoCodeCard {...promoCode} callback={callbackDeletePromoCode} />)
                    }
                </div>
            </div>
            <NewPromoCode showModalNewPromoCode={showModalNewPromoCode} setShowModalNewPromoCode={setShowModalNewPromoCode} callback={callbackNewPromoCode}/>
        </main>
    );
}