export type NavigationPaths = '/home' | '/basket' | '/profile';

export type NavigationState = {
    active: NavigationPaths;
    show: boolean;
    changeShow: (show: boolean) => void;
    changeActive: (active: NavigationPaths) => void;
}