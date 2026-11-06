'use client'

import React, {useState, useEffect} from 'react';
import {otherHook} from "@/app/hooks/main";
import Loading from "@/app/loading";
import {HistoryEmpty} from "@/app/history/historyEmpty";
import {getHistory} from "@/app/history/api";
import {OrderHistoryType} from "@/app/history/types";
import {HistoryCard} from "@/app/history/historyCard";
import {CloudFilled} from '@ant-design/icons';

export default function Page() {
    otherHook();

    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<OrderHistoryType[]>([])

    useEffect(() => {
        getHistory().then(r => {
            setHistory(r);
            setLoading(false);
        })
    }, []);

    if (loading) return <Loading />;
    if (loading) return <main><HistoryEmpty/></main>;

    return (
        <main>
            {history.length >= 1
                ? <div className="flex flex-col w-full gap-3">
                    <div className="flex w-full items-center gap-2 text-[16px] leading-4 font-semibold pl-3 pb-2">
                        <CloudFilled style={{fontSize: 20}}/><p>История заказов</p>
                    </div>
                    {history.map(item => (<HistoryCard {...item} key={item.id} />))}
                  </div>
                : <HistoryEmpty/>
            }
        </main>
    );
}