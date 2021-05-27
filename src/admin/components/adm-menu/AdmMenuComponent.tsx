import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { Tree } from 'primereact/tree';
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { MyEventType } from "../../../base/models/MyEventType";
import { AdmMenu, emptyAdmMenu } from "../../models/AdmMenu";
import { AdmPage } from "../../models/AdmPage";
import { useHistory } from "react-router-dom";
import TreeNode from "primereact/components/treenode/TreeNode";
import AdmMenuService from "../../services/AdmMenuService";
import AdmPageService from "../../services/AdmPageService";
import { emptyTreeNode, NodeOnSelectEventType } from "../../../base/models/NodeOnSelectEventType";
import BarraMenu from "../../../base/components/BarraMenu";
import ReportPanelComponent from "../../../base/components/ReportPanel";
import { ItypeReport, PDFReport } from "../../../base/services/ReportService";
import { ReportParamForm, emptyReportParamForm } from "../../../base/models/ReportParamsForm";


function AdmMenuComponent() {

  const admMenuService = new AdmMenuService();
  const admPageService = new AdmPageService();

  const [admMenuDialog, setAdmMenuDialog] = useState<boolean>(false);
  const [listaAdmMenu, setListaAdmMenu] = useState<AdmMenu[]>([]);
  const [admMenu, setAdmMenu] = useState<AdmMenu>(emptyAdmMenu);
  const [selectedAdmMenu, setSelectedAdmMenu] = useState<AdmMenu>(emptyAdmMenu);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [cols, setCols] = useState<any[]>([]);
  const [, setExportColumns] = useState<any[]>([]);
  const [listaNodeMenu, setListaNodeMenu] = useState<TreeNode[]>([]);
  const [selectedNodeMenu, setSelectedNodeMenu] = useState<TreeNode>(emptyTreeNode);
  const [listaAdmPage, setListaAdmPage] = useState<AdmPage[]>([]);
  const [listaAdmMenuParent, setListaAdmMenuParent] = useState<AdmMenu[]>([]);  
  const toast = useRef<Toast>(new Toast({}));
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const history = useHistory();
  
  const [selectedTypeReport, setSelectedTypeReport] = useState<ItypeReport>(PDFReport);
  const [selectedForceDownload, setSelectedForceDownload] = useState(true);
  const [reportParamForm, setReportParamForm] = useState<ReportParamForm>(emptyReportParamForm);

  useEffect(() => {
    admPageService.findAll().then(item => setListaAdmPage(item));

    admMenuService
      .findAll()
      .then(lista => {
        setListaAdmMenu(lista);

        setListaAdmMenuParent(lista.filter(menu => menu.idMenuParent == null));

        updateMenusTree(lista);
      });

    setCols([
      { field: 'id', header: 'Id' },
      { field: 'description', header: 'Description' }
    ]);

    setExportColumns(cols.map(col => ({title: col.header, dataKey: col.field})));

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateMenusTree = (listaMenu: AdmMenu[]): void => {
    const _listaNodeMenu: TreeNode[] = [];
    let _listaAdmMenuParent: AdmMenu[] = [];
    const menuRoot: TreeNode = {
      'label': 'System Menu',
      'data': '0',
      'children': []
    };

    _listaAdmMenuParent = listaMenu.filter(menu => menu.idMenuParent == null);    

    _listaAdmMenuParent.forEach((itemMenu: AdmMenu) => {
      const m: TreeNode = {
        'label': itemMenu.description,
        'data': itemMenu,
        'children': mountSubMenu(listaMenu, itemMenu)
      };
      menuRoot.children.push(m);
    });

    _listaNodeMenu.push(menuRoot);

    setListaNodeMenu(_listaNodeMenu);
  }

  const isSubMenu = (menu: AdmMenu): boolean => {
    return menu.idPage === null;
  }

  const getAdmSubMenus = (listaMenu: AdmMenu[], menuPai: AdmMenu): AdmMenu[] => {
    return listaMenu.filter(menu => menu.idMenuParent === menuPai.id);
  }

  const mountSubMenu = (listaMenu: AdmMenu[], menu: AdmMenu): TreeNode[] => {
    let lstSubMenu: TreeNode[] = [];

    getAdmSubMenus(listaMenu, menu).forEach((subMenu: AdmMenu) => {
      
      if (isSubMenu(subMenu)) {
        /*
        const m: TreeNode = {
          'label': subMenu.description,
          'data': subMenu,
          'children': mountSubMenu(listaMenu, subMenu)
        };
        */
      } else {
        let m: TreeNode = {
          'label': subMenu.description,
          'data': subMenu,
          'children': []
        };
        lstSubMenu.push(m);
      }

    });

    return lstSubMenu;
  }

  const onNodeSelect = (node: NodeOnSelectEventType) => {
    let _menu: AdmMenu = node.node.data as AdmMenu;
    setSelectedAdmMenu(_menu);
  }

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
    admMenuService.report(reportParamForm).then(() => {
      toast.current.show({ severity: 'info', summary: 'Menu Exported', detail: 'Menu Exported', life: 3000 });
    });
  }

  const onCancel = () => {
    history.push('/');
  }

  const onInsert = () => {
    setAdmMenu(emptyAdmMenu);
    setSubmitted(false);
    setAdmMenuDialog(true);
  }

  const onEdit = (admMenu: AdmMenu) => {
    setAdmMenu({...admMenu});
    setAdmMenuDialog(true);
  }

  const confirmDelete = (admMenu: AdmMenu) => {
    setAdmMenu(admMenu);
    setDeleteDialog(true);
  }

  const hideDialog = () => {
    setAdmMenuDialog(false);
    setSubmitted(false);
  }

  const hideDeleteDialog = () => {
    setDeleteDialog(false);
  }

  const onDelete = () => {
    admMenuService.delete(admMenu.id).then(obj => {
      let _listaAdmMenu = listaAdmMenu.filter(val => val.id !== admMenu.id);
      setListaAdmMenu(_listaAdmMenu);
      setDeleteDialog(false);
      setAdmMenu(emptyAdmMenu);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Menu Deleted', life: 3000 });
    });
  }

  const onSave = () => {
    setSubmitted(true);
  }

  const onAdmPageChange = (e: MyEventType) => {
    const val: AdmPage = e.value as AdmPage;
    let _admMenu = {...admMenu};
    _admMenu.admPage = val;

    setAdmMenu(_admMenu);
  }

  const onDescriptionChange = (e: React.FormEvent<HTMLInputElement>) => {
    const val: string = (e.currentTarget && e.currentTarget.value) || '';
    let _admMenu = {...admMenu};
    _admMenu.description = val;

    setAdmMenu(_admMenu);
  }

  const onAdmMenuParentChange = (e: MyEventType) => {
    const val: AdmMenu = e.value as AdmMenu;
    let _admMenu = {...admMenu};
    _admMenu.admMenuParent = val;

    setAdmMenu(_admMenu);

    console.log(_admMenu.admMenuParent);
  }

  const onOrderChange = (e: MyEventType) => {
    const val: number = Number(e.value) || 0;
    let _admMenu = {...admMenu};
    _admMenu.order = val;

    setAdmMenu(_admMenu);
  }

  return (
    <div>
      <BarraMenu></BarraMenu>
      <Toast ref={toast} />

      <Panel header="Menu" className="p-mb-2">
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
              <Button label="Edit" icon="pi pi-pencil" className="p-button-warning p-mr-2" onClick={() => onEdit(selectedAdmMenu)}
                  disabled={!selectedAdmMenu || !listaAdmMenu || !listaAdmMenu.length}></Button>
              <Button label="Delete" icon="pi pi-trash" className="p-button-danger p-mr-2" onClick={() => confirmDelete(selectedAdmMenu)}
                  disabled={!selectedAdmMenu || !listaAdmMenu || !listaAdmMenu.length}></Button>
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
              {admMenu && <span>Are you sure you want to delete <b>{admMenu.description}</b>?</span>}
          </div>
      </Dialog>

      <Tree value={listaNodeMenu} selectionMode="single" selectionKeys={selectedNodeMenu} 
        onSelectionChange={e => setSelectedNodeMenu(e.value)} onSelect={node => onNodeSelect(node)} />

      <Dialog header="Menu Details" visible={admMenuDialog} style={{width: '450px'}} modal={true} 
        onHide={hideDialog} className="p-fluid"
        footer={
          <div>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={onSave} />
          </div>
        }>

        <div className="p-field">
            <label htmlFor="cmbAdmPage">Page:</label>
            <Dropdown id="cmbAdmPage" value={admMenu.admPage} options={listaAdmPage}
                onChange={e => onAdmPageChange(e)} optionLabel="description" />
        </div>
        <div className="p-field">
            <label htmlFor="description">Menu name:</label>
            <InputText id="description" value={admMenu.description} onChange={(e) => onDescriptionChange(e)} required />
            {submitted && !admMenu.description && <small className="p-error">Description is required.</small>}
        </div>
        <div className="p-field">
            <label htmlFor="admMenuParent">Parent menu:</label>
            <Dropdown id="admMenuParent" value={admMenu.admMenuParent} options={listaAdmMenuParent}
                onChange={e => onAdmMenuParentChange(e)} optionLabel="description" />
        </div>
        <div className="p-field">
            <label htmlFor="order">Order</label>
            <InputNumber id="order" value={admMenu.order} onValueChange={(e) => onOrderChange(e)} required />
            {submitted && !admMenu.order && <small className="p-error">Order is required.</small>}
        </div>

      </Dialog>


    </div>
  );
}

export default AdmMenuComponent;
