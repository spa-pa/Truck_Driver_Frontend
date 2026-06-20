import { Component } from '@angular/core';
import { DashboardService } from '@shared/_http/dashboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  subs: any;
  projectHistory: any;
  schedulerConfig: any;

  TotalSaleChart = { "series": [{ "data": [30, 20, 25, 15, 35, 38, 49, 38, 45, 35, 55, 57] }], "chart": { "width": 180, "height": 120, "type": "line", "toolbar": { "show": false }, "offsetY": 10, "dropShadow": { "enabled": false } }, "grid": { "show": false }, "colors": ["#004761"], "stroke": { "width": 2, "curve": "smooth" }, "labels": ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"], "markers": { "size": 0 }, "xaxis": { "axisBorder": { "show": false }, "axisTicks": { "show": false }, "labels": { "show": false }, "tooltip": { "enabled": false } }, "yaxis": { "axisBorder": { "show": false }, "axisTicks": { "show": false }, "labels": { "show": false } }, "legend": { "show": false }, "tooltip": { "marker": { "show": false }, "x": { "show": false }, "y": { "show": false, "labels": { "show": false } } }, "responsive": [{ "breakpoint": 1790, "options": { "chart": { "width": 150 } } }, { "breakpoint": 1660, "options": { "chart": { "width": 120 } } }, { "breakpoint": 1520, "options": { "chart": { "width": 100 } } }, { "breakpoint": 1500, "options": { "chart": { "width": 200, "height": 130, "offsetX": 20, "offsetY": 20 } } }, { "breakpoint": 1340, "options": { "chart": { "width": 170, "height": 120 } } }, { "breakpoint": 1270, "options": { "chart": { "width": 170, "height": 100 } } }, { "breakpoint": 1200, "options": { "chart": { "width": 180, "height": 120, "offsetX": -10 } } }, { "breakpoint": 992, "options": { "chart": { "width": 130, "height": 120, "offsetX": 10 } } }, { "breakpoint": 976, "options": { "chart": { "width": 180, "height": 120, "offsetX": 40 } } }, { "breakpoint": 768, "options": { "chart": { "width": 180, "height": 120, "offsetX": 0 } } }, { "breakpoint": 380, "options": { "chart": { "width": 110, "height": 120, "offsetX": 0 } } }], "name": "Total Port Config", "percentage": "3.4%", "class1": "danger", "class2": "primary", "price": " 0", "icon": "Product-discount", "des": "PDF files configured", "icon2": "arrow-up-right" }
  TotalSaleChart1 = { "series": [{ "data": [30, 20, 25, 15, 35, 38, 49, 38, 45, 35, 55, 57] }], "chart": { "width": 180, "height": 120, "type": "line", "toolbar": { "show": false }, "offsetY": 10, "dropShadow": { "enabled": false } }, "grid": { "show": false }, "colors": ["#004761"], "stroke": { "width": 2, "curve": "smooth" }, "labels": ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"], "markers": { "size": 0 }, "xaxis": { "axisBorder": { "show": false }, "axisTicks": { "show": false }, "labels": { "show": false }, "tooltip": { "enabled": false } }, "yaxis": { "axisBorder": { "show": false }, "axisTicks": { "show": false }, "labels": { "show": false } }, "legend": { "show": false }, "tooltip": { "marker": { "show": false }, "x": { "show": false }, "y": { "show": false, "labels": { "show": false } } }, "responsive": [{ "breakpoint": 1790, "options": { "chart": { "width": 150 } } }, { "breakpoint": 1660, "options": { "chart": { "width": 120 } } }, { "breakpoint": 1520, "options": { "chart": { "width": 100 } } }, { "breakpoint": 1500, "options": { "chart": { "width": 200, "height": 130, "offsetX": 20, "offsetY": 20 } } }, { "breakpoint": 1340, "options": { "chart": { "width": 170, "height": 120 } } }, { "breakpoint": 1270, "options": { "chart": { "width": 170, "height": 100 } } }, { "breakpoint": 1200, "options": { "chart": { "width": 180, "height": 120, "offsetX": -10 } } }, { "breakpoint": 992, "options": { "chart": { "width": 130, "height": 120, "offsetX": 10 } } }, { "breakpoint": 976, "options": { "chart": { "width": 180, "height": 120, "offsetX": 40 } } }, { "breakpoint": 768, "options": { "chart": { "width": 180, "height": 120, "offsetX": 0 } } }, { "breakpoint": 380, "options": { "chart": { "width": 110, "height": 120, "offsetX": 0 } } }], "name": "PDF Scans", "percentage": "3.4%", "class1": "danger", "class2": "primary", "price": " 0", "icon": "Product-discount", "des": "PDF files processed by AI", "icon2": "arrow-up-right" }
  TotalSaleChart2 = { "series": [{ "data": [30, 20, 25, 15, 35, 38, 49, 38, 45, 35, 55, 57] }], "chart": { "width": 180, "height": 120, "type": "line", "toolbar": { "show": false }, "offsetY": 10, "dropShadow": { "enabled": false } }, "grid": { "show": false }, "colors": ["#004761"], "stroke": { "width": 2, "curve": "smooth" }, "labels": ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"], "markers": { "size": 0 }, "xaxis": { "axisBorder": { "show": false }, "axisTicks": { "show": false }, "labels": { "show": false }, "tooltip": { "enabled": false } }, "yaxis": { "axisBorder": { "show": false }, "axisTicks": { "show": false }, "labels": { "show": false } }, "legend": { "show": false }, "tooltip": { "marker": { "show": false }, "x": { "show": false }, "y": { "show": false, "labels": { "show": false } } }, "responsive": [{ "breakpoint": 1790, "options": { "chart": { "width": 150 } } }, { "breakpoint": 1660, "options": { "chart": { "width": 120 } } }, { "breakpoint": 1520, "options": { "chart": { "width": 100 } } }, { "breakpoint": 1500, "options": { "chart": { "width": 200, "height": 130, "offsetX": 20, "offsetY": 20 } } }, { "breakpoint": 1340, "options": { "chart": { "width": 170, "height": 120 } } }, { "breakpoint": 1270, "options": { "chart": { "width": 170, "height": 100 } } }, { "breakpoint": 1200, "options": { "chart": { "width": 180, "height": 120, "offsetX": -10 } } }, { "breakpoint": 992, "options": { "chart": { "width": 130, "height": 120, "offsetX": 10 } } }, { "breakpoint": 976, "options": { "chart": { "width": 180, "height": 120, "offsetX": 40 } } }, { "breakpoint": 768, "options": { "chart": { "width": 180, "height": 120, "offsetX": 0 } } }, { "breakpoint": 380, "options": { "chart": { "width": 110, "height": 120, "offsetX": 0 } } }], "name": "EBMS Uploaded", "percentage": "3.4%", "class1": "danger", "class2": "primary", "price": " 0", "icon": "Product-discount", "des": "EBMS uploaded data", "icon2": "arrow-up-right" }
  TotalSaleChart3 = { "series": [{ "data": [30, 20, 25, 15, 35, 38, 49, 38, 45, 35, 55, 57] }], "chart": { "width": 180, "height": 120, "type": "line", "toolbar": { "show": false }, "offsetY": 10, "dropShadow": { "enabled": false } }, "grid": { "show": false }, "colors": ["#004761"], "stroke": { "width": 2, "curve": "smooth" }, "labels": ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"], "markers": { "size": 0 }, "xaxis": { "axisBorder": { "show": false }, "axisTicks": { "show": false }, "labels": { "show": false }, "tooltip": { "enabled": false } }, "yaxis": { "axisBorder": { "show": false }, "axisTicks": { "show": false }, "labels": { "show": false } }, "legend": { "show": false }, "tooltip": { "marker": { "show": false }, "x": { "show": false }, "y": { "show": false, "labels": { "show": false } } }, "responsive": [{ "breakpoint": 1790, "options": { "chart": { "width": 150 } } }, { "breakpoint": 1660, "options": { "chart": { "width": 120 } } }, { "breakpoint": 1520, "options": { "chart": { "width": 100 } } }, { "breakpoint": 1500, "options": { "chart": { "width": 200, "height": 130, "offsetX": 20, "offsetY": 20 } } }, { "breakpoint": 1340, "options": { "chart": { "width": 170, "height": 120 } } }, { "breakpoint": 1270, "options": { "chart": { "width": 170, "height": 100 } } }, { "breakpoint": 1200, "options": { "chart": { "width": 180, "height": 120, "offsetX": -10 } } }, { "breakpoint": 992, "options": { "chart": { "width": 130, "height": 120, "offsetX": 10 } } }, { "breakpoint": 976, "options": { "chart": { "width": 180, "height": 120, "offsetX": 40 } } }, { "breakpoint": 768, "options": { "chart": { "width": 180, "height": 120, "offsetX": 0 } } }, { "breakpoint": 380, "options": { "chart": { "width": 110, "height": 120, "offsetX": 0 } } }], "name": "EBMS Not Uploaded", "percentage": "3.4%", "class1": "danger", "class2": "primary", "price": " 0", "icon": "Product-discount", "des": "EBMS data not uploaded", "icon2": "arrow-up-right" }

  constructor(private dashboardservice: DashboardService) { }

  ngOnInit(): void {
    this.subs = new Subscription()
    // this.getDashboardCount();
    // this.getAllProjectHistory();
    // this.getAllScheduler();
  }

  // getDashboardCount() {
  //   this.subs.add(this.dashboardservice.getDashboardCount().subscribe({
  //     next: (value) => {
  //       this.TotalSaleChart.price = value.data.total_config ?? 0
  //       this.TotalSaleChart1.price = value.data.total_history ?? 0
  //       this.TotalSaleChart2.price = value.data.ebs_uploaded ?? 0
  //       this.TotalSaleChart3.price = value.data.ebs_not_uploaded ?? 0
  //     }
  //   }))
  // }

  // getAllScheduler() {
  //   this.subs.add(this.schedulerservice.getAllScheduler().subscribe({
  //     next: (value) => {
  //       this.schedulerConfig = value.data;
  //     }
  //   }))
  // }

  // getAllProjectHistory() {
  //   this.subs.add(this.projectservice.getAllProjectHistory().subscribe({
  //     next: (value) => {
  //       this.projectHistory = value.data.slice(0, 6);
  //     }
  //   }))
  // }
}
