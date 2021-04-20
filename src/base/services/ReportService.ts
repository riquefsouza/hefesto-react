export interface ItypeReport {
  type: string;
  typeContent: string;
  description: string;
}

export interface SelectItemGroup {
  label: string;
  value?: ItypeReport;
  items?: SelectItemGroup[];
}

export const PDFReport = { type: 'PDF', typeContent: 'application/pdf', description: 'Portable Document Format (.pdf)' };

export class ReportService {

  private typeReport: SelectItemGroup[];

  constructor() {

    this.typeReport = [
      {
        label: 'Documents',
        items: [
          {
            label: 'Portable Document Format (.pdf)',
            value: PDFReport
          },
          {
            label: 'Microsoft Word XML (.docx)',
            value: {
              type: 'DOCX',
              typeContent: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              description: 'Microsoft Word XML (.docx)'
            }
          },
          {
            label: 'Rich Text Format (.rtf)',
            value: { type: 'RTF', typeContent: 'application/rtf', description: 'Rich Text Format (.rtf)' }
          },
          {
            label: 'OpenDocument Text (.odt)',
            value: {
              type: 'ODT', typeContent: 'application/vnd.oasis.opendocument.text',
              description: 'OpenDocument Text (.odt)'
            }
          }
        ]
      },
      {
        label: 'Spreadsheets',
        items: [
          {
            label: 'Microsoft Excel XML (.xlsx)',
            value: {
              type: 'XLSX', typeContent: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              description: 'Microsoft Excel XML (.xlsx)'
            }
          },
          {
            label: 'OpenDocument Spreadsheet (.ods)',
            value: {
              type: 'ODS', typeContent: 'application/vnd.oasis.opendocument.spreadsheet',
              description: 'OpenDocument Spreadsheet (.ods)'
            }
          }
        ]
      },
      {
        label: 'Pure Text',
        items: [
          {
            label: 'Comma Separated Values (.csv)',
            value: {
              type: 'CSV', typeContent: 'text/plain',
              description: 'Comma Separated Values (.csv)'
            }
          },
          {
            label: 'Text Only (.txt)',
            value: {
              type: 'TXT', typeContent: 'text/plain',
              description: 'Text Only (.txt)'
            }
          }
        ]
      },
      {
        label: 'Others',
        items: [
          {
            label: 'Microsoft Powerpoint XML (.pptx)',
            value: {
              type: 'PPTX',
              typeContent: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
              description: 'Microsoft Powerpoint XML (.pptx)'
            }
          },
          {
            label: 'Hypertext Markup Language (.html)',
            value: {
              type: 'HTML',
              typeContent: 'application/zip',
              description: 'Hypertext Markup Language (.html)'
            }
          }
        ]
      }
    ];

  }

  public getTypeReport(): SelectItemGroup[] {
    return this.typeReport;
  }
}