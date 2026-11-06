import React from 'react';
import {IconProps} from "@/app/icons/types";

export function HomeIcon(props: IconProps) {
    const color = props.color ?? "#707178";
    const width = props.width ?? 20;
    const height = props.height ?? 20;

    return (
        <svg width={width} height={height} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M22.54 6.02287L15.3471 0.984789C13.3866 -0.390369 10.3771 -0.315361 8.49152 1.14731L2.23527 6.03537C0.986515 7.01048 0 9.01072 0 10.5858V19.2118C0 22.3997 2.58492 25 5.76924 25H19.2308C22.4151 25 25 22.4122 25 19.2243V10.7484C25 9.06072 23.9136 6.98548 22.54 6.02287ZM13.4365 19.9994C13.4365 20.512 13.012 20.937 12.5 20.937C11.988 20.937 11.5634 20.512 11.5634 19.9994V16.249C11.5634 15.7364 11.988 15.3114 12.5 15.3114C13.012 15.3114 13.4365 15.7364 13.4365 16.249V19.9994Z"
                fill={color}/>
        </svg>

    );
}