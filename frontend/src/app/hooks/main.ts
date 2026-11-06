import {useEffect} from "react";
import {navigation} from "@/store/store";
import {useRouter} from "next/navigation";
import {NavigationPaths} from "@/store/types";
import {getBasketProducts} from "@/app/basket/api";
import {basketPersistStore} from "@/store/persistBasketStore";

export const mainHook = (path: NavigationPaths) => {
    const nav = navigation()
    const router = useRouter();
    const basketStore = basketPersistStore();
    useEffect(() => {
        if (Telegram.WebApp.initDataUnsafe.user) {
            Telegram.WebApp.SettingsButton.isVisible = true
            Telegram.WebApp.SettingsButton.onClick(() => {router.push("/settings")})
            nav.changeShow(true)
            nav.changeActive(path)
            if (path === "/basket" || path === "/home") getBasketProducts().then((r) => basketStore.replaceProducts(r));

            const popupClosed = (params: {button_id: string | null}) => {
                if (params.button_id === "closeWebApp") Telegram.WebApp.close();
            }
            Telegram.WebApp.onEvent("popupClosed", popupClosed)
            if (path !== '/home') {
                const backButton = Telegram.WebApp.BackButton
                backButton.show()
                backButton.onClick(() => router.back())
                return () => {
                    Telegram.WebApp.offEvent("popupClosed", popupClosed);
                    backButton.hide()
                    backButton.offClick(() => router.back())
                }
            }
        }
    }, [])
}

export const otherHook = (showNav: NavigationPaths | undefined = undefined) => {
    const nav = navigation()
    const router = useRouter();
    useEffect(() => {
        if (Telegram.WebApp.initDataUnsafe.user) {
            Telegram.WebApp.SettingsButton.isVisible = true
            Telegram.WebApp.SettingsButton.onClick(() => router.push("/settings"))
            if (showNav) {
                nav.changeShow(true);
                nav.changeActive(showNav)
            }
            else nav.changeShow(false);

            const backButton = Telegram.WebApp.BackButton
            backButton.show()
            backButton.onClick(() => router.back())
            const popupClosed = (params: {button_id: string | null}) => {
                if (params.button_id === "closeWebApp") Telegram.WebApp.close();
            }
            Telegram.WebApp.onEvent("popupClosed", popupClosed)
            return () => {
                Telegram.WebApp.offEvent("popupClosed", popupClosed);
                backButton.hide()
                backButton.offClick(() => router.back())
            }
        }
    }, [])
}