import React, {useState} from 'react';
import {Input, Checkbox, message, ConfigProvider, Spin} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';
import type { CheckboxProps } from 'antd';
// import {authentication} from "@/app/api";
import {error} from "@/app/utils";
import {authentication} from "@/app/api";

export function Authorization(props: {callback: () => void}) {
    const [login, setLogin] = useState("");
    const [pass, setPass] = useState("");
    const [checkBox, setCheckBox] = useState(true);
    const [messageApi, contextHolder] = message.useMessage()
    const [disabled, setDisabled] = useState(false);

    const onChange: CheckboxProps['onChange'] = (e) => {
        setCheckBox(e.target.checked);
    };
    const handleClick = () => {
        setDisabled(true);
        authentication({login: login, password: pass, remember_me: checkBox}).then(r => {
            if (r) {
                return props.callback();
            }
            else {
                error(messageApi, "Неверный логин или пароль")
                setLogin("");
                setPass("");
                setDisabled(false);
            }
        })
    }
    return (
        <div className="flex w-screen h-screen items-center justify-center -mt-20 text-black">
            <ConfigProvider theme={{components:
                    {Message: {contentBg: '#F2F2F2', colorText: '#141414'}
                    }}}>
                {contextHolder}
                <div className="flex flex-col items-center px-8 py-10 rounded-[32px] bg-[#FFFFFF] gap-3">
                    <h1 className="text-[20px] mb-2 font-medium">Авторизация</h1>
                    <Input style={{borderRadius: "12px"}} size={"large"} placeholder="Логин" value={login} onChange={(e) => setLogin(e.target.value)} />
                    <Input.Password style={{borderRadius: "12px"}} size={"large"} placeholder="Пароль" value={pass} onChange={(e) => setPass(e.target.value)} />
                    <Checkbox onChange={onChange} checked={checkBox} className="w-11/12 text-white">Запомнить вход</Checkbox>
                    <button
                        onClick={handleClick}
                        disabled={disabled}
                        className={`flex items-center justify-center rounded-xl bg-blue-500 text-[16px] leading-4 text-white cursor-pointer ${login && pass ? '' : 'opacity-30'} w-full py-3`}>
                        {
                            disabled ? <Spin size={"small"} indicator={<LoadingOutlined spin style={{
                                    color: 'white',
                                    width: 16,
                                    height: 16
                                }}/>}/>
                                : <p>Войти</p>
                        }
                    </button>
                </div>
            </ConfigProvider>
        </div>
    );
}