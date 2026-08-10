import { IFormStructure } from "@shared/models/form";
import { RowData } from "@shared/models/table";

export const PosterDetailsData: RowData = {
  headers: [
    { label: "Sr.No", key: "SR.NO", type: "autoIncrementNumber", size: "4%" },
    { label: "Terminal", key: "terminal_name", type: "" },
    { label: "Poster Image", key: "poster_path", type: "urlLink" },
    { label: "Poster Sequence", key: "sequence", type: "" },
    {
      label: "Action",
      key: "action",
      type: "action",
      size: "20%",
      buttonNames: ["edit", "view", "delete"],
    },
  ],
  data: [],
  dataKey: "poster_id",
  buttonname: "Create Poster",
  button: true,
  statuses: [
    { label: "false", value: "danger" },
    { label: "true", value: "success" },
  ],
  filterfields: ["terminal_name"],
  isSearch: false,
};

export const PosterTypeSearchGroup: IFormStructure[] = [
  {
    name: "poster_id",
    placeholder: "Poster Id",
    label: "Poster Id",
    type: "text",
    value: "",
    hiddenControl: true,
    disable: false,
  },
  {
    name: "terminal_id",
    label: "Terminal",
    placeholder: "Enter Terminal",
    type: "select",
    value: "",
    required: true,
    disable: false,
    bindValue: "terminal_id",
    bindLabel: "terminal_name",
    listName: "terminal",
    listData: [],
  },
  {
    name: "sequence",
    label: "Poster Sequence",
    placeholder: "Enter Poster Sequence",
    type: "number",
    value: "",
    required: true,
    disable: false,
  },
  {
    name: "poster_image",
    label: "Poster Image",
    placeholder: "Select poster image",
    type: "upload",
    value: "",
    required: true,
    disable: false,
    requireBase64: true,
    formConfigUpload: [
      {
        name: "poster_image",
        type: "IMAGE",
        required: true,
        disable: false,
        text: ' <div class="dz-message needsclick"><i class="icon-cloud-up"></i><h6>Upload Poster Image</h6></div>',
        dropzoneConfig: {
          clickable: true,
          url: "http://localhost:3000/api/v1/upload/file",
          addRemoveLinks: true,
          parallelUploads: 1,
          acceptedFiles: ".jpg,.jpeg,.png",
          maxFiles: 1,
        },
      },
    ],
    colsize: "col-12",
  },
];
