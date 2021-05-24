import React from "react";
import { Route, Switch, Redirect } from 'react-router-dom';
import PrimeReact from "primereact/api";
import axios from 'axios';
import { environment } from './environments/environment';
import { UserService } from './base/user/UserService';

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import BarraMenu from "./base/components/BarraMenu";
import AdmParameterCategoryComponent from './admin/components/adm-parameter-category/AdmParameterCategoryComponent';
import AdmParameterComponent from "./admin/components/adm-parameter/AdmParameterComponent";
import AdmParameterCategoryEditComponent from "./admin/components/adm-parameter-category/AdmParameterCategoryEditComponent";
import AdmParameterEditComponent from "./admin/components/adm-parameter/AdmParameterEditComponent";
import AdmMenuComponent from "./admin/components/adm-menu/AdmMenuComponent";
import AdmPageComponent from "./admin/components/adm-page/AdmPageComponent";
import AdmPageEditComponent from "./admin/components/adm-page/AdmPageEditComponent";
import AdmProfileComponent from "./admin/components/adm-profile/AdmProfileComponent";
import AdmProfileEditComponent from "./admin/components/adm-profile/AdmProfileEditComponent";
import AdmUserComponent from "./admin/components/adm-user/AdmUserComponent";
import AdmUserEditComponent from "./admin/components/adm-user/AdmUserEditComponent";
import ChangePasswordEditComponent from "./admin/components/change-password/ChangePasswordEditComponent";
import LoginComponent from "./admin/components/login/LoginComponent";
import NotFoundComponent from "./base/components/NotFoundComponent";

function App() {
  const userService = new UserService();

  PrimeReact.ripple = true;

  axios.defaults.baseURL = environment.url;
  //axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
  //axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';  

  return (
    <main>
        <Switch>
          <Route exact path="/" render={() => (<Redirect to="/login" />)} /> 
          <Route path='/home'>
            {userService.isLogged() ? <BarraMenu />: <Redirect to="/login" />}
          </Route>
          <Route path='/admParameterCategory'>
            {userService.isLogged() ? <AdmParameterCategoryComponent />: <Redirect to="/login" />}
          </Route>
          <Route path='/admParameterCategoryEdit' component={ AdmParameterCategoryEditComponent }/>
          <Route path='/admParameter' component={ AdmParameterComponent }/>
          <Route path='/admParameterEdit' component={ AdmParameterEditComponent }/>
          <Route path='/admPage' component={ AdmPageComponent }/>
          <Route path='/admPageEdit' component={ AdmPageEditComponent }/>
          <Route path='/admProfile' component={ AdmProfileComponent }/>
          <Route path='/admProfileEdit' component={ AdmProfileEditComponent }/>
          <Route path='/admUser' component={ AdmUserComponent }/>
          <Route path='/admUserEdit' component={ AdmUserEditComponent }/>
          <Route path='/admMenu' component={ AdmMenuComponent }/>
          <Route path='/changePasswordEdit' component={ ChangePasswordEditComponent }/>
          <Route path='/login' component={ LoginComponent }/>
          <Route path="*" component={ NotFoundComponent } />
        </Switch>
    </main>
  );
}

export default App;
