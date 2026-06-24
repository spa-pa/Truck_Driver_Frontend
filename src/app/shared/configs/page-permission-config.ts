import { IFormStructure } from "@shared/models/form";
import { RowData } from "@shared/models/table";

export const PagePermissionDetailsData: RowData = {
    "headers": [
        { label: "", key: "SR.NO", type: 'autoIncrementNumber', size: '4%' },
        { label: "Page Name", key: "page_name", type: 'text' },
        { label: "Permission", key: "Permission", type: 'text' },
        { label: "Action", key: "action", type: 'action', size: '8%', buttonNames: ['edit', 'view', 'delete'] }
    ],
    "data": [
        // { "SR.NO": 1, "role": "Admin", "permission": "Add, Edit, Delete, View, Download, Upload, Approval, Excel" },
        // { "SR.NO": 2, "role": "User", "permission": "View, Download" }
    ],
    "dataKey": 'pagePermissionId',
    "buttonname": 'Create Permission',
    "button": true,
    "statuses": [
        { label: 'inactive', value: 'danger' },
        { label: 'active', value: 'success' }
    ],
    "filterfields": ['page_id', 'pagePermissionId', 'page_name'],
    "isSearch": false
}

export const PagePermissionSearchGroup: IFormStructure[] = [
    {
        name: "page_permission_id",
        label: "Pages",
        placeholder: "Enter service type",
        type: "text",
        value: "",
        required: false,
        hiddenControl: true,
        disable: false,
    },
    {
        name: "page_id",
        label: "Pages",
        placeholder: "Enter service type",
        type: "select",
        value: "",
        required: true,
        disable: false,
        bindMultiple: false,
        bindValue: 'page_id',
        bindLabel: 'page_name',
        listName: 'page-id',
        listData: []
    },
    {
        name: "permission_id",
        label: "Permission",
        placeholder: "Enter permission",
        type: "select",
        value: "",
        required: true,
        disable: false,
        bindMultiple: true,
        bindValue: 'permission_id',
        bindLabel: 'permission_name',
        listName: 'permission-id',
        listData: [],
    },
    {
        name: "description",
        label: "Description",
        placeholder: "Description",
        type: "text",
        value: "",
        required: false,
        disable: false,
    }

]
