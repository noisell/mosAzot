import axios from 'axios'
import { loginData } from "@/app/api/types";

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
                return Telegram.WebApp.showPopup({
                    title: "Ошибка соединения",
                    message: "Пожалуйста проверьте соединение с интернетом и повторите попытку",
                    buttons: [{ id: 'closeWebApp', type: 'close' }],
                });
            } else if (error.response && error.response.status === 401) {
                if (!check401Error) return Promise.reject(error);
                const refreshed = await refreshAccessToken();
                if (refreshed) return instance(error.config);
                else return Telegram.WebApp.showPopup({
                    title: "Сессия истекла",
                    message: "Пожалуйста перезапустите приложение и повторите попытку",
                    buttons: [{ id: 'closeWebApp', type: 'close'}],
                });
            } else if (error.response && error.response.status === 403) {
                return Telegram.WebApp.showPopup({
                    title: 'Запрещено',
                    message: 'Вы не имеете доступа к этому ресурсу',
                    buttons: [{ id: 'ok', type: 'ok'}]
                });
            } else if ([400, 404].includes(error.response.status)) {
                return Promise.reject(error);
            } else {
                // Обработка остальных ошибок (можно вывести общее сообщение об ошибке)
                return Telegram.WebApp.showPopup({
                    title: "Неизвестная ошибка",
                    message: "Попробуйте перезайти в приложение или повторить попытку.",
                    buttons: [{ id: 'closeWebApp', type: 'close'}]
                });
            }
        }
    );
    return instance;
}

async function refreshAccessToken(): Promise<boolean> {
    const instance = await axiosBaseInstance(true, "/auth", false, false)
    try {
        const response = await instance.post("/refresh");
        const token = response.headers['authorization'].split(' ')[1]
        localStorage.setItem('token', token)
        return true
    } catch (error: any) {
        return false
    }
}

async function authentication(data: loginData) {
    const instance = await axiosBaseInstance(true, "/auth", false)
    try {
        const response = await instance.post("/login", {
            user_id: data.user_id,
            username: data.username,
            init_data: data.initData,
            avatar: data.avatar ? data.avatar : null,
        })
        const token = response.headers['authorization'].split(' ')[1]
        localStorage.setItem('token', token)
        return true
    } catch (error) { return false }
}

async function createUser(data: loginData, first_name: string) {
    const instance = await axiosBaseInstance(true, "/user", false)
    try {
        await instance.post("", {id: data.user_id, username: data.username, first_name: first_name, avatar_url: data.avatar})
        return true
    }
    catch (error) { return false }
}

export async function authorization(userData: loginData, first_name: string): Promise<boolean> {
    try {
        const authenticated = await authentication(userData)
        if (!authenticated) {
            const created = await createUser(userData, first_name)
            if (!created) {
                Telegram.WebApp.showPopup({
                    title: "Неизвестная ошибка",
                    message: "Попробуйте перезайти в приложение или повторить попытку.",
                    buttons: [{ id: 'closeWebApp', type: 'close'}]
                });
                return false
            }
            return await authorization(userData, first_name)
        }
        return true;
    }
    catch (error) {
        Telegram.WebApp.showPopup({
            title: "Неизвестная ошибка",
            message: "Попробуйте перезайти в приложение или повторить попытку.",
            buttons: [{ id: 'closeWebApp', type: 'close'}]
        });
        return false
    }
}