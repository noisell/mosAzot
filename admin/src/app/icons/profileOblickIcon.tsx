import React from 'react';
import {IconProps} from "@/app/icons/types";

export function ProfileOblickIcon(props: IconProps) {
    const color = props.color ?? "#FFFFFF";
    const width = props.width ?? 20;
    const height = props.height ?? 20;

    return (
        <svg width={width} height={height} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="12" fill={color}/>
            <path
                d="M32 28.3182C32 30.8035 26.6274 32 20 32C13.3726 32 8 30.8035 8 28.3182C8 25.8329 13.3726 23 20 23C26.6274 23 32 25.8329 32 28.3182Z"
                fill="#f3f3f3"/>
            <circle cx="20" cy="14" r="6" fill="#f3f3f3"/>
        </svg>
    );
}