import axios, { AxiosRequestConfig } from 'axios';
import { environment } from '../../environments/environment';
import { TokenService } from '../../base/services/TokenService';
import { AdmPage } from '../models/AdmPage';
import { AdmProfile } from "../models/AdmProfile";
import { AdmUser } from '../models/AdmUser';
import { ReportParamForm } from '../../base/models/ReportParamsForm';
import * as FileSaver from 'file-saver';
import { MenuItemDTO } from '../../base/models/MenuItemDTO';

export default class AdmProfileService {

    private PATH: string;
    private axiosConfig: AxiosRequestConfig;
    private tokenService: TokenService;

    constructor() {
        this.PATH = environment.apiVersion + '/admProfile';
        this.tokenService = new TokenService();
        this.axiosConfig = this.tokenService.getAuth();
    }

    public findIndexById(listaAdmProfile: AdmProfile[], id?: number | null): number {
        let index = -1;
        if (id){
            for (let i = 0; i < listaAdmProfile.length; i++) {
                if (listaAdmProfile[i].id === id) {
                    index = i;
                    break;
                }
            }    
        }
        return index;
    }

    /*
    public async findAll(): Promise<AdmProfile[]> {
        const res = await axios.get('data/admProfile.json');
        return res.data;
    }

    public findById(id: number): Promise<AdmProfile> {
        const res = new Promise<AdmProfile>((resolve, reject) => {
            let lista: AdmProfile[] = [];

            this.findAll()
                .then(Profiles => {
                    lista = Profiles.filter(Profile => Profile.id === id);
                    resolve(lista[0]);
                })
                .catch(erro => {
                    reject(erro);
                });
            }
        );

        return res;
    }

    public findProfilesByPage(admPage: AdmPage): Promise<AdmProfile[]> {
        const res = new Promise<AdmProfile[]>((resolve, reject) => {
            let lista: AdmProfile[] = [];

            this.findAll()
                .then(profiles => {
                    lista = profiles.filter(profile => {
                        return profile.admPages.filter(page => page.id === admPage.id).length > 0;
                    });
                    resolve(lista);
                })
                .catch(erro => {
                    reject(erro);
                });
            }
        );

        return res;
    }

    public findAllWithUsers(): Promise<AdmProfile[]> {
        const res = new Promise<AdmProfile[]>((resolve, reject) => {

            this.findAll().then(profiles => {
                profiles.forEach(profile => {
                    profile.profileUsers = '';
                    profile.profilePages = '';

                    profile.admUsers.forEach(user => {
                        profile.profileUsers += user.name + ', ';
                    });
                    profile.admPages.forEach(page => {
                        profile.profilePages += page.description + ', ';
                    });
                });
                resolve(profiles);
            })
            .catch(erro => {
                reject(erro);
            });

        });

        return res;
    }

    public findProfilesByUser(admUser: AdmUser): Promise<AdmProfile[]> {
        const res = new Promise<AdmProfile[]>((resolve, reject) => {
            let lista: AdmProfile[] = [];

            this.findAll()
                .then(profiles => {
                    lista = profiles.filter(profile => {
                        return profile.admUsers.filter(user => user.id === admUser.id).length > 0;
                    });
                    resolve(lista);
                })
                .catch(erro => {
                    reject(erro);
                });
            }
        );

        return res;
    }
    */

    public findAllPaginated(page: number): Promise<AdmProfile[]> {
        const res = new Promise<AdmProfile[]>((resolve, reject) => {
            const url = `${this.PATH}/paged?page=${page}`;
            const config = this.axiosConfig;
            axios.get<AdmProfile[]>(url, config)
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

    public findAll(): Promise<AdmProfile[]> {
        const res = new Promise<AdmProfile[]>((resolve, reject) => {
            const url = this.PATH;
            const config = this.axiosConfig;
            axios.get<AdmProfile[]>(url, config)
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

    public findById(id: number): Promise<AdmProfile> {
        const res = new Promise<AdmProfile>((resolve, reject) => {
            const url = `${this.PATH}/${id}`;
            const config = this.axiosConfig;
            axios.get<AdmProfile>(url, config)
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

    public insert(obj: AdmProfile): Promise<AdmProfile> {
        const res = new Promise<AdmProfile>((resolve, reject) => {
            const url = this.PATH;
            const config = this.axiosConfig;
            axios.post<AdmProfile>(url, obj, config)
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

    public update(obj: AdmProfile): Promise<AdmProfile> {
        const res = new Promise<AdmProfile>((resolve, reject) => {
            const url = `${this.PATH}/${obj.id}`;
            const config = this.axiosConfig;
            axios.put<AdmProfile>(url, obj, config)
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

    public findProfilesByPage(admPage: AdmPage): Promise<AdmProfile[]> {
        const res = new Promise<AdmProfile[]>((resolve, reject) => {
            const url = `${this.PATH}/findProfilesByPage/${admPage.id}`;
            const config = this.axiosConfig;
            axios.get<AdmProfile[]>(url, config)
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

    public findProfilesByUser(admUser: AdmUser): Promise<AdmProfile[]> {        
        const res = new Promise<AdmProfile[]>((resolve, reject) => {
            const url = `${this.PATH}/findProfilesByUser/${admUser.id}`;
            const config = this.axiosConfig;
            axios.get<AdmProfile[]>(url, config)
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
                const filename: string = 'AdmProfile.' + obj.reportType.toLowerCase();
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

    public mountMenu(obj: number[]): Promise<MenuItemDTO[]> {
        const res = new Promise<MenuItemDTO[]>((resolve, reject) => {
            const url = `${this.PATH}/mountMenu`;
            const config = this.tokenService.getAuth();
            axios.post<MenuItemDTO[]>(url, obj, config)
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

}