import {axiosBaseInstance} from "@/app/api";
import {AddressCreateType, AddressType, UserFullType} from "@/app/profile/types";

export async function userInstance() {
    return await axiosBaseInstance(false, "/user");
}

export async function getUserFullInfo(): Promise<UserFullType> {
    const instance = await userInstance();
    const response = await instance.get("")
    return response.data;
}

export async function createAddress(address: AddressCreateType): Promise<AddressType> {
    const instance = await userInstance();
    const response = await instance.post("/address", address)
    return response.data;
}

export async function changeDefaultAddress(addressId: number): Promise<void> {
    const instance = await userInstance();
    await instance.patch("/address/default", {id: addressId});
}

export async function updateAddress(address: AddressType): Promise<void> {
    const instance = await userInstance();
    await instance.put("/address", address);
}

export async function deleteAddress(addressId: number): Promise<number | null> {
    const instance = await userInstance();
    const response = await instance.post("/address/delete", {id: addressId});
    return response.data.new_selected_address_id;
}

export async function updateUserInfo(name: string, phoneNumber: number | null): Promise<void> {
    const instance = await userInstance();
    await instance.patch("", {first_name: name, phone_number: phoneNumber});
}