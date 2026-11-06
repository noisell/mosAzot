export type AddressCreateType = {
    name: string,
    address: string,
    entrance: string | null,
    flat: string | null,
    level: string | null,
    door_phone: string | null,
}

export type AddressType = AddressCreateType & {
    id: number,
}

export type UserType = {
    id: number
    username: string | null,
    first_name: string
    avatar_url: string | null,
    phone_number: number | null,
    banned: boolean,
    selected_address_id: number | null,
    created_at: string
}

export type UserFullType = UserType & {
    addresses: AddressType[]
}