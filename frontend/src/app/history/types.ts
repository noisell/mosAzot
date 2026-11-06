export type ProductForHistoryType = {
    id: number;
    name: string;
    image: string;
    size: string;
    balloon: boolean;
}

export type ProductsHistoryType = {
    price: number;
    trade: boolean | null;
    count: number;
    product: ProductForHistoryType;
}

export type OrderHistoryType = {
    id: number;
    amount: number;
    address: string;
    created_at: string;
    products: ProductsHistoryType[];
}

export type OrderRepeatType = {
    product_id: number;
    count: number;
}