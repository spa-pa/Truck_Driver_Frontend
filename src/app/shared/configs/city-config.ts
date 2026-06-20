import { IFormStructure } from "@shared/models/form";
import { RowData } from "@shared/models/table";

export const CityDetailsData: RowData = {
    "headers": [{ label: "Sr.No", key: "SR.NO", type: 'autoIncrementNumber', size: '4%' },
    { label: "City  Name", key: "city_name", type: '' },
    // { label: "State", key: "stateName", type: '' },
    // { label: "Country", key: "countryName", type: '' },
    { label: "Action", key: "action", type: 'action', size: '8%', buttonNames: ['edit', 'view', 'delete'] }],
    "data": [],
    "dataKey": 'city_id',
    "buttonname": 'Create city ',
    "button": true,
    "statuses": [
        { label: 'false', value: 'danger' },
        { label: 'true', value: 'success' },
    ],
    "filterfields": ['cityName'],
    "isSearch": false
}

export const CityTypeSearchGroup: IFormStructure[] = [
    {
        name: "city_id",
        placeholder: "city Id",
        label: "City Id",
        type: "text",
        value: "",
        hiddenControl: true,
        disable: false
    },
    {
        name: "city_name",
        label: "City Name",
        placeholder: "Enter city",
        type: "text",
        value: "",
        required: true,
        disable: false,
        isUpperCase: true
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