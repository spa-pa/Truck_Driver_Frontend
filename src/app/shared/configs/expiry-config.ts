import { IFormStructure } from "@shared/models/form";
import { RowData } from "@shared/models/table";

export const ExpiryConfigDetailsData: RowData = {
    "headers": [{ label: "Sr.No", key: "SR.NO", type: 'autoIncrementNumber', size: '4%' },
    { label: "Expiry Month", key: "expiry_month", type: '' },
    // { label: "State", key: "stateName", type: '' },
    // { label: "Country", key: "countryName", type: '' },
    { label: "Action", key: "action", type: 'action', size: '10%', buttonNames: ['edit', 'view', 'delete'] }],
    "data": [],
    "dataKey": 'config_id',
    "buttonname": 'Create config ',
    "button": false,
    "statuses": [
        { label: 'false', value: 'danger' },
        { label: 'true', value: 'success' },
    ],
    "filterfields": ['expiry_month'],
    "isSearch": false
}

export const ExpiryConfigSearchGroup: IFormStructure[] = [
    {
        name: "config_id",
        placeholder: "Config Id",
        label: "Config Id",
        type: "text",
        value: "",
        hiddenControl: true,
        disable: false
    },
    {
        name: "expiry_month",
        label: "Expiry Month",
        placeholder: "Expiry Month",
        type: "number",
        value: "",
        required: true,
        disable: false,
    },
    // {
    //     name: "stateId",
    //     label: "State",
    //     placeholder: "Enter State",
    //     type: "select",
    //     value: "",
    //     required: false,
    //     disable: false,
    //     bindValue: 'stateId',
    //     bindLabel: 'stateName',
    //     listName: 'state',
    //     listData: []
    // },
    // {
    //     name: "countryi_Id",
    //     label: "Country",
    //     placeholder: "Enter Country",
    //     type: "select",
    //     value: "",
    //     required: true,
    //     disable: false,
    //     bindValue: 'countryi_Id',
    //     bindLabel: 'countryName',
    //     listName: 'country',
    //     listData: []

    // }
]