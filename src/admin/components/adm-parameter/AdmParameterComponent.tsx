import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import ReportPanelComponent from "../../../base/components/ReportPanel";
import AdmParameterService from "../../services/AdmParameterService";
import { AdmParameter, emptyAdmParameter } from "../../models/AdmParameter";
import { AdmParameterCategory } from "../../models/AdmParameterCategory";
import { useHistory } from "react-router-dom";
import { ExportService } from "../../../base/services/ExportService";
import { StorageService } from "../../../base/services/StorageService";
import AdmParameterCategoryService from "../../services/AdmParameterCategoryService";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Column } from 'primereact/column';
import { DataTable } from "primereact/datatable";
import { Tooltip } from 'primereact/tooltip';
import { Dialog } from "primereact/dialog";

function AdmParameterComponent() {

  const admParameterService = new AdmParameterService();
  const admParameterCategoryService = new AdmParameterCategoryService();
  const storageService = new StorageService();
  const exportService = new ExportService();

  const [listaAdmParameter, setListaAdmParameter] = useState<AdmParameter[]>([]);
  const [admParameter, setAdmParameter] = useState<AdmParameter>(emptyAdmParameter);
  const [selectedAdmParameter, setSelectedAdmParameter] = useState<AdmParameter>(emptyAdmParameter);
  const [, setSubmitted] = useState<boolean>(false);
  const [listaAdmParameterCategory, setListaAdmParameterCategory] = useState<AdmParameterCategory[]>([]);
  //const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef<Toast>(new Toast({}));
  //const dt = useRef(null);
  const [cols, setCols] = useState<any[]>([]);
  const [exportColumns, setExportColumns] = useState<any[]>([]);
  const history = useHistory();
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);

  useEffect(() => {
    admParameterCategoryService.findAll().then(item => setListaAdmParameterCategory(item));

    admParameterService.findAll().then(item => setListaAdmParameter(item));

    setCols([
      { field: 'id', header: 'Id' },
      { field: 'admParameterCategory.description', header: 'Parameter Category' },
      { field: 'code', header: 'Parameter' },
      { field: 'value', header: 'Value' },
      { field: 'description', header: 'Description' }
    ]);

    setExportColumns(cols.map(col => ({title: col.header, dataKey: col.field})));

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onExport = () => {
    toast.current.show({ severity: 'info', summary: 'Parameter Exported', detail: 'Parameters Exported', life: 3000 });
  }

  const onCancel = () => {
    history.push('/');
  }
    
  const onInsert = () => {
    setAdmParameter(emptyAdmParameter);
    setSubmitted(false);

    admParameter.admParameterCategory = listaAdmParameterCategory[0];

    // storageService.setStorage(admParameter);
    storageService.persistObj('admParameter', admParameter);
    history.push('/admParameterEdit');
  }

  const onEdit = (admParameter: AdmParameter) => {
    setAdmParameter({...admParameter});

    // storageService.setStorage(admParameter);
    storageService.persistObj('admParameter', admParameter);
    history.push('/admParameterEdit');
  }

  const confirmDelete = (admParameter: AdmParameter) => {
    setAdmParameter(admParameter);
    setDeleteDialog(true);
  }

  const hideDeleteDialog = () => {
    setDeleteDialog(false);
  }

  const onDelete = () => {
    let _listaAdmParameter = listaAdmParameter.filter(val => val.id !== admParameter.id);
    setListaAdmParameter(_listaAdmParameter);
    setDeleteDialog(false);
    setAdmParameter(emptyAdmParameter);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Parameter Deleted', life: 3000 });
  }

  const exportPdf = () => {
    const head: string[] = [];
    const data: any[] = [];

    exportColumns.forEach(item => head.push(item.title));
    listaAdmParameter.forEach(item => data.push(
      [item.id, item.admParameterCategory.description, item.code, item.value, item.description]
    ));

    exportService.exportPdf(head, data, 'Parameters.pdf');
  }

  const exportExcel = () => {
    exportService.exportExcel(listaAdmParameter, 'Parameters');
  }

  return (
    <div>
      <Toast ref={toast} />

      <Panel header="Configuration Parameter" className="p-mb-2">
        <ReportPanelComponent></ReportPanelComponent>
      </Panel>

      <Toolbar className="p-mb-2"
        left = {
          <React.Fragment>
              <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={onExport}></Button>
          </React.Fragment>
        }
        right={
          <React.Fragment>
              <Button label="New" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={onInsert}></Button>
              <Button label="Edit" icon="pi pi-pencil" className="p-button-warning p-mr-2" onClick={() => onEdit(selectedAdmParameter)}
                  disabled={!selectedAdmParameter || !listaAdmParameter || !listaAdmParameter.length}></Button>
              <Button label="Delete" icon="pi pi-trash" className="p-button-danger p-mr-2" onClick={() => confirmDelete(selectedAdmParameter)}
                  disabled={!selectedAdmParameter || !listaAdmParameter || !listaAdmParameter.length}></Button>
              <Button label="Cancel" icon="pi pi-times" className="p-button-secondary p-mr-2" onClick={onCancel}></Button>    
          </React.Fragment>
        }
      ></Toolbar>
      
      <Tooltip target=".export-buttons>button" position="bottom" />
      
      <DataTable value={listaAdmParameter} selection={selectedAdmParameter} onSelectionChange={(e) => setSelectedAdmParameter(e.value)}
          selectionMode="single" rows={10} dataKey="id" paginator paginatorPosition="both" rowsPerPageOptions={[10,25,50,100,150,200]}
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" 
          header={
            <div className="p-d-flex export-buttons">
              <Button type="button" icon="pi pi-file-excel" onClick={exportExcel} className="p-button-success p-mr-2" data-pr-tooltip="XLS" />
              <Button type="button" icon="pi pi-file-pdf" onClick={exportPdf} className="p-button-warning p-mr-2" data-pr-tooltip="PDF" />
            </div>              
          }
          footer={
            <div className="p-d-flex p-ai-center p-jc-between">
                In total there are {listaAdmParameter ? listaAdmParameter.length : 0 } parameters.
            </div>
          }>

          <Column field="id" header="Id" sortable></Column>
          <Column field="admParameterCategory.description" header="Parameter Category" sortable></Column>
          <Column field="code" header="Parameter" sortable></Column>
          <Column field="value" header="Value" sortable></Column>
          <Column field="description" header="Description" sortable></Column>
      </DataTable>

      <Dialog visible={deleteDialog} style={{ width: '450px' }} header="Confirm" modal onHide={hideDeleteDialog}
        footer={
          <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={onDelete} />
          </React.Fragment>
        }>
          <div className="confirmation-content">
              <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
              {admParameter && <span>Are you sure you want to delete <b>{admParameter.description}</b>?</span>}
          </div>
      </Dialog>

    </div>
  );
}

export default AdmParameterComponent;
