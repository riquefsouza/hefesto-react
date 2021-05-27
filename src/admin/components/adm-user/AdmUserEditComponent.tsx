import React, { useEffect, useRef, useState } from "react";
import { Panel } from "primereact/panel";
import { StorageService } from "../../../base/services/StorageService";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { PickList } from 'primereact/picklist';
import { InputText } from 'primereact/inputtext';
import { Toast } from "primereact/toast";
import { AdmUser, cleanAdmUser, emptyAdmUser } from "../../models/AdmUser";
import AdmUserService from "../../services/AdmUserService";
import { AdmProfile } from "../../models/AdmProfile";
import AdmProfileService from "../../services/AdmProfileService";
import { Checkbox } from "primereact/checkbox";
import BarraMenu from "../../../base/components/BarraMenu";

function AdmUserEditComponent() {

  const admProfileService = new AdmProfileService();
  const admUserService = new AdmUserService();
  const storageService = new StorageService();

  const [listaAdmUser, setListaAdmUser] = useState<AdmUser[]>([]);
  const [admUser, setAdmUser] = useState<AdmUser>(emptyAdmUser);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const toast = useRef<Toast>(new Toast({}));
  const history = useHistory();

  const [sourceProfiles, setSourceProfiles] = useState<AdmProfile[]>([]);
  const [targetProfiles, setTargetProfiles] = useState<AdmProfile[]>([]);

  useEffect(() => {
    let vUser: AdmUser = storageService.getPersistedObj('admUser') as AdmUser; 
    // setAdmUser(storageService.getStorage());
    setAdmUser(vUser);

    admUserService.findAll().then(item => setListaAdmUser(item));

    loadAdmProfiles(vUser);

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAdmProfiles = (user: AdmUser) => {
    setTargetProfiles([]);
    if (user.id != null) {
      admProfileService.findProfilesByUser(user).then(item => {
        setTargetProfiles(item);

        admProfileService.findAll().then(profiles => {
          setSourceProfiles(profiles.filter(profile => !item.find(target => target.id === profile.id)));
        });

      });     
    } else {
      admProfileService.findAll().then(profiles => setSourceProfiles(profiles));
    }
  }

  const onClean = () => {
    setAdmUser({...cleanAdmUser});
  }

  const onCancel = () => {
    history.push('/admUser');
  }

  const onSave = () => {
    setSubmitted(true);

    if (admUser.name.trim()) {
        let _listaAdmUser = [...listaAdmUser];
        let _admUser = {...admUser};

        if (admUser.id) {
          admUserService.update(_admUser).then((obj: AdmUser) => {
            _admUser = obj;

            const index = admUserService.findIndexById(listaAdmUser, admUser.id);

            _listaAdmUser[index] = _admUser;
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
          });  
        } else {
          admUserService.insert(_admUser).then((obj: AdmUser) => {
            _admUser = obj;

            _listaAdmUser.push(_admUser);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
          });  
        }

        setListaAdmUser(_listaAdmUser);
        setAdmUser(emptyAdmUser);
        history.push('/admUser');
    }
  }
  
  const setActiveChange = (val: boolean) => {
    let _admUser = {...admUser};
    _admUser.active = val;

    setAdmUser(_admUser);
  }

  const onEmailChange = (e: React.FormEvent<HTMLInputElement>) => {
    const val: string = (e.currentTarget && e.currentTarget.value) || '';
    let _admUser = {...admUser};
    _admUser.email = val;

    setAdmUser(_admUser);
  }

  const onLoginChange = (e: React.FormEvent<HTMLInputElement>) => {
    const val: string = (e.currentTarget && e.currentTarget.value) || '';
    let _admUser = {...admUser};
    _admUser.login = val;

    setAdmUser(_admUser);
  }

  const onNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    const val: string = (e.currentTarget && e.currentTarget.value) || '';
    let _admUser = {...admUser};
    _admUser.name = val;

    setAdmUser(_admUser);
  }

  const onUserProfilesChange = (event: { 
    source: React.SetStateAction<AdmProfile[]>; 
    target: React.SetStateAction<AdmProfile[]>; }) => {
    setSourceProfiles(event.source);
    setTargetProfiles(event.target);
  }

  const itemTemplate = (item: AdmProfile) => {
    return (
      <div>
          {item.description}
      </div>
    );
  }

  return (
    <div>
      <BarraMenu></BarraMenu>
      <Toast ref={toast} />

      <Panel header="Configuration User" className="p-mb-2">
        <div className="p-grid p-justify-end">
          <Button label="Save" icon="pi pi-check" className="p-button-success p-mr-2" onClick={onSave}></Button>
          <Button label="Clean" icon="pi pi-star-o" className="p-button-primary p-mr-2" onClick={onClean}></Button>
          <Button label="Cancel" icon="pi pi-times" className="p-button-secondary p-mr-2" onClick={onCancel}></Button>
        </div>
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col-2 p-md-2">
              <label htmlFor="active" style={{margin: '4px'}}>Active:</label>
              <Checkbox id="active" onChange={e => setActiveChange(e.checked)} checked={admUser.active}></Checkbox>
          </div>
          <div className="p-field p-col-12">
              <label htmlFor="email">E-mail:</label>
              <InputText id="email" value={admUser.email} onChange={(e) => onEmailChange(e)} required />
              {submitted && !admUser.email && <small className="p-error">E-mail is required.</small>}
          </div>
          <div className="p-field p-col-12">
            <label htmlFor="login">Login:</label>
            <InputText id="login" value={admUser.login} onChange={(e) => onLoginChange(e)} required />
            {submitted && !admUser.login && <small className="p-error">Login is required.</small>}
          </div>
          <div className="p-field p-col-12">
            <label htmlFor="name">Name:</label>
            <InputText id="name" value={admUser.name} onChange={(e) => onNameChange(e)} required />
            {submitted && !admUser.name && <small className="p-error">Name is required.</small>}
          </div>
          <div className="p-field p-col-12 p-md-8">
            <label htmlFor="userProfiles">User profile(s):</label>
            <PickList source={sourceProfiles} target={targetProfiles} itemTemplate={itemTemplate}
              sourceHeader="Available" targetHeader="Seleced" 
              sourceStyle={{height:'30rem'}} targetStyle={{height:'30rem'}} onChange={onUserProfilesChange} />
          </div>  
        </div>
      </Panel>
    </div>
  );
}

export default AdmUserEditComponent;
