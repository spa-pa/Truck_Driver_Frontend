import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent implements ControlValueAccessor {
  /** Form control for validation */
  @Input() formControl!: FormControl;

  /** Label text next to the checkbox */
  @Input() label: string = '';

  /** Form control name/id */
  @Input() name: string = '';

  /** Disable the checkbox */
  @Input() disable: boolean = false;

  /** Optional description shown as button */
  @Input() description: string = '';

  /** Emits when the checkbox is toggled */
  @Output() checkboxChange = new EventEmitter<{ name: string; formvalue: boolean }>();

  /** Internal state */
  value: boolean = false;
  disabled: boolean = false;

  /** Callback functions */
  onChange: (_: any) => void = () => {};
  onTouch: () => void = () => {};

  /** Register callback for value change */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /** Register callback for touch event */
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  /** Update disabled state */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /** Write value from form control */
  writeValue(value: any): void {
    this.value = value;
  }

  /** Handle checkbox change and emit data */
  onCheckboxChange(event: Event, name: string): void {
    const target = event.target as HTMLInputElement;
    this.value = target.checked;

    this.onChange(this.value);
    this.onTouch();

    // Emit the checkbox state and name
    this.checkboxChange.emit({ name, formvalue: this.value });
  }
}
