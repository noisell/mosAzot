import React from 'react';
import {IconProps} from "@/app/icons/types";

export function SearchIcon(props: IconProps) {
    const color = props.color ?? "#FFF";
    const width = props.width ?? 18;
    const height = props.height ?? 18;

    return (
        <svg width={width} height={height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M13.123 11.9654C14.1311 10.7051 14.734 9.10643 14.734 7.36698C14.734 3.29831 11.4356 0 7.36698 0C3.29831 0 0 3.29831 0 7.36698C0 11.4356 3.29831 14.734 7.36698 14.734C9.10643 14.734 10.7051 14.1311 11.9654 13.123L16.6026 17.7603C16.9223 18.0799 17.4406 18.0799 17.7603 17.7603C18.0799 17.4406 18.0799 16.9223 17.7603 16.6026L13.123 11.9654ZM7.36698 13.105C4.19792 13.105 1.62889 10.536 1.62889 7.36698C1.62889 4.19792 4.19792 1.62889 7.36698 1.62889C10.536 1.62889 13.105 4.19792 13.105 7.36698C13.105 10.536 10.536 13.105 7.36698 13.105Z"
                  fill={color}/>
        </svg>
    );
}