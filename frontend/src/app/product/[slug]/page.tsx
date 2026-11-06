'use client'

import React, {useState, useEffect} from 'react';
import {getProductById} from "@/app/product/[slug]/api";
import {ProductType} from "@/app/home/types";
import Loading from "@/app/loading";
import {ProductNotFound} from "@/app/product/[slug]/productNotFound";
import {otherHook} from "@/app/hooks/main";
import {basketPersistStore} from "@/store/persistBasketStore";
import {addBasketProduct, changeCountBasketProduct, deleteBasketProduct, getDataForOrders} from "@/app/basket/api";
import {ChangeBasketType} from "@/app/basket/types";
import {FullCardProduct} from "@/app/home/components/fullCardProduct";

export default function PageProduct({ params }: { params: { slug: string } }) {
    otherHook();
    const basketStore = basketPersistStore();

    const [product, setProduct] = useState<ProductType | boolean>();
    const [disabled, setDisabled] = useState(false);
    const [inBasket, setInBasket] = useState(basketStore.products.filter(product => product.product.id === Number(params.slug)).length > 0)

    const [priceInMKAD, setPriceInMKAD] = useState<number>(0)
    const [priceOutMKAD, setPriceOutMKAD] = useState<number>(0)
    const [priceUpToLevel, setPriceUpToLevel] = useState<number>(0)
    const [minOrderAmount, setMinOrderAmount] = useState<number>(0)

    useEffect(() => {
        getDataForOrders().then(r => {
            r.forEach((value) => {
                if (value.name === "price_in_MKAD") setPriceInMKAD(Number(value.value))
                else if (value.name === "price_out_MKAD") setPriceOutMKAD(Number(value.value))
                else if (value.name === "price_up_to_level") setPriceUpToLevel(Number(value.value))
                else if (value.name === "min_order_amount") setMinOrderAmount(Number(value.value))
            })
        });
        getProductById(Number(params.slug)).then(r => {
            setProduct(r)
        });
    }, [])

    useEffect(() => {
        setInBasket(basketStore.products.filter(product => product.product.id === Number(params.slug)).length > 0)
    }, [])

    const addProductInBasket = async () => {
        Telegram.WebApp.HapticFeedback.impactOccurred("light")
        const basketProduct = await addBasketProduct(Number(params.slug))
        if (!basketProduct) return;
        basketStore.addProduct(basketProduct);
        setInBasket(true)
    }

    const handleClickInBasket = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        setDisabled(true)
        await addProductInBasket()
        setDisabled(false)
    }

    const changeCountProductInBasket = async (change: ChangeBasketType) => {
        Telegram.WebApp.HapticFeedback.impactOccurred("light")
        const basketProduct = basketStore.products.filter(basketProduct => basketProduct.product.id === Number(params.slug))[0]
        if (change === "minus") {
            if (basketProduct.count <= 1) {
                setInBasket(false)
                basketStore.deleteProduct(basketProduct.id)
                await deleteBasketProduct(basketProduct.id)
            } else {
                basketStore.minusProductCount(basketProduct.id)
                await changeCountBasketProduct(basketProduct.id, "minus")
            }
        } else {
            basketStore.plusProductCount(basketProduct.id)
            await changeCountBasketProduct(basketProduct.id, "plus")
        }
    }

    const handleClickChangeCountProduct = async (event: React.MouseEvent, change: ChangeBasketType) => {
        event.stopPropagation();
        setDisabled(false)
        await changeCountProductInBasket(change)
        setDisabled(false)
    }

    if (product === undefined) return <Loading />;
    else if (product === false || product === true) return <main><ProductNotFound/></main>;
    return (
        <main>
            <FullCardProduct {...product} disabled={disabled} inBasket={inBasket} handleClickInBasket={handleClickInBasket} handleClickChangeCountProduct={handleClickChangeCountProduct} isFullScreen priceInMKAD={priceInMKAD} priceOutMKAD={priceOutMKAD} priceUpToLevel={priceUpToLevel} minOrderAmount={minOrderAmount} />
        </main>
    );
}