import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-count-view',
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './count-view.component.html',
  styleUrl: './count-view.component.scss'
})
export class CountViewComponent {
  @Input() data: any;
}
