import { AdmUser } from './../models/AdmUser';

export default class LoginService {

    public login(admUser: AdmUser): boolean {

        if (admUser.login !== '' && admUser.password !== '') {
            return true;
        }
        return false;
    }
}
