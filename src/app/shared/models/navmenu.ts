export interface Menu {
    headTitle1?: string;
    level?: number;
    badge?: boolean;
    path?: string;
    line?: boolean;
    title?: string;
    icon?: string;
    type?: string;
    active?: boolean;
    id?: number;
    bookmark?: boolean;
    children?: Menu[];
    horizontalList?: boolean;
    items?: Menu[]
}