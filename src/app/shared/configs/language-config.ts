import { IFormStructure } from "@shared/models/form";
import { RowData } from "@shared/models/table";

export const LanguageDetailsData: RowData = {
    "headers": [{ label: "Sr.No", key: "SR.NO", type: 'autoIncrementNumber', size: '4%' },
    { label: "Language Name", key: "languageName", type: '' },
    { label: "Language Code", key: "languageCode", type: '' },
    { label: "Action", key: "action", type: 'action', size: '8%', buttonNames: ['edit', 'view', 'delete'] }],
    "data": [],
    "dataKey": 'language_id',
    "buttonname": 'Create Language',
    "button": true,
    "statuses": [
        { label: 'false', value: 'danger' },
        { label: 'true', value: 'success' },
    ],
    "filterfields": ['languageName'],
    "isSearch": false
}

export const LanguageTypeSearchGroup: IFormStructure[] = [
    {
        name: "language_id",
        placeholder: "Language Id",
        label: "Language Id",
        type: "text",
        value: "",
        hiddenControl: true,
        disable: false,
    },
    {
        name: "language_name",
        label: "Language Name",
        placeholder: "Enter Language name",
        type: "text",
        value: "",
        required: true,
        isUpperCase: true,
        disable: false,
    },
    {
        name: "language_code",
        label: "Language Code",
        placeholder: "Enter Language code",
        type: "text",
        value: "",
        required: true,
        disable: false,
    }
]