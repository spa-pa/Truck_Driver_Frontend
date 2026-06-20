// Placeholder configuration
import { IFormStructure } from '@shared/models/form';
import { RowData } from '@shared/models/table';

export const RolePermissionDetailsData: RowData = {
  headers: [
    { label: '', key: 'SR.NO', type: 'autoIncrementNumber', size: '4%' },
    { label: 'Role Name', key: 'role_name', type: '' },
    { label: 'Page Name', key: 'page_name', type: '' },
    { label: 'Role', key: 'description', type: '' },
    { label: 'Action', key: 'action', type: 'action', size: '8%', buttonNames: ['edit', 'view', 'delete'] }
  ],
  data: [],
  dataKey: 'role_page_permission_id',
  buttonname: 'Create Role',
  button: true,
  statuses: [
    { label: 'Active', value: 'success' },
    { label: 'Inactive', value: 'danger' }
  ],
  filterfields: ['role_name', 'description'],
  isSearch: false
};

export const RolePagePermissionGroup: IFormStructure[] = [
  {
    name: "permission",
    label: "permission",
    placeholder: "permission",
    type: "number",
    value: "",
    disable: false,
    hiddenControl:true
  },
  {
    name: "role_id",
    label: "Role",
    placeholder: "Enter role",
    type: "select",
    value: "",
    required: true,
    disable: false,
    bindValue: 'role_id',
    bindLabel: 'role_name',
    listName: 'role-id',
    listData: []
  },
  {
    name: "page_id",
    label: "Pages",
    placeholder: "Enter service type",
    type: "select",
    value: "",
    required: true,
    disable: false,
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
    disable: false
  }
];
