import {useEffect} from "react";
import {navigation} from "@/store/store";
import {NavigationPaths} from "@/store/types";

export const mainHook = (path: NavigationPaths) => {
    const nav = navigation()
    useEffect(() => {
        nav.changeShow(true)
        nav.changeActive(path)

    }, [])
}