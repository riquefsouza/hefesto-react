import axios from 'axios';
import { AdmParameter } from "../models/AdmParameter";

export default class AdmParameterService {

    public findIndexById(listaAdmParameter: AdmParameter[], id: number): number {
        let index = -1;
        for (let i = 0; i < listaAdmParameter.length; i++) {
            if (listaAdmParameter[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

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

}