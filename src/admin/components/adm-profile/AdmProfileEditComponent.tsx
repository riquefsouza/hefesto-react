import React, { useEffect, useRef, useState } from "react";
import { Panel } from "primereact/panel";
import { AdmPage } from "../../models/AdmPage";
import { StorageService } from "../../../base/services/StorageService";
import AdmPageService from "../../services/AdmPageService";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { PickList } from 'primereact/picklist';
import { InputText } from 'primereact/inputtext';
import { Toast } from "primereact/toast";
import { AdmProfile, cleanAdmProfile, emptyAdmProfile } from "../../models/AdmProfile";
import AdmProfileService from "../../services/AdmProfileService";
import { Checkbox } from "primereact/checkbox";
import { AdmUser } from "../../models/AdmUser";
import AdmUserService from "../../services/AdmUserService";
import BarraMenu from "../../../base/components/BarraMenu";

function AdmProfileEditComponent() {

  const admProfileService = new AdmProfileService();
  const admUserService = new AdmUserService();
  const admPageService = new AdmPageService();
  const storageService = new StorageService();

  const [listaAdmProfile, setListaAdmProfile] = useState<AdmProfile[]>([]);
  const [admProfile, setAdmProfile] = useState<AdmProfile>(emptyAdmProfile);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const toast = useRef<Toast>(new Toast({}));
  const history = useHistory();

  const [sourceUsers, setSourceUsers] = useState<AdmUser[]>([]);
  const [targetUsers, setTargetUsers] = useState<AdmUser[]>([]);

  const [sourcePages, setSourcePages] = useState<AdmPage[]>([]);
  const [targetPages, setTargetPages] = useState<AdmPage[]>([]);

  useEffect(() => {
    let vProfile: AdmProfile = storageService.getPersistedObj('admProfile') as AdmProfile; 
    // setAdmProfile(storageService.getStorage());
    setAdmProfile(vProfile);

    admProfileService.findAll().then(item => setListaAdmProfile(item));

    loadAdmUsers(vProfile);
    loadAdmPages(vProfile);

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAdmUsers = (profile: AdmProfile) => {
    let _targetUsers: AdmUser[] = [];
    
    if (profile.id != null) {
      _targetUsers = profile.admUsers;
      setTargetUsers(_targetUsers);
    }
    admUserService.findAll().then(users => {
      setSourceUsers(users.filter(user => !_targetUsers.find(target => target.id === user.id)));
    });    
  }

  const loadAdmPages = (profile: AdmProfile) => {
    let _targetPages: AdmPage[] = [];

    if (profile.id != null) {
      _targetPages = profile.admPages;
      setTargetPages(_targetPages);
    }
    admPageService.findAll().then(pages => {
      setSourcePages(pages.filter(page => !_targetPages.find(target => target.id === page.id)));
    });    
  }

  const onClean = () => {
    setAdmProfile({...cleanAdmProfile});
  }

  const onCancel = () => {
    history.push('/admin/admProfile');
  }

  const onSave = () => {
    setSubmitted(true);

    if (admProfile.description.trim()) {
        let _listaAdmProfile = [...listaAdmProfile];
        let _admProfile = {...admProfile};

        if (admProfile.id) {
          admProfileService.update(_admProfile).then((obj: AdmProfile) => {
            _admProfile = obj;

            const index = admProfileService.findIndexById(listaAdmProfile, admProfile.id);

            _listaAdmProfile[index] = _admProfile;
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Profile Updated', life: 3000 });
          });  
        } else {
          admProfileService.insert(_admProfile).then((obj: AdmProfile) => {
            _admProfile = obj;

            _listaAdmProfile.push(_admProfile);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Profile Created', life: 3000 });
          });
        }

        setListaAdmProfile(_listaAdmProfile);
        setAdmProfile(emptyAdmProfile);
        history.push('/admin/admProfile');
    }
  }
  
  const onDescriptionChange = (e: React.FormEvent<HTMLInputElement>) => {
    const val: string = (e.currentTarget && e.currentTarget.value) || '';
    let _admProfile = {...admProfile};
    _admProfile.description = val;

    setAdmProfile(_admProfile);
  }

  const setGeneralChange = (val: boolean) => {
    let _admProfile = {...admProfile};
    _admProfile.general = val;

    setAdmProfile(_admProfile);
  }

  const setAdministratorChange = (val: boolean) => {
    let _admProfile = {...admProfile};
    _admProfile.administrator = val;

    setAdmProfile(_admProfile);
  }

  const onProfileUsersChange = (event: { 
    source: React.SetStateAction<AdmUser[]>; 
    target: React.SetStateAction<AdmUser[]>; }) => {
    setSourceUsers(event.source);
    setTargetUsers(event.target);
  }

  const onProfilePagesChange = (event: { 
    source: React.SetStateAction<AdmPage[]>; 
    target: React.SetStateAction<AdmPage[]>; }) => {
    setSourcePages(event.source);
    setTargetPages(event.target);
  }

  const itemTemplateUsers = (item: AdmUser) => {
    return (
      <div>
          {item.name}
      </div>
    );
  }

  const itemTemplatePages = (item: AdmPage) => {
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

      <Panel header="Configuration Profile" className="p-mb-2">
        <div className="p-grid p-justify-end">
          <Button label="Save" icon="pi pi-check" className="p-button-success p-mr-2" onClick={onSave}></Button>
          <Button label="Clean" icon="pi pi-star-o" className="p-button-primary p-mr-2" onClick={onClean}></Button>
          <Button label="Cancel" icon="pi pi-times" className="p-button-secondary p-mr-2" onClick={onCancel}></Button>
        </div>
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col-6">
            <label htmlFor="description">Description:</label>
            <InputText id="description" value={admProfile.description} onChange={(e) => onDescriptionChange(e)} required />
            {submitted && !admProfile.description && <small className="p-error">Description is required.</small>}
          </div>

          <div className="p-field p-col-1 p-md-1">
            <label htmlFor="general" style={{margin: '4px'}}>All users:</label>
            <Checkbox id="general" onChange={e => setGeneralChange(e.checked)} checked={admProfile.general}></Checkbox>
          </div>    
          <div className="p-field p-col-2 p-md-2">
              <label htmlFor="administrator" style={{margin: '4px'}}>System administrators:</label>
              <Checkbox id="administrator" onChange={e => setAdministratorChange(e.checked)} checked={admProfile.administrator}></Checkbox>
          </div>
        </div>
        <div className="p-fluid p-formgrid p-grid">    
          <div className="p-field p-col-12 p-md-8">
            <label htmlFor="profileUsers">User(s):</label>
            <PickList source={sourceUsers} target={targetUsers} itemTemplate={itemTemplateUsers}
              sourceHeader="Available" targetHeader="Seleced" 
              sourceStyle={{height:'30rem'}} targetStyle={{height:'30rem'}} onChange={onProfileUsersChange} />
          </div>  
          <div className="p-field p-col-12 p-md-8">
            <label htmlFor="profilePages">Page(s):</label>
            <PickList source={sourcePages} target={targetPages} itemTemplate={itemTemplatePages}
              sourceHeader="Available" targetHeader="Seleced" 
              sourceStyle={{height:'30rem'}} targetStyle={{height:'30rem'}} onChange={onProfilePagesChange} />
          </div>  
        </div>
      </Panel>
    </div>
  );
}

export default AdmProfileEditComponent;
