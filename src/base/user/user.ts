export const emptyUser: User = {
    id: 0,
    name: '',
    email: ''
}

export interface User {
    id: number;
    name: string;
    email: string;
}