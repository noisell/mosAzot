import {adminInstance} from "@/app/api";
import {OrderType} from "@/app/orders/types";


export async function getAllOrders(): Promise<OrderType[]> {
    const instance = await adminInstance();
    const response = await instance.get('/orders');
    return response.data;
}