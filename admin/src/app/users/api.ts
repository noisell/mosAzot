import {adminInstance} from "@/app/api";
import {UserType} from "@/app/users/types";


export async function getAllUsers(): Promise<UserType[]> {
    const instance = await adminInstance();
    const response = await instance.get("/users");
    return response.data;
}

export async function changeUser(id: number, first_name: string, phone_number: number | null, banned: boolean) {
    const instance = await adminInstance()
    await instance.patch("/user", {id: id, first_name: first_name, phone_number: phone_number, banned: banned})
}