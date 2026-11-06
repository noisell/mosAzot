import React from 'react';
import {UserType} from "@/app/users/types";
import {Checkbox, InputNumber, Input} from "antd";
import Image from "next/image";

type Props = {
    user: UserType
    setUser: (user: UserType) => void
};

export function ModalUser(props: Props) {
    const {user, setUser} = props;
    return (
        <div className="flex w-full flex-col">
            <span className={"flex w-full items-center gap-5 mt-3"}>
                <span className={"flex w-full items-center gap-2"}>
                    <Input style={{borderRadius: "12px", width: "100%"}} size={"middle"} placeholder="Имя"
                           value={user.first_name}
                           onChange={(e) => setUser({...user, first_name: e.target.value})}/>
                </span>
                <span className={"flex w-full items-center gap-2"}>
                    <InputNumber style={{borderRadius: "12px", width: "100%"}} size={"middle"}
                                 placeholder="Номер телефона (без +7)"
                                 value={user.phone_number}
                                 maxLength={10}
                                 onChange={(e) => setUser({...user, phone_number: e ? e : null})}/>
                </span>
            </span>
            <span className={"flex w-full items-center mt-5 pl-1"}>
                <Checkbox onChange={(e) => {
                    setUser({...user, banned: e.target.checked})
                }} checked={user.banned}><p className="text-[16px]">Заблокировать?</p></Checkbox>
            </span>
        </div>
    )
}