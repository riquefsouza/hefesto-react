import { AdmPage, emptyAdmPage } from './AdmPage';

export const emptyAdmMenu: AdmMenu = {
    id: null,
    description: '',
    order: 0,
    idPage: 0,
    idMenuParent: 0,
    admPage: emptyAdmPage,
    admMenuParent: null
};

export const cleanAdmMenu: AdmMenu = {
    description: '',
    order: 0,
    idPage: 0,
    idMenuParent: 0,
    admPage: emptyAdmPage,
    admMenuParent: null
};

export interface AdmMenu {

    id?: number | null;
    description: string;
    order: number;
    idPage: number;
    idMenuParent: number;
    admPage?: AdmPage;
    admMenuParent?: AdmMenu | null;
}
