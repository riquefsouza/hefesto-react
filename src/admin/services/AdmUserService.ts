import axios, { AxiosRequestConfig } from 'axios';
import { environment } from '../../environments/environment';
import { TokenService } from '../../base/services/TokenService';
import { AdmUser } from "../models/AdmUser";
import AdmProfileService from './AdmProfileService';

export default class AdmUserService {

    private admProfileService: AdmProfileService;
    private PATH: string;
    private axiosConfig: AxiosRequestConfig;
    private tokenService: TokenService;

    constructor() {
        this.PATH = environment.apiVersion + '/admUser';
        this.tokenService = new TokenService();
        this.axiosConfig = this.tokenService.getAuth();
        this.admProfileService = new AdmProfileService();
    }

    public findIndexById(listaAdmUser: AdmUser[], id?: number | null): number {
        let index = -1;
        if (id){
            for (let i = 0; i < listaAdmUser.length; i++) {
                if (listaAdmUser[i].id === id) {
                    index = i;
                    break;
                }
            }    
        }
        return index;
    }

    /*
    public async findAll(): Promise<AdmUser[]> {
        const res = await axios.get('data/admUser.json');
        return res.data;
    }

    public findById(id: number): Promise<AdmUser> {
        const res = new Promise<AdmUser>((resolve, reject) => {
            let lista: AdmUser[] = [];

            this.findAll()
                .then(Users => {
                    lista = Users.filter(User => User.id === id);
                    resolve(lista[0]);
                })
                .catch(erro => {
                    reject(erro);
                });
            }
        );

        return res;
    }

    public findAllWithProfiles(): Promise<AdmUser[]> {
        const res = new Promise<AdmUser[]>((resolve, reject) => {

            this.findAll().then(users => {
                users.forEach(user => {
                    user.userProfiles = '';

                    user.admIdProfiles.forEach(idProfile => {

                        this.admProfileService.findById(idProfile).then(profile => {
                            user.userProfiles += profile.description + ', ';
                        })
                        .catch(erro => {
                            reject(erro);
                        });

                    });
                });
                resolve(users);
            })
            .catch(erro => {
                reject(erro);
            });

        });

        return res;
    }
    */

    public findAllPaginated(page: number): Promise<AdmUser[]> {
        const res = new Promise<AdmUser[]>((resolve, reject) => {
            const url = `${this.PATH}/paged?page=${page}`;
            const config = this.axiosConfig;
            axios.get<AdmUser[]>(url, config)
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

    public findAll(): Promise<AdmUser[]> {
        const res = new Promise<AdmUser[]>((resolve, reject) => {
            const url = this.PATH;
            const config = this.axiosConfig;
            axios.get<AdmUser[]>(url, config)
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

    public findById(id: number): Promise<AdmUser> {
        const res = new Promise<AdmUser>((resolve, reject) => {
            const url = `${this.PATH}/${id}`;
            const config = this.axiosConfig;
            axios.get<AdmUser>(url, config)
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

    public insert(obj: AdmUser): Promise<AdmUser> {
        const res = new Promise<AdmUser>((resolve, reject) => {
            const url = this.PATH;
            const config = this.axiosConfig;
            axios.post<AdmUser>(url, obj, config)
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

    public update(obj: AdmUser): Promise<AdmUser> {
        const res = new Promise<AdmUser>((resolve, reject) => {
            const url = `${this.PATH}/${obj.id}`;
            const config = this.axiosConfig;
            axios.put<AdmUser>(url, obj, config)
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