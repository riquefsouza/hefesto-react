import axios, { AxiosRequestConfig } from 'axios';
import { environment } from '../../environments/environment';
import { TokenService } from '../../base/services/TokenService';
import { AdmPage } from "../models/AdmPage";
import AdmProfileService from './AdmProfileService';

export default class AdmPageService {

    private admProfileService: AdmProfileService;
    private PATH: string;
    private axiosConfig: AxiosRequestConfig;
    private tokenService: TokenService;

    constructor() {
        this.PATH = environment.apiVersion + '/admPage';
        this.tokenService = new TokenService();
        this.axiosConfig = this.tokenService.getAuth();
        this.admProfileService = new AdmProfileService();
    }

    public findIndexById(listaAdmPage: AdmPage[], id?: number | null): number {
        let index = -1;
        if (id){
            for (let i = 0; i < listaAdmPage.length; i++) {
                if (listaAdmPage[i].id === id) {
                    index = i;
                    break;
                }
            }    
        }
        return index;
    }

    /*
    public async findAll(): Promise<AdmPage[]> {
        const res = await axios.get('data/admPage.json');
        return res.data;
    }

    public findById(id: number): Promise<AdmPage> {
        const res = new Promise<AdmPage>((resolve, reject) => {
            let lista: AdmPage[] = [];

            this.findAll()
                .then(Pages => {
                    lista = Pages.filter(Page => Page.id === id);
                    resolve(lista[0]);
                })
                .catch(erro => {
                    reject(erro);
                });
            }
        );

        return res;
    }

    public findAllWithProfiles(): Promise<AdmPage[]> {
        const res = new Promise<AdmPage[]>((resolve, reject) => {

            this.findAll().then(pages => {
                pages.forEach(page => {
                    page.pageProfiles = '';

                    page.admIdProfiles.forEach(idProfile => {

                        this.admProfileService.findById(idProfile).then(profile => {
                            page.pageProfiles += profile.description + ', ';
                        })
                        .catch(erro => {
                            reject(erro);
                        });

                    });
                });
                resolve(pages);
            })
            .catch(erro => {
                reject(erro);
            });

        });

        return res;
    }
    */

    public findAllPaginated(page: number): Promise<AdmPage[]> {
        const res = new Promise<AdmPage[]>((resolve, reject) => {
            const url = `${this.PATH}/paged?page=${page}`;
            const config = this.axiosConfig;
            axios.get<AdmPage[]>(url, config)
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

    public findAll(): Promise<AdmPage[]> {
        const res = new Promise<AdmPage[]>((resolve, reject) => {
            const url = this.PATH;
            const config = this.axiosConfig;
            axios.get<AdmPage[]>(url, config)
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

    public findById(id: number): Promise<AdmPage> {
        const res = new Promise<AdmPage>((resolve, reject) => {
            const url = `${this.PATH}/${id}`;
            const config = this.axiosConfig;
            axios.get<AdmPage>(url, config)
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

    public insert(obj: AdmPage): Promise<AdmPage> {
        const res = new Promise<AdmPage>((resolve, reject) => {
            const url = this.PATH;
            const config = this.axiosConfig;
            axios.post<AdmPage>(url, obj, config)
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

    public update(obj: AdmPage): Promise<AdmPage> {
        const res = new Promise<AdmPage>((resolve, reject) => {
            const url = `${this.PATH}/${obj.id}`;
            const config = this.axiosConfig;
            axios.put<AdmPage>(url, obj, config)
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