import React, { useEffect, useState } from "react";
import { ItypeReport, PDFReport, ReportService, SelectItemGroup } from "../services/ReportService";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from 'primereact/checkbox';

function ReportPanelComponent() {
  const reportService = new ReportService();

  const [typeReport, setTypeReport] = useState<SelectItemGroup[]>();
  const [selectedTypeReport, setSelectedTypeReport] = useState<ItypeReport>();
  const [forceDownload, setForceDownload] = useState(false);

  useEffect(() => {
    setTypeReport(reportService.getTypeReport());
    setSelectedTypeReport(PDFReport);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="p-fluid p-formgrid p-grid">
        <div className="p-field p-col-12 p-md-4">
            <label htmlFor="cmbTypeReport">Choose the type of report:</label>
            <Dropdown value={selectedTypeReport} options={typeReport} 
                onChange={e => setSelectedTypeReport(e.value)} 
                optionLabel="label" optionGroupLabel="label" optionGroupChildren="items" />
        </div>
        <div className="p-field p-col-12 p-md-4">
            <label htmlFor="forceDownload" style={{margin: '4px'}}>Force Download:</label>
            <Checkbox id="forceDownload" onChange={e => setForceDownload(e.checked)} checked={forceDownload}></Checkbox>
        </div>
    </div>
  );

}

export default ReportPanelComponent;
