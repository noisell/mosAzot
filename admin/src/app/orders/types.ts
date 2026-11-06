export type UserCreateType = {
    id: number;
    username: string | null;
    first_name: string;
    avatar_url: string;
    phone_number: number | null;
};

export type OrderDeliveryType = {
    address: string;
    up_to_level: boolean;
    description: string;
};

export type OrderAmountType = {
    amount: number;
    discount_amount: number;
    delivery_price: number;
};

export type SpecificationsForHistoryType = {
    value: string;
}

export type ProductForHistoryType = {
    id: number;
    name: string;
    image: string;
    size: string;
    specifications: SpecificationsForHistoryType[];
}

export type ProductsHistoryType = {
    price: number;
    count: number;
    product: ProductForHistoryType;
};

export type OrderType = {
    id: number;
    comment: string;
    created_at: string;
    user: UserCreateType;
    delivery: OrderDeliveryType;
    amount: OrderAmountType;
    products: ProductsHistoryType[];
};

export type OrderTypeIndex = keyof OrderType;
export type UserCreateTypeIndex = keyof UserCreateType;