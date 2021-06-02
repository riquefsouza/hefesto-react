import React, { useState } from "react";

import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/api";
import { UserService } from '../../base/user/UserService';
import { useHistory } from "react-router";

import logo from '../../assets/logo.png';
import { MenuItemDTO } from "../models/MenuItemDTO";

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

    const menuItems: MenuItem[] = [];
    
    if (userService.getMenuItems()){
        userService.getMenuItems().forEach((menu: MenuItemDTO) => {
            let menuItem: MenuItem = {
                label: menu.label,
                items: []
            };

            if (menu.items){
                const submenuItems: MenuItem[] = [];
                menu.items.forEach((submenu: MenuItemDTO) => {
                    let submenuItem: MenuItem = {
                        'label': submenu.label,
                        'url': getURL() + submenu.url
                    };
                    submenuItems.push(submenuItem);
                }); 
                menuItem.items = submenuItems;
            }
                        
            menuItems.push(menuItem);
        });    

        if (menuItems) {
            menuItems.push({ label: 'Sair', icon: 'pi pi-fw pi-power-off', command: () => { logout(); } });
        }
      
    }

    /*
    const menuItems: MenuItem[] = [
        {
            label: "Settings",
            items: [
                {label: "Parameter Category", url:  getURL() + "/admin/admParameterCategory"},
                {label: "Parameter", url:  getURL() + '/admin/admParameter'},
                {label: "Profile", url:  getURL() + '/admin/admProfile'},
                {label: "Page", url:  getURL() + '/admin/admPage'},
                {label: "Menu", url:  getURL() + '/admin/admMenu'},
                {label: "User", url:  getURL() + '/admin/admUser'},
                {label: "Change Password", url:  getURL() + '/admin/changePasswordEdit'},
                {label: "Sair", command: () => {logout();}},
            ],
        }
    ];
    */

    const logout = () => {
        userService.logout();
        history.push('/login');
      }
    

    return (
    <div>
        <Menubar className="p-mb-2" style={logged ? {display: "none"} : {display: ""}}
            start = {
                <a href="/home">
                    <img alt="logo" src={logo} height="40" className="p-mr-2"></img>
                </a>
            }
        />
        <Menubar model={menuItems} className="p-mb-2" style={logged ? {display: ""} : {display: "none"}}
            start = {
                <a href="/home">
                    <img alt="logo" src={logo} height="40" className="p-mr-2"></img>
                </a>
            }
            end = {
                <div v-if="username">
                    <i className="pi pi-user p-mr-1"></i>
                    <span className="p-mr-5">{username}</span>
                </div>            
            }
        />
    </div>
    );
}

export default BarraMenu;
