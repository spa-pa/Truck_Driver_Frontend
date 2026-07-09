import { IFormStructure } from "@shared/models/form";
import { RowData } from "@shared/models/table";

export const DriverTrainingDetailsData: RowData = {
    "headers": [{ label: "Sr.No", key: "SR.NO", type: 'autoIncrementNumber', size: '4%' },
    { label: "Full Name", key: "full_name", type: '' },
    { label: "Mobile Number", key: "mobile_number", type: '' },
    { label: "License Number", key: "driving_license_number", type: '' },
    { label: "License Expiry", key: "driving_license_expiry_date", type: 'date' },
    { label: "Certification Expiry", key: "expiry_date", type: 'date' },
    { label: "Terminal", key: "terminal_name", type: '' },
    { label: "Created At", key: "created_at", type: 'date&time' },
    { label: "Action", key: "action", type: 'action', size: '8%', buttonNames: ['view', 'edit'] }],
    "data": [],
    "dataKey": 'certification_id',
    "buttonname": 'Create Certification',
    "button": false,
    "exportExcel": true,
    "excelKeys": {
        "SR.NO": "Sr.No",
        "full_name": "Driver Name",
        "mobile_number": "Mobile Number",
        "driving_license_expiry_date": "License Expiry Date",
        "terminal_name" : "Terminal",
        "expiry_date": "Certification Expiry Date",
        "created_at": "Training Date",
    },
    "statuses": [
        { label: 'false', value: 'danger' },
        { label: 'true', value: 'success' },
    ],
    "filterfields": ['driving_license_number'],
    "isSearch": false
}

export const DriverTrainingTypeSearchGroup: IFormStructure[] = [
    {
        name: "certification_id",
        placeholder: "Country Id",
        label: "Country  Id",
        type: "text",
        value: "",
        hiddenControl: true,
        disable: false,
    },
    {
        name: "driver_certification_id",
        placeholder: "Driver Id",
        label: "Driver Id",
        type: "text",
        value: "",
        hiddenControl: true,
        disable: false,
    },

    {
        name: "driving_license_expiry_date",
        label: "Driving License Expiry",
        placeholder: "Enter Driving License",
        type: "date",
        value: "",
        required: true,
        disable: false,
    }
]