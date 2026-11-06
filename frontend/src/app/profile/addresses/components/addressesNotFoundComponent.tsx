import React from 'react';

export function AddressesNotFoundComponent() {
    return (
        <div className={`flex flex-col w-full mt-3 rounded-[32px] bg-[#111111] pl-4 pr-6 py-6 gap-3 select-none`}>
            <p className="leading-4 font-medium ml-2">Еще нет сохраненных адресов</p>
            <div className="w-full flex items-start gap-3 mt-3">
                <img src={"https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"} alt={""} width="30%"/>
                <p className="leading-[14px] text-[14px] text-[#757575]">
                    Добавить их можно нажав на "+" выше, а при оформлении заказ просто выбирать нужный адрес.
                </p>
            </div>
        </div>
    );
}