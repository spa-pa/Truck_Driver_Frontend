import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, NgbModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent implements OnInit {
  // Inputs for configuration
  @Input() formControl!: FormControl;
  @Input() placeholder = '';
  @Input() required = false;
  @Input() disable = false;
  @Input() label: string = 'Select';
  @Input() listData: any[] = [];
  @Input() bindLabel = 'name';
  @Input() bindValue = 'id';
  @Input() name = '';
  @Input() bindMultiple = false;
  @Input() isEditButtonAdd = false;
  @Input() isAddButtonAdd = false;
  @Input() editicon = false;

  @Input() options: { value: string, label: string }[] = [];
  
  // Event emitters
  @Output() optionSelected = new EventEmitter<any>();
  @Output() onEditIconSelectClickEmit = new EventEmitter<any>();
  @Output() onAddIconSelectClickEmit = new EventEmitter<any>();

  // ViewChild references
  @ViewChild(NgSelectComponent) ngSelectComponent!: NgSelectComponent;
  @ViewChild('ngSelectRef') ngSelect!: NgSelectComponent;

  // Internal state
  selectedCity: string;
  dropdownOpen = false;
  highlightedIndex = 0;

  ngOnInit(): void {
    // Ensure form control has a null default value
    if (!this.formControl.value) {
      this.formControl.setValue(null);
    }
  }

  // Emit selected value change
  onSelectionChange(selectedValue: any): void {
    this.optionSelected.emit(selectedValue);
  }

  // Emit click on edit/add icon
  onEditIconClick(event: any): void {
    this.onEditIconSelectClickEmit.emit(event);
  }

  // Validate selected value on blur (ensure it exists in listData)
  onBlurCheck(): void {
    const currentValue = this.formControl.value;
    const isValid = this.listData.some(item => item[this.bindValue] === currentValue);

    if (!isValid) {
      this.formControl.setValue(null);
    }
  }
}
