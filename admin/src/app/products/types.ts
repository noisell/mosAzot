export type ProductCreateType = {
    name: string;
    price: number;
    old_price: number | null;
    price_trade: number | null;
    size: string;
    image: string;
    hit: boolean;
    active: boolean;
    description: string;
    balloon: boolean;
}

export type ProductType = ProductCreateType & {
    id: number;
}

export type ChangeProductImageType = {
    image: string;
    product_id: number;
}

export type ChangeProductType = {
    product_id: number;
    name: string;
    price: number;
    old_price: number | null;
    price_trade: number | null;
    size: string;
    hit: boolean;
    active: boolean;
    description: string;
}