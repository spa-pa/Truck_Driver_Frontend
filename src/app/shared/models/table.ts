export interface Header {
    label: string;
    key: string;
    type?: string;
    url?: string
    size?: string;
    truncateString?: boolean;
    buttonNames?: any;
    buttonMenuNames?:any;
    isbuttonMenu?: boolean;
    buttonMenu?: any;
    bindTagName?:any;
    firstkey?: string;
    secondKey?: string;
    minSize?:string;
}

export interface RowData {
    headers: Header[];
    data: any;
    statuses: any;
    dataKey: string;
    buttonname?: string;
    button?: boolean;
    secondbuttonname?: string;
    secondbutton?: boolean;
    thirdbuttonname?:string;
    thirdbutton?:boolean;
    filterfields?: any;
    isSearch?: boolean;
    exportExcel?: boolean;
    excelKeys?: any;
    isSearchIndividual?:boolean;
    operationId?:string;
    scrollable?:boolean;
    minSize?:string;
    bgset?:boolean;
    bgsetKey?:string;
    buttonActionList?:any;
    isWarningRowKey?:any;
    buttonAction?:boolean;
}