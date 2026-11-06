import {AddressCreateType} from "@/app/profile/types";

export type ProductForBasketType = {
    id: number;
    name: string;
    price: number;
    old_price: number | null;
    price_trade: number | null;
    size: string;
    image: string;
    count: number;
    balloon: boolean;
    active: boolean;

}

export type BasketType = {
    id: number;
    count: number;
    product: ProductForBasketType;
    trade: boolean | null;
}

export type PromoCodeSimpleType = {
    id: number;
    name: string;
    amount: number;
}

export type CheckPromoCodeResponseType = {
    success: boolean;
    data: PromoCodeSimpleType | string;
}

export type SystemDataNamesType = "price_in_MKAD" | "price_out_MKAD" | "price_up_to_level" | "min_order_amount"

export type SystemDataType = {
    name: SystemDataNamesType,
    value: string
}

export type DeliveryType = "in_MKAD" | "out_MKAD"

export type ChangeBasketType = "plus" | "minus"

export type CreateOrderType = {
    comment: string
    up_to_level: boolean
    delivery_type: DeliveryType
    promo_code: string
    first_name: string
    phone_number: number
    address: AddressCreateType
    products?: number[];
    trade: boolean | null;
}