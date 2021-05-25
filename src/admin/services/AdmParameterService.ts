import axios, { AxiosRequestConfig } from 'axios';
import { environment } from '../../environments/environment';
import { AdmParameter } from "../models/AdmParameter";
import { TokenService } from '../../base/services/TokenService';

export default class AdmParameterService {

    private PATH: string;
    private axiosConfig: AxiosRequestConfig;
    private tokenService: TokenService;

    constructor() {
        this.PATH = environment.apiVersion + '/admParameter';
        this.tokenService = new TokenService();
        this.axiosConfig = this.tokenService.getAuth();
    }

    public findIndexById(listaAdmParameter: AdmParameter[], id?: number | null): number {
        let index = -1;
        if (id){
            for (let i = 0; i < listaAdmParameter.length; i++) {
                if (listaAdmParameter[i].id === id) {
                    index = i;
                    break;
                }
            }    
        }
        return index;
    }
    
    /*
    public async findAll(): Promise<AdmParameter[]> {
        const res = await axios.get('data/admParameter.json');
        return res.data;
    }

    public findById(id: number): Promise<AdmParameter> {
        const res = new Promise<AdmParameter>((resolve, reject) => {
            let lista: AdmParameter[] = [];

            this.findAll()
                .then(parameters => {
                    lista = parameters.filter(parameter => parameter.id === id);
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

    public findAllPaginated(page: number): Promise<AdmParameter[]> {
        const res = new Promise<AdmParameter[]>((resolve, reject) => {
            const url = `${this.PATH}/paged?page=${page}`;
            const config = this.axiosConfig;
            axios.get<AdmParameter[]>(url, config)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error.config);
                reject(error.toJSON());
            });
        });

        return res;
    }

    public findAll(): Promise<AdmParameter[]> {
        const res = new Promise<AdmParameter[]>((resolve, reject) => {
            const url = this.PATH;
            const config = this.axiosConfig;
            axios.get<AdmParameter[]>(url, config)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error.config);
                reject(error.toJSON());
            });
        });

        return res;
    }

    public findById(id: number): Promise<AdmParameter> {
        const res = new Promise<AdmParameter>((resolve, reject) => {
            const url = `${this.PATH}/${id}`;
            const config = this.axiosConfig;
            axios.get<AdmParameter>(url, config)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error.config);
                reject(error.toJSON());
            });
        });

        return res;
    }

    public insert(obj: AdmParameter): Promise<AdmParameter> {
        const res = new Promise<AdmParameter>((resolve, reject) => {
            const url = this.PATH;
            const config = this.axiosConfig;
            axios.post<AdmParameter>(url, obj, config)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error.config);
                reject(error.toJSON());
            });
        });

        return res;
    }

    public update(obj: AdmParameter): Promise<AdmParameter> {
        const res = new Promise<AdmParameter>((resolve, reject) => {
            const url = `${this.PATH}/${obj.id}`;
            const config = this.axiosConfig;
            axios.put<AdmParameter>(url, obj, config)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error.config);
                reject(error.toJSON());
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
                console.log(error.config);
                reject(error.toJSON());
            });
        });

        return res;
    }

}