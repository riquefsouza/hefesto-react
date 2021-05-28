import { AdmUser } from './../models/AdmUser';
import { emptyLoginForm, LoginForm } from '../../base/models/LoginForm';
import { TokenDTO } from '../../base/models/TokenDTO';
import { UserService } from '../../base/user/UserService';
//import { environment } from '../../environments/environment';
import axios from 'axios';
import AdmProfileService from './AdmProfileService';
import { MenuItemDTO } from '../../base/models/MenuItemDTO';

export default class LoginService {

    //private PATH: string;
    private userService: UserService;
    private admProfileService: AdmProfileService;

    constructor() { 
        //this.PATH = environment.url;
        this.userService = new UserService();
        this.admProfileService = new AdmProfileService();
    }

    public login(admUser: AdmUser): Promise<boolean> {
        const res = new Promise<boolean>((resolve, reject) => {
            const loginForm: LoginForm = emptyLoginForm;

            if (admUser.login !== '' && admUser.password !== '') {
                loginForm.login = admUser.login;
                loginForm.password = admUser.password;

                this.auth(loginForm).then((obj: TokenDTO) => {
                    this.userService.setToken(obj.tipo + " "+ obj.token);
                    console.log(`User ${admUser.login} authenticated with token: ${obj.tipo} ${obj.token}`);
                    
                    // axios.defaults.headers.common['Authorization'] = obj.tipo + ' ' + obj.token;

                    if (this.userService.getIdProfiles().length > 0) {
                        this.admProfileService.mountMenu(this.userService.getIdProfiles())
                        .then((menus: MenuItemDTO[]) => {
                          this.userService.setMenuItems(menus);
                          resolve(true);
                        });
                    }
                })
                .catch(error => {
                    reject(false);
                });
            } else {
                reject(false);
            }
        });

        return res;
    }

    public auth(obj: LoginForm): Promise<TokenDTO> {
        const res = new Promise<TokenDTO>((resolve, reject) => {
            //const url = this.PATH + '/auth';
            const url = '/auth';
            axios.post<TokenDTO>(url, obj)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Login error: ', error.message);
                }
                console.log(error.config);
                reject(error.toJSON());
            });
        });        
           
        return res;
    }

}
