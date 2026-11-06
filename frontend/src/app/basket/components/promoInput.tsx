import React, {useRef, useState} from 'react';
import {checkPromoCode} from "@/app/basket/api";
import {MessageInstance} from "antd/es/message/interface";
import {error, success} from "@/app/utils";
import {PromoCodeSimpleType} from "@/app/basket/types";
import {VerificationIcon} from "@/app/icons/verificationIcon";
import {SaleIcon} from "@/app/icons/saleIcon";

type Props = {
    placeholder: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    disabled?: boolean;
    messageApi: MessageInstance;
    onActivating: (promoCode?: PromoCodeSimpleType) => void;
    onFocus: () => void;
    onBlur: () => void;
}

export function PromoInput(props: Props) {
    const {value, setValue} = props;

    const handleBlur = async () => {
        props.onBlur();
        window.scrollTo(0, 0);
        if (!value) props.onActivating();
        else {
            const promoCode = await checkPromoCode(value);
            if (promoCode.success) {
                Telegram.WebApp.HapticFeedback.notificationOccurred("success")
                props.onActivating(promoCode.data as PromoCodeSimpleType);
                success(props.messageApi, "Промокод успешно активирован")
            }
            else {
                Telegram.WebApp.HapticFeedback.notificationOccurred("error")
                props.onActivating()
                setValue("");
                error(props.messageApi, promoCode.data as string);
            }
        }
    }

    const handleFocus = () => {
        props.onFocus();
    }

    const inputRef = useRef<HTMLInputElement>(null);
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputRef.current) inputRef.current.blur();
    };

    return (
        <div className="relative flex w-full gap-2 items-center">
            <SaleIcon width={16} height={16} color={value ? "#E1C272" : "#757575"}/>
            <input
                type={"text"}
                ref={inputRef}
                onKeyDown={handleKeyDown}
                placeholder={props.placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value.toUpperCase())}
                className={`w-full bg-transparent border-none focus:outline-none text-[16px] placeholder-[#757575] font-medium font-sans text-[#E1C272]`}
                onBlur={handleBlur}
                onFocus={handleFocus}
                style={{zIndex: 100}}
                disabled={props.disabled}
            />
        </div>
    );
}