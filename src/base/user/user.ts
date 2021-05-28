export const emptyUser: User = {
    id: 0,
    name: '',
    email: '',
    idProfiles: ''
}

export interface User {
    id: number;
    name: string;
    email: string;
    idProfiles: string;
}