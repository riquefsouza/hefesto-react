import axios from 'axios';
import { AdmParameterCategory } from "../models/AdmParameterCategory";

export default class AdmParameterCategoryService {

    /*
    public async findAll(): Promise<AdmParameterCategory[]> {
        const response = await fetch('http://localhost:3000/data/admParameterCategory.json');

        console.log("FETCH!");

        return await response.json();
    }
                

    public async findAll(): Promise<AdmParameterCategory[]> {
        const response = await axios.get('http://localhost:3000/data/admParameterCategory.json');
        return await response.data;
    }

*/

    public findIndexById(listaAdmParameterCategory: AdmParameterCategory[], id: number): number {
        let index = -1;
        for (let i = 0; i < listaAdmParameterCategory.length; i++) {
            if (listaAdmParameterCategory[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

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

}