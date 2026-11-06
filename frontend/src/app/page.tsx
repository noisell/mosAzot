'use client'

import React, {useState, useEffect} from 'react';
import {authorization} from "@/app/api";
import {navigation} from "@/store/store";
import {userPersistStore} from "@/store/persistUserStore";
import {useRouter} from "next/navigation";
import {TelegramWebApps} from "telegram-webapps";
import {Loading} from "@/app/components/loading";

export default function Home() {
    const nav = navigation()
    const store = userPersistStore()
    const router = useRouter();

    const [isVerified, setIsVerified] = useState(false);

    const checkTelegram = () => {
        if (Telegram.WebApp.initData !== "") {
            setIsVerified(true);
            Telegram.WebApp.ready();
            Telegram.WebApp.expand();
            Telegram.WebApp.disableVerticalSwipes();
            Telegram.WebApp.lockOrientation();
            if (store.firstName === "") store.changeFirstName(Telegram.WebApp.initDataUnsafe.user?.first_name ?? "Пользователь");
        }
        else window.location.replace(process.env.NEXT_PUBLIC_BOT_URL as string); // Открыто не в ТГ - перенапрявляем
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (Telegram.WebApp.initData == "") setTimeout(() => checkTelegram(), 1000)
            else checkTelegram()
        }
    }, []);

    useEffect(() => {
        if (isVerified) {
            const user = Telegram.WebApp.initDataUnsafe.user as TelegramWebApps.WebAppUser
            authorization({
                user_id: user.id,
                username: user.username ?? null,
                avatar: user.photo_url ?? null,
                initData: Telegram.WebApp.initData
            }, user.first_name).then(r => {
                if (r) {
                    nav.changeShow(true)
                    router.replace("/home")
                }
            })
        }
    }, [isVerified]);

    return <Loading/>;
}
