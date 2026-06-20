import { IFormStructure } from "@shared/models/form";
import { RowData } from "@shared/models/table";

export const StateDetailsData: RowData = {
    "headers": [{ label: "Sr.No", key: "SR.NO", type: 'autoIncrementNumber', size: '4%' },
    { label: "State Name", key: "state_name", type: '' },
    { label: "State Code", key: "state_code", type: '' },
    { label: "Country", key: "country_name", type: '' }, 
    { label: "Country Code", key: "country_code", type: '' },
    { label: "Action", key: "action", type: 'action', size: '8%', buttonNames: ['edit', 'view', 'delete'] }],
    "data": [],
    "dataKey": 'state_id',
    "buttonname": 'Create state',
    "button": true,
    "statuses": [
        { label: 'false', value: 'danger' },
        { label: 'true', value: 'success' },
    ],
    "filterfields": ['stateName'],
    "isSearch": false
}

export const StateTypeSearchGroup: IFormStructure[] = [
    {
        name: "state_id",
        placeholder: "state Type Id",
        label: "State Type Id",
        type: "text",
        value: "",
        hiddenControl: true,
        disable: false
    },
    {
        name: "country_id",
        placeholder: "Country",
        label: "Country",
        type: "select",
        value: "",
        bindValue: 'countryId',
        bindLabel: 'countryName',
        listName: 'country',
        required: true,
        disable: false,
    },
    {
        name: "state_name",
        label: "State Name",
        placeholder: "Enter state name",
        type: "text",
        value: "",
        required: true,
        disable: false,
        isUpperCase: true
    },
    {
        name: "state_code",
        label: "State Type Code",
        placeholder: "Enter state type code",
        type: "text",
        value: "",
        required: true,
        disable: false,
    }
]