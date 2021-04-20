import axios from 'axios';
import { AdmUser } from "../models/AdmUser";
import AdmProfileService from './AdmProfileService';

export default class AdmUserService {

    private admProfileService: AdmProfileService;

    constructor() { 
        this.admProfileService = new AdmProfileService();
    }

    public findIndexById(listaAdmUser: AdmUser[], id: number): number {
        let index = -1;
        for (let i = 0; i < listaAdmUser.length; i++) {
            if (listaAdmUser[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

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

}