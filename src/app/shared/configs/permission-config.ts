import { IFormStructure } from "@shared/models/form";
import { RowData } from "@shared/models/table";


export const PermissionDetails: RowData = {
    "headers": [
        { label: "SR.NO", key: "SR.NO", type: 'autoIncrementNumber', size: '1rem' },
        // { label: "ID", key: "permission_id", type: '',size: '2rem' }, 
        { label: "Permission", key: "permission", type: '' },
        // { label: "Action", type: "button", key: "delete", size: '4rem' },
        { label: "Action", key: "action", type: 'action', size: '8%', buttonNames: ['edit', 'view', 'delete'] }
    ],
    "data": [],
    "dataKey": 'permissionId',
    "buttonname": 'Create Role Permission',
    "button": true,
    "statuses": [
        { label: 'false', value: 'danger' },
        { label: 'true', value: 'success' },
    ],
    "filterfields": ['permissionId', 'permissionId'],
    "isSearch": true
}

export const RolePermissionDetails: RowData = {
    "headers": [
        { label: "SR.NO", key: "SR.NO", type: 'autoIncrementNumber', size: '1rem' },
        // { label: "ID", key: "role_page_permission_id", type: 'link', url: "/permission/role-permission/", size: '2rem' }, 
        { label: "Role Name", key: "roleName", type: '' },
        { label: "Page Name", key: "pageName", type: '', size: '13rem', truncateString: false },
        { label: "Role", key: "permission", type: '', size: '13rem', truncateString: false },
        // { label: "Action", type: "button", key: "delete" }
        { label: "Action", key: "action", type: 'action', size: '8%', buttonNames: ['edit', 'view', 'delete'] }
    ],
    "data": [],
    "dataKey": 'rolePagePermissionId',
    "buttonname": 'Create Role Permission',
    "button": true,
    "statuses": [
        { label: 'false', value: 'danger' },
        { label: 'true', value: 'success' },
    ],
    "filterfields": ['rolePagePermissionId', 'role_name', 'page_name'],
    "isSearch": true
}

export const RoleDetails: RowData = {
    "headers": [
        { label: "SR.NO", key: "SR.NO", type: 'autoIncrementNumber', size: '1rem' },
        // { label: "ID", key: "role_id", type: '',size: '2rem' }, 
        { label: "Role Name", key: "role", type: '', size: '13rem' },
        // { label: "Action", type: "button", key: "delete" }
        { label: "Action", key: "action", type: 'action', size: '8%', buttonNames: ['edit', 'view', 'delete'] }
    ],
    "data": [],
    "dataKey": 'roleId',
    "buttonname": 'Create Role',
    "button": true,
    "statuses": [
        { label: 'false', value: 'danger' },
        { label: 'true', value: 'success' },
    ],
    "filterfields": ['roleId', 'roleName'],
    "isSearch": true
}

export const PagePermissionDetails: RowData = {
    "headers": [
        { label: "SR.NO", key: "SR.NO", type: 'autoIncrementNumber', size: '1rem' },
        // { label: "ID", key: "page_permission_id", type: '',size: '2rem' }, ß
        { label: "Page Name", key: "page_name", type: '', size: '13rem', truncateString: false },
        { label: "Permission", key: "permission", type: '' },
        // { label: "Action", type: "button", key: "delete" }
        { label: "Action", key: "action", type: 'action', size: '8%', buttonNames: ['edit', 'view', 'delete'] }
    ],
    "data": [],
    "dataKey": 'page_permission_id',
    "buttonname": 'Create Page Permission',
    "button": true,
    "statuses": [
        { label: 'false', value: 'danger' },
        { label: 'true', value: 'success' },
    ],
    "filterfields": ['page_name', 'permission'],
    "isSearch": true
}

export const RoleFormGroup: IFormStructure[] = [
    {
        name: "role_id",
        label: "Role ID",
        placeholder: "Role ID",
        type: "text",
        value: "",
        disable: false,
        hiddenControl: true,
    },
    {
        name: "role",
        label: "Role",
        placeholder: "Role",
        type: "text",
        value: "",
        disable: false,
        required: true,
        colsize: "col-6"
    },
    {
        name: "menu_id",
        label: "Based On",
        placeholder: "Based On",
        type: "select",
        value: "",
        bindValue: 'menu_id',
        bindLabel: 'menu_id',
        listName: 'menu-set',
        required: true,
        disable: false,
    },
]

