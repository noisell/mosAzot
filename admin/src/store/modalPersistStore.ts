import {create} from "zustand/index";
import { persist, createJSONStorage } from 'zustand/middleware';
import {ModalState} from "@/store/types";

export const modal = create(
    persist<ModalState>(
        (set) => ({
            show: false,
            changeShow: (show: boolean) => set((state) => ({...state,  show: show })),
            title: "",
            changeTitle: (title: string) => set((state) => ({...state,  title: title })),
            message: "",
            changeMessage: (message: string) => set((state) => ({...state,  message: message })),
            reload: false,
            changeReload: (reload: boolean) => set((state) => ({...state,  show: reload })),
        }),
        {
            name: 'modal',
            storage: createJSONStorage(() => localStorage),
        }
    )
);