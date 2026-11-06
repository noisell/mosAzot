export type UserType = {
    id: number;
    username: string | null;
    phone_number: number | null;
    first_name: string;
    avatar_url: string;
    selected_address_id: number | null;
    banned: boolean;
    created_at: string;
}
export type UserTypeIndex = keyof UserType;