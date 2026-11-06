import React from 'react';
import Link from "next/link";
import {HomeIcon} from "@/app/icons/homeIcon";

export function BasketEmpty() {
    return (
        <div className="flex w-full flex-col items-center font-sans text-center">
            <img src={"https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"} alt={""} width="50%" className="mt-8"/>
            <p className="text-[16px] leading-4 text-white font-bold mt-5">В корзине пусто</p>
            <p className="text-[14px] leading-4 text-[#757575] text-center font-medium mt-3">Добавляйте сюда любимые товары<br/>и заказывайте их всего в пару кликов</p>
            <Link href={"/home"} className="flex items-center justify-center gap-2 w-3/4 bg-[#111111] text-center rounded-2xl py-2.5 mt-10">
                <HomeIcon color={"#FFFFFF"} width={16} height={16}/> За покупками
            </Link>
        </div>
    );
}