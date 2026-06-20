import { CommonModule, Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IFormStructure, IUploadStructure } from '@shared/models/form';
import { InputComponent } from '../input/input.component';
import { SelectComponent } from '../select/select.component';
import { SwitchComponent } from '../switch/switch.component';
// import { CheckboxTickComponent } from '../checkbox-tick/checkbox-tick.component';
import { DateTimeComponent } from '../date-time/date-time.component';
import { ToastService } from '@shared/services/toast.service';
import { responseMessages } from '@shared/constants/response-msgs.constant';
import { CheckboxComponent } from '../checkbox/checkbox.component';
// import { UploadFileComponent } from '../upload-file/upload-file.component';
import { contactNumberValidator, pancardValidator, adharcardValidator, passportValidator, emailValidator } from '@shared/utils/custom-validators';
import { UploadFileComponent } from '../upload-file/upload-file.component';
import { FeathericonComponent } from '../feathericon/feathericon.component';
import { TimePickerComponent } from '../time/time.component';
// import { CustomFileUploadModule } from '../sc-custom-file-upload/package.module';
@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, InputComponent, SelectComponent, SwitchComponent, CheckboxComponent, DateTimeComponent, UploadFileComponent, FeathericonComponent, TimePickerComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() formConfig: IFormStructure[] = [];
  @Input() formConfigUpload: IUploadStructure[] = [];
  @Input() formData: any;
  @Input() actiontype: any = 'create';
  @Input() isBack: boolean = false;
  @Input() isNext: boolean = false;
  @Input() isSubmit: boolean = false;
  @Input() isAdd: boolean = false;
  @Input() isSearch: boolean = false;
  @Input() isButtonHidden: boolean = false;
  @Input() isSet: boolean = false;
  @Input() isComplete: boolean = false;
  @Input() isGenerate: boolean = false;
  @Input() formTitle: string = '';
  @Input() updateFormvalue: any = [];
  @Input() isDownloadAvailable: boolean = false;
  @Output() isCheckboxChange = new EventEmitter<any>();
  @Output() emitData: EventEmitter<any> = new EventEmitter();
  @Output() emitCompleteData: EventEmitter<any> = new EventEmitter();
  @Output() selectValueChangeChange: EventEmitter<any> = new EventEmitter();
  @Output() onInputChangeEmit: EventEmitter<any> = new EventEmitter();
  @Output() onEditIconClickEmit: EventEmitter<any> = new EventEmitter();
  @Output() onEditIconSelectClickEmit: EventEmitter<any> = new EventEmitter();
  @Output() onDateChangeEmit: EventEmitter<any> = new EventEmitter();
  @Output() onTimeChangeEmit: EventEmitter<any> = new EventEmitter();
  @Output() removeEmit: EventEmitter<any> = new EventEmitter();
  @Output() fileUploaded: EventEmitter<File> = new EventEmitter<File>();
  @Output() photoBase64Uploaded: EventEmitter<any> = new EventEmitter();
  @Output() emitUploadData: EventEmitter<any> = new EventEmitter();
  @Output() emitDownloadData: EventEmitter<any> = new EventEmitter();

  dynamicForm: FormGroup;

  constructor(private formbuilder: FormBuilder, private location: Location, private toastService: ToastService, private cdr: ChangeDetectorRef) {
    this.dynamicForm = this.formbuilder.group({});
  }

  ngOnInit(): void {
    this.createForm();
  }

  ngAfterViewInit(): void {
    this.dynamicForm.patchValue(this.formData)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formConfig']) {
      // Reset the form when formConfig changes
      this.resetForm();
      this.createForm(); // Re-create the form based on the new formConfig
    }

    if (changes['formData']) {
      this.dynamicForm.patchValue(this.formData)
    }

    if (changes['updateFormvalue']) {
      this.updateFormValues();
    }

  }

  createForm() {
    this.formConfig.forEach(control => {
      const validators = [];

      if (control.required) {
        validators.push(Validators.required);
      }
      if (control.minLength) {
        validators.push(Validators.minLength(control.minLength));
      }
      if (control.maxLength) {
        validators.push(Validators.maxLength(control.maxLength));
      }
      if (control.type === 'email') {
        validators.push(Validators.email);
      }

      // Type-specific validations
      switch (control.validationFor) {
        case 'email':
          validators.push(emailValidator());
          break;
        case 'contact':
          validators.push(contactNumberValidator());
          break;
        case 'pancard':
          validators.push(pancardValidator());
          break;
        case 'adharcard':
          validators.push(adharcardValidator());
          break;
        case 'passport':
          validators.push(passportValidator());
          break;
        default:
          break;
      }

      this.dynamicForm.addControl(
        control.name,
        this.formbuilder.control(
          { value: control.value || '', disabled: control.disable || false },
          validators
        )
      );
    });
  }

  getColumnSizeClass(colsize: any): string {
    if (colsize && colsize.length > 0) {
      return colsize;
    } else {
      return 'col-lg-3 col-md-6 col-sm-12';
    }
  }

  getControl(value: string) {
    return this.dynamicForm.get(value) as FormControl;
  }

  onSubmit(type: string) {
    if (type === 'uploadCustomImage' || type === 'downloadCustomImage') {
      this.emitData.emit({ formValue: this.dynamicForm.getRawValue(), type: type })
    } else if (type == 'back') {
      this.emitData.emit({ formValue: [], type: type })
    } else if (type == 'additem' || type == 'removeitem') {
      const formData = this.dynamicForm.getRawValue();
      this.removeEmit.emit({ type: type, formValue: this.convertEmptyStringsToNull(formData) })
    } else if (type == 'download') {
      this.emitDownloadData.emit({ formValue: this.dynamicForm.getRawValue(), type: type });
    }
    else {
      if (!this.dynamicForm.valid) {
        const message = responseMessages.codes.find(item => item.code == '1.0101')?.message ?? 'Something went to wrong!';
        this.toastService.open(message, 'error');
        this.dynamicForm.markAllAsTouched();
        return;
      } else {
        const formData = this.dynamicForm.getRawValue();
        if (type == 'complete') {
          this.emitCompleteData.emit({ formValue: this.convertEmptyStringsToNull(formData) });
        } if (type == 'upload') {
          this.emitUploadData.emit({ formValue: this.convertEmptyStringsToNull(formData) });
        } else {
          this.emitData.emit({ formValue: this.convertEmptyStringsToNull(formData) });
        }
      }
    }
  }

  onCancle() {
    this.location.back();
  }

  handleCheckboxChange(event: any) {
    this.isCheckboxChange.emit(event)
  }

  optionSelectedChange(event: any, controlName: any) {
    const updatedEvent = event || {};
    updatedEvent.controlName = controlName;
    this.selectValueChangeChange.emit(updatedEvent);
  }

  onInputChange(event: Event, controlName: string, maxValue: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    // console.log(' value = ',value);
    // if (isNaN(value)) {
    //   this.dynamicForm.get(controlName)?.setValue(0, { emitEvent: false });
    //   return;
    // }

    // if (value > maxValue) {
    //   value = maxValue;
    // }

    // this.dynamicForm.get(controlName)?.setValue(Number(value), { emitEvent: false });
    // console.log(' value = ',value);

    let data = {
      value: value,
      controlName: controlName
    }
    this.onInputChangeEmit.emit(data);
  }

  onEditIconClick() {
    this.onEditIconClickEmit.emit();
  }
  onEditIconSelectClick(event: any) {
    this.onEditIconSelectClickEmit.emit(event);
  }

  handleFileUpload(event: any, type?: any) {
    if (type === 'base64') {
      this.photoBase64Uploaded.emit(event)
    } else {
      this.fileUploaded.emit(event);
    }
  }

  onDateChange(event: any) {
    this.onDateChangeEmit.emit(event)
  }

  onTimeChange(event: any) {
    this.onTimeChangeEmit.emit(event)
  }


  getFormData(): any {
    const formData = this.dynamicForm.getRawValue();
    return this.convertEmptyStringsToNull(formData);
  }

  get isValid(): boolean {
    if (!this.dynamicForm.valid) {
      this.dynamicForm.markAllAsTouched();
    }
    return this.dynamicForm.valid;
  }

  isFormValid(): boolean {
    if (!this.dynamicForm.valid) {
      const message = responseMessages.codes.find(item => item.code == '1.0101')?.message ?? 'Something went to wrong!';
      this.toastService.open(message, 'error');
      this.dynamicForm.markAllAsTouched();
    }
    return this.dynamicForm.valid;
  }

  convertEmptyStringsToNull(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.convertEmptyStringsToNull(item));
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        acc[key] = this.convertEmptyStringsToNull(obj[key]);
        return acc;
      }, {} as any);
    } else {
      return obj === "" ? null : obj;
    }
  }

  resetForm() {
    this.dynamicForm.reset();
    this.createForm(); // Re-create form controls if needed
  }

  updateFormValues() {
    if (this.updateFormvalue && this.updateFormvalue.length > 0) {
      for (const update of this.updateFormvalue) {
        const control = this.dynamicForm.get(update.key);
        if (control) {
          control.setValue(update.value);
        }
        const index = this.formConfig.findIndex(control => control.name === update.key);
        if (index !== -1) {
          if (update && update.value)
            this.formConfig[index].value = update.value;
        }
      }
    }
    // this.cdr.detectChanges(); 
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files?.length) {
      const file = input.files[0];
      this.convertToBase64(file, input.name);  // Pass the name of the control
    }
  }

  private convertToBase64(file: File, controlName: string): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      this.dynamicForm.get(controlName)?.setValue(base64String); // Set the base64 string to the correct form control
    };
    reader.readAsDataURL(file); // Read the file as a base64 string
  }

  updateFile(data: any) {

    // console.log("this.dynamicform",this.dynamicForm.patchValue({cd_image_file_name:data?.['EDI Excel File']}))
    if (data?.['EDI Excel File']) {
      this.dynamicForm.patchValue({ edi_excel_file_name: data?.['EDI Excel File'] })
    }
    else if (data?.['CD Image']) {
      this.dynamicForm.patchValue({ cd_image_file_name: data?.['CD Image'] })
    }
  }

}