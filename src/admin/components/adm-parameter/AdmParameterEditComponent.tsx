import React, { useEffect, useRef, useState } from "react";
import { Panel } from "primereact/panel";
import { AdmParameterCategory } from "../../models/AdmParameterCategory";
import { AdmParameter, cleanAdmParameter, emptyAdmParameter } from "../../models/AdmParameter";
import { StorageService } from "../../../base/services/StorageService";
import AdmParameterCategoryService from "../../services/AdmParameterCategoryService";
import AdmParameterService from "../../services/AdmParameterService";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from 'primereact/inputtext';
import { MyEventType } from "../../../base/models/MyEventType";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import BarraMenu from "../../../base/components/BarraMenu";

function AdmParameterEditComponent() {

  const admParameterService = new AdmParameterService();
  const admParameterCategoryService = new AdmParameterCategoryService();
  const storageService = new StorageService();

  const [listaAdmParameter, setListaAdmParameter] = useState<AdmParameter[]>([]);
  const [admParameter, setAdmParameter] = useState<AdmParameter>(emptyAdmParameter);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [listaAdmParameterCategory, setListaAdmParameterCategory] = useState<AdmParameterCategory[]>([]);
  const toast = useRef<Toast>(new Toast({}));
  const history = useHistory();

  useEffect(() => {
    admParameterCategoryService.findAll().then(item => setListaAdmParameterCategory(item));

    // setAdmParameter(storageService.getStorage());
    setAdmParameter(storageService.getPersistedObj('admParameter') as AdmParameter);

    admParameterService.findAll().then(item => setListaAdmParameter(item));

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onClean = () => {
    setAdmParameter({...cleanAdmParameter});
  }

  const onCancel = () => {
    history.push('/admParameter');
  }

  const onSave = () => {
    setSubmitted(true);

    if (admParameter.description.trim()) {
        let _listaAdmParameter = [...listaAdmParameter];
        let _admParameter = {...admParameter};

        if (admParameter.id) {
          admParameterService.update(_admParameter).then((obj: AdmParameter) => {
            _admParameter = obj;

            const index = admParameterService.findIndexById(listaAdmParameter, admParameter.id);

            _listaAdmParameter[index] = _admParameter;
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Parameter Updated', life: 3000 });
          });  
        } else {
          admParameterService.insert(_admParameter).then((obj: AdmParameter) => {
            _admParameter = obj;
            
            _listaAdmParameter.push(_admParameter);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Parameter Created', life: 3000 });
        });  
        }

        setListaAdmParameter(_listaAdmParameter);
        setAdmParameter(emptyAdmParameter);
        history.push('/admParameter');
    }
  }
  
  const onAdmParameterCategoryChange = (e: MyEventType) => {
    const val: any = e.value;
    let _admParameter = {...admParameter};
    _admParameter.admParameterCategory = val;

    setAdmParameter(_admParameter);
  }

  const onCodeChange = (e: React.FormEvent<HTMLInputElement>) => {
    const val: string = (e.currentTarget && e.currentTarget.value) || '';
    let _admParameter = {...admParameter};
    _admParameter.code = val;

    setAdmParameter(_admParameter);
  }

  const onValueChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const val: string = (e.currentTarget && e.currentTarget.value) || '';
    let _admParameter = {...admParameter};
    _admParameter.value = val;

    setAdmParameter(_admParameter);
  }

  const onDescriptionChange = (e: React.FormEvent<HTMLInputElement>) => {
    const val: string = (e.currentTarget && e.currentTarget.value) || '';
    let _admParameter = {...admParameter};
    _admParameter.description = val;

    setAdmParameter(_admParameter);
  }

  return (
    <div>
      <BarraMenu></BarraMenu>
      <Toast ref={toast} />

      <Panel header="Configuration Parameter" className="p-mb-2">
        <div className="p-grid p-justify-end">
          <Button label="Save" icon="pi pi-check" className="p-button-success p-mr-2" onClick={onSave}></Button>
          <Button label="Clean" icon="pi pi-star-o" className="p-button-primary p-mr-2" onClick={onClean}></Button>
          <Button label="Cancel" icon="pi pi-times" className="p-button-secondary p-mr-2" onClick={onCancel}></Button>
        </div>
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col-12 p-md-6">
              <label htmlFor="admParameterCategory">Parameter Category:</label>
              <Dropdown id="admParameterCategory" value={admParameter.admParameterCategory} options={listaAdmParameterCategory} 
                  onChange={(e) => onAdmParameterCategoryChange(e)}
                  optionLabel="description" placeholder="Select a parameter category"></Dropdown>
          </div>
          <div className="p-field p-col-12 p-md-6">
              <label htmlFor="code">Code:</label>
              <InputText id="code" value={admParameter.code} onChange={(e) => onCodeChange(e)} required />
              {submitted && !admParameter.code && <small className="p-error">Code is required.</small>}
          </div>
          <div className="p-field p-col-12">
            <label htmlFor="value">Value:</label>
            <InputTextarea id="value" value={admParameter.value} onChange={(e) => onValueChange(e)} required rows={3} cols={20} />
            {submitted && !admParameter.value && <small className="p-error">Value is required.</small>}            
          </div>
          <div className="p-field p-col-12">
            <label htmlFor="description">Description:</label>
            <InputText id="description" value={admParameter.description} onChange={(e) => onDescriptionChange(e)} required />
            {submitted && !admParameter.description && <small className="p-error">Description is required.</small>}
          </div>
        </div>
      </Panel>
    </div>
  );
}

export default AdmParameterEditComponent;
