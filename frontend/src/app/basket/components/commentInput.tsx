import React, {useRef, useState} from 'react';
import {ChatIcon} from "@/app/icons/chatIcon";

type Props = {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    disabled?: boolean;
    onFocus: () => void;
    onBlur: () => void;
}

export function CommentInput(props: Props) {
    const {value, setValue} = props;

    const handleBlur = () => {
        window.scrollTo(0, 0);
        props.onBlur();
    }
    const handleFocus = () => {
        props.onFocus();
    }

    const inputRef = useRef<HTMLInputElement>(null);
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputRef.current) inputRef.current.blur();
    };

    return (
        <div className="relative flex w-full gap-2 items-center bg-[#111111] rounded-2xl py-3.5 px-4">
            <ChatIcon color={"#757575"} width={16} height={16} />
            <input
                type={"text"}
                ref={inputRef}
                onKeyDown={handleKeyDown}
                placeholder={"Комментарий к заказу"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={`w-full bg-transparent border-none focus:outline-none text-[16px] placeholder-[#757575] font-normal font-sans text-[#FFFFFF]`}
                style={{zIndex: 100}}
                maxLength={512}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={props.disabled}
            />
        </div>
    );
}