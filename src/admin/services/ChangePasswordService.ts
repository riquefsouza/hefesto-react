import AdmUserService from './AdmUserService';
import * as bcryptjs from 'bcryptjs';
import { AdmUser } from '../models/AdmUser';

export default class ChangePasswordService {

    private admUserService: AdmUserService;

    constructor() {
        this.admUserService = new AdmUserService();
    }

    private distinct = (arrArg: string[]) => {
        return arrArg.filter((elem: string, pos: number, arr: string[]) => {
            return arr.indexOf(elem) === pos;
        });
    }

    private containsNumericSequences(min: number, max: number, stexto: string): boolean {
        let lista: string[] = [];
        let sValorMin: string;
        const vnum: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

        for (let n = 0; n < 7; n++) {
            for (let qtd = min - 1; qtd <= max; qtd++) {
                sValorMin = '';
                for (let i = n; i <= (qtd + n); i++) {
                    if (i <= max) {
                        sValorMin += vnum[i].toString();
                    }
                }
                lista.push(sValorMin);
            }
        }
        lista = this.distinct(lista);
        return lista.includes(stexto);
    }

    private containsConsecutiveIdenticalCharacters(min: number, max: number, stexto: string): boolean {
        const lista: string[] = [];
        let sAlfaMin: string;
        let i: number = 'a'.charCodeAt(0);
        const j: number = 'z'.charCodeAt(0);

        for (; i <= j; ++i) {
            for (let qtd = min; qtd <= max; qtd++) {
                sAlfaMin = '';
                for (let x = 1; x <= qtd; x++) {
                    sAlfaMin += String.fromCharCode(i);
                }
                lista.push(sAlfaMin);
                lista.push(sAlfaMin.toUpperCase());
            }
        }
        return lista.includes(stexto);
    }

    public validatePassword(login: string, senha: string): boolean {
        if (senha.length >= 8) {
            const letterUppercase = new RegExp('[A-Z]');
            const letterLowercase = new RegExp('[a-z]');
            const digit = new RegExp('[0-9]');
            const special = new RegExp('[!@#$%&*()_+=|<>?{}\\[\\]~-]');

            const U: boolean = letterUppercase.test(senha);
            const L: boolean = letterLowercase.test(senha);
            const D: boolean = digit.test(senha);
            const S: boolean = special.test(senha);

            const hasChars: boolean = (U && L && D) || (S && U && L) || (D && S && U) || (L && D && S);

            return hasChars
                && !this.containsNumericSequences(4, 9, senha)
                && !this.containsConsecutiveIdenticalCharacters(4, 9, senha)
                && !senha.includes(login);

        } else {
            return false;
        }
    }

    public updatePassword(admUser: AdmUser): boolean {

        const salt = bcryptjs.genSaltSync(10);
        admUser.password = bcryptjs.hashSync(admUser.confirmNewPassword, salt);

        this.admUserService.update(admUser).then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });
        return false;
    }

}
