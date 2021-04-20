import { AdmPage } from './AdmPage';
import { AdmUser } from './AdmUser';

export const emptyAdmProfile: AdmProfile = {
    id: null,
    administrator: false,
    description: '',
    general: false,
    admPages: [],
    admUsers: [],
    profilePages: '',
    profileUsers: ''
};

export const cleanAdmProfile: AdmProfile = {
    administrator: false,
    description: '',
    general: false,
    admPages: [],
    admUsers: [],
    profilePages: '',
    profileUsers: ''
};

export interface AdmProfile {
    id?: number | null;
    administrator: boolean;
    description: string;
    general: boolean;
    admPages: AdmPage[];
    admUsers: AdmUser[];
    profilePages: string;
    profileUsers: string;
}
