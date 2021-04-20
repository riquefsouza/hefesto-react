import React, { useState } from "react";

import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { MenuItem } from "primereact/api";

import logo from '../../assets/logo.png';

function BarraMenu() {

    const [logged] = useState<boolean>(true);

    const menuItems: MenuItem[] = [
        {
            label: "Configurações",
            items: [
                {label: "Parameter Category", command: () => {window.location.href = "/admParameterCategory"}},
                {label: "Parameter", command: () => {window.location.href = '/admParameter'}},
                {label: "Profile", command: () => {window.location.href = '/admProfile'}},
                {label: "Page", command: () => {window.location.href = '/admPage'}},
                {label: "Menu", command: () => {window.location.href = '/admMenu'}},
                {label: "User", command: () => {window.location.href = '/admUser'}},
                {label: "Change Password", command: () => {window.location.href = '/changePasswordEdit'}},
                {label: "Sair", command: () => {window.location.href = '/'}},
            ],
        }
    ];

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
                <Button label="Logout" icon="pi pi-power-off" />
            }
        />
    </div>
    );
}

export default BarraMenu;
