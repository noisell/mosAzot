import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {BasketType, ProductForBasketType} from "@/app/basket/types";

interface BasketPersistState{
    products: BasketType[];
    addProduct: (product: BasketType) => void;
    deleteProduct: (id: number) => void;
    plusProductCount: (id: number) => void;
    minusProductCount: (id: number) => void;
    replaceProducts: (products: BasketType[]) => void;
}

export const basketPersistStore = create (
    persist<BasketPersistState> (
        (set) => ({
            products: [],
            addProduct: (product: BasketType) => set((state) => ({...state, products: [...state.products, product] })),
            deleteProduct: (id: number) => set((state) => ({...state, products: state.products.filter(product => product.id !== id) })),
            plusProductCount: (id: number) => set((state) => ({...state, products: state.products.map(product => product.id === id ? {...product, count: product.count + 1 } : product) })),
            minusProductCount: (id: number) => set((state) => ({...state, products: state.products.map(product => product.id === id ? {...product, count: product.count - 1 } : product) })),
            replaceProducts: (products: BasketType[]) => set((state) => ({...state, products: products }))
        }),
        {
            name: 'basket',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
