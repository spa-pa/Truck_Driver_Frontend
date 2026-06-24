import { IFormStructure } from "@shared/models/form";
import { RowData } from "@shared/models/table";


export const PageDetails: RowData = {
    "headers": [
        { label: "SR.NO", key: "SR.NO", type: 'autoIncrementNumber', size: '1rem' },
        // { label: "ID", key: "page_id", type: 'link', size: '2rem' }, 
        { label: "Page Name", key: "page_name", type: '', size: '13rem', truncateString: false },
        { label: "Page URL", key: "page_path", type: '', size: '13rem', truncateString: false },
        // { label: "Action", type: "button", key: "delete" }
        { label: "Action", key: "action", type: 'action', size: '8%', buttonNames: ['edit', 'view', 'delete'] }
    ],
    "data": [],
    "dataKey": 'pageId',
    "buttonname": 'Create Page',
    "button": true,
    "statuses": [
        { label: 'false', value: 'danger' },
        { label: 'true', value: 'success' },
    ],
    "filterfields": ['pageName', 'pageUrl', 'mobileUrl', 'module_name'],
    "isSearch": true
}

export const PageFormGroup: IFormStructure[] = [
    {
        name: "page_id",
        label: "Page ID",
        placeholder: "Page ID",
        type: "text",
        value: "",
        disable: false,
        hiddenControl: true,
    },
    // {
    //     name: "interface",
    //     label: "Interface",
    //     placeholder: "Interface",
    //     type: "text",
    //     value: "",
    //     disable: false,
    //     hiddenControl: true,
    // },
    {
        name: "page_name",
        label: "Page Name",
        placeholder: "Page Name",
        type: "text",
        value: "",
        disable: false,
    },
    {
        name: "page_path",
        label: "Page URL",
        placeholder: "Page URL",
        type: "text",
        value: "",
        disable: false,
    }
]