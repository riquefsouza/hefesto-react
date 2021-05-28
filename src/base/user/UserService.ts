import { TokenService } from '../services/TokenService';
import { StorageService } from '../services/StorageService';
import { BehaviorSubject } from 'rxjs';
import { emptyUser, User } from './user';
import jtw_decode from 'jwt-decode';
import axios from 'axios';
import { MenuItemDTO } from '../models/MenuItemDTO';

export class UserService {

    private userSubject = new BehaviorSubject<User>(emptyUser);
    private userName: string = "";
    private tokenService: TokenService;
    private storageService: StorageService;
    private idProfiles: number[] = [];

    constructor() {
        this.tokenService = new TokenService();
        this.storageService = new StorageService();
        this.tokenService.hasToken() && this.decodeAndNotify();
    }

    setToken(token: string) {
        this.tokenService.setToken(token);
        this.decodeAndNotify();
    }

    getUser() {
        return this.userSubject.asObservable();
    }

    private decodeAndNotify() {
        const token = this.tokenService.getToken();
        if (token){
            const user = jtw_decode(token) as User;
            this.userName = user.name;
            this.userSubject.next(user);
            this.idProfiles = [];
            if (user.idProfiles.length > 0) {
                const vIdProfiles = user.idProfiles.split(',');
                vIdProfiles.forEach((id: string) => {
                    this.idProfiles.push(parseInt(id, 0));
                });
            }    
        }
    }

    logout() {
        this.tokenService.removeToken();
        axios.defaults.headers.common['Authorization'] = '';
        this.userSubject.next(emptyUser);
        this.storageService.removePersistedObj('menuItem');
        this.storageService.clearStorage();
    }

    isLogged() {
        return this.tokenService.hasToken();
    }

    getUserName() {
        return this.userName;
    }

    getIdProfiles(): number[] {
        return this.idProfiles;
    }

    getMenuItems(): MenuItemDTO[] {
        return this.storageService.getPersistedObj('menuItem') as MenuItemDTO[];
    }

    setMenuItems(menuItems: MenuItemDTO[]) {
        this.storageService.persistObj('menuItem', menuItems);
    }

}