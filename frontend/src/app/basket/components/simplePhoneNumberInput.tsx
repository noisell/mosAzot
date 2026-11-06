import React, {useRef, useState} from 'react';

type Props = {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    onFocus: () => void;
    onBlur: () => void;
}

export function SimplePhoneNumberInput(props: Props) {
    const [focused, setFocused] = useState<boolean>((!(!props.value || props.value === "")));
    const {value, setValue} = props;

    const handleBlur = () => {
        if (!value) setFocused(false);
        else setFocused(true);
        window.scrollTo(0, 0);
        props.onBlur();
    }

    const handleFocus = () => {
        setFocused(true);
        props.onFocus();
    }

    const handleChangePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (newValue.length < value.length) {
            setValue(newValue.trim())
        }
        if (/^\d+$/.test(newValue.replaceAll(" ", "")) && newValue.slice(newValue.length - 1) !== " ") {
            if (newValue.length === 4) {
                const part1 = newValue.slice(0, 3);
                const part2 = newValue.slice(3);
                setValue(part1 + " " + part2);
            }
            else if (newValue.length === 8) {
                const part1 = newValue.slice(0, 7);
                const part2 = newValue.slice(7);
                setValue(part1 + " " + part2);
            }
            else if (newValue.length === 11) {
                const part1 = newValue.slice(0, 10);
                const part2 = newValue.slice(10);
                setValue(part1 + " " + part2);
            }
            else setValue(newValue.trim())
            if (newValue.length === 13) if (inputRef.current) inputRef.current.blur();
        }
        else if (newValue === "") {setValue(newValue)}
    }

    const inputRef = useRef<HTMLInputElement>(null);
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputRef.current) inputRef.current.blur();
    };

    return (
        <div
            className={`relative flex font-sans gap-1 w-full border-b-[0.5px] border-[#2E2E2E]`}>
            <p className={`absolute ${focused ? '-top-4 text-xs' : 'top-0 text-[14px]'} text-[#757575] left-0 `}>Номер телефона</p>
            {focused && <p>+7 </p>}
            <input
                type={"tel"}
                ref={inputRef}
                onKeyDown={handleKeyDown}
                placeholder={""}
                value={value}
                onChange={handleChangePhoneNumber}
                className={`w-full bg-transparent border-none focus:outline-none text-[16px] font-normal font-sans`}
                onFocus={handleFocus}
                onBlur={handleBlur}
                maxLength={13}
                style={{zIndex: 100}}
            />
        </div>
    );
}
