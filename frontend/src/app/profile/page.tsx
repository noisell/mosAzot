'use client'

import React, {useState, useEffect} from 'react';
import {mainHook} from "@/app/hooks/main";
import {PencilIcon} from "@/app/icons/pencilIcon";
import {BasketIcon} from "@/app/icons/basketIcon";
import {CaretRightOutlined} from "@ant-design/icons";
import {Footer} from "@/app/components/footer";
import {getUserFullInfo} from "@/app/profile/api";
import {userPersistStore} from "@/store/persistUserStore";
import {AddressesComponent} from "@/app/profile/addresses/addressesComponent";
import {HeadProfileComponent} from "@/app/profile/head/headProfileComponent";
import {useRouter} from "next/navigation";

export default function Page() {
    mainHook("/profile")
    const store = userPersistStore()
    const router = useRouter();

    useEffect(() => {
        getUserFullInfo().then(r => {
            if (r.avatar_url) store.changePhotoUrl(r.avatar_url);
            store.changeAddresses(r.addresses);
            store.changeSelectedAddressId(r.selected_address_id);
            store.changeFirstName(r.first_name);
            const phoneNumber = r.phone_number !== null ? r.phone_number+"" : ""
            store.changePhoneNumber(phoneNumber ? `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 8)} ${phoneNumber.slice(8, 10)}` : phoneNumber);
        })
    }, []);

    const handleClickHistory = () => {
        Telegram.WebApp.HapticFeedback.impactOccurred("light")
        router.push("/history")
    }

    return (
        <main>
            <HeadProfileComponent/>
            <AddressesComponent/>
            <button className="flex items-center w-full bg-[#111111] py-5 rounded-full px-6 mt-6 justify-between"
                    onClick={handleClickHistory}
            >
                <div className="flex items-center text-[16px] gap-3 leading-4 font-semibold">
                    <BasketIcon width={20} height={20} color={"#FFF"}/>
                    <p>История заказов</p>
                </div>
                <CaretRightOutlined style={{fontSize: 20, color: "#E1C272"}}/>
            </button>
            <Footer/>
        </main>
    );
}