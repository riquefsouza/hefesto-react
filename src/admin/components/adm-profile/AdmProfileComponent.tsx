import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import ReportPanelComponent from "../../../base/components/ReportPanel";
import { useHistory } from "react-router-dom";
import { ExportService } from "../../../base/services/ExportService";
import { StorageService } from "../../../base/services/StorageService";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Column } from 'primereact/column';
import { DataTable } from "primereact/datatable";
import { Tooltip } from 'primereact/tooltip';
import { Dialog } from "primereact/dialog";
import { AdmProfile, emptyAdmProfile } from "../../models/AdmProfile";
import AdmProfileService from "../../services/AdmProfileService";

function AdmProfileComponent() {

  const admProfileService = new AdmProfileService();
  const storageService = new StorageService();
  const exportService = new ExportService();

  const [listaAdmProfile, setListaAdmProfile] = useState<AdmProfile[]>([]);
  const [admProfile, setAdmProfile] = useState<AdmProfile>(emptyAdmProfile);
  const [selectedAdmProfile, setSelectedAdmProfile] = useState<AdmProfile>(emptyAdmProfile);
  const [, setSubmitted] = useState<boolean>(false);
  const toast = useRef<Toast>(new Toast({}));
  const [cols, setCols] = useState<any[]>([]);
  const [exportColumns, setExportColumns] = useState<any[]>([]);
  const history = useHistory();
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);

  useEffect(() => {
    admProfileService.findAllWithUsers().then(item => setListaAdmProfile(item));

    setCols([
      { field: 'id', header: 'Id' },
      { field: 'description', header: 'Description' },
      { field: 'profileUsers', header: 'User(s)' }
    ]);

    setExportColumns(cols.map(col => ({title: col.header, dataKey: col.field})));

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onExport = () => {
    toast.current.show({ severity: 'info', summary: 'Profile Exported', detail: 'Profiles Exported', life: 3000 });
  }

  const onCancel = () => {
    history.push('/');
  }

  const onInsert = () => {
    setAdmProfile(emptyAdmProfile);
    setSubmitted(false);

    // storageService.setStorage(admProfile);
    storageService.persistObj('admProfile', admProfile);
    history.push('/admProfileEdit');
  }

  const onEdit = (admProfile: AdmProfile) => {
    setAdmProfile({...admProfile});

    // storageService.setStorage(admProfile);
    storageService.persistObj('admProfile', admProfile);
    history.push('/admProfileEdit');
  }

  const confirmDelete = (admProfile: AdmProfile) => {
    setAdmProfile(admProfile);
    setDeleteDialog(true);
  }

  const hideDeleteDialog = () => {
    setDeleteDialog(false);
  }

  const onDelete = () => {
    let _listaAdmProfile = listaAdmProfile.filter(val => val.id !== admProfile.id);
    setListaAdmProfile(_listaAdmProfile);
    setDeleteDialog(false);
    setAdmProfile(emptyAdmProfile);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Profile Deleted', life: 3000 });
  }

  const exportPdf = () => {
    const head: string[] = [];
    const data: any[] = [];

    exportColumns.forEach(item => head.push(item.title));
    listaAdmProfile.forEach(item => data.push(
      [item.id, item.description, item.profileUsers]
    ));

    exportService.exportPdf(head, data, 'profiles.pdf');
  }

  const exportExcel = () => {
    exportService.exportExcel(listaAdmProfile, 'profiles');
  }

  return (
    <div>
      <Toast ref={toast} />

      <Panel header="Configuration Profile" className="p-mb-2">
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
              <Button label="Edit" icon="pi pi-pencil" className="p-button-warning p-mr-2" onClick={() => onEdit(selectedAdmProfile)}
                  disabled={!selectedAdmProfile || !listaAdmProfile || !listaAdmProfile.length}></Button>
              <Button label="Delete" icon="pi pi-trash" className="p-button-danger p-mr-2" onClick={() => confirmDelete(selectedAdmProfile)}
                  disabled={!selectedAdmProfile || !listaAdmProfile || !listaAdmProfile.length}></Button>
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
              {admProfile && <span>Are you sure you want to delete <b>{admProfile.description}</b>?</span>}
          </div>
      </Dialog>

      <Tooltip target=".export-buttons>button" position="bottom" />
      
      <DataTable value={listaAdmProfile} selection={selectedAdmProfile} onSelectionChange={(e) => setSelectedAdmProfile(e.value)}
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
                In total there are {listaAdmProfile ? listaAdmProfile.length : 0 } profiles.
            </div>
          }>

          <Column field="id" header="Id" sortable></Column>
          <Column field="description" header="Description" sortable></Column>
          <Column field="profileUsers" header="User(s)" sortable></Column>
          
      </DataTable>

    </div>
  );
}

export default AdmProfileComponent;
