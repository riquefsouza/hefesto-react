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
          <Route path='/home' render={() => (userService.isLogged() ? <BarraMenu /> : <Redirect to="/login" />)} />
          <Route path='/admin/admParameterCategory'>
            {userService.isLogged() ? <AdmParameterCategoryComponent />: <Redirect to="/login" />}
          </Route>
          <Route path='/admin/admParameterCategoryEdit'>
            {userService.isLogged() ? <AdmParameterCategoryEditComponent />: <Redirect to="/login" />}
          </Route>
          <Route path='/admin/admParameter'>
            {userService.isLogged() ? <AdmParameterComponent />: <Redirect to="/login" />}
          </Route>
          <Route path='/admin/admParameterEdit'>
            {userService.isLogged() ? <AdmParameterEditComponent />: <Redirect to="/login" />}
          </Route>
          <Route path='/admin/admPage'>
            {userService.isLogged() ? <AdmPageComponent />: <Redirect to="/login" />}
          </Route>
          <Route path='/admin/admPageEdit'>
            {userService.isLogged() ? <AdmPageEditComponent />: <Redirect to="/login" />}
          </Route>
          <Route path='/admin/admProfile'>
            {userService.isLogged() ? <AdmProfileComponent />: <Redirect to="/login" />}
          </Route>
          <Route path='/admin/admProfileEdit'>
            {userService.isLogged() ? <AdmProfileEditComponent />: <Redirect to="/login" />}
          </Route>
          <Route path='/admin/admUser'>
            {userService.isLogged() ? <AdmUserComponent />: <Redirect to="/login" />}
          </Route>
          <Route path='/admin/admUserEdit'>
            {userService.isLogged() ? <AdmUserEditComponent />: <Redirect to="/login" />}
          </Route>
          <Route path='/admin/admMenu'>
            {userService.isLogged() ? <AdmMenuComponent />: <Redirect to="/login" />}
          </Route>
          <Route path='/admin/changePasswordEdit'>
            {userService.isLogged() ? <ChangePasswordEditComponent />: <Redirect to="/login" />}
          </Route>
          <Route path='/login' component={ LoginComponent }/>
          <Route path="*" component={ NotFoundComponent } />
        </Switch>
    </main>
  );
}

export default App;
