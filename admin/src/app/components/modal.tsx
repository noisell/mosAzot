'use client'

import React from 'react';
import { Modal } from 'antd';
import { modal } from "@/store/modalPersistStore";
import {useRouter} from "next/navigation";

export function ModalWindow() {
    const modalState = modal();
    const router = useRouter();

    const handleOk = () => {
        modalState.changeShow(false);
        return window.location.replace("/");

    };

    return (
        <Modal title={modalState.title} open={modalState.show} onOk={handleOk}>
            <p>{modalState.message}</p>
        </Modal>
    );
}