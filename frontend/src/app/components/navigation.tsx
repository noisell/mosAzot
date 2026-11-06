'use client'

import React from 'react';
import {navigation} from "@/store/store";
import {NavigationPaths} from "@/store/types";
import {ProfileIcon} from "@/app/icons/profileIcon";
import {useRouter} from "next/navigation";
import {HomeIcon} from "@/app/icons/homeIcon";
import {CategoriesIcon} from "@/app/icons/categoriesIcon";
import {BasketIcon} from "@/app/icons/basketIcon";
import {Badge, ConfigProvider} from 'antd';
import {basketPersistStore} from "@/store/persistBasketStore";

const getIcon = (path: NavigationPaths, active: NavigationPaths) => {
    if (path === "/home") {
        return <HomeIcon color={active == "/home" ? "#E1C272" : "#707178"}/>
    }
    else if (path === "/basket") {
        return <BasketIcon color={active == "/basket" ? "#E1C272" : "#707178"}/>
    }
    else {
        return <ProfileIcon color={active == "/profile" ? "#E1C272" : "#707178"}/>
    }
}

type Buttons = {
    path: NavigationPaths,
    name: string,
}

export function Navigation() {
    const data = navigation()
    const router = useRouter()
    const basketStore = basketPersistStore()
    const buttons: Buttons[] = [
        {path: "/home", name: "Главная"},
        {path: "/basket", name: "Корзина"},
        {path: "/profile", name: "Профиль"},
    ]
    const handleClick = (path: NavigationPaths) => {
        Telegram.WebApp.HapticFeedback.impactOccurred("soft")
        data.changeActive(path)
        return router.push(path)


    }
    return (
        data.show
            ?
            <div className="w-full flex fixed items-center justify-around bottom-0 bg-[#171717] px-4 pt-1 pb-5 backdrop-blur-xl bg-opacity-10" style={{zIndex: 200}} id={"nav"}>
                <div className={"w-full flex items-center justify-around bg-[#111111] rounded-full py-4 gap-2 px-6"}>
                    <ConfigProvider
                        theme={{
                            components: {
                                Badge: {
                                    colorBorderBg: '#111111',
                                    fontSize: 12,
                                },
                            },
                        }}>
                        {buttons.map((button, index) => (
                            button.path === '/basket' ?
                                    <Badge count={basketStore.products.map(product => {return product.count}).reduce((a, b) => {return a + b}, 0)}>
                                        <button className={"flex w-[50px] flex-col items-center gap-2"} key={index}
                                                onClick={() => handleClick(button.path)}>
                                            {getIcon(button.path, data.active)}
                                            <p className={`text-[10px] ${data.active === button.path ? "text-[#E1C272]" : "text-[#707178]"}`}>{button.name}</p>
                                        </button>
                                    </Badge>

                                :
                                <Badge count={0}>
                                    <button className={"flex w-[50px] flex-col items-center gap-2"} key={index}
                                            onClick={() => handleClick(button.path)}>
                                        {getIcon(button.path, data.active)}
                                        <p className={`text-[10px] ${data.active === button.path ? "text-[#E1C272]" : "text-[#707178]"}`}>{button.name}</p>
                                    </button>
                                </Badge>
                        ))}
                    </ConfigProvider>
                </div>
            </div>
            : null
    );
}