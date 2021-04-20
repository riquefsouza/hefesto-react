import React, { useEffect, useRef, useState } from "react";
import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";
import { useHistory } from "react-router";
import { AdmUser, cleanAdmUser, emptyAdmUser } from "../../models/AdmUser";
import LoginService from "../../services/LoginService";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import './LoginComponent.css';

function LoginComponent() {

  const loginService = new LoginService();

  const [admUser, setAdmUser] = useState<AdmUser>(emptyAdmUser);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const toast = useRef<Toast>(new Toast({}));
  const history = useHistory();

  useEffect(() => {
    onClean();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onClean = () => {
    setAdmUser(cleanAdmUser);
  }

  const login = () => {
    setSubmitted(true);

    if (loginService.login(admUser)) {
      history.push('/home');
    } else {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'login now allowed!', life: 3000 });
    }
  }

  const onLoginChange = (e: React.FormEvent<HTMLInputElement>) => {
    const val: string = (e.currentTarget && e.currentTarget.value) || '';
    let _admUser = {...admUser};
    _admUser.login = val;

    setAdmUser(_admUser);
  }

  const onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    const val: string = (e.currentTarget && e.currentTarget.value) || '';
    let _admUser = {...admUser};
    _admUser.password = val;

    setAdmUser(_admUser);
  }

  return (
    <div>
      <Toast ref={toast} />
      <div className="centered p-shadow-8" style={{width: '350px'}}>
        <Panel header="Log in" className="p-mb-2">
          <div className="p-fluid p-formgrid">
            <div className="p-field p-col-12">
              <label htmlFor="login">Login:</label>				
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-user"></i>
                </span>
                <InputText id="login" value={admUser.login} onChange={(e) => onLoginChange(e)} required maxLength={10} 
                  placeholder="Enter your username" />
              </div>	  
              {submitted && !admUser.login && <small className="p-error">Login is required.</small>}
            </div>
            <div className="p-field p-col-12">
              <label htmlFor="password">password:</label>
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-lock"></i>
                </span>				
                <Password id="password" value={admUser.password} required feedback={false} maxLength={10} 
                  placeholder="Enter your password" onChange={(e) => onPasswordChange(e)}></Password>
              </div>	  
              {submitted && !admUser.currentPassword && <small className="p-error">Password is required.</small>}
            </div>
          </div>  
          <div className="p-grid p-justify-center">
            <Button label="Enter" icon="pi pi-check" className="p-button-success p-mr-2" onClick={login}></Button>
          </div>          
        </Panel>
      </div>
    </div>
  );
}

export default LoginComponent;
