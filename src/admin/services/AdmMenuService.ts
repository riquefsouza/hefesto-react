import axios from 'axios';
import { AdmMenu } from "../models/AdmMenu";
import AdmPageService from './AdmPageService';

export default class AdmMenuService {

    private admPageService: AdmPageService;

    constructor() { 
        this.admPageService = new AdmPageService();
    }

    public findIndexById(listaAdmMenu: AdmMenu[], id: number): number {
        let index = -1;
        for (let i = 0; i < listaAdmMenu.length; i++) {
            if (listaAdmMenu[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    public async findAll(): Promise<AdmMenu[]> {
        const res = await axios.get('data/admMenu.json');
        return res.data;
    }

    public findById(id: number): Promise<AdmMenu> {
        const res = new Promise<AdmMenu>((resolve, reject) => {
            let lista: AdmMenu[] = [];

            this.findAll()
                .then(Menus => {
                    lista = Menus.filter(Menu => Menu.id === id);

                    lista.forEach(menu => {
                        menu.admPage = undefined;
                        menu.admMenuParent = undefined;
                    });

                    resolve(lista[0]);
                })
                .catch(erro => {
                    reject(erro);
                });
            }
        );

        return res;
    }

    public findAllWithPages(): Promise<AdmMenu[]> {
        const res = new Promise<AdmMenu[]>((resolve, reject) => {

            this.findAll().then(menus => {
                menus.forEach(menu => {
                    this.admPageService.findById(menu.idPage).then(page => menu.admPage = page);
                    this.findById(menu.idMenuParent).then(menuParent => menu.admMenuParent = menuParent);
                });
                resolve(menus);
            })
            .catch(erro => {
                reject(erro);
            });

        });

        return res;
    }

}