import {adminInstance} from "@/app/api";
import {PromoCodeCreateType, PromoCodeType} from "@/app/promo/types";


export async function getAllPromoCodes (): Promise<PromoCodeType[]> {
    const instance = await adminInstance();
    const response = await instance.get("/promoCode")
    return response.data;
}

export async function createPromoCode (promoCode: PromoCodeCreateType): Promise<number> {
    const instance = await adminInstance();
    try {
        const response = await instance.post("/promoCode", promoCode);
        return response.data;
    }
    catch (error) {return 0}
}

export async function deletePromoCode (promoCodeId: number): Promise<void> {
    const instance = await adminInstance();
    await instance.delete("/promoCode", {params: {promo_code_id: promoCodeId}});
}