import { AdmParameterCategory, emptyAdmParameterCategory } from './AdmParameterCategory';

export const emptyAdmParameter: AdmParameter = {
    id: null,
    code: '',
    description: '',
    value: '',
    admParameterCategory: emptyAdmParameterCategory
};

export const cleanAdmParameter: AdmParameter = {
    code: '',
    description: '',
    value: '',
    admParameterCategory: emptyAdmParameterCategory
};

export interface AdmParameter {
    id?: number | null;
    code: string;
    description: string;
    value: string;
    admParameterCategory: AdmParameterCategory;
}
