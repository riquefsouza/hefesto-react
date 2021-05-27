import React from "react";
import { PDFReport, ReportService } from "../services/ReportService";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from 'primereact/checkbox';
import { MyEventType, MyCheckboxEventType } from "../../base/models/MyEventType";

interface ReportPanelProps {
  typeReportChange?(e: MyEventType): void,
  forceDownloadChange?(e: MyCheckboxEventType): void
}

class ReportPanelComponent extends React.Component<ReportPanelProps,any> {

  private reportService: ReportService;

  constructor(props: ReportPanelProps) {
    super(props);
    this.reportService = new ReportService();

    this.state = {
      typeReport: this.reportService.getTypeReport(),
      selectedTypeReport: PDFReport,
      selectedForceDownload: true
    }
  }

  private typeReportChange(e: MyEventType): void {
    this.setState({ selectedTypeReport: e.value });

    if (this.props.typeReportChange) {
      this.props.typeReportChange(e);
    }
  }

  private forceDownloadChange(e: MyCheckboxEventType): void {
    this.setState({ selectedForceDownload: e.checked });

    if (this.props.forceDownloadChange) {
      this.props.forceDownloadChange(e);
    }
  }

  /*
  const reportService = new ReportService();

  const [typeReport, setTypeReport] = useState<SelectItemGroup[]>();
  const [selectedTypeReport, setSelectedTypeReport] = useState<ItypeReport>();
  const [selectedForceDownload, setSelectedForceDownload] = useState(true);

  useEffect(() => {
    setTypeReport(reportService.getTypeReport());
    setSelectedTypeReport(PDFReport);
    setSelectedForceDownload(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fireTypeReportChange = (e: MyEventType)=>{
    typeReportChange = (e) => {
      setSelectedTypeReport(e.value);
    }
  }
  */
  
  render() {
    return (
      <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col-12 p-md-4">
              <label htmlFor="cmbTypeReport">Choose the type of report:</label>
              <Dropdown value={this.state.selectedTypeReport} options={this.state.typeReport} 
                  onChange={e => this.typeReportChange(e)} 
                  optionLabel="label" optionGroupLabel="label" optionGroupChildren="items" />
          </div>
          <div className="p-field p-col-12 p-md-4">
              <label htmlFor="forceDownload" style={{margin: '4px'}}>Force Download:</label>
              <Checkbox id="forceDownload" onChange={e => this.forceDownloadChange(e)} 
                  checked={this.state.selectedForceDownload}></Checkbox>
          </div>
      </div>
    );
  }
}

export default ReportPanelComponent;
