import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import ReportPanelComponent from "../../../base/components/ReportPanel";
import AdmUserService from "../../services/AdmUserService";
import { AdmUser, emptyAdmUser } from "../../models/AdmUser";
import { useHistory } from "react-router-dom";
import { ExportService } from "../../../base/services/ExportService";
import { StorageService } from "../../../base/services/StorageService";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Column } from 'primereact/column';
import { DataTable } from "primereact/datatable";
import { Tooltip } from 'primereact/tooltip';
import { Dialog } from "primereact/dialog";
import BarraMenu from "../../../base/components/BarraMenu";
import { ItypeReport, PDFReport } from "../../../base/services/ReportService";
import { ReportParamForm, emptyReportParamForm } from "../../../base/models/ReportParamsForm";


function AdmUserComponent() {

  const admUserService = new AdmUserService();
  const storageService = new StorageService();
  const exportService = new ExportService();

  const [listaAdmUser, setListaAdmUser] = useState<AdmUser[]>([]);
  const [admUser, setAdmUser] = useState<AdmUser>(emptyAdmUser);
  const [selectedAdmUser, setSelectedAdmUser] = useState<AdmUser>(emptyAdmUser);
  const [, setSubmitted] = useState<boolean>(false);
  const toast = useRef<Toast>(new Toast({}));
  const [cols, setCols] = useState<any[]>([]);
  const [exportColumns, setExportColumns] = useState<any[]>([]);
  const history = useHistory();
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);

  const [selectedTypeReport, setSelectedTypeReport] = useState<ItypeReport>(PDFReport);
  const [selectedForceDownload, setSelectedForceDownload] = useState(true);
  const [reportParamForm, setReportParamForm] = useState<ReportParamForm>(emptyReportParamForm);

  useEffect(() => {
    admUserService.findAll().then(item => setListaAdmUser(item));

    setCols([
      { field: 'id', header: 'Id' },
      { field: 'email', header: 'Email' },
      { field: 'login', header: 'Login' },
      { field: 'name', header: 'Name' },
      { field: 'userProfiles', header: 'User profile(s)' },
      { field: 'active', header: 'Active' }
    ]);

    setExportColumns(cols.map(col => ({title: col.header, dataKey: col.field})));

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onChangedTypeReport = (typeReport: ItypeReport) => {
    setSelectedTypeReport(typeReport);
    setReportParamForm({ reportType: typeReport.type, 
      forceDownload: selectedForceDownload });
  }

  const onChangedForceDownload = (forceDownload: boolean) => {
    setSelectedForceDownload(forceDownload);
    setReportParamForm({ reportType: selectedTypeReport.type, 
      forceDownload: forceDownload });
  }

  const onExport = () => {
    admUserService.report(reportParamForm).then(() => {
      toast.current.show({ severity: 'info', summary: 'User Exported', detail: 'User Exported', life: 3000 });
    });
  }

  const onCancel = () => {
    history.push('/home');
  }

  const onInsert = () => {
    setAdmUser(emptyAdmUser);
    setSubmitted(false);

    // storageService.setStorage(admUser);
    storageService.persistObj('admUser', admUser);
    history.push('/admin/admUserEdit');
  }

  const onEdit = (admUser: AdmUser) => {
    setAdmUser({...admUser});

    // storageService.setStorage(admUser);
    storageService.persistObj('admUser', admUser);
    history.push('/admin/admUserEdit');
  }

  const confirmDelete = (admUser: AdmUser) => {
    setAdmUser(admUser);
    setDeleteDialog(true);
  }

  const hideDeleteDialog = () => {
    setDeleteDialog(false);
  }

  const onDelete = () => {
    admUserService.delete(admUser.id).then(obj => {
      let _listaAdmUser = listaAdmUser.filter(val => val.id !== admUser.id);
      setListaAdmUser(_listaAdmUser);
      setDeleteDialog(false);
      setAdmUser(emptyAdmUser);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
    });  
  }

  const exportPdf = () => {
    const head: string[] = [];
    const data: any[] = [];

    exportColumns.forEach(item => head.push(item.title));
    listaAdmUser.forEach(item => data.push(
      [item.id, item.email, item.login, item.name, item.userProfiles, item.active]
    ));

    exportService.exportPdf(head, data, 'users.pdf');
  }

  const exportExcel = () => {
    exportService.exportExcel(listaAdmUser, 'users');
  }

  return (
    <div>
      <BarraMenu></BarraMenu>
      <Toast ref={toast} />

      <Panel header="Configuration User" className="p-mb-2">
        <ReportPanelComponent typeReportChange={e => onChangedTypeReport(e.value)}
              forceDownloadChange={e => onChangedForceDownload(e.checked)}></ReportPanelComponent>
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
              <Button label="Edit" icon="pi pi-pencil" className="p-button-warning p-mr-2" onClick={() => onEdit(selectedAdmUser)}
                  disabled={!selectedAdmUser || !listaAdmUser || !listaAdmUser.length}></Button>
              <Button label="Delete" icon="pi pi-trash" className="p-button-danger p-mr-2" onClick={() => confirmDelete(selectedAdmUser)}
                  disabled={!selectedAdmUser || !listaAdmUser || !listaAdmUser.length}></Button>
              <Button label="Cancel" icon="pi pi-times" className="p-button-secondary p-mr-2" onClick={onCancel}></Button>    
          </React.Fragment>
        }
      ></Toolbar>
      
      <Dialog visible={deleteDialog} style={{ width: '450px' }} header="Confirm" modal onHide={hideDeleteDialog}
        footer={
          <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={onDelete} />
          </React.Fragment>
        }>
          <div className="confirmation-content">
              <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
              {admUser && <span>Are you sure you want to delete <b>{admUser.name}</b>?</span>}
          </div>
      </Dialog>

      <Tooltip target=".export-buttons>button" position="bottom" />
      
      <DataTable value={listaAdmUser} selection={selectedAdmUser} onSelectionChange={(e) => setSelectedAdmUser(e.value)}
          selectionMode="single" rows={10} dataKey="id" paginator paginatorPosition="both" rowsPerPageOptions={[10,25,50,100,150,200]}
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" 
          paginatorLeft={<Button type="button" icon="pi pi-refresh" className="p-button-text" />} 
          paginatorRight={<Button type="button" icon="pi pi-cloud" className="p-button-text" />}
          header={
            <div className="p-d-flex export-buttons">
              <Button type="button" icon="pi pi-file-excel" onClick={exportExcel} className="p-button-success p-mr-2" data-pr-tooltip="XLS" />
              <Button type="button" icon="pi pi-file-pdf" onClick={exportPdf} className="p-button-warning p-mr-2" data-pr-tooltip="PDF" />
            </div>              
          }
          footer={
            <div className="p-d-flex p-ai-center p-jc-between">
                In total there are {listaAdmUser ? listaAdmUser.length : 0 } users.
            </div>
          }>

          <Column field="id" header="Id" sortable style={{width: '120px'}}></Column>
          <Column field="email" header="Email" sortable></Column>
          <Column field="login" header="Login" sortable></Column>
          <Column field="name" header="Name" sortable></Column>
          <Column field="userProfiles" header="User profile(s)" sortable></Column>
          <Column field="active" header="active" sortable></Column>

      </DataTable>

    </div>
  );
}

export default AdmUserComponent;
