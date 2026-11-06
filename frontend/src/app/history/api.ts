import {OrderHistoryType, OrderRepeatType} from "@/app/history/types";
import {orderInstance} from "@/app/basket/api";


export async function getHistory(): Promise<OrderHistoryType[]> {
    const instance = await orderInstance();
    const response = await instance.get("/history");
    return response.data;
}

export async function orderRepeat(data: OrderRepeatType[]) {
    const instance = await orderInstance();
    await instance.post("/repeat", data);
}