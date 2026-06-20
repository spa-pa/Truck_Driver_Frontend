import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { FeathericonComponent } from '../feathericon/feathericon.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RowData } from '@shared/models/table';
import { DatePipe } from '@angular/common';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { ToastService } from '@shared/services/toast.service';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NoRecordFoundComponent } from '../no-record-found/no-record-found.component';
import { ItemDetailDialogComponent } from '../item-detail-dialog/item-detail-dialog.component';
import { PermissionsService } from '@shared/services/PermissionsService';
import { PermissionsActions } from '@shared/constants/permissionsActions.constant';
import { PermissionHelperService } from '@shared/services/permission-helper.service';
import { currentUser } from '@shared/utils/current-user';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  standalone: true,
  providers: [DatePipe],
  imports: [TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, DropdownModule, HttpClientModule, CommonModule, FeathericonComponent, RouterModule, NgbModule, MatDialogModule, MatButtonModule, NoRecordFoundComponent]
})
export class TableComponent implements OnInit {

  statuses!: any[];
  loading: boolean = true;
  openmenu: any;
  emitId: any = null;
  emitFullRowData: any = null;
  canCreate: boolean = false;
  canEdit: boolean = false;
  canView: boolean = false;
  canDelete: boolean = false;
  canUnlock: boolean = false;
  pageId: number | null = null; // Nullable to handle cases where pageId is not set
  @Input() actiontype: any = 'create';

  @Input() jsonData!: RowData;
  showJsonModal = false;
  selectedJson: any[] = [];

  @Output() handleCreateAction = new EventEmitter<void>();
  @Output() handleEditAction = new EventEmitter<void>();
  @Output() handleViewAction = new EventEmitter<void>();
  @Output() handleTrackAction = new EventEmitter<void>();
  @Output() handleDeleteAction = new EventEmitter<void>();
  @Output() handleDeleteActionRowData = new EventEmitter<void>();
  @Output() handleHubAction = new EventEmitter<void>();
  @Output() handleCloneAction = new EventEmitter<void>();
  @Output() handleSelectRowAction = new EventEmitter<void>();
  @Output() handleApprovedAction = new EventEmitter<void>();
  @Output() handleCorssAction = new EventEmitter<void>();
  @Output() handleExportAction = new EventEmitter<void>();
  @Output() handleViewImageActionRowData = new EventEmitter<void>();
  @Output() handleViewImageActionRowFullData = new EventEmitter<void>();
  @Output() handleOptionalButtonsAction = new EventEmitter<void>();

