import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeathericonComponent } from '../feathericon/feathericon.component';

@Component({
  selector: 'app-date',
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    FeathericonComponent
  ],
  templateUrl: './date.component.html',
  styleUrl: './date.component.scss'
})
export class DateComponent {
  // Bound reactive form control
  @Input() formControl!: FormControl;

  // Optional input attributes
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disable: boolean = false;
  @Input() label: string = 'Select';
  @Input() name: string = '';
}
