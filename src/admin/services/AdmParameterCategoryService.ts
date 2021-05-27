import axios, { AxiosRequestConfig } from 'axios';
import { environment } from '../../environments/environment';
import { TokenService } from '../../base/services/TokenService';
import { AdmParameterCategory } from "../models/AdmParameterCategory";
import { ReportParamForm } from '../../base/models/ReportParamsForm';
import * as FileSaver from 'file-saver';

export default class AdmParameterCategoryService {

    private PATH: string;
    private axiosConfig: AxiosRequestConfig;
    private tokenService: TokenService;

    constructor() {
        this.PATH = environment.apiVersion + '/admParameterCategory';
        this.tokenService = new TokenService();
        this.axiosConfig = this.tokenService.getAuth();
    }
    
    public findIndexById(listaAdmParameterCategory: AdmParameterCategory[], id?: number | null): number {
        let index = -1;
        if (id){
            for (let i = 0; i < listaAdmParameterCategory.length; i++) {
                if (listaAdmParameterCategory[i].id === id) {
                    index = i;
                    break;
                }
            }    
        }
        return index;
    }
    
    /*
    public async findAll(): Promise<AdmParameterCategory[]> {
        const res = await axios.get('data/admParameterCategory.json');
        return res.data;
    }

    public findById(id: number): Promise<AdmParameterCategory> {
        const res = new Promise<AdmParameterCategory>((resolve, reject) => {
            let lista: AdmParameterCategory[] = [];

            this.findAll()
                .then(parameterCategories => {
                    lista = parameterCategories.filter(parameterCategory => parameterCategory.id === id);
                    resolve(lista[0]);
                })
                .catch(erro => {
                    reject(erro);
                });
            }
        );

        return res;
    }
    */

    public async findAllPaginated(page: number): Promise<AdmParameterCategory[]> {
        const res = new Promise<AdmParameterCategory[]>((resolve, reject) => {
            const url = `${this.PATH}/paged?page=${page}`;
            const config = this.axiosConfig;
            axios.get<AdmParameterCategory[]>(url, config)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error.message);
                reject(error.message);
            });
        });

        return res;
    }

    public findAll(): Promise<AdmParameterCategory[]> {
        const res = new Promise<AdmParameterCategory[]>((resolve, reject) => {
            const url = this.PATH;
            const config = this.axiosConfig;
            axios.get<AdmParameterCategory[]>(url, config)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error.message);
                reject(error.message);
            });
        });

        return res;
    }

    public findById(id: number): Promise<AdmParameterCategory> {
        const res = new Promise<AdmParameterCategory>((resolve, reject) => {
            const url = `${this.PATH}/${id}`;
            const config = this.axiosConfig;
            axios.get<AdmParameterCategory>(url, config)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error.message);
                reject(error.message);
            });
        });

        return res;
    }

    public insert(obj: AdmParameterCategory): Promise<AdmParameterCategory> {
        const res = new Promise<AdmParameterCategory>((resolve, reject) => {
            const url = this.PATH;
            const config = this.axiosConfig;
            axios.post<AdmParameterCategory>(url, obj, config)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error.message);
                reject(error.message);
            });
        });

        return res;
    }

    public update(obj: AdmParameterCategory): Promise<AdmParameterCategory> {
        const res = new Promise<AdmParameterCategory>((resolve, reject) => {
            const url = `${this.PATH}/${obj.id}`;
            const config = this.axiosConfig;
            axios.put<AdmParameterCategory>(url, obj, config)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error.message);
                reject(error.message);
            });
        });

        return res;
    }

    public delete(id?: number | null): Promise<any> {
        const res = new Promise<any>((resolve, reject) => {
            const url = `${this.PATH}/${id}`;
            const config = this.axiosConfig;
            axios.delete<any>(url, config)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error.message);
                reject(error.message);
            });
        });

        return res;
    }

    public report(obj: ReportParamForm): Promise<string> {
        const res = new Promise<string>((resolve, reject) => {
            const url = `${this.PATH}/report`;
            const config: AxiosRequestConfig = this.tokenService.getAuthWithBlob();
            axios.post(url, obj, config)
            .then((response) => {
                const filename: string = 'AdmParameterCategory.' + obj.reportType.toLowerCase();
                FileSaver.saveAs(response.data, filename);
                resolve(filename);
            })
            .catch((error) => {
                console.log(error.message);
                reject(error.message);
            });
        });

        return res;
    }


}