import axios from 'axios';
import { environment } from '../../environments/environment';
import { AdmParameterCategory } from "../models/AdmParameterCategory";
import { TokenService } from '../../base/services/TokenService';

export default class AdmParameterCategoryService {

    private PATH: string;
    private tokenService: TokenService;

    constructor() {
        this.PATH = environment.apiVersion + '/admParameterCategory';
        this.tokenService = new TokenService();
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

    public async findAllPaginated(page: number) {
        const url = `${this.PATH}/paged/${page}`;
        const res = await axios.get<AdmParameterCategory[]>(url);
        return res;
    }

    public findAll(): Promise<AdmParameterCategory[]> {
        const res = new Promise<AdmParameterCategory[]>((resolve, reject) => {
            const url = this.PATH;
            axios.get<AdmParameterCategory[]>(url, 
                { headers: {'Authorization': this.tokenService.getToken()}} )
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

    public async findById(id: number): Promise<AdmParameterCategory> {
        const url = `${this.PATH}/${id}`;
        const res = await axios.get<AdmParameterCategory>(url);
        return res;
    }

    public async insert(obj: AdmParameterCategory): Promise<AdmParameterCategory> {
        const url = this.PATH;
        const res = await axios.post<AdmParameterCategory>(url, obj);
        return res;
    }

    public async update(obj: AdmParameterCategory): Promise<AdmParameterCategory> {
        const url = `${this.PATH}/${obj.id}`;
        const res = await axios.put<AdmParameterCategory>(url, obj);

        return res;
    }

    public async delete(id?: number | null): Promise<any> {
        const url = `${this.PATH}/${id}`;
        const res = await axios.delete(url);

        return res;
    }

}