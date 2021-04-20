import axios from 'axios';
import { AdmPage } from '../models/AdmPage';
import { AdmProfile } from "../models/AdmProfile";
import { AdmUser } from '../models/AdmUser';

export default class AdmProfileService {

    public findIndexById(listaAdmProfile: AdmProfile[], id: number): number {
        let index = -1;
        for (let i = 0; i < listaAdmProfile.length; i++) {
            if (listaAdmProfile[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

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

}