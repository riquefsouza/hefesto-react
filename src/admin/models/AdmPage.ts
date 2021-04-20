export const emptyAdmPage: AdmPage = {
    id: null,
    description: '',
    url: '',
    admIdProfiles: [],
    pageProfiles: ''
};

export const cleanAdmPage: AdmPage = {
    description: '',
    url: '',
    admIdProfiles: [],
    pageProfiles: ''
};

export interface AdmPage {
    id?: number | null;
    description: string;
    url: string;
    admIdProfiles: number[];
    pageProfiles: string;
}