export const PermissionFormGroup: IFormStructure[] = [
    {
        name: "permissionId",
        label: "Permission ID",
        placeholder: "Permission ID",
        type: "text",
        value: "",
        disable: true,
        hiddenControl: true,
    },
    {
        name: "permissionValues",
        label: "Permission Values",
        placeholder: "Permission Values",
        type: "text",
        value: "",
        disable: true,
        hiddenControl: true,
    },
    {
        name: "permission",
        label: "Permission",
        placeholder: "Permission",
        type: "text",
        value: "",
        disable: false,
        required: true,
        colsize: "col-6"
    },
    {
        name: "description",
        label: "Description",
        placeholder: "Description",
        type: "text",
        value: "",
        disable: false,
        required: true,
        colsize: "col-6"
    }


]

export const RolePermissionFormGroup: IFormStructure[] = [
    {
        name: "role_page_permission_id",
        label: "Role Permission ID",
        placeholder: "Role Permission ID",
        type: "text",
        value: "",
        disable: true,
        hiddenControl: true,
    },
    {
        name: "role_id",
        label: "Role",
        placeholder: "Role",
        type: 'select',
        value: '',
        bindValue: 'role_id',
        bindLabel: 'role',
        listName: 'role-id',
        required: false,
        disable: false,
    },
    {
        name: "permission",
        label: "Permission",
        placeholder: "Permission",
        type: 'select',
        value: '',
        bindValue: 'permission_id',
        bindLabel: 'permission',
        listName: 'permission-id',
        required: false,
        disable: false,
        bindMultiple: true
    },
    {
        name: "page_id",
        label: "Page",
        placeholder: "Page",
        type: 'select',
        value: '',
        bindValue: 'page_id',
        bindLabel: 'page_name',
        listName: 'page-id',
        required: false,
        disable: false,
    },
    {
        name: "description",
        label: "Description",
        placeholder: "Description",
        type: "text",
        value: "",
        disable: false,
    },
]

export const RolePagePermissionGroup: IFormStructure[] = [
    {

        name: "rolePagePermissionId",
        label: "permission",
        placeholder: "permission",
        type: "number",
        value: "",
        disable: false,
        hiddenControl: true
    },
    {
        name: "permission",
        label: "permission",
        placeholder: "permission",
        type: "number",
        value: "",
        disable: false,
        hiddenControl: true
    },
    {
        name: "roleId",
        label: "Role",
        placeholder: "Enter role",
        type: "select",
        value: "",
        required: true,
        disable: false,
        bindValue: 'roleId',
        bindLabel: 'roleName',
        listName: 'role-id',
        listData: []
    },
    {
        name: "pageId",
        label: "Pages",
        placeholder: "Enter service type",
        type: "select",
        value: "",
        required: true,
        disable: false,
        bindValue: 'pageId',
        bindLabel: 'pageName',
        listName: 'page-id',
        listData: []
    },
    {
        name: "permissionId",
        label: "Permission",
        placeholder: "Enter permission",
        type: "select",
        value: "",
        required: true,
        disable: false,
        bindMultiple: true,
        bindValue: 'permissionId',
        bindLabel: 'permission',
        listName: 'permission-id',
        listData: []
    },
    {
        name: "description",
        label: "Description",
        placeholder: "Description",
        type: "text",
        value: "",
        disable: true,
        hiddenControl: true
    },
    {
        name: "status_id",
        label: "Is Active",
        placeholder: "Is Active",
        type: "select",
        value: "",
        bindValue: 'id',
        bindLabel: 'name',
        listName: 'yesno',
        required: true,
        disable: false,
    }
];

export const PagePermissionFormGroup: IFormStructure[] = [
    {
        name: "page_permission_id",
        label: "Page Permission ID",
        placeholder: "Page Permission ID",
        type: "text",
        value: "",
        disable: false,
        hiddenControl: true,
    },
    {
        name: "page_id",
        label: "Page",
        placeholder: "Page",
        type: 'select',
        value: '',
        bindValue: 'page_id',
        bindLabel: 'page_name',
        listName: 'page-id',
        required: false,
        disable: false,
    },
    {
        name: "permission_id",
        label: "Permission",
        placeholder: "Permission",
        type: 'select',
        value: '',
        bindValue: 'permission_id',
        bindLabel: 'permission',
        listName: 'permission-id',
        required: false,
        disable: false,
    },
    {
        name: "description",
        label: "Description",
        placeholder: "Description",
        type: "text",
        value: "",
        disable: false,
    }
]


export const RoleWisePagePermissionGroupTable: IFormStructure[] = [

    {
        name: "role_id",
        label: "Role",
        placeholder: "Enter role",
        type: "select",
        value: "",
        required: true,
        disable: false,
        bindValue: 'role_id',
        bindLabel: 'role',
        listName: 'role-id',
        listData: []
    },
];


