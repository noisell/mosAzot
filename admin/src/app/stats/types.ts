export type StatsBaseType = {
    today: number;
    mouth: number;
    all: number;
}


export type StatsOtherType = {
    count: number;
    percent: number;
}


export type StatsType = {
    orders: StatsBaseType
    users: StatsBaseType
    users_order: StatsOtherType
    users_basket: StatsOtherType
}