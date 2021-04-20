export const emptyAdmUser: AdmUser = {
    id: null,
    email: '',
    login: '',
    name: '',
    password: '',
    admIdProfiles: [],
    active: false,
    userProfiles: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
};

export const cleanAdmUser: AdmUser = {
    email: '',
    login: '',
    name: '',
    password: '',
    admIdProfiles: [],
    active: false,
    userProfiles: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
};

export interface AdmUser {
    id?: number | null;
    email: string;
    login: string;
    name: string;
    password: string;
    admIdProfiles: number[];
    active: boolean;
    userProfiles: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}
