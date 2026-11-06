export type SystemDataNamesType = "price_in_MKAD" | "price_out_MKAD" | "price_up_to_level" | "min_order_amount"

export type SystemDataType = {
    name: SystemDataNamesType,
    value: string
}

export type UpdateSystemDataType = {
    price_in_MKAD: number;
    price_out_MKAD: number;
    price_up_to_level: number;
    min_order_amount: number;
}