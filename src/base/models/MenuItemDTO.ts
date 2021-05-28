export const emptyMenuItemDTO: MenuItemDTO = {
    label: '',
    routerLink: '',
    url: '',
    to: '',
    items: []
}

export interface MenuItemDTO {
    label: string;
    routerLink: string;
    url: string;
    to: string;
    items: MenuItemDTO[];
}
