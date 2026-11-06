import React, {useEffect, useState} from 'react';
import {PencilIcon} from "@/app/icons/pencilIcon";
import {userPersistStore} from "@/store/persistUserStore";
import {Drawer} from "@/app/components/drawer";
import {InputPhoneNumber} from "@/app/profile/head/components/inputPhoneNumber";
import {InputName} from "@/app/profile/head/components/inputName";
import {VerificationIcon} from "@/app/icons/verificationIcon";
import {message, ConfigProvider} from 'antd';
import {error, success} from "@/app/utils"
import {updateUserInfo} from "@/app/profile/api";

export function HeadProfileComponent() {
    const store = userPersistStore()
    const [messageApi, contextHolder] = message.useMessage()

    const [openDrawer, setOpenDrawer] = useState<boolean>(false)
    const [name, setName] = useState<string>(store.firstName)
    const [phoneNumber, setPhoneNumber] = useState<string>(store.phoneNumber)
    const [disabledComponent, setDisabledComponent] = useState<boolean>(false)

    useEffect(() => {
        setName(store.firstName)
        setPhoneNumber(store.phoneNumber)
    }, []);

    const handleClickSave = async () => {
        const phoneNumberFormated = phoneNumber.trim().replaceAll(" ", "")
        if (/^\d+$/.test(phoneNumberFormated) && phoneNumberFormated.length === 10) {
            setDisabledComponent(true)
            await updateUserInfo(name, Number(phoneNumberFormated))
            store.changeFirstName(name)
            store.changePhoneNumber(phoneNumber.trim())
            setOpenDrawer(false)
            setDisabledComponent(false)
            success(messageApi, "Данные успешно обновлены!")
        }
        else error(messageApi, "Проверьте корректность номера телефона")
    }

    return (
        <div className="w-full flex flex-col items-center">
            <ConfigProvider theme={{components: {Message: {contentBg: '#222', colorText: '#FFF', borderRadiusLG: 999}}}}>
                {contextHolder}
            </ConfigProvider>
            <div className="flex ml-auto bg-[#111111] rounded-full p-2.5" onClick={() => setOpenDrawer(true)}>
                <PencilIcon color={"#E1C272"}/>
            </div>
            <img src={store.photoUrl} alt={""} width="40%" className="rounded-full -mt-3"/>
            <p className="text-xl mt-4 font-medium">{store.firstName}</p>
            <p className="text-[#757575] font-sans">{store.phoneNumber ? `+7 ${store.phoneNumber}` : "Телефон не указан"}</p>
            <Drawer open={openDrawer} setOpen={setOpenDrawer} fullScreen>
                <div className="flex flex-col w-full h-full items-center justify-between">
                    <div className="flex flex-col w-full items-center pb-8">
                        <img src={store.photoUrl} alt={""} width="50%" className="rounded-full "/>
                        <div className="flex w-full flex-col items-center mt-8 gap-3">
                            <InputName name={name} setName={setName} disabled={disabledComponent}/>
                            <InputPhoneNumber phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} disabled={disabledComponent}/>
                        </div>
                    </div>
                    <button className={`flex items-center justify-center w-full py-5 rounded-3xl font-medium gap-2 leading-4 text-[16px] ${disabledComponent ? 'bg-green-900 text-gray-300 cursor-not-allowed' : `${store.firstName == name && (store.phoneNumber == phoneNumber || phoneNumber.length < 13) ? 'bg-green-900 text-gray-300 cursor-not-allowed' : 'bg-green-600 text-white cursor-pointer'}`}`}
                            onClick={handleClickSave}
                            disabled={disabledComponent ? true : store.firstName == name && (store.phoneNumber == phoneNumber || phoneNumber.length < 13)}
                    >
                        <VerificationIcon width={16} height={16} color={disabledComponent ? "#D1D5DB" : store.firstName == name && (store.phoneNumber == phoneNumber || phoneNumber.length < 13) ? "#D1D5DB" : "#FFFFFF"}/>
                        Сохранить
                    </button>
                </div>
            </Drawer>
        </div>
    );
}