'use client'

import React, {useEffect, useState} from 'react';
import {mainHook} from "@/app/hooks/main";
import {ProductType} from "@/app/products/types";
import {getProducts} from "@/app/products/api";
import {CardProduct} from "@/app/products/components/cardProduct";
import {LoadingComponent} from "@/app/components/loading";
import {NewProduct} from "@/app/products/components/newProduct";

export default function ProductsPage() {
    mainHook("/products")

    const [showModalNewProducts, setShowModalNewProducts] = useState(false);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<ProductType[]>([]);
    useEffect(() => {
        getProducts().then(r => {
            setProducts(r);
            setLoading(false);
        })
    }, []);

    const handleCallback = (data: ProductType) => {
        setProducts(prevState => prevState.map(item => item.id === data.id ? data : item))
    }

    const handleCallbackDelete = (id: number) => {
        setProducts(prevState => prevState.filter(product => product.id !== id))
    }

    const handleCallbackCreateProduct = (product: ProductType) => {
        setProducts(prevState => [...prevState, product]);
    }

    if (loading) return <main><LoadingComponent/></main>;
    return (
        <main>
            <div className="flex flex-col w-full h-full pt-3">
                <div className="flex w-full items-center pl-5 gap-3 font-sans">
                    <h1 className="text-[20px] leading-5 font-semibold text-black">Товары</h1>
                    <div
                        className="flex items-center justify-center py-2 px-3 text-[16px] leading-4 font-normal bg-blue-500 text-white rounded-xl">
                        {products.length} шт
                    </div>
                    <div
                        className="flex items-center justify-center py-2 px-3 text-[16px] leading-4 font-normal bg-orange-500 text-white rounded-xl">
                        {products.filter(item => item.hit).length} хит
                    </div>
                    <div
                        className="flex items-center justify-center py-2 px-3 text-[16px] leading-4 font-normal bg-red-500 text-white rounded-xl">
                        {products.filter(item => !item.active).length} выкл
                    </div>
                    <button
                        className="flex ml-auto items-center justify-center py-2 px-5 text-[16px] leading-4 font-normal bg-green-500 text-white rounded-xl"
                        onClick={() => {
                            setShowModalNewProducts(true)
                        }}
                    >
                        Создать +
                    </button>
                </div>
                <div
                    className="flex flex-col w-full h-full rounded-[32px] bg-[#FFFFFF] mt-5 overflow-scroll px-7 py-7 font-sans">
                    <p className="text-[18px] leading-5 font-bold pl-3 mb-5">Баллоны</p>
                    {products.map((product, index) => (
                        product.balloon ?
                            <div className="flex flex-col w-full gap-3 mb-6" key={index} id={product.id + ""}>
                                <div className="w-full flex flex-col items-center gap-3">
                                    <CardProduct {...product} key={index} callback={handleCallback}
                                                 callbackDelete={handleCallbackDelete}/>
                                </div>
                            </div> : null
                    ))}
                    <p className="text-[18px] leading-5 font-bold pl-3 mb-5 mt-7">Аксессуары</p>
                    {products.map((product, index) => (
                        !product.balloon ?
                            <div className="flex flex-col w-full gap-3 mb-6" key={index} id={product.id + ""}>
                                <div className="w-full flex flex-col items-center gap-3">
                                    <CardProduct {...product} key={index} callback={handleCallback}
                                                 callbackDelete={handleCallbackDelete}/>
                                </div>
                            </div> : null
                    ))}
                </div>
            </div>
            <NewProduct showModalNewProducts={showModalNewProducts} setShowModalNewProducts={setShowModalNewProducts} callback={handleCallbackCreateProduct} />
        </main>
    );
}