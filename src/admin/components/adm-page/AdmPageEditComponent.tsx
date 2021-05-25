import React, { useEffect, useRef, useState } from "react";
import { Panel } from "primereact/panel";
import { AdmPage, cleanAdmPage, emptyAdmPage } from "../../models/AdmPage";
import { StorageService } from "../../../base/services/StorageService";
import AdmPageService from "../../services/AdmPageService";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { PickList } from 'primereact/picklist';
import { InputText } from 'primereact/inputtext';
import { Toast } from "primereact/toast";
import { AdmProfile } from "../../models/AdmProfile";
import AdmProfileService from "../../services/AdmProfileService";
import BarraMenu from "../../../base/components/BarraMenu";

function AdmPageEditComponent() {

  const admProfileService = new AdmProfileService();
  const admPageService = new AdmPageService();
  const storageService = new StorageService();

  const [listaAdmPage, setListaAdmPage] = useState<AdmPage[]>([]);
  const [admPage, setAdmPage] = useState<AdmPage>(emptyAdmPage);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const toast = useRef<Toast>(new Toast({}));
  const history = useHistory();

  const [sourceProfiles, setSourceProfiles] = useState<AdmProfile[]>([]);
  const [targetProfiles, setTargetProfiles] = useState<AdmProfile[]>([]);

  useEffect(() => {
    let vPage: AdmPage = storageService.getPersistedObj('admPage') as AdmPage; 
    // setAdmPage(storageService.getStorage());
    setAdmPage(vPage);

    admPageService.findAll().then(item => setListaAdmPage(item));

    loadAdmProfiles(vPage);

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAdmProfiles = (page: AdmPage) => {
    setTargetProfiles([]);
    if (page.id != null) {
      admProfileService.findProfilesByPage(page).then(item => {
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
    setAdmPage({...cleanAdmPage});
  }

  const onCancel = () => {
    history.push('/admPage');
  }

  const onSave = () => {
    setSubmitted(true);

    if (admPage.description.trim()) {
        let _listaAdmPage = [...listaAdmPage];
        let _admPage = {...admPage};

        if (admPage.id) {
          admPageService.update(_admPage).then((obj: AdmPage) => {
            _admPage = obj;

            const index = admPageService.findIndexById(listaAdmPage, admPage.id);

            _listaAdmPage[index] = _admPage;
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Page Updated', life: 3000 });
          });  
        } else {
          admPageService.insert(_admPage).then((obj: AdmPage) => {
            _admPage = obj;

            _listaAdmPage.push(_admPage);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Page Created', life: 3000 });
          });  
        }

        setListaAdmPage(_listaAdmPage);
        setAdmPage(emptyAdmPage);
        history.push('/admPage');
    }
  }
  
  const onUrlChange = (e: React.FormEvent<HTMLInputElement>) => {
    const val: string = (e.currentTarget && e.currentTarget.value) || '';
    let _admPage = {...admPage};
    _admPage.url = val;

    setAdmPage(_admPage);
  }

  const onDescriptionChange = (e: React.FormEvent<HTMLInputElement>) => {
    const val: string = (e.currentTarget && e.currentTarget.value) || '';
    let _admPage = {...admPage};
    _admPage.description = val;

    setAdmPage(_admPage);
  }

  const onPageProfilesChange = (event: { 
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

      <Panel header="Configuration Page" className="p-mb-2">
        <div className="p-grid p-justify-end">
          <Button label="Save" icon="pi pi-check" className="p-button-success p-mr-2" onClick={onSave}></Button>
          <Button label="Clean" icon="pi pi-star-o" className="p-button-primary p-mr-2" onClick={onClean}></Button>
          <Button label="Cancel" icon="pi pi-times" className="p-button-secondary p-mr-2" onClick={onCancel}></Button>
        </div>
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col-12 p-md-8">
              <label htmlFor="url">Page:</label>
              <InputText id="url" value={admPage.url} onChange={(e) => onUrlChange(e)} required />
              {submitted && !admPage.url && <small className="p-error">Page is required.</small>}
          </div>
          <div className="p-field p-col-12">
            <label htmlFor="description">Description:</label>
            <InputText id="description" value={admPage.description} onChange={(e) => onDescriptionChange(e)} required />
            {submitted && !admPage.description && <small className="p-error">Description is required.</small>}
          </div>
          <div className="p-field p-col-12 p-md-8">
            <label htmlFor="pageProfiles">Page profile(s):</label>
            <PickList source={sourceProfiles} target={targetProfiles} itemTemplate={itemTemplate}
              sourceHeader="Available" targetHeader="Seleced" 
              sourceStyle={{height:'30rem'}} targetStyle={{height:'30rem'}} onChange={onPageProfilesChange} />
          </div>  
        </div>
      </Panel>
    </div>
  );
}

export default AdmPageEditComponent;

