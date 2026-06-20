import { IFormStructure } from "@shared/models/form";
import { RowData } from "@shared/models/table";


export const PageDetails: RowData = {
    "headers": [
        { label: "SR.NO", key: "SR.NO", type: 'autoIncrementNumber', size: '1rem' }, 
        // { label: "ID", key: "page_id", type: 'link', size: '2rem' }, 
        { label: "Page Name", key: "pageName", type: '', size: '13rem', truncateString: false }, 
        { label: "Page URL", key: "pageUrl", type: '', size: '13rem', truncateString: false }, 
        { label: "Mobile URL", key: "mobileUrl", type: '', size: '13rem', truncateString: false }, 
        { label: "Module Name", key: "description", type: '' }, 
        // { label: "Action", type: "button", key: "delete" }
        { label: "Action", key: "action", type: 'action', size: '8%', buttonNames: ['edit', 'view', 'delete']}
    ],
    "data": [],
    "dataKey": 'pageId',
    "buttonname": 'Create Page',
    "button": true,
    "statuses": [
        { label: 'false', value: 'danger' },
        { label: 'true', value: 'success' },
    ],
    "filterfields":['pageName', 'pageUrl', 'mobileUrl', 'module_name'],
    "isSearch": true
}

export const PageFormGroup: IFormStructure[] = [
    {
        name: "pageId",
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
        name: "pageName",
        label: "Page Name",
        placeholder: "Page Name",
        type: "text",
        value: "",
        disable: false,
    },
    {
        name: "pageUrl",
        label: "Page URL",
        placeholder: "Page URL",
        type: "text",
        value: "",
        disable: false,
    },
    {
        name: "mobileUrl",
        label: "Mobile URL",
        placeholder: "Mobile URL",
        type: "text",
        value: "",
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