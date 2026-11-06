'use client'

import React, {useEffect, useState} from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export function LoadingComponent() {
    const [text, setText] = useState('');
    useEffect(() => {
        setText(['Вычисляем', 'Обрабатываем', 'Подгружаем', 'Анализируем', 'Сопоставляем'][Math.floor(Math.random() * 5)]);
    }, []);
    return (
        <main className="gap-3 -mt-10 items-center justify-center">
            <Spin size="large" indicator={<LoadingOutlined spin />} />
            {text}
        </main>
    );
}