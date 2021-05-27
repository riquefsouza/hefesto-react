import { ParamForm } from "./ParamForm";

export const emptyReportParamForm: ReportParamForm = {
    reportType: 'PDF',
    forceDownload: true,
    reportName: '',
    params: []
}

export interface ReportParamForm {
    reportType: string;
    forceDownload: boolean;
    reportName?: string;
    params?: ParamForm[];

}
