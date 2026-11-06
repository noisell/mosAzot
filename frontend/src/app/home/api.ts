import {axiosBaseInstance} from "@/app/api";
import {ProductBalloonType, ProductType} from "@/app/home/types";

export async function productInstance() {
    return await axiosBaseInstance(false, "/product");
}

export async function getProductsOthers(): Promise<ProductType[]> {
    const instance = await productInstance();
    const response = await instance.get("/others")
    return response.data;
}

export async function getProductsBalloon(): Promise<ProductBalloonType[]> {
    const instance = await productInstance();
    const response = await instance.get("/balloon")
    return response.data;
}