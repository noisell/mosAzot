import React, {useRef} from 'react';

type Props = {
    phoneNumber: string,
    setPhoneNumber: React.Dispatch<React.SetStateAction<string>>,
    disabled?: boolean,
    otherStyle?: boolean
}

export function InputPhoneNumber(props: Props) {
    const {phoneNumber, setPhoneNumber, disabled} = props;

    const placeholderSymbol = (index: number) => {
        return (
            <p className={`${phoneNumber.length >= index + 1 ? 'opacity-0' : 'opacity-100' }`}>{phoneNumber[index] ?? 0}</p>
        )
    }

    const placeholder = () => {
        return (
            <div className="absolute flex w-full h-[21px] bg-transparent border-none py-3.5 left-0 top-0 text-[18px] leading-[21px] font-sans font-medium text-[#757575]">
                {placeholderSymbol(0)}{placeholderSymbol(1)}{placeholderSymbol(2)}&nbsp;
                {placeholderSymbol(4)}{placeholderSymbol(5)}{placeholderSymbol(6)}&nbsp;
                {placeholderSymbol(8)}{placeholderSymbol(9)}&nbsp;
                {placeholderSymbol(11)}{placeholderSymbol(12)}
            </div>
        )
    }

    const handleChangePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length < phoneNumber.length) {
            setPhoneNumber(value.trim())
        }
        if (/^\d+$/.test(value.replaceAll(" ", "")) && value.slice(value.length - 1) !== " ") {
            if (value.length === 4) {
                const part1 = value.slice(0, 3);
                const part2 = value.slice(3);
                setPhoneNumber(part1 + " " + part2);
            }
            else if (value.length === 8) {
                const part1 = value.slice(0, 7);
                const part2 = value.slice(7);
                setPhoneNumber(part1 + " " + part2);
            }
            else if (value.length === 11) {
                const part1 = value.slice(0, 10);
                const part2 = value.slice(10);
                setPhoneNumber(part1 + " " + part2);
            }
            else setPhoneNumber(value.trim())
            if (value.length === 13) if (inputRef.current) inputRef.current.blur();
        }
        else if (value === "") {setPhoneNumber(value)}
    }

    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex flex-col w-full">
            <p className="ml-5 font-normal text-[#757575]">Номер телефона для связи</p>
            <div className="flex w-full items-center bg-[#111111] px-5 rounded-[26px] mt-1 text-[18px] font-sans">
                <span className="font-medium border-r-2 border-[#171717] py-3.5 pr-4">+7</span>
                <div className="relative flex w-full py-3.5 ml-3">
                    {placeholder()}
                    <input
                        type={"tel"}
                        ref={inputRef}
                        placeholder={""}
                        value={phoneNumber}
                        onChange={handleChangePhoneNumber}
                        className={`w-full bg-transparent border-none focus:outline-none text-[18px] leading-[21px] font-medium font-sans text-[#FFFFFF] h-[21px]`}
                        style={{zIndex: 100}}
                        height={21}
                        maxLength={13}
                        disabled={disabled}
                    />
                </div>
            </div>
        </div>
    );
}