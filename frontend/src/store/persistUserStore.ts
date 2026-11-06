import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AddressType } from "@/app/profile/types";

interface PersistentUserState {
    firstName: string;
    changeFirstName: (firstName: string) => void;
    phoneNumber: string;
    changePhoneNumber: (phoneNumber: string) => void;
    addresses: AddressType[]
    addAddress: (address: AddressType) => void;
    deleteAddress: (id: number) => void;
    changeAddresses: (addresses: AddressType[]) => void;
    updateAddress: (address: AddressType) => void;
    selectedAddressId: number | null;
    changeSelectedAddressId: (id: number | null) => void;
    photoUrl: string;
    changePhotoUrl: (photoUrl: string) => void;
}

export const userPersistStore = create(
    persist<PersistentUserState>(
        (set) => ({
            firstName: "",
            changeFirstName: (firstName: string) => set((state) => ({...state, firstName: firstName })),
            phoneNumber: "",
            changePhoneNumber: (phoneNumber: string) => set((state) => ({...state, phoneNumber: phoneNumber })),
            addresses: [],
            addAddress: (address: AddressType) => set((state) => ({...state, addresses: [address, ...state.addresses] })),
            deleteAddress: (id: number) => set((state) => ({...state, addresses: state.addresses.filter((address) => address.id !== id) })),
            changeAddresses: (addresses: AddressType[]) => set((state) => ({...state, addresses: addresses })),
            updateAddress: (address: AddressType) => set((state) => ({...state, addresses: state.addresses.map(value => value.id === address.id ? address : value) })),
            selectedAddressId: null,
            changeSelectedAddressId: (id: number | null) => set((state) => ({...state, selectedAddressId: id })),
            photoUrl: "",
            changePhotoUrl: (photoUrl: string) => set((state) => ({...state, photoUrl: photoUrl })),
        }),
        {
            name: 'user',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
