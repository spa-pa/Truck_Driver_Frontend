import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeathericonComponent } from '../feathericon/feathericon.component';
import { FlatpickrDefaults, FlatpickrModule } from 'angularx-flatpickr';

@Component({
  selector: 'app-date-time',
  standalone: true,
  imports: [CommonModule, NgbModule, FormsModule, FlatpickrModule, ReactiveFormsModule],
  providers: [FlatpickrDefaults],
  templateUrl: './date-time.component.html',
  styleUrl: './date-time.component.scss'
})
export class DateTimeComponent implements AfterViewInit {
  @Input() formControl!: FormControl;
  @Input() placeholder = '';
  @Input() required = false;
  @Input() disable = false;
  @Input() label: string = 'Select';
  @Input() name = '';
  @Input() minDate: string;
  @Input() maxDate: string;
  @Input() enableTime = true;
  @Input() dateFormat = "Y-m-dTH:i";
  @Input() altFormat = "F j, Y H:i";
  @Output() onDateChangeEmit: EventEmitter<any> = new EventEmitter();
  @ViewChild('dateInput', { static: false }) dateInput: ElementRef;

  ngAfterViewInit() {
    const flatpickrInstance = this.dateInput.nativeElement._flatpickr;

    if (flatpickrInstance) {
      // Attach the onChange event handler
      flatpickrInstance.config.onChange.push((selectedDates: Date[], dateStr: string, instance: any) => {
        this.onDateChange(selectedDates, dateStr, instance);
      });
    }
  }

  onDateChange(selectedDates: Date[], dateStr: string, instance: any) {
    console.log('Date changed to:', selectedDates[0]);
    const data = {
      selectedDate: selectedDates[0],
      fieldName: this.name
    }
    this.onDateChangeEmit.emit(data)
    // Implement additional logic for date change here
  }
}
