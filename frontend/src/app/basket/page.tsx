'use client'

import React, {useEffect, useState} from 'react';
import {mainHook} from "@/app/hooks/main";
import {basketPersistStore} from "@/store/persistBasketStore";
import {Basket} from "@/app/basket/components/basket";
import {BasketEmpty} from "@/app/basket/components/basketEmpty";

export default function Page() {
    mainHook("/basket");
    const basketStore = basketPersistStore();

    return (
        <main>
            { basketStore.products.length > 0 ? <Basket/> : <BasketEmpty/> }
        </main>
    );
}