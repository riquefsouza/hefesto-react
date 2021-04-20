import React, { useEffect, useRef, useState } from "react";
import { Toolbar } from "primereact/toolbar";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import AdmParameterCategoryService from "../../services/AdmParameterCategoryService";
import { AdmParameterCategory, emptyAdmParameterCategory } from "../../models/AdmParameterCategory";
import { Panel } from 'primereact/panel';
import ReportPanelComponent from "../../../base/components/ReportPanel";
import { MyEventType } from "../../../base/models/MyEventType";

function AdmParameterCategoryComponent() {

  const admParameterCategoryService = new AdmParameterCategoryService();

  const [listaAdmParameterCategory, setListaAdmParameterCategory] = useState<AdmParameterCategory[]>([]);
  const [admParameterCategoryDialog, setAdmParameterCategoryDialog] = useState<boolean>(false);
  const [deleteAdmParameterCategoryDialog, setDeleteAdmParameterCategoryDialog] = useState<boolean>(false);
  const [deleteAdmParameterCategoriesDialog, setDeleteAdmParameterCategoriesDialog] = useState<boolean>(false);
  const [admParameterCategory, setAdmParameterCategory] = useState<AdmParameterCategory>(emptyAdmParameterCategory);

  const [selectedAdmParameterCategories, setSelectedAdmParameterCategories] = useState<AdmParameterCategory[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  //const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef<Toast>(new Toast({}));
  //const dt = useRef(null);

  useEffect(() => {
    admParameterCategoryService.findAll().then(item => setListaAdmParameterCategory(item));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  const onExport = () => {
    toast.current.show({ severity: 'info', summary: 'Page Exported', detail: 'Parameter Category Exported', life: 3000 });
  }
  
  const onInsert = () => {
    setAdmParameterCategory(emptyAdmParameterCategory);
    setSubmitted(false);
    setAdmParameterCategoryDialog(true);
  }

  const onEdit = (admParameterCategory: AdmParameterCategory) => {
    setAdmParameterCategory({...admParameterCategory});
    setAdmParameterCategoryDialog(true);
  }

  const hideDialog = () => {
    setAdmParameterCategoryDialog(false);
    setSubmitted(false);
  }

  const hideDeleteAdmParameterCategoryDialog = () => {
    setDeleteAdmParameterCategoryDialog(false);
  }

  const hideDeleteAdmParameterCategoriesDialog = () => {
      setDeleteAdmParameterCategoriesDialog(false);
  }

  const onSave = () => {
    setSubmitted(true);

    if (admParameterCategory.description.trim()) {
        let _listaAdmParameterCategory = [...listaAdmParameterCategory];
        let _admParameterCategory = {...admParameterCategory};

        if (admParameterCategory.id) {
          const index = findIndexById(admParameterCategory.id);

          _listaAdmParameterCategory[index] = _admParameterCategory;
          toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Parameter Category Updated', life: 3000 });
        } else {
          _admParameterCategory.id = _listaAdmParameterCategory.length + 1;
          _listaAdmParameterCategory.push(_admParameterCategory);
          toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Parameter Category Created', life: 3000 });
        }

        setListaAdmParameterCategory(_listaAdmParameterCategory);
        setAdmParameterCategoryDialog(false);
        setAdmParameterCategory(emptyAdmParameterCategory);
    }
  }

  const findIndexById = (id: number): number => {
    let index = -1;
    for (let i = 0; i < listaAdmParameterCategory.length; i++) {
        if (listaAdmParameterCategory[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
  }

  const confirmDelete = (admParameterCategory: AdmParameterCategory) => {
    setAdmParameterCategory(admParameterCategory);
    setDeleteAdmParameterCategoryDialog(true);
  }

  const deleteAdmParameterCategory = () => {
    let _listaAdmParameterCategory = listaAdmParameterCategory.filter(val => val.id !== admParameterCategory.id);
    setListaAdmParameterCategory(_listaAdmParameterCategory);
    setDeleteAdmParameterCategoryDialog(false);
    setAdmParameterCategory(emptyAdmParameterCategory);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Parameter Category Deleted', life: 3000 });
  }

  const confirmDeleteSelected = () => {
    setDeleteAdmParameterCategoriesDialog(true);
  }

  const deleteSelectedAdmParameterCategories = () => {
    let _listaAdmParameterCategory = listaAdmParameterCategory.filter(val => !selectedAdmParameterCategories.includes(val));
    setListaAdmParameterCategory(_listaAdmParameterCategory);
    setDeleteAdmParameterCategoriesDialog(false);
    setSelectedAdmParameterCategories([]);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
  }

  const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" />;
  const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" />;

  const myFooter = (
    <div>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" onClick={onSave} />
    </div>
  )

  const actionBodyTemplate = (rowData: AdmParameterCategory) => {
    return (
        <React.Fragment>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => onEdit(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDelete(rowData)} />
        </React.Fragment>
    );
  }
  
  const deleteAdmParameterCategoryDialogFooter = (
    <React.Fragment>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteAdmParameterCategoryDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteAdmParameterCategory} />
    </React.Fragment>
  );

  const deleteAdmParameterCategoriesDialogFooter = (
      <React.Fragment>
          <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteAdmParameterCategoriesDialog} />
          <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedAdmParameterCategories} />
      </React.Fragment>
  );

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
      <Toast ref={toast} />

      <Panel header="Configuration Parameter Category" className="p-mb-2">
          <ReportPanelComponent></ReportPanelComponent>
      </Panel>

      <Toolbar className="p-mb-2"
        left = {
          <React.Fragment>
              <Button label="New" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={onInsert}></Button>
              <Button label="Delete" icon="pi pi-trash" className="p-button-danger p-mr-2" 
                  onClick={confirmDeleteSelected}
                  disabled={!selectedAdmParameterCategories || !selectedAdmParameterCategories.length}></Button>
          </React.Fragment>
        }

        right={
          <React.Fragment>
              <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={onExport}></Button>
          </React.Fragment>
        }
      ></Toolbar>

      <DataTable value={listaAdmParameterCategory} selection={selectedAdmParameterCategories} onSelectionChange={(e) => setSelectedAdmParameterCategories(e.value)}
          rows={10} dataKey="id" paginator paginatorPosition="both" rowsPerPageOptions={[10,25,50,100,150,200]}
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
          paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>

          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>  
          <Column field="id" header="Id"></Column>
          <Column field="description" header="Description"></Column>
          <Column field="order" header="Order"></Column>
          <Column body={actionBodyTemplate}></Column>
      </DataTable>

      <Dialog header="Parameter Category Details" footer={myFooter} 
          visible={admParameterCategoryDialog} style={{width: '450px'}} modal={true} onHide={hideDialog} className="p-fluid">

          <div className="p-field">
              <label htmlFor="description">Description</label>
              <InputTextarea id="description" value={admParameterCategory.description} 
              onChange={(e) => onInputChange(e)}
              required autoFocus rows={3} cols={30} />
              {submitted && !admParameterCategory.description && <small className="p-error">Description is required.</small>}
          </div>
          <div className="p-field p-col">
              <label htmlFor="order">Order</label>
              <InputNumber id="order" value={admParameterCategory.order} onValueChange={(e) => onInputNumberChange(e)} />
          </div>

      </Dialog>

      <Dialog visible={deleteAdmParameterCategoryDialog} style={{ width: '450px' }} header="Confirm" modal 
        footer={deleteAdmParameterCategoryDialogFooter} onHide={hideDeleteAdmParameterCategoryDialog}>
          <div className="confirmation-content">
              <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
              {admParameterCategory && <span>Are you sure you want to delete <b>{admParameterCategory.description}</b>?</span>}
          </div>
      </Dialog>

      <Dialog visible={deleteAdmParameterCategoriesDialog} style={{ width: '450px' }} header="Confirm" modal 
        footer={deleteAdmParameterCategoriesDialogFooter} onHide={hideDeleteAdmParameterCategoriesDialog}>
          <div className="confirmation-content">
              <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
              {admParameterCategory && <span>Are you sure you want to delete the selected?</span>}
          </div>
      </Dialog>

    </div>
  );
  
}

export default AdmParameterCategoryComponent;
