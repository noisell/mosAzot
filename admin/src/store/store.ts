import { create } from "zustand";
import {NavigationPaths, NavigationState} from "@/store/types";

export const navigation = create<NavigationState>((set) => ({
    active: "/stats",
    show: false,
    changeShow: (show: boolean) => set((state) => ({...state,  show: show })),
    changeActive: (active: NavigationPaths) => set((state) => ({...state,  active: active }))
}))

