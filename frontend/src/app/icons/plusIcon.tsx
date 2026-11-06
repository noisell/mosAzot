import React from 'react';
import {IconProps} from "@/app/icons/types";

export function PlusIcon(props: IconProps & {strokeWidth?: number}) {
    const color = props.color ?? "#FFF";
    const width = props.width ?? 20;
    const height = props.height ?? 20;
    const strokeWidth = props.strokeWidth ?? 3;

    return (
        <svg width={width} height={height} viewBox="0 0 22 22" fill={color} xmlns="http://www.w3.org/2000/svg">
            <path d="M1 11H21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11 1V21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}