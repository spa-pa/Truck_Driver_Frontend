import { IFormStructure } from "@shared/models/form";
import { RowData } from "@shared/models/table";

export const DriverEntriesDetailsData: RowData = {
    "headers": [{ label: "Sr.No", key: "SR.NO", type: 'autoIncrementNumber', size: '4%' },
    { label: "Full Name", key: "full_name", type: '' },
    { label: "Mobile Number", key: "mobile_number", type: '' },
    { label: "License Number", key: "driving_license_number", type: '' },
    { label: "License Expiry", key: "driving_license_expiry_date", type: 'date' },
    { label: "Certification Expiry", key: "certification_expiry_date", type: 'date' },
    { label: "Terminal", key: "terminal_name", type: '' },
    { label: "Gate In", key: "created_at", type: 'date&time' },

    { label: "Action", key: "action", type: 'action', size: '8%', buttonNames: ['view'] }],
    "data": [],
    "dataKey": 'certification_id',
    "buttonname": 'Create Certification',
    "button": false,
    "statuses": [
        { label: 'false', value: 'danger' },
        { label: 'true', value: 'success' },
    ],
    "filterfields": ['mobile_number,driving_license_number'],
    "isSearch": false
}