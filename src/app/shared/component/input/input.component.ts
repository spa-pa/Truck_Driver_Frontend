import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  // --------------------
  // Input Properties
  // --------------------

  /** FormControl to bind input */
  @Input() formControl!: FormControl;

  /** Label displayed for the input */
  @Input() label: string;

  /** Input type (default: 'text') */
  @Input() type: string = 'text';

  /** Placeholder text */
  @Input() placeholder: string = '';

  /** Marks the field as required */
  @Input() required: boolean = false;

  /** Minimum allowed length */
  @Input() minLength: number = 0;

  /** Maximum allowed length */
  @Input() maxLength: number = 500;

  /** Input name attribute */
  @Input() name: string = '';

  /** Number of rows (for textarea) */
  @Input() rows: number = 2;

  /** Number of columns (for textarea) */
  @Input() cols: number = 30;

  /** Disables the input field */
  @Input() disable: boolean = false;

  /** Optional input description (displayed beside label) */
  @Input() description: string = '';

  /** If true, input converts characters to uppercase on keyup */
  @Input() isUpperCase: boolean = false;

  /** Enables a button addon prefix */
  @Input() buttonAddons: boolean = false;

  /** Text or content to show inside the button addon */
  @Input() buttonAddonsData: any = '';

  // --------------------
  // Output Events
  // --------------------

  /** Emits when input value changes */
  @Output() onInputChangeEmit = new EventEmitter<any>();

  /** Emits when edit icon is clicked */
  @Output() onEditIconClickEmit = new EventEmitter<any>();

  // Placeholder methods for touch/callback hooks (if needed later)
  onChange: any = () => {};
  onTouch: any = () => {};

  // --------------------
  // Component Methods
  // --------------------

  /**
   * Handles input changes, emits the event, and prevents negative values if numeric
   * @param event Input event object
   */
  onInputChange(event: any): void {
    let value = event.target.value;

    // Prevent negative values for numeric input
    if (!isNaN(value) && value < 0) {
      event.target.value = 0; // Reset input
      return;
    }

    // Emit input change
    this.onInputChangeEmit.emit(event);
  }

  /**
   * Converts input value to uppercase and updates the form control
   * @param event Keyup event
   */
  toUppercase(event: any): void {
    const input = event.target;
    input.value = input.value.toUpperCase();
    this.formControl.setValue(input.value);
  }

  /**
   * Emits when the edit icon is clicked
   */
  onEditIconClick(): void {
    this.onEditIconClickEmit.emit();
  }

  /**
   * Dynamically resizes the textarea based on content height
   * @param event Input event from textarea
   */
  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;

    // Reset to base row count first
    textarea.rows = 2;

    const lineHeight = 24; // Adjust based on design (typical: 20–24px)
    const currentHeight = textarea.scrollHeight;
    const newRows = Math.ceil(currentHeight / lineHeight);

    // Set rows based on content height
    textarea.rows = newRows;
  }
}
