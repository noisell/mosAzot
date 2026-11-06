export type NavigationPaths = '/stats' | '/users' | '/products' | '/settings' | '/orders' | "/promo";

export type NavigationState = {
    active: NavigationPaths;
    show: boolean;
    changeShow: (show: boolean) => void;
    changeActive: (active: NavigationPaths) => void;
}

export type ModalState = {
    show: boolean;
    changeShow: (show: boolean) => void;
    title: string;
    changeTitle: (title: string) => void;
    message: string;
    changeMessage: (message: string) => void;
    reload: boolean;
    changeReload: (reload: boolean) => void;
}