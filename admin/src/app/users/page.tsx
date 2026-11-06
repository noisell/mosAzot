'use client'

import React, {useEffect, useRef, useState} from 'react';
import {UserType, UserTypeIndex} from "@/app/users/types";
import {changeUser, getAllUsers} from "@/app/users/api";
import {Button, Input, InputNumber, InputRef, Modal, Space, Table, TableColumnType} from "antd";
import type {FilterDropdownProps} from "antd/es/table/interface";
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {EditIcon} from "@/app/icons/editIcon";
import {formatToUserTimezone} from "@/app/utils";
import {LoadingComponent} from "@/app/components/loading";
import {ModalUser} from "@/app/users/modal";
import {mainHook} from "@/app/hooks/main";

export default function UsersPage() {
    mainHook("/users")

    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<UserType[]>([])

    useEffect(() => {
        getAllUsers().then(r => {
            setData(r);
            setLoading(false);
        })
    }, [])

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: UserTypeIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: UserTypeIndex): TableColumnType<UserType> => ({
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
            title: '',
            dataIndex: 'avatar',
            key: 'avatar',
            width: 70,
            render: (_: any, record: UserType) => (record.avatar_url ? <a href={record.avatar_url} target={"_blank"}><img src={record.avatar_url} alt={"avatar"} width={32} height={32} className={"rounded-full"}/></a> : <p></p>)
        },
        {
            title: 'id',
            key: 'id',
            dataIndex: 'id',
            ...getColumnSearchProps('id'),
            width: 200
        },
        {
            title: 'username',
            dataIndex: 'username',
            key: 'username',
            ...getColumnSearchProps('username'),
            width: 200,
            render: (_: any, record: UserType) => <a href={`https://t.me/${record.username}`} target={"_blank"}>{record.username}</a>
        },
        {
            title: 'Имя',
            dataIndex: 'first_name',
            key: 'first_name',
            ...getColumnSearchProps('first_name'),
            width: 200
        },
        {
            title: 'Номер телефона',
            dataIndex: 'phone_number',
            key: 'phone_number',
            defaultSortOrder: 'descend',
            width: 200,
            render: (_: any, record: UserType) => (record.phone_number ? `+7${record.phone_number }`: "Не задан"),
        },
        {
            title: 'Бан?',
            dataIndex: 'banned',
            key: 'banned',
            defaultSortOrder: 'descend',
            sorter: (a: UserType, b: UserType) => a.banned == b.banned ? 1 : -1,
            width: 100,
            render: (_: any, record: UserType) => (record.banned ? "Да": "Нет"),
        },
        {
            title: 'Дата регистрации',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 200,
            render: (_: any, record: UserType) => (formatToUserTimezone(record.created_at, true, false)),
        },
        {
            title: "",
            key: 'action',
            render: (_: any, record: UserType) => (
                <span className={"flex w-full items-center justify-center cursor-pointer"} onClick={() => {showModal(record.id)}}>
                    <EditIcon/>
                </span>
            ),
            width: 50,
        }
    ];

    const [open, setOpen] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<UserType>();
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [banned, setBanned] = useState<boolean>(currentUser?.banned as boolean);

    useEffect(() => {
        setBanned(currentUser?.banned as boolean)
    }, [currentUser]);

    const showModal = (userId: number) => {
        setCurrentUser(data.find((user) => user.id === userId));
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);
        changeUser(currentUser?.id as number, currentUser?.first_name as string, currentUser?.phone_number as number | null, currentUser?.banned as boolean).then(() => {
            setData(prevState => {
                return prevState.map((user) => (user.id === currentUser?.id ? { ...currentUser } : user))
            });
            setConfirmLoading(false)
            setOpen(false);
        })
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <main>
            {data.length > 0 ? <div className="flex flex-col w-full h-full pt-3">
                <div className="flex w-full items-center pl-5 gap-3 font-sans">
                    <h1 className="text-[20px] leading-5 font-semibold text-black">Пользователи</h1>
                    <div
                        className="flex items-center justify-center py-2 px-3 text-[16px] leading-4 font-normal bg-blue-500 text-white rounded-xl">
                        {data.length} чел
                    </div>
                </div>
                <div className="flex flex-col w-full h-full rounded-[32px] bg-[#FFFFFF] mt-5 overflow-scroll">
                    <Table<UserType> dataSource={data} columns={columns as never[]} pagination={false} sticky={true}
                                     scroll={{x: 1600, y: "100vh"}}/>
                </div>
                <Modal
                    title={`Управление пользователем ${currentUser?.username ? `@${currentUser?.username}` : currentUser?.id}`}
                    open={open}
                    onOk={handleOk}
                    okText={"Сохранить"}
                    cancelText={"Отменить"}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                >
                    <ModalUser user={currentUser as UserType} setUser={setCurrentUser}/>
                </Modal>
            </div> : <LoadingComponent/>}
        </main>
    );
}