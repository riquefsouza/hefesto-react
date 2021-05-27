import React, { useState } from "react";

import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { MenuItem } from "primereact/api";
import { UserService } from '../../base/user/UserService';
import { useHistory } from "react-router";

import logo from '../../assets/logo.png';

function BarraMenu() {
    const userService = new UserService();

    const [logged] = useState<boolean>(userService.isLogged());
    const history = useHistory();

    const [username] = useState<string>(userService.getUserName());

    const getURL = (): string => {
        if (window.location.port)
            return window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
        else
            return window.location.protocol + '//' + window.location.hostname;            
    }

    const menuItems: MenuItem[] = [
        {
            label: "Configurações",
            items: [
                {label: "Parameter Category", url:  getURL() + "/admParameterCategory"},
                {label: "Parameter", command: () => {window.location.href = '/admParameter'}},
                {label: "Profile", command: () => {window.location.href = '/admProfile'}},
                {label: "Page", command: () => {window.location.href = '/admPage'}},
                {label: "Menu", command: () => {window.location.href = '/admMenu'}},
                {label: "User", command: () => {window.location.href = '/admUser'}},
                {label: "Change Password", command: () => {window.location.href = '/changePasswordEdit'}},
                {label: "Sair", command: () => {logout();}},
            ],
        }
    ];

    const logout = () => {
        userService.logout();
        history.push('/');
      }
    

    return (
    <div>
        <Menubar className="p-mb-2" style={logged ? {display: "none"} : {display: ""}}
            start = {
                <a href="/">
                    <img alt="logo" src={logo} height="40" className="p-mr-2"></img>
                </a>
            }
        />
        <Menubar model={menuItems} className="p-mb-2" style={logged ? {display: ""} : {display: "none"}}
            start = {
                <a href="/">
                    <img alt="logo" src={logo} height="40" className="p-mr-2"></img>
                </a>
            }
            end = {
                <div v-if="username">
                    <i className="pi pi-user p-mr-1"></i>
                    <a href="/" className="p-mr-5">{username}</a>
                    <Button label="Logout" icon="pi pi-power-off" onClick={logout} />
                </div>
    
                
            }
        />
    </div>
    );
}

export default BarraMenu;
