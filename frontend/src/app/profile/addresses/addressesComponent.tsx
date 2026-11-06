import React, { useState } from 'react';
import { AddressesNotFoundComponent } from "@/app/profile/addresses/components/addressesNotFoundComponent";
import { AddressBaseComponent } from "@/app/profile/addresses/components/addressBaseComponent";
import { PlusOutlined, EnvironmentFilled } from "@ant-design/icons";
import {userPersistStore} from "@/store/persistUserStore";
import {changeDefaultAddress} from "@/app/profile/api";

export function AddressesComponent() {
    const store = userPersistStore()
    const [addAddress, setAddAddress] = useState<boolean>(false)

    const handleDeleteAddress = (id: number) => {
        Telegram.WebApp.HapticFeedback.impactOccurred("light")
        store.deleteAddress(id)
    }

    const handleSaveNewAddress = () => setAddAddress(false)

    const handleClickAddAddress = () => {
        if (!addAddress) {
            Telegram.WebApp.HapticFeedback.impactOccurred("light")
            setAddAddress(true)
        }
        else Telegram.WebApp.HapticFeedback.notificationOccurred("error")
    }

    const handleDeleteNewAddress = () => {
        Telegram.WebApp.HapticFeedback.impactOccurred("light")
        setAddAddress(false)
    }

    const handleClickSelectAddress = (id: number) => {
        Telegram.WebApp.HapticFeedback.impactOccurred("light")
        store.changeSelectedAddressId(id)
        changeDefaultAddress(id).then()
    }

    return (
        <div className="w-full flex flex-col items-center mt-6">
            <div className="flex w-full items-center justify-between px-6">
                <div className="flex items-center gap-2.5 font-semibold text-[16px] leading-4">
                    <EnvironmentFilled style={{fontSize: 20, color: "#FFFFFF"}}/> <p>Адреса</p>
                </div>
                <PlusOutlined style={{fontSize: 20, color: "#E1C272"}} onClick={handleClickAddAddress}/>
            </div>
            <div className="w-full flex flex-col">
                {addAddress && (
                    <AddressBaseComponent id={0} name={""} address={""} entrance={""} flat={""} level={""} door_phone={""} selected={false} autoFocus onDelete={handleDeleteNewAddress} onSave={handleSaveNewAddress} showManageButtons />
                )}
                {
                    store.addresses.length > 0
                        ? store.addresses.map(address =>
                            <AddressBaseComponent
                                key={address.id}
                                id={address.id}
                                name={address.name}
                                address={address.address}
                                entrance={address.entrance}
                                flat={address.flat}
                                level={address.level}
                                door_phone={address.door_phone}
                                selected={store.selectedAddressId === address.id}
                                onDelete={() => handleDeleteAddress(address.id)}
                                onSave={() => {}}
                                handleClickSelectAddress={() => handleClickSelectAddress(address.id)}
                            />)
                        : !addAddress && <AddressesNotFoundComponent/>
                }
            </div>
        </div>
    );
}