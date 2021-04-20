export const emptyAdmParameterCategory: AdmParameterCategory = {
    id: null,
    description: '',
    order: 0
};

export const cleanAdmParameterCategory: AdmParameterCategory = {
    description: '',
    order: 0
};

export interface AdmParameterCategory {
    id?: number | null;
    description: string;
    order: number;
}
