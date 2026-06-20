import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastService } from '@shared/services/toast.service';
import { IUploadStructure } from '@shared/models/form';
import { ItemDetailDialogComponent } from '../item-detail-dialog/item-detail-dialog.component';

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [CommonModule, DropzoneModule],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.scss',
})
export class UploadFileComponent {

  /** Config data for each upload block */
  @Input() formConfig: IUploadStructure[] = [];

  /** Toggle to support multiple documents upload per field */
  @Input() isUploadMultiDocs: boolean = false;

  /** Flag for folder-level ZIP upload */
  @Input() isFolderUpload: boolean = false;

  /** Toggle to emit base64 instead of File */
  @Input() requireBase64: boolean = false;

  /** Optional FormControl for single file use case */
  @Input() formControl: any;

  /** Emit a File object on successful single file upload */
  @Output() fileUploaded = new EventEmitter<File>();

  /** Emit base64 image data object if `requireBase64` is true */
  @Output() photoBase64Uploaded = new EventEmitter<any>();

  /** Emit complete upload structure if bulk upload */
  @Output() uploadBulkFile = new EventEmitter<IUploadStructure[]>();

  /** For file previews */
  uploadedFiles: File[] = [];
  uploadedDocuments: any[] = [];

  /** Image modal support */
  modalImageUrl: string | null = null;

  constructor(
    private toastService: ToastService,
    public dialog: MatDialog
  ) {}

  /** Called when Dropzone triggers upload error */
  onUploadError(event:any): void {
    this.toastService.open('An error occurred while uploading the file. Please try again.', 'error');
  }

  /**
   * Called when a file is uploaded successfully
   * Converts file to base64 and optionally emits data
   */
  onUploadSuccess(event: any, index: number): void {
    const [file] = event;
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      const formEntry = this.formConfig[index];

      if (!this.isUploadMultiDocs) {
        if (this.requireBase64) {
          const payload = {
            imgName: file.name,
            base64String,
            fieldName: formEntry.name
          };
          this.photoBase64Uploaded.emit(payload);
        } else {
          this.fileUploaded.emit(file);
        }
      }

      if (formEntry && formEntry.dropzoneConfig) {
        const maxFiles = formEntry.dropzoneConfig.maxFiles;

        // Simulated logic (commented service upload code here)
        if (maxFiles === 1 || maxFiles === 2) {
          if (maxFiles === 1) {
            formEntry.upload_page_1_file_name = file.name;
            formEntry.upload_page_1_file = base64String;
          } else {
            if (!formEntry.upload_page_1_file_name) {
              formEntry.upload_page_1_file_name = file.name;
              formEntry.upload_page_1_file = base64String;
            } else {
              formEntry.upload_page_2_file_name = file.name;
              formEntry.upload_page_2_file = base64String;
            }
          }
        }
      } else {
        console.warn('Missing dropzone config at index:', index);
      }
    };

    reader.readAsDataURL(file);
  }

  /**
   * Launch hidden input for folder upload
   */
  handleFolderInput(event: any): void {
    this.fileUploaded.emit(event);
  }

  /**
   * Submit all documents from `formConfig`
   */
  submitDocuments(): void {
    this.uploadBulkFile.emit(this.formConfig);
  }

  /**
   * View uploaded document/image using MatDialog
   */
  viewImages(item: any): void {
    let base64String = item || '';
    let mimeType = 'application/octet-stream';
    let imageFilePath: string | undefined;

    if (typeof base64String === 'string') {
      if (base64String.startsWith('http://') || base64String.startsWith('https://')) {
        imageFilePath = base64String;
      } else {
        if (base64String.startsWith('/9j/') || base64String.startsWith('iVBORw0KGgo')) {
          mimeType = base64String.startsWith('iVBORw0KGgo') ? 'image/png' : 'image/jpeg';
        } else if (base64String.startsWith('JVBERi0')) {
          mimeType = 'application/pdf';
        } else if (base64String.startsWith('data:')) {
          mimeType = base64String.split(';')[0].split(':')[1];
        }

        if (!base64String.startsWith('data:')) {
          base64String = `data:${mimeType};base64,${base64String}`;
        }
      }
    }

    const imgData = {
      key: mimeType === 'application/pdf' ? 'Document' : 'Job Id',
      value: item?.document_no || item?.job_no,
      img: imageFilePath ?? base64String,
      img_name: item?.image_file_name,
    };

    const dialogConfig: MatDialogConfig = {
      maxWidth: '80vw',
      maxHeight: '90vh',
      width: '100%',
      height: '100%',
      data: imgData,
      autoFocus: true,
      disableClose: true,
      panelClass: 'custom-dialog-container',
    };

    this.dialog.open(ItemDetailDialogComponent, dialogConfig);
  }

  /**
   * Remove image preview from a given form block
   */
  removeImage(formIndex: number, imageIndex: number): void {
    const formEntry = this.formConfig[formIndex];

    if (imageIndex === 0) {
      formEntry.upload_page_1_file = null;
      formEntry.upload_page_1_file_name = null;
    } else {
      formEntry.upload_page_2_file = null;
      formEntry.upload_page_2_file_name = null;
    }
  }

  /**
   * Calculates Bootstrap column width based on number of items
   */
  calculateColumnsPerRow(numItems: number): number {
    if (numItems <= 1) return 12;
    if (numItems === 2) return 6;
    if (numItems === 3) return 4;
    if (numItems >= 4) return 3;
    return 12;
  }
}
