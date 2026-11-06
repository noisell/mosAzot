'use client'

import React, {useState, useEffect, useRef} from 'react';

type Props = {
    placeholder: string;
    placeholderMove?: boolean;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    simpleStyle?: boolean;
    autoFocus?: boolean;
    disabled?: boolean;
    dopMargin?: boolean;
    maxLength?: number;
    onFocus?: () => void;
    onBlur?: () => void;
}

export function CustomInput(props: Props) {
    const [focused, setFocused] = useState<boolean>(!!props.value);
    const {value, setValue} = props;
    const inputRef = useRef<HTMLInputElement>(null);

    const handleBlur = () => {
        if (!value) setFocused(false);
        else setFocused(true);
        window.scrollTo(0, 0);
        if (props.onBlur) props.onBlur();
}

    useEffect(() => {
        setFocused(!!props.value);
    }, [props.value]);

    const onFocus = () => {
        setFocused(true)
        if (props.onFocus) props.onFocus();
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputRef.current) inputRef.current.blur();
    };

    return (
        props.simpleStyle
            ?
            <div className="relative flex flex-col w-full">
                <input
                    ref={inputRef}
                    type={"text"}
                    onKeyDown={handleKeyDown}
                    autoFocus={props.autoFocus}
                    placeholder={props.placeholder}
                    maxLength={props.maxLength ?? 256}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className={`w-full bg-transparent border-none focus:outline-none text-[16px] font-medium font-sans text-[#E1C272]`}
                    onFocus={onFocus}
                    onBlur={handleBlur}
                    style={{zIndex: 100}}
                    disabled={props.disabled}
                />
            </div>
            :
            <div className={`relative flex flex-col w-full border-b-[0.5px] border-[#2E2E2E] ${props.dopMargin ? `${focused ? 'mt-2' : ''}` : ''}`}>
                <p className={`absolute ${focused ? !props.placeholderMove ? '-top-4 text-xs' : `text-[14px] ${value ? 'text-opacity-0' : 'text-opacity-100'}` : !props.placeholderMove ? 'top-0 text-[14px]' : 'text-opacity-100 text-[14px] top-0'} text-[#757575] left-0 `}>{props.placeholder}</p>
                <input
                    ref={inputRef}
                    type={"text"}
                    onKeyDown={handleKeyDown}
                    autoFocus={props.autoFocus}
                    maxLength={props.maxLength ?? 256}
                    placeholder={""}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className={`w-full bg-transparent border-none focus:outline-none text-[16px] font-normal font-sans`}
                    onFocus={onFocus}
                    onBlur={handleBlur}
                    style={{zIndex: 100}}
                    disabled={props.disabled}
                />
            </div>
    );
}