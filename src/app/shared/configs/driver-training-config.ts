import { IFormStructure } from "@shared/models/form";
import { RowData } from "@shared/models/table";

export const DriverTrainingDetailsData: RowData = {
    "headers": [{ label: "Sr.No", key: "SR.NO", type: 'autoIncrementNumber', size: '4%' },
    { label: "Full Name", key: "full_name", type: '' },
    { label: "Mobile Number", key: "mobile_number", type: '' },
    { label: "License Number", key: "driving_license_number", type: '' },
    { label: "License Expiry", key: "driving_license_expiry_date", type: 'date' },
    { label: "Certification Expiry", key: "expiry_date", type: 'date' },
    { label: "Created At", key: "created_at", type: 'date&time' },
    { label: "Action", key: "action", type: 'action', size: '8%', buttonNames: ['view'] }],
    "data": [],
    "dataKey": 'certification_id',
    "buttonname": 'Create Certification',
    "button": false,
    "statuses": [
        { label: 'false', value: 'danger' },
        { label: 'true', value: 'success' },
    ],
    "filterfields": ['countryName'],
    "isSearch": false
}

export const DriverTrainingTypeSearchGroup: IFormStructure[] = [
    {
        name: "country_id",
        placeholder: "Country Id",
        label: "Country  Id",
        type: "text",
        value: "",
        hiddenControl: true,
        disable: false,
    },
    {
        name: "country_name",
        label: "Country Name",
        placeholder: "Enter name",
        type: "text",
        value: "",
        required: true,
        isUpperCase: true,
        disable: false,
    },
    {
        name: "country_code",
        label: "Country Code",
        placeholder: "Enter country code",
        type: "text",
        value: "",
        required: true,
        disable: false,
    }
]