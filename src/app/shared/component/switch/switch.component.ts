import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-switch',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, NgbModule],
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SwitchComponent {

  @Input() label: string = 'Toggle';
  @Input() name: string = '';
  @Input() formControl!: FormControl;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() checked: boolean = false;
  @Input() disable: boolean = false;
  @Input() isReversed: boolean = false;
  @Output() valueChange = new EventEmitter<boolean>();

  onChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(input.checked);
    const isChecked = input.checked;
    this.formControl.setValue(isChecked ? 1 : 0);
  }
}
