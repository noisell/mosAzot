import {axiosBaseInstance} from "@/app/api";
import {BasketType, CheckPromoCodeResponseType, CreateOrderType, SystemDataType} from "@/app/basket/types";
import {userInstance} from "@/app/profile/api";
import axios from "axios";

export async function orderInstance() {
    return await axiosBaseInstance(false, "/order");
}

export async function checkPromoCode(name: string): Promise<CheckPromoCodeResponseType> {
    const instance = await orderInstance();
    const response = await instance.get("/promoCode", {params: {name: name}})
    return response.data;
}

export async function getDataForOrders(): Promise<SystemDataType[]> {
    const instance = await orderInstance();
    const response = await instance.get("/dataForOrders");
    return response.data;
}

export async function getBasketProducts(): Promise<BasketType[]> {
    const instance = await userInstance();
    const response = await instance.get("/basket");
    return response.data;
}

export async function addBasketProduct(product_id: number, trade?: boolean): Promise<BasketType | undefined> {
    const instance = await userInstance();
    try {
        const response = await instance.post("/basket", {product_id: product_id, trade: trade ?? null});
        return response.data;
    }
    catch (error) {return undefined}
}

export async function changeCountBasketProduct(basketProductId: number, change: "plus" | "minus"): Promise<void> {
    const instance = await userInstance();
    await instance.patch("/basket", {id: basketProductId, change: change});
}

export async function deleteBasketProduct(basketProductId: number): Promise<boolean> {
    const instance = await userInstance();
    try {
        await instance.delete("/basket", {params: {basket_product_id: basketProductId}});
        return true;
    }
    catch (error) {return false}
}

export async function createOrder(data: CreateOrderType): Promise<boolean> {
    const instance = await orderInstance();
    try {
        const response = await instance.post("", data);
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {  //Указываем тип
            if (error.response && error.response.data && error.response.data.detail) {
                Telegram.WebApp.showAlert(error.response.data.detail as string);
            } else Telegram.WebApp.showAlert("Произошла ошибка, попробуйте позже");
        } else Telegram.WebApp.showAlert("Произошла ошибка, попробуйте позже");
        return false;
    }

}
