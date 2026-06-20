import { IFormStructure } from "@shared/models/form";
import { RowData } from "@shared/models/table";
import { EncryptedStorage } from "@shared/utils/encrypted-storage";
import { GlobalConfig } from "./global-config";


export const SampleOperationDetails: RowData = {
  "headers": [
    { label: "Sr.No", key: "SR.NO", type: 'autoIncrementNumber', size: '4%' }, 
    { label: "Sample Name", key: "sample_name", type: '' },
    { label: "Sample Number", key: "sample_number", type: '' }, 
    { label: "Action", key: "action", type: 'action', size: '8%', buttonNames: ['edit', 'view', 'delete'] }
  ],
  "data": [],
  "dataKey": 'sample_id',
  "buttonname": 'Create Sample',
  "button": true,
  "statuses": [
      { label: 'false', value: 'danger' },
      { label: 'true', value: 'success' },
  ],
  filterfields: ['sample_id','sample_name','sample_name','sample_number','connecting_sample_no'],
  "isSearch": true
}

export const SampleOperationSearchGroup: IFormStructure[] = [
  {
    name: 'sample_id',
    label: 'sample Id',
    placeholder: 'sample Id',
    type: 'text',
    value: '',
    disable: false,
    hiddenControl: true,
  },
  {
    name: 'sample_name',
    label: 'sample Name',
    placeholder: 'sample Name',
    type: 'text',
    value: '',
    disable: false,
    required:true
  },
  {
    name: 'code',
    label: 'Code',
    placeholder: 'Code',
    type: 'text',
    value: '',
    disable: false,
  },

  {
    name: 'sample_number',
    label: 'sample Number',
    placeholder: 'sample Number',
    type: 'text',
    value: '',
    disable: false,
    required:true
  },
  {
    name: 'status_id',
    label:'Status',
    placeholder: 'Status',
    type: 'select',
    value: '',
    bindValue: 'status_id',
    bindLabel: 'name',
    listName: 'status_list',
    required: false,
    disable: false,
  }
];
