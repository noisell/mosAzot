export type PromoCodeCreateType = {
    name: string;
    amount: number;
    count: number | null;
    date: string | null;
}


export type PromoCodeType = PromoCodeCreateType & {
    id: number;
}