import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
export interface IFormStructure {
    name: any;
    placeholder: string;
    type: string;
    label: string;
    value: any;
    disable: boolean;
    hiddenControl?: boolean;
    minLength?: number;
    maxLength?: number;
    required?: boolean;
    colsize?: string;
    bindValue?: string;
    bindLabel?: string;
    listData?: any;
    listName?: string;
    options?: { value: string; label: string }[];
    isReversed?:boolean;
    contractId?:number;
    tariff?:number;
    qty?:number;
    charges?:number;
    bindMultiple?:boolean;
    description?:any;
    file?: any;
    upload_page_1_file_name?: any;
    upload_page_1?:any;
    // File upload
    formConfigUpload?:IUploadStructure[];
    isFolderUpload?:boolean;
    checkNumberValidation?:any;
    validationFor?:string;
    isUpperCase?:boolean;
    requireBase64?:boolean
    //Date
    minDate?:string;
    maxDate?:string;
    isEditButtonAdd?:boolean;
    isAddButtonAdd?:boolean;
    buttonAddons?:boolean;
    buttonAddonsData?:any;
    rows?:any;
    secondaryDisabled?:boolean;
    minTime?:string;
    maxTime?:string;
}

export interface IUploadStructure {
    name?: string;
    disable?: boolean;
    required?: boolean;
    text?: string;
    dropzoneConfig?: DropzoneConfigInterface;
    downloadPredefinedXlsxData?: any;
    file?: any;
    type?: any;
    upload_page_1_file_name?: string | null;
    upload_page_1?: string | null;
    upload_page_1_file?:any | null;
    upload_page_2_file_name?: string | null;
    upload_page_2?: string | null;
    upload_page_2_file?:any | null;
    agent_kyc_id?:any;
    kyc_type_id?: any,
    kyc_type_name?: any,
    document_no?:any,
    name_as_per_document?:any
    uploadFields?:any
    formFields?:any
    file1?: any;
    file2?: any;
}
