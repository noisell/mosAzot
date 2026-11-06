import React from 'react';
import {IconProps} from "@/app/icons/types";

export function PencilIcon(props: IconProps) {
    const color = props.color ?? "#FFF";
    const width = props.width ?? 18;
    const height = props.height ?? 18;

    return (
        <svg width={width} height={height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M15.0988 2.37068C14.2201 1.492 12.7954 1.492 11.9168 2.37068L11.3865 2.90101L15.0988 6.61332L15.6291 6.08299C16.5078 5.20431 16.5078 3.77969 15.6291 2.90101L15.0988 2.37068ZM14.0381 7.674L10.3258 3.96167L3.50755 10.7799C3.35846 10.929 3.25427 11.117 3.20686 11.3225L2.43582 14.6636C2.31105 15.2043 2.79562 15.6887 3.33615 15.5639L6.67734 14.7929C6.88278 14.7455 7.07077 14.6414 7.21986 14.4923L14.0381 7.674Z"
                  fill={color}/>
        </svg>
    );
}