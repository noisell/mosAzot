import axios from 'axios'
import { loginData } from "@/app/api/types";
import {showModal} from "@/app/utils";

const baseURL = process.env.NEXT_PUBLIC_API_URL as string;

export const axiosBaseInstance = async (cookie: boolean = false, prefix: string = "", token: boolean = true, check401Error: boolean = true) => {
    const instance = axios.create({
        baseURL: baseURL + prefix,
        headers: {
            Authorization: token ? `Bearer ${localStorage.getItem('token')}` : "",
            'Content-Type': 'application/json',
        },
        withCredentials: cookie,
    })
    instance.interceptors.request.use(
        config => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        error => Promise.reject(error)
    );
    instance.interceptors.response.use(
        response => response,
        async error => {
            const isNetworkError = !error.response; // Проверка на ошибку сети (нет ответа от сервера)

            if (isNetworkError) {
                return showModal("Ошибка соединения", "Пожалуйста проверьте соединение с интернетом и повторите попытку")
            } else if (error.response && error.response.status === 401) {
                if (!check401Error) return Promise.reject(error);
                const refreshed = await refreshAccessToken();
                if (refreshed) return instance(error.config);
                return showModal("Сессия истекла", "Пожалуйста перезапустите приложение и повторите попытку")
            } else if (error.response && error.response.status === 403) {
                return showModal('Запрещено', 'Вы не имеете доступа к этому ресурсу')
            } else if ([400, 404].includes(error.response.status)) {
                return Promise.reject(error);
            } else {
                // Обработка остальных ошибок (можно вывести общее сообщение об ошибке)
                return showModal("Неизвестная ошибка", "Попробуйте перезайти в приложение или повторить попытку.")
            }
        }
    );
    return instance;
}

async function refreshAccessToken(): Promise<boolean> {
    const instance = await axiosBaseInstance(true, "/auth", true, false)
    try {
        const response = await instance.post(`/admin/refresh`);
        const token = response.headers['authorization'].split(' ')[1]
        localStorage.setItem('token', token)
        return true
    } catch (error: any) {
        return false
    }
}

export async function authentication(data?: loginData) {
    let instance = await axiosBaseInstance(true, "/auth", false)
    if (!data) {
        instance = await axiosBaseInstance(true, "/auth", false, false)
    }
    try {
        const response = await instance.post("/admin/login", data ? {
            login: data.login,
            password: data.password,
            remember_me: data.remember_me,
        } : null)
        const token = response.headers['authorization'].split(' ')[1]
        localStorage.setItem('token', token)
        localStorage.setItem('user_id', response.data.user_id)
        localStorage.setItem('level', response.data.level)
        return true
    } catch (error) { return false }
}

export async function adminInstance() {
    return await axiosBaseInstance(false, "/admin");
}