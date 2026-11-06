import React from 'react';
import type { Metadata } from "next";
import { AntdRegistry } from '@ant-design/nextjs-registry'
import "./globals.css";
import {Navigation} from "@/app/components/navigation";
import { Raleway } from "next/font/google";

const raleway = Raleway({subsets: ["cyrillic", "latin"]});

export const metadata: Metadata = {
  title: "MosAlko",
  description: "MosAlko Web Application",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <head>
                <title>MosAlko</title>
                <script src='https://telegram.org/js/telegram-web-app.js'/>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
            </head>
            <body suppressHydrationWarning={true} className={raleway.className}>
                <AntdRegistry>
                    {children}
                    <Navigation/>
                </AntdRegistry>
            </body>
        </html>
    );
}

