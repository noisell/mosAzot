import {MessageInstance} from "antd/es/message/interface";
import {SuccessIcon} from "@/app/icons/successIcon";
import {CloseCircleFilled} from "@ant-design/icons";

export function numberFormat(number: number): string {
    if (number < 1000) {
        return number.toString();
    } else {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
}

export const error = (messageApi: MessageInstance, text: string) => {
    messageApi
        .open({
            type: 'error',
            content: <p>{text}</p>,
            icon: <CloseCircleFilled style={{ color: "#ed5c5c" }} />
        })
        .then(() => {
            return
        })
}

export const success = (messageApi: MessageInstance, text: string) => {
    messageApi
        .open({
            type: 'success',
            content: <p className={"ml-1"}>{text}</p>,
            icon: <SuccessIcon color={"#0ec17c"}/>,
        })
        .then(() => {
            return
        })
}

export function formatToUserTimezone(dateString: string, simpleFormat: boolean = false, secondNeed: boolean = true): string {
    // Преобразуем строку в объект Date (UTC)
    const date = new Date(dateString)

    // Получаем смещение временной зоны пользователя в минутах
    const timezoneOffsetMinutes = date.getTimezoneOffset()

    // Применяем смещение к дате
    const userDate = new Date(date.getTime() - timezoneOffsetMinutes * 60 * 1000)

    // Получаем компоненты даты с учётом локального времени пользователя
    const day = String(userDate.getDate()).padStart(2, '0') // День с ведущим нулём
    const month = String(userDate.getMonth() + 1).padStart(2, '0') // Месяцы начинаются с 0
    const year = userDate.getFullYear()

    // Получаем компоненты времени с учётом локального времени пользователя
    const hours = String(userDate.getHours()).padStart(2, '0')
    const minutes = String(userDate.getMinutes()).padStart(2, '0')
    const seconds = String(userDate.getSeconds()).padStart(2, '0')

    // Форматируем в строку "dd.mm.yyyy hh:mm:ss"
    return simpleFormat ? `${day}.${month}.${year} ${hours}:${minutes}${secondNeed ? `:${seconds}` : ''}` : `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

export const calculateVisibilityPercentage = (el: HTMLElement | null): number => {
    if (!el) return 0;

    // Получаем размеры элемента
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    // Получаем высоты шапки и навигации
    const headerHeight = document.getElementById("header")?.offsetHeight || 0; // Высота шапки
    const navbarHeight = document.getElementById("nav")?.offsetHeight || 0; // Высота навигации

    // Корректируем границы видимости для учета header и навигации
    const adjustedTop = Math.max(0, rect.top - headerHeight);
    const adjustedBottom = Math.min(windowHeight, rect.bottom + navbarHeight);

    // Вычисляем видимую высоту элемента
    const visibleHeight = Math.max(0, adjustedBottom - adjustedTop);
    const elementArea = rect.width * rect.height;

    return (elementArea > 0) ? (visibleHeight / elementArea) * 100 : 0;
};