  @ViewChild('DeleteConfirmation', { static: true }) DeleteConfirmation!: TemplateRef<NgbModal>;
  constructor(private modalService: NgbModal, private toastService: ToastService, public dialog: MatDialog, private route: ActivatedRoute, private permissionsService: PermissionsService, private permissionHelper: PermissionHelperService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.pageId = data['pageId']; // Retrieve pageId from route data

      const roleId = currentUser().role_id
      if (roleId === 1) {
        this.canCreate = true;
        this.canEdit = true;
        this.canView = true;
        this.canDelete = true;
      } else {
        if (this.pageId) {
          // Check permissions based on the retrieved pageId
          this.canCreate = this.permissionsService.hasPermission(this.pageId, PermissionsActions.CREATE.name);
          this.canEdit = this.permissionsService.hasPermission(this.pageId, PermissionsActions.EDIT.name);
          this.canView = this.permissionsService.hasPermission(this.pageId, PermissionsActions.VIEW.name);
          this.canDelete = this.permissionsService.hasPermission(this.pageId, PermissionsActions.DELETE.name);
        }
      }
    })

    // this.route.data.subscribe(data => {
    //   this.pageId = data['pageId'];

    //   if (this.pageId) {
    //     const perms = this.permissionHelper.getPermissions(this.pageId);

    //     this.canCreate = perms.canCreate;
    //     this.canEdit = perms.canEdit;
    //     this.canView = perms.canView;
    //     this.canDelete = perms.canDelete;
    //     this.canUnlock = perms.canUnlock;
    //   }
    // });

    this.loading = false;
    this.statuses = this.jsonData.statuses
  }


  openJsonPopup(row: any) {
    this.selectedJson = row.parsed_json_details || [];
    this.showJsonModal = true;
  }

  closeJsonPopup() {
    this.showJsonModal = false;
  }

  clear(table: Table) {
    table.clear();
  }

  getSeverity(status: string) {
    const state = this.statuses.find((item: any) => item.label === status.toString())?.value ?? '';
    switch (state) {
      case 'danger':
        return 'danger';

      case 'success':
        return 'success';

      case 'info':
        return 'info';

      case 'warning':
        return 'warning';

      default:
        return undefined;
    }
  }

  getDateSeverity(date: string) {
    const currentDate = new Date();
    const providedDate = new Date(date);

    if (providedDate.toString() === 'Invalid Date') {
      console.warn('Invalid date provided');
      return undefined;
    }

    if (currentDate > providedDate) {
      return 'danger';  // If the current date is greater, return 'danger'
    } else {
      return 'success'; // If the provided date is in the future, return 'success'
    }
  }

  checkValidity(date: string) {
    const currentDate = new Date();
    const providedDate = new Date(date);

    if (providedDate.toString() === 'Invalid Date') {
      console.warn('Invalid date provided');
      return undefined;
    }

    if (currentDate > providedDate) {
      return 'Expired';
    } else {
      return 'Active';
    }
  }

  calculateHeaderSize(headerCount: any, colSize: any) {
    if (colSize && colSize.length > 0) {
      return colSize;
    }
    else {
      const count = Number(headerCount) - 2
      const calculatePercentage = 85 / Number(count);
      return calculatePercentage + '%'
    }
  }

  buttonClick(action: any, id: any = '', event: any = {}, operationId?: any, data?: any) {
    switch (action) {
      case 'create':
        this.handleCreateAction.emit();
        break;
      case 'edit':
        this.handleEditAction.emit(id);
        break;
      case 'view':
        this.handleViewAction.emit(id);
        break;
      case 'track':
        this.handleTrackAction.emit(id);
        break;
      case 'hub':
        this.handleHubAction.emit(id);
        break;
      case 'approve':
        this.handleApprovedAction.emit(id);
        break;
      case 'corss':
        this.handleCorssAction.emit(id);
        break;
      case 'selectrow':
        if ((event.target as HTMLElement).closest('.action-button')) {
        } else {
          this.handleSelectRowAction.emit(id);
        }
        break;
      case 'delete':
        this.centeredModal(operationId)
        this.emitId = id;
        this.emitFullRowData = data;
        // this.handleDeleteAction.emit(id);
        break;
      case 'export':
        this.handleExportAction.emit();
    }
  }

  buttonOptionalClick(action: any) {
    this.handleOptionalButtonsAction.emit(action);
  }

  buttonClickDataFull(action: any, data: any) {
    switch (action) {
      case 'hub':
        this.handleHubAction.emit(data);
        break;
      case 'clone':
        this.handleCloneAction.emit(data);
        break;
    }
  }

  openMenu(index: any) {
    if (index == this.openmenu)
      this.openmenu = null;
    else
      this.openmenu = index;
  }

  getObjectsDiff(newObject: any, originalObject: any): any {
    const objectsDiff = (newObject: any, originalObject: any): any => {
      return _.transform(newObject, (result: any, value: any, key: string) => {
        if (!_.isEqual(value, originalObject[key])) {
          result[key] = (_.isObject(value) && _.isObject(originalObject[key])) ? objectsDiff(value, originalObject[key]) : value;
        }
      });
    }
    return objectsDiff(newObject, originalObject);
  }

  centeredModal(operationId: any) {
    if (operationId) {
      const message = 'This field cannot be deleted because a job ID is present.';
      this.toastService.open(message, 'error');
      return
    } else {
      const modalRef = this.modalService.open(this.DeleteConfirmation, { centered: true, backdrop: 'static' });
    }
  }

  confirmDelete() {
    if (this.emitId) {
      this.handleDeleteAction.emit(this.emitId);
    }
    if (this.emitFullRowData) {
      this.handleDeleteActionRowData.emit(this.emitFullRowData);
    }
    this.emitId = null;
    this.emitFullRowData = null;
    this.modalService.dismissAll();
  }

  isValidDataKey(key: any): key is string {
    return typeof key === 'string';
  }

  viewImage(id: any, data: any) {
    this.handleViewImageActionRowData.emit(id);
    this.handleViewImageActionRowFullData.emit(data);
  }
  openDetailDialog(item: any): void {
    let imgData: any;
    let base64String = item || '';
    let mimeType: string = 'application/octet-stream'; // Default MIME type for unknown data
    let imageFilePath;

    if (base64String.startsWith('http://') || base64String.startsWith('https://')) {
      // mimeType = 'text/html'; // MIME type for URLs
      imageFilePath = base64String
    }

    // Detect the type of base64 data based on its prefix or content
    if (base64String && !imageFilePath) {
      if (base64String.startsWith('/9j/') || base64String.startsWith('iVBORw0KGgo')) {
        // Assuming this is an image (JPEG or PNG)
        mimeType = 'image/jpeg'; // Default MIME type for JPEG images
        if (base64String.startsWith('iVBORw0KGgo')) {
          mimeType = 'image/png'; // For PNG images
        }
      } else if (base64String.startsWith('JVBERi0')) {
        // Detect PDF based on its header
        mimeType = 'application/pdf';
      } else if (base64String.startsWith('data:')) {
        // Already in the correct format
        mimeType = base64String.split(';')[0].split(':')[1];
      }

      // If the base64String does not already include the MIME type
      if (!base64String.startsWith('data:')) {
        base64String = `data:${mimeType};base64,${base64String}`;
      }
    }

    // Prepare the imgData object based on the type of content
    imgData = {
      key: mimeType === 'application/pdf' ? 'Document' : 'Job Id',
      value: mimeType === 'application/pdf' ? item?.document_no : item?.job_no,
      img: imageFilePath ? imageFilePath : base64String,
      img_name: item?.image_file_name,
    };

    // Configure dialog settings
    const dialogConfig: MatDialogConfig = {
      maxWidth: '80vw',
      maxHeight: '90vh',
      height: '100%',
      width: '100%',
      data: imgData,
      autoFocus: true,
      disableClose: true,
      panelClass: 'custom-dialog-container', // Use a custom class for additional styling
    };
    const dialogRef = this.dialog.open(ItemDetailDialogComponent, dialogConfig);

  }

  getParsedJson(value: any) {
    try {
      if (!value) return [];

      // ✅ Case: Already array
      if (Array.isArray(value)) return value;

      let cleaned = value;

      // ✅ Step 1: Convert to string
      if (typeof cleaned !== 'string') {
        cleaned = String(cleaned);
      }

      cleaned = cleaned.trim();

      // 🔥 Step 2: Remove outer wrapping quotes multiple times
      while (
        (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
        (cleaned.startsWith("'") && cleaned.endsWith("'"))
      ) {
        cleaned = cleaned.slice(1, -1).trim();
      }

      // 🔥 Step 3: Fix escaped quotes
      cleaned = cleaned
        .replace(/\\"/g, '"')   // \" → "
        .replace(/\\\\/g, '\\'); // \\ → \

      // 🔥 Step 4: Try parsing
      let parsed = JSON.parse(cleaned);

      // 🔥 Step 5: If STILL string → parse again (double encoded)
      while (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }

      return Array.isArray(parsed) ? parsed : [];

    } catch (e) {
      console.error('🔥 FINAL JSON ERROR:', e, value);
      return [];
    }
  }
}