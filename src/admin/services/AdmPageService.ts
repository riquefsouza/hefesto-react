import axios from 'axios';
import { AdmPage } from "../models/AdmPage";
import AdmProfileService from './AdmProfileService';

export default class AdmPageService {

    private admProfileService: AdmProfileService;

    constructor() { 
        this.admProfileService = new AdmProfileService();
    }

    public findIndexById(listaAdmPage: AdmPage[], id: number): number {
        let index = -1;
        for (let i = 0; i < listaAdmPage.length; i++) {
            if (listaAdmPage[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

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

}