'use client'

import React, {useState} from 'react';
import {navigation} from "@/store/store";
import {useRouter} from "next/navigation";
import {NavigationPaths} from "@/store/types";
import {HomeIcon} from "@/app/icons/homeIcon";
import {CategoriesIcon} from "@/app/icons/categoriesIcon";
import {SettingsIcon} from "@/app/icons/settingsIcon";
import {ProfileOblickIcon} from "@/app/icons/profileOblickIcon";
import {SaleIcon} from "@/app/icons/saleIcon";
import {BasketIcon} from "@/app/icons/basketIcon";

type Buttons = {
    path: NavigationPaths,
    name: string,
}

const getIcon = (path: NavigationPaths, active: NavigationPaths) => {
    if (path === "/stats") {
        return <HomeIcon color={active == "/stats" ? "#4e8bfb" : "#707178"}/>
    }
    else if (path === "/users") {
        return <ProfileOblickIcon color={active == "/users" ? "#4e8bfb" : "#707178"}/>
    }
    else if (path === "/products") {
        return <CategoriesIcon color={active == "/products" ? "#4e8bfb" : "#707178"}/>
    }
    else if (path === "/orders") {
        return <BasketIcon color={active == "/orders" ? "#4e8bfb" : "#707178"}/>
    }
    else if (path === "/promo") {
        return <SaleIcon color={active == "/promo" ? "#4e8bfb" : "#707178"}/>
    }
    else {
        return <SettingsIcon color={active == "/settings" ? "#4e8bfb" : "#707178"}/>
    }
}

export function Navigation() {
    const data = navigation();
    const router = useRouter()
    const buttons: Buttons[] = [
        {path: "/stats", name: "Главная"},
        {path: "/users", name: "Пользователи"},
        {path: "/products", name: "Товары"},
        {path: "/orders", name: "Заказы"},
        {path: "/promo", name: "Промокоды"},
        {path: "/settings", name: "Настройки"},
    ]
    const handleClick = (path: NavigationPaths) => {
        data.changeActive(path)
        return router.push(path)
    }

    return (
        data.show
            ?
            <div className="flex flex-col items-center bg-[#FFFFFF] h-screen sticky top-0 py-4 pl-5 pr-10 gap-3 border-r font-sans">
                <div className="flex w-full items-center font-bold pl-2 mb-2.5 mt-2.5">
                    <p>MOSAZOT ADMIN</p>
                </div>
                {buttons.map((button, index) => (
                    <button key={index} className={`flex items-center w-[200px] py-3 px-6 bg-[#f3f3f3] rounded-2xl gap-3 border ${data.active == button.path ? 'border-[#4e8bfb]' : 'border-[#f3f3f3]'}`}
                            onClick={() => {handleClick(button.path)}}
                    >
                        {getIcon(button.path, data.active)}
                        <p style={{color: data.active == button.path ? "#4e8bfb" : "#707178"}}>{button.name}</p>
                    </button>
                ))}
            </div>
            : null
    );
}