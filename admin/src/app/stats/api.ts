import {adminInstance} from "@/app/api";
import {StatsType} from "@/app/stats/types";


export async function getStats(): Promise<StatsType> {
    const instance = await adminInstance();
    const response = await instance.get("/stats")
    return response.data;
}