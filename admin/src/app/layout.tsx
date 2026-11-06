import React from 'react';
import type { Metadata } from "next";
import { AntdRegistry } from '@ant-design/nextjs-registry'
import "./globals.css";
import { Raleway } from "next/font/google";
import {Navigation} from "@/app/components/navigation";
import {ModalWindow} from "@/app/components/modal";

const raleway = Raleway({subsets: ["cyrillic", "latin"]});

export const metadata: Metadata = {
  title: "MosAlko",
  description: "MosAlko Admin Panel",
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
                    <ModalWindow/>
                    <Navigation/>
                    {children}
                </AntdRegistry>
            </body>
        </html>
    );
}

