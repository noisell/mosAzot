'use client'

import React, { useState } from 'react'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import { StyledEngineProvider } from '@mui/material/styles';
import { CloseCircleFilled, UpCircleFilled, DownCircleFilled } from '@ant-design/icons';

interface Props {
    open: boolean
    setOpen: (open: boolean) => void
    children: React.ReactNode
    className?: string
    fullScreen?: boolean
    fullScreenManage?: boolean
}

export function Drawer (props: Props) {
    const { open, setOpen, children, className, fullScreenManage } = props;
    const [fullScreen, setFullScreen] = useState(props.fullScreen ?? false);
    return (
        <StyledEngineProvider injectFirst>
            <SwipeableDrawer
                variant={"temporary"}
                anchor='bottom'
                open={open}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                className='bg-transparent'
                style={{ backgroundColor: 'transparent' }}>
                <div className={`relative flex flex-col w-full items-center px-4 pt-3 bg-[#171717] rounded-t-[32px] text-white overflow-y-auto pb-[40px] ${fullScreen ? 'h-screen' : 'h-auto'} ${className ?? ''}`}>
                    <div className='absolute flex w-full items-center justify-between top-3 px-6'>
                        {
                            fullScreen
                                ?
                                <DownCircleFilled style={{color: "#2E2E2E", fontSize: 20, opacity: fullScreenManage ? 100 : 0}} onClick={() => setFullScreen(false)}/>
                                :
                                <UpCircleFilled style={{color: "#2E2E2E", fontSize: 20, opacity: fullScreenManage ? 100 : 0}} onClick={() => setFullScreen(true)}/>
                        }
                        <CloseCircleFilled style={{color: "#2E2E2E", fontSize: 20}} onClick={() => {
                            setOpen(false);
                        }} />
                    </div>
                    <div className='flex w-full items-center justify-center mt-1'>
                        <span className='w-12 h-1 bg-[#2E2E2E] rounded-full mb-6'/>
                    </div>
                    {children}
                </div>
            </SwipeableDrawer>
        </StyledEngineProvider>
    )
}