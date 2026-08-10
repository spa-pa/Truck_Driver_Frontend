import { IFormStructure } from "@shared/models/form";
import { RowData } from "@shared/models/table";

export const ConsentDetailsData: RowData = {
  headers: [
    { label: "Sr.No", key: "SR.NO", type: "autoIncrementNumber", size: "4%" },
    { label: "Language", key: "language_name", type: "" },
    { label: "Description", key: "description", type: "" },
    {
      label: "Action",
      key: "action",
      type: "action",
      size: "10%",
      buttonNames: ["edit", "view", "delete"],
    },
  ],
  data: [],
  dataKey: "consent_id",
  buttonname: "Create Consent",
  button: true,
  statuses: [
    { label: "false", value: "danger" },
    { label: "true", value: "success" },
  ],
  filterfields: ["language_name"],
  isSearch: false,
};

export const ConsentTypeSearchGroup: IFormStructure[] = [
  {
    name: "consent_id",
    placeholder: "Consent Id",
    label: "Consent Id",
    type: "text",
    value: "",
    hiddenControl: true,
    disable: false,
  },
  {
    name: "language_id",
    label: "Language",
    placeholder: "Enter Language",
    type: "select",
    value: "",
    required: true,
    disable: false,
    bindValue: "language_id",
    bindLabel: "language_name",
    listName: "language",
    listData: [],
  },
  {
    name: "description",
    label: "Description",
    placeholder: "Enter Description",
    type: "textarea",
    value: "",
    required: true,
    disable: false,
    colsize: "col-12"
  },
];
