import {SystemDataType, UpdateSystemDataType} from "@/app/settings/types";
import {adminInstance} from "@/app/api";



export async function getDataForOrders(): Promise<SystemDataType[]> {
    const instance = await adminInstance();
    const response = await instance.get("/dataForOrders");
    return response.data;
}

export async function updateSystemData(data: UpdateSystemDataType) {
    const instance = await adminInstance();
    await instance.put(`/systemData`, data);
}