export type ProductType = {
    id: number;
    name: string;
    price: number;
    old_price: number | null;
    size: string;
    image: string;
    hit: boolean;
    active: boolean;
    description: string;
}

export type ProductBalloonType = {
    id: number;
    name: string;
    price: number;
    old_price: number | null;
    price_trade: number;
    size: string;
    image: string;
}
