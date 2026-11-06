import {ChangeProductImageType, ChangeProductType, ProductCreateType, ProductType} from "@/app/products/types";
import {adminInstance} from "@/app/api";

export async function getProducts(): Promise<ProductType[]> {
    const instance = await adminInstance();
    const response = await instance.get("/products")
    return response.data;
}

export async function changeProductImage(data: ChangeProductImageType) {
    const instance = await adminInstance();
    await instance.patch(`/product/image`, data)
}

export async function changeProduct(data: ChangeProductType) {
    const instance = await adminInstance();
    await instance.patch(`/product`, data)
}

export async function createProduct(data: ProductCreateType): Promise<ProductType> {
    const instance = await adminInstance();
    const response = await instance.post(`/product`, data);
    return response.data;
}

export async function deleteProduct(id: number): Promise<void> {
    const instance = await adminInstance();
    await instance.delete(`/product`, {params: {product_id: id}});
}