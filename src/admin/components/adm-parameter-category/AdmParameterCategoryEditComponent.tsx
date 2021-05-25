import React, { useEffect, useRef, useState } from "react";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { useHistory } from "react-router";
import { MyEventType } from "../../../base/models/MyEventType";
import { AdmParameterCategory, emptyAdmParameterCategory } from "../../models/AdmParameterCategory";
import AdmParameterCategoryService from "../../services/AdmParameterCategoryService";
import { StorageService } from "../../../base/services/StorageService";
import BarraMenu from "../../../base/components/BarraMenu";

function AdmParameterCategoryEditComponent() {

  const admParameterCategoryService = new AdmParameterCategoryService();
  const storageService = new StorageService();
  
  const [listaAdmParameterCategory, setListaAdmParameterCategory] = useState<AdmParameterCategory[]>([]);
  const [admParameterCategory, setAdmParameterCategory] = useState<AdmParameterCategory>(emptyAdmParameterCategory);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const toast = useRef<Toast>(new Toast({}));
  const history = useHistory();

  useEffect(() => {
    // setAdmParameterCategory(storageService.getStorage());
    setAdmParameterCategory(storageService.getPersistedObj('admParameterCategory') as AdmParameterCategory);

    admParameterCategoryService.findAll().then(item => setListaAdmParameterCategory(item));

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onClean = () => {
    setAdmParameterCategory({...emptyAdmParameterCategory});
  }

  const onCancel = () => {
    history.push('/admParameter');
  }

  const onSave = () => {
    setSubmitted(true);

    if (admParameterCategory.description.trim()) {
        let _listaAdmParameterCategory = [...listaAdmParameterCategory];
        let _admParameterCategory = {...admParameterCategory};

        if (admParameterCategory.id) {
          admParameterCategoryService.update(_admParameterCategory).then((obj: AdmParameterCategory) => {
            _admParameterCategory = obj;

            const index = admParameterCategoryService.findIndexById(listaAdmParameterCategory, admParameterCategory.id);

            _listaAdmParameterCategory[index] = _admParameterCategory;
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Parameter Category Updated', life: 3000 });
          });
        } else {
          admParameterCategoryService.insert(_admParameterCategory).then((obj: AdmParameterCategory) => {
            _admParameterCategory = obj;

            _listaAdmParameterCategory.push(_admParameterCategory);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Parameter Category Created', life: 3000 });
          });
        }

        setListaAdmParameterCategory(_listaAdmParameterCategory);
        setAdmParameterCategory(emptyAdmParameterCategory);
        history.push('/admParameterCategory');
    }
  }

  const onInputChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const val: string = (e.currentTarget && e.currentTarget.value) || '';
    let _admParameterCategory = {...admParameterCategory};
    _admParameterCategory.description = val;

    setAdmParameterCategory(_admParameterCategory);
  }
  
  const onInputNumberChange = (e: MyEventType) => {
    const val: number = Number(e.value) || 0;
    let _admParameterCategory = {...admParameterCategory};
    _admParameterCategory.order = val;

    setAdmParameterCategory(_admParameterCategory);
  }

  return (
    <div>
      <BarraMenu></BarraMenu>
      <Toast ref={toast} />

      <Panel header="Configuration Parameter Category" className="p-mb-2">
        <div className="p-grid p-justify-end">
          <Button label="Save" icon="pi pi-check" className="p-button-success p-mr-2" onClick={onSave}></Button>
          <Button label="Clean" icon="pi pi-star-o" className="p-button-primary p-mr-2" onClick={onClean}></Button>
          <Button label="Cancel" icon="pi pi-times" className="p-button-secondary p-mr-2" onClick={onCancel}></Button>
        </div>
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col-12">
                <label htmlFor="description">Description</label>
                <InputTextarea id="description" value={admParameterCategory.description} 
                onChange={(e) => onInputChange(e)}
                required autoFocus rows={3} cols={30} />
                {submitted && !admParameterCategory.description && <small className="p-error">Description is required.</small>}
            </div>
            <div className="p-field p-col-12 p-md-6">
                <label htmlFor="order">Order</label>
                <InputNumber id="order" value={admParameterCategory.order} onValueChange={(e) => onInputNumberChange(e)} />
            </div>          
        </div>
      </Panel>
    </div>
  );
}

export default AdmParameterCategoryEditComponent;
