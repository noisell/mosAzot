import React from 'react';
import {IconProps} from "@/app/icons/types";

export function ProfileIcon(props: IconProps) {
    const color = props.color ?? "#707178";
    const width = props.width ?? 20;
    const height = props.height ?? 27;

    return (
        <svg width={width} height={height} viewBox="0 0 20 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M9.99317 12.1938C9.8612 12.1812 9.70284 12.1812 9.55768 12.1938C6.41699 12.0929 3.92285 9.632 3.92285 6.60323C3.92285 3.51136 6.53575 1 9.78202 1C13.0152 1 15.6413 3.51136 15.6413 6.60323C15.6281 9.632 13.1339 12.0929 9.99317 12.1938Z"
                stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path
                d="M3.39516 16.8506C0.201613 18.895 0.201613 22.2267 3.39516 24.2585C7.02419 26.5805 12.9758 26.5805 16.6048 24.2585C19.7984 22.2141 19.7984 18.8824 16.6048 16.8506C12.989 14.5412 7.03739 14.5412 3.39516 16.8506Z"
                stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

    );
}