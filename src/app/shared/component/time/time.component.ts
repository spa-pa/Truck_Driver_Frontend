import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrDefaults, FlatpickrModule } from 'angularx-flatpickr';

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [CommonModule, NgbModule, FormsModule, FlatpickrModule, ReactiveFormsModule],
  providers: [FlatpickrDefaults],
  templateUrl: './time.component.html',
  styleUrl: './time.component.scss'
})
export class TimePickerComponent implements AfterViewInit {

  @Input() formControl!: FormControl;
  @Input() placeholder = '';
  @Input() required = false;
  @Input() disable = false;
  @Input() label: string = 'Select Time';
  @Input() name = '';

  @Input() minTime: string = "00:00";
  @Input() maxTime: string = "23:59"

  @Input() timeFormat = "H:i";
  @Input() altFormat = "h:i K";

  @Output() onTimeChangeEmit: EventEmitter<any> = new EventEmitter();

  @ViewChild('timeInput', { static: false }) timeInput: ElementRef;

  ngAfterViewInit() {
    const fp = this.timeInput.nativeElement._flatpickr;

    if (fp) {
      fp.set('onValueUpdate', [
        (selectedDates: Date[], timeStr: string, instance: any) => {
          this.onTimeChange(selectedDates, timeStr, instance);
        }
      ]);
    }
  }

  onTimeChange(selectedDates: Date[], timeStr: string, instance: any) {
    const model24 = instance.formatDate(selectedDates[0], "H:i");  // 24 hour

    const data = {
      selectedTime: model24,
      fieldName: this.name
    };

    this.onTimeChangeEmit.emit(data);
    this.formControl.setValue(model24);
  }
}
