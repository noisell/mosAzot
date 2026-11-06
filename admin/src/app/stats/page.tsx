'use client'

import React, {useEffect, useState} from 'react';
import {mainHook} from "@/app/hooks/main";
import {StatsType} from "@/app/stats/types";
import {LoadingComponent} from "@/app/components/loading";
import {getStats} from "@/app/stats/api";
import {numberFormat} from "@/app/utils";

export default function StatsPage() {
    mainHook("/stats")
    const [stats, setStats] = useState<StatsType>()

    useEffect(() => {
        getStats().then(r => setStats(r));
    }, []);

    if (stats === undefined) return <main><LoadingComponent/></main>;
    return (
        <main>
            <div className="flex flex-col w-full h-full pt-3">
                <div className="flex w-full items-center pl-5 gap-3 font-sans">
                    <h1 className="text-[20px] leading-5 font-semibold text-black">Статистика</h1>
                </div>
                <div className="flex flex-col w-full h-full rounded-[32px] bg-[#FFFFFF] mt-5 overflow-scroll pt-5 px-5 gap-3 font-sans">
                    <div className="flex flex-col items-start w-full gap-3 justify-between">
                        <div className="flex w-full items-center gap-2 justify-between">
                            <div
                                className="flex flex-col w-1/2 rounded-3xl bg-[#F7F7F7] py-4 px-6 border border-[#CCCCCC]">
                                <p className="text-black font-semibold text-xl leading-5">Пользователи</p>
                                <div
                                    className="flex w-full items-end gap-2 mt-5 pb-5 border-b-[0.5px] border-[#757575]">
                                    <p className="text-[50px] leading-[50px] text-blue-600">{numberFormat(stats.users.all)}</p>
                                    <p className="text-[16px] leading-6 font-medium">чел</p>
                                </div>
                                <div className="flex w-full items-center gap-3 mt-5">
                                    <div className="flex flex-col w-1/2 gap-2">
                                        <p className="text-[16px] leading-4 font-medium ml-2">Сегодня:</p>
                                        <div
                                            className="flex w-full items-end gap-2 rounded-2xl bg-[#FFFFFF] py-3 px-4 border border-[#CCCCCC]">
                                            <p className="text-[32px] leading-[32px] text-green-600">+ {numberFormat(stats.users.today)}</p>
                                            <p className="text-[16px] leading-6 font-medium">чел</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-1/2 gap-2">
                                        <p className="text-[16px] leading-4 font-medium ml-2">За месяц:</p>
                                        <div
                                            className="flex w-full items-end gap-2 rounded-2xl bg-[#FFFFFF] py-3 px-4 border border-[#CCCCCC]">
                                            <p className="text-[32px] leading-[32px] text-green-600">+ {numberFormat(stats.users.mouth)}</p>
                                            <p className="text-[16px] leading-6 font-medium">чел</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col w-1/2 rounded-3xl bg-[#F7F7F7] py-4 px-6 border border-[#CCCCCC]">
                                <p className="text-black font-semibold text-xl leading-5">Заказы</p>
                                <div
                                    className="flex w-full items-end gap-2 mt-5 pb-5 border-b-[0.5px] border-[#757575]">
                                    <p className="text-[50px] leading-[50px] text-blue-600">{numberFormat(stats.orders.all)}</p>
                                    <p className="text-[16px] leading-6 font-medium">зак</p>
                                </div>
                                <div className="flex w-full items-center gap-3 mt-5">
                                    <div className="flex flex-col w-1/2 gap-2">
                                        <p className="text-[16px] leading-4 font-medium ml-2">Сегодня:</p>
                                        <div
                                            className="flex w-full items-end gap-2 rounded-2xl bg-[#FFFFFF] py-3 px-4 border border-[#CCCCCC]">
                                            <p className="text-[32px] leading-[32px] text-green-600">+ {numberFormat(stats.orders.today)}</p>
                                            <p className="text-[16px] leading-6 font-medium">зак</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-1/2 gap-2">
                                        <p className="text-[16px] leading-4 font-medium ml-2">За месяц:</p>
                                        <div
                                            className="flex w-full items-end gap-2 rounded-2xl bg-[#FFFFFF] py-3 px-4 border border-[#CCCCCC]">
                                            <p className="text-[32px] leading-[32px] text-green-600">+ {numberFormat(stats.orders.mouth)}</p>
                                            <p className="text-[16px] leading-6 font-medium">зак</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full items-center gap-2 justify-between">
                            <div
                                className="flex flex-col w-1/2 rounded-3xl bg-[#F7F7F7] py-4 px-6 border border-[#CCCCCC]">
                                <p className="text-black font-semibold text-xl leading-5">Сделали хотя бы 1 заказ</p>
                                <div className="flex w-full items-center mt-5">
                                    <div
                                        className="flex w-1/2 items-end gap-2 text-blue-600">
                                        <p className="text-[50px] leading-[50px]">{numberFormat(stats.users_order.count)}</p>
                                        <p className="text-[16px] leading-6 font-medium">чел</p>
                                    </div>
                                    <div
                                        className="flex w-1/2 items-end gap-2 text-green-600">
                                        <p className="text-[50px] leading-[50px] text-green-60">{stats.users_order.percent}</p>
                                        <p className="text-[16px] leading-6 font-medium">%</p>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="flex flex-col w-1/2 rounded-3xl bg-[#F7F7F7] py-4 px-6 border border-[#CCCCCC]">
                                <p className="text-black font-semibold text-xl leading-5">Имеют товары в корзине</p>
                                <div className="flex w-full items-center mt-5">
                                    <div
                                        className="flex w-1/2 items-end gap-2 text-blue-600">
                                        <p className="text-[50px] leading-[50px]">{numberFormat(stats.users_basket.count)}</p>
                                        <p className="text-[16px] leading-6 font-medium">чел</p>
                                    </div>
                                    <div
                                        className="flex w-1/2 items-end gap-2 text-green-600">
                                        <p className="text-[50px] leading-[50px] text-green-60">{stats.users_basket.percent}</p>
                                        <p className="text-[16px] leading-6 font-medium">%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}