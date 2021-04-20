import React from "react";
import { Route, Switch } from 'react-router-dom';
import PrimeReact from "primereact/api";

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

function App() {
  PrimeReact.ripple = true;

  return (
    <main>
        <BarraMenu></BarraMenu>
        <Switch>
            <Route path='/admParameterCategory' component={AdmParameterCategoryComponent}/>
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
        </Switch>
    </main>
  );
}

export default App;
