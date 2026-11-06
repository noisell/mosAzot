import {productInstance} from "@/app/home/api";
import {ProductType} from "@/app/home/types";

export async function getProductById(id: number): Promise<ProductType | boolean> {
    const instance = await productInstance();
    try {
        const response = await instance.get("/byId", {params: {product_id: id}});
        return response.data;
    }
    catch (error) {return false}
}