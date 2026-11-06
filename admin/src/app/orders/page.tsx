'use client'

import React, {useEffect, useRef, useState} from 'react';
import {mainHook} from "@/app/hooks/main";
import {OrderType, OrderTypeIndex, UserCreateType, UserCreateTypeIndex} from "@/app/orders/types";
import {getAllOrders} from "@/app/orders/api";
import {LoadingComponent} from "@/app/components/loading";
import {Button, Input, InputRef, Space, Table, TableColumnType} from "antd";
import type {FilterDropdownProps} from "antd/es/table/interface";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {UserType, UserTypeIndex} from "@/app/users/types";
import {formatToUserTimezone, numberFormat} from "@/app/utils";

export default function OrdersPage() {
    mainHook("/orders")
    const [orders, setOrders] = useState<OrderType[]>([])
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getAllOrders().then(r => {
            setOrders(r);
            setLoading(false);
        })
    }, [])

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: OrderTypeIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: OrderTypeIndex): TableColumnType<OrderType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            (record[dataIndex] ? record[dataIndex] : "").toString().toLowerCase().includes((value as string).toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {if (open) setTimeout(() => searchInput.current?.select(), 100);},
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (text),
    });

    const columns = [
        {
            title: '№ Заказа',
            key: 'id',
            dataIndex: 'id',
            ...getColumnSearchProps('id'),
            width: 70
        },
        {
            title: 'Автар',
            dataIndex: 'user',
            key: 'user',
            width: 50,
            render: (_: any, record: OrderType) => (record.user.avatar_url ? <a href={record.user.avatar_url} target={"_blank"}><img src={record.user.avatar_url} alt={"avatar"} width={32} height={32} className={"rounded-full"}/></a> : <p></p>)
        },
        {
            title: 'ID юзера',
            dataIndex: 'user',
            key: 'user',
            width: 100,
            render: (_: any, record: OrderType) => record.user.id
        },
        {
            title: 'Телефон',
            dataIndex: 'user',
            key: 'user',
            width: 100,
            render: (_: any, record: OrderType) => record.user.phone_number ? `+7${record.user.phone_number}` : "➖"
        },
        {
            title: 'Username',
            dataIndex: 'user',
            key: 'user',
            width: 100,
            render: (_: any, record: OrderType) => record.user.username ? <a href={`https://t.me/${record.user.username}`} target={"_blank"}>{record.user.username}</a> : "➖"
        },
        {
            title: 'Имя пользователя',
            dataIndex: 'user',
            key: 'user',
            width: 100,
            render: (_: any, record: OrderType) => record.user.first_name ? record.user.first_name : "➖"
        },
        {
            title: 'Сумма',
            dataIndex: 'amount',
            key: 'user',
            width: 70,
            render: (_: any, record: OrderType) => <p className="font-bold">{numberFormat(record.amount.amount)}₽</p>
        },
        {
            title: 'Доставка',
            dataIndex: 'user',
            key: 'user',
            width: 70,
            render: (_: any, record: OrderType) => <p>{numberFormat(record.amount.delivery_price)}₽</p>
        },
        {
            title: 'Промокод',
            dataIndex: 'delivery',
            key: 'delivery',
            width: 100,
            render: (_: any, record: OrderType) => <p>{record.delivery.description ? `${record.delivery.description} (-${record.amount.discount_amount}₽)` : "➖"}</p>
        },
        {
            title: 'Подъем на этаж',
            dataIndex: 'delivery',
            key: 'delivery',
            width: 70,
            render: (_: any, record: OrderType) => record.delivery.up_to_level ? "✅" : "➖"
        },
        {
            title: 'Адрес доставки',
            dataIndex: 'delivery',
            key: 'delivery',
            width: 150,
            render: (_: any, record: OrderType) => <p className={"flex items-center w-full overflow-y-hidden overflow-x-auto text-nowrap"}>{record.delivery.address}</p>
        },
        {
            title: 'Дата',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 100,
            render: (_: any, record: UserType) => (formatToUserTimezone(record.created_at, true, false)),
        },
        {
            title: 'Товары',
            dataIndex: 'products',
            key: 'products',
            width: 200,
            render: (_: any, record: OrderType) => <div className="flex w-full items-center gap-3 overflow-x-auto">{record.products.map(product => <img key={product.product.id} src={product.product.image} alt={""} style={{height: "100px"}}/>)}</div>
        },
        {
            title: 'Комментарий к заказу',
            dataIndex: 'comment',
            key: 'comment',
            width: 200,
            render: (_: any, record: OrderType) => <p className={"flex items-center w-full overflow-y-hidden overflow-x-auto text-nowrap"}>{record.comment ? record.comment : "➖"}</p>
        },
    ];

    if (loading) return <main><LoadingComponent/></main>;
    return (
        <main>
            <div className="flex flex-col w-full h-full pt-3">
                <div className="flex w-full items-center pl-5 gap-3 font-sans">
                    <h1 className="text-[20px] leading-5 font-semibold text-black">Заказы</h1>
                </div>
                <div className="flex flex-col w-full h-full rounded-[32px] bg-[#FFFFFF] mt-5 overflow-scroll">
                    <Table<OrderType> dataSource={orders} columns={columns as never[]} pagination={false} sticky={true}
                                     scroll={{x: 3000, y: "100vh"}}/>
                </div>
            </div>
        </main>
    );
}