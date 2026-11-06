import React, {useRef} from 'react';

type Props = {
    name: string,
    setName: React.Dispatch<React.SetStateAction<string>>,
    disabled?: boolean,
}

export function InputName(props: Props) {
    const {name, setName, disabled} = props;

    const inputRef = useRef<HTMLInputElement>(null);
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputRef.current) inputRef.current.blur();
    };

    return (
        <div className="flex flex-col w-full">
            <p className="ml-5 font-normal text-[#757575]">Как к вам обращаться?</p>
            <div className="flex w-full bg-[#111111] py-3.5 px-5 rounded-[26px] mt-1 font-sans">
                <input
                    type={"text"}
                    ref={inputRef}
                    onKeyDown={handleKeyDown}
                    placeholder={""}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full bg-transparent border-none focus:outline-none text-[18px] font-medium text-[#FFFFFF]`}
                    style={{zIndex: 100}}
                    maxLength={64}
                    disabled={disabled}
                />
            </div>
        </div>
    );
}