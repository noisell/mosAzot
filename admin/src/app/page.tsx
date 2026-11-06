'use client'

import React, {useState, useEffect} from 'react';
import {Authorization} from "@/app/components/authorization";
import {navigation} from "@/store/store";
import {authentication} from "@/app/api";
import {LoadingComponent} from "@/app/components/loading";
import {useRouter} from "next/navigation";

export default function Home() {
    const [login, setLogin] = useState<boolean>();
    const nav = navigation();
    const router = useRouter();

    useEffect(() => {
        authentication().then(r => {
            setLogin(r)
            nav.changeShow(r);
        })
    }, []);

    const handleAuth = () => {
        setLogin(true);
        nav.changeShow(true);
    }

    if (login === undefined) return <LoadingComponent/>;
    else if (!login) return <main><Authorization callback={handleAuth}/></main>;
    else return router.replace("/stats")
}