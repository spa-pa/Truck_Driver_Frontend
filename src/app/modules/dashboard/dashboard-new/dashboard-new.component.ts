import { CommonModule } from "@angular/common";
import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DashboardService } from "@shared/_http/dashboard.service";
import { Chart, registerables } from "chart.js";

import * as XLSX from "xlsx";

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-new.component.html',
  styleUrl: './dashboard-new.component.scss'
})
export class DashboardNewComponent implements OnInit, AfterViewInit{
@ViewChild("trendsChart") trendsChartCanvas!: ElementRef;
  @ViewChild("languageChart") languageChartCanvas!: ElementRef;
  @ViewChild("terminalChart") terminalChartCanvas!: ElementRef;
  @ViewChild("hourlyChart") hourlyChartCanvas!: ElementRef;

  
  @ViewChild("driverBreakdownChart") driverBreakdownChartCanvas!: ElementRef;


  private charts: Chart[] = [];

  activeTab: string = "gate";

  currentMonth: string = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  counts: any = {
    total_drivers: 0,
    active_certificates: 0,
    todays_gate_entries: 0,
    todays_certificates_generated: 0,
  };

  // Statistics data
  stats = {
    totalDrivers: 24589,
    activeCertificates: 14789,
    gateEntries: 1589,
    certificatesGenerated: 45289,
  };

  // Gate Entries Data
  gateEntries = [
    {
      driverName: "Rajesh Kumar",
      truckNumber: "TN-07-AB-1234",
      terminal: "Terminal A",
      status: "Entry",
      statusClass: "success",
      time: "2 min ago",
      icon: "truck",
      iconClass: "primary",
    },
    {
      driverName: "Priya Sharma",
      truckNumber: "KA-01-CD-5678",
      terminal: "Terminal B",
      status: "Entry",
      statusClass: "success",
      time: "15 min ago",
      icon: "truck",
      iconClass: "success",
    },
    {
      driverName: "Amit Patel",
      truckNumber: "MH-03-EF-9012",
      terminal: "Terminal A",
      status: "Exit",
      statusClass: "warning",
      time: "32 min ago",
      icon: "truck",
      iconClass: "warning",
    },
    {
      driverName: "Suresh Reddy",
      truckNumber: "AP-09-GH-3456",
      terminal: "Terminal C",
      status: "Entry",
      statusClass: "success",
      time: "1 hour ago",
      icon: "truck",
      iconClass: "danger",
    },
    {
      driverName: "Ananya Singh",
      truckNumber: "UP-14-IJ-7890",
      terminal: "Terminal B",
      status: "Exit",
      statusClass: "warning",
      time: "2 hours ago",
      icon: "truck",
      iconClass: "info",
    },
  ];

  // Quiz Drivers Data
  quizDrivers = [
    {
      name: "Vikram Singh",
      language: "Hindi",
      score: 2,
      totalQuestions: 2,
      quizStatus: "Passed",
      quizStatusClass: "success",
      attempts: 1,
      attemptClass: "success",
      time: "5 min ago",
      icon: "user-graduate",
      iconClass: "primary",
    },
    {
      name: "Lakshmi Devi",
      language: "Tamil",
      score: 2,
      totalQuestions: 2,
      quizStatus: "Passed",
      quizStatusClass: "success",
      attempts: 1,
      attemptClass: "success",
      time: "18 min ago",
      icon: "user-graduate",
      iconClass: "success",
    },
    {
      name: "Ganesh Patil",
      language: "Marathi",
      score: 1,
      totalQuestions: 2,
      quizStatus: "Failed",
      quizStatusClass: "danger",
      attempts: 2,
      attemptClass: "warning",
      time: "28 min ago",
      icon: "user-graduate",
      iconClass: "warning",
    },
    {
      name: "Meena Reddy",
      language: "Telugu",
      score: 2,
      totalQuestions: 2,
      quizStatus: "Passed",
      quizStatusClass: "success",
      attempts: 1,
      attemptClass: "success",
      time: "45 min ago",
      icon: "user-graduate",
      iconClass: "danger",
    },
    {
      name: "Arjun Nair",
      language: "English",
      score: 0,
      totalQuestions: 2,
      quizStatus: "Failed",
      quizStatusClass: "danger",
      attempts: 3,
      attemptClass: "danger",
      time: "1 hour ago",
      icon: "user-graduate",
      iconClass: "info",
    },
  ];

  // Driver categories
  driverCategories = [
    {
      name: "Regular Drivers",
      count: 8234,
      icon: "user-check",
      iconClass: "primary",
      growth: "3.2%",
      growthClass: "success",
      trend: "up",
    },
    {
      name: "New Drivers",
      count: 1456,
      icon: "user-plus",
      iconClass: "success",
      growth: "8.7%",
      growthClass: "success",
      trend: "up",
    },
    {
      name: "Returning Drivers",
      count: 3567,
      icon: "sync-alt",
      iconClass: "warning",
      growth: "0.8%",
      growthClass: "warning",
      trend: "minus",
    },
    {
      name: "Blocked Drivers",
      count: 342,
      icon: "user-slash",
      iconClass: "danger",
      growth: "2.1%",
      growthClass: "danger",
      trend: "down",
    },
  ];

  // Compliance data
  complianceData = {
    passRate: 94,
    passRateChange: "+2.5%",
    mobileUsage: 75,
    kioskUsage: 25,
    statuses: [
      { label: "Verified", count: 1245, percentage: 78, class: "success" },
      { label: "Pending", count: 246, percentage: 15, class: "warning" },
      { label: "Failed", count: 112, percentage: 7, class: "danger" },
    ],
  };

  // Terminal data
  terminalData = [
    { name: "Terminal A", count: 450 },
    { name: "Terminal B", count: 380 },
    { name: "Terminal C", count: 320 },
    { name: "Terminal D", count: 290 },
    { name: "Terminal E", count: 210 },
  ];

  // Language data
  languageData = [
    { name: "Hindi", count: 35 },
    { name: "Tamil", count: 25 },
    { name: "Telugu", count: 20 },
    { name: "Marathi", count: 12 },
    { name: "English", count: 8 },
  ];

   weeklyDataMap: { [offset: number]: { terminal: string, completions: number }[] } = {
    0: [
      { terminal: "Terminal A", completions: 120 },
      { terminal: "Terminal B", completions: 98 },
      { terminal: "Terminal C", completions: 85 },
      { terminal: "Terminal D", completions: 72 },
      { terminal: "Terminal E", completions: 55 },
      { terminal: "Terminal F", completions: 40 },
      { terminal: "Terminal G", completions: 35 },
    ],
    1: [
      { terminal: "Terminal A", completions: 105 },
      { terminal: "Terminal B", completions: 88 },
      { terminal: "Terminal C", completions: 75 },
      { terminal: "Terminal D", completions: 60 },
      { terminal: "Terminal E", completions: 45 },
      { terminal: "Terminal F", completions: 30 },
      { terminal: "Terminal G", completions: 25 },
    ],
    2: [
      { terminal: "Terminal A", completions: 95 },
      { terminal: "Terminal B", completions: 80 },
      { terminal: "Terminal C", completions: 65 },
      { terminal: "Terminal D", completions: 50 },
      { terminal: "Terminal E", completions: 35 },
      { terminal: "Terminal F", completions: 20 },
      { terminal: "Terminal G", completions: 15 },
    ],
  };

   monthlyDataMap: { [offset: number]: { terminal: string, certifications: number }[] } = {
    0: [
      { terminal: "Terminal A", certifications: 480 },
      { terminal: "Terminal B", certifications: 390 },
      { terminal: "Terminal C", certifications: 320 },
      { terminal: "Terminal D", certifications: 280 },
      { terminal: "Terminal E", certifications: 210 },
      { terminal: "Terminal F", certifications: 150 },
      { terminal: "Terminal G", certifications: 120 },
    ],
    1: [
      { terminal: "Terminal A", certifications: 450 },
      { terminal: "Terminal B", certifications: 370 },
      { terminal: "Terminal C", certifications: 300 },
      { terminal: "Terminal D", certifications: 260 },
      { terminal: "Terminal E", certifications: 190 },
      { terminal: "Terminal F", certifications: 130 },
      { terminal: "Terminal G", certifications: 100 },
    ],
    2: [
      { terminal: "Terminal A", certifications: 420 },
      { terminal: "Terminal B", certifications: 340 },
      { terminal: "Terminal C", certifications: 280 },
      { terminal: "Terminal D", certifications: 230 },
      { terminal: "Terminal E", certifications: 170 },
      { terminal: "Terminal F", certifications: 110 },
      { terminal: "Terminal G", certifications: 85 },
    ],
  };

  uniqueDrivers = 15890;
  repeatDrivers = 8699;
  uniquePercentage: number;

  selectedWeekOffset: number = 0;
  selectedMonthOffset: number = 0;

   weeklyData: { terminal: string, completions: number }[] = [];
  monthlyData: { terminal: string, certifications: number }[] = [];

  locationVolume = [
    { terminal: "Terminal A", weekly: 120, monthly: 480, total: 2450 },
    { terminal: "Terminal B", weekly: 98, monthly: 390, total: 2100 },
    { terminal: "Terminal C", weekly: 85, monthly: 320, total: 1800 },
    { terminal: "Terminal D", weekly: 72, monthly: 280, total: 1500 },
    { terminal: "Terminal E", weekly: 55, monthly: 210, total: 1200 },
    { terminal: "Terminal F", weekly: 40, monthly: 150, total: 800 },
    { terminal: "Terminal G", weekly: 35, monthly: 120, total: 650 },
  ];

  constructor(private dashboardService: DashboardService) {
    this.uniquePercentage = Math.round((this.uniqueDrivers / (this.uniqueDrivers + this.repeatDrivers)) * 100);
    // Initialize with default offsets
    this.weeklyData = this.weeklyDataMap[this.selectedWeekOffset];
    this.monthlyData = this.monthlyDataMap[this.selectedMonthOffset]
  }

  ngOnInit(): void {
    this.getDashboardCounts();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeCharts();
    }, 500);
  }

    get selectedWeekLabel(): string {
    const labels = ['This Week', 'Last Week', '2 Weeks Ago'];
    return labels[this.selectedWeekOffset] || 'This Week';
  }
  get selectedMonthLabel(): string {
    const labels = ['This Month', 'Last Month', '2 Months Ago'];
    return labels[this.selectedMonthOffset] || 'This Month';
  }

  // Computed values for progress bars
 get maxWeeklyCompletions(): number {
    return Math.max(...this.weeklyData.map(d => d.completions), 1);
  }
  get maxMonthlyCertifications(): number {
    return Math.max(...this.monthlyData.map(d => d.certifications), 1);
  }

  // Get dashboard counts from API
  getDashboardCounts(): void {
    this.dashboardService.getDashboardCount().subscribe({
      next: (response) => {
        console.log("Success:", response);
        if (response && response.success && response.data) {
          this.counts = response.data;
        }
      },
      error: (error) => {
        console.error("Error fetching dashboard counts:", error);
        // Keep default values if API fails
      },
      complete: () => {
        console.log("Dashboard counts API call completed");
      },
    });
  }

  // Tab switching method
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  initializeCharts(): void {
    this.initializeTrendsChart();
    this.initializeLanguageChart();
    this.initializeTerminalChart();
    this.initializeHourlyChart();

    this.initializeDriverBreakdownChart();
  }

  initializeTrendsChart(): void {
    if (!this.trendsChartCanvas) return;

    const ctx = this.trendsChartCanvas.nativeElement.getContext("2d");
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Certifications",
            data: [65, 78, 82, 95, 88, 72, 60],
            borderColor: "#1c2b3a",
            backgroundColor: "rgba(28, 43, 58, 0.1)",
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: "#1c2b3a",
          },
          {
            label: "Gate Entries",
            data: [45, 52, 58, 65, 60, 48, 40],
            borderColor: "#1f9d55",
            backgroundColor: "rgba(31, 157, 85, 0.1)",
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: "#1f9d55",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0,0,0,0.05)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
    this.charts.push(chart);
  }

  initializeLanguageChart(): void {
    if (!this.languageChartCanvas) return;

    const ctx = this.languageChartCanvas.nativeElement.getContext("2d");
    const chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Hindi", "Tamil", "Telugu", "Marathi", "English"],
        datasets: [
          {
            data: [35, 25, 20, 12, 8],
            backgroundColor: [
              "#1c2b3a",
              "#2c4256",
              "#f5a623",
              "#1f9d55",
              "#d64545",
            ],
            borderWidth: 2,
            borderColor: "#ffffff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 15,
              usePointStyle: true,
              pointStyle: "circle",
              font: {
                size: 11,
              },
            },
          },
        },
        cutout: "65%",
      },
    });
    this.charts.push(chart);
  }

  initializeTerminalChart(): void {
    if (!this.terminalChartCanvas) return;

    const ctx = this.terminalChartCanvas.nativeElement.getContext("2d");
    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: this.terminalData.map((t) => t.name),
        datasets: [
          {
            label: "Certifications",
            data: this.terminalData.map((t) => t.count),
            backgroundColor: [
              "#1c2b3a",
              "#2c4256",
              "#f5a623",
              "#1f9d55",
              "#d64545",
            ],
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0,0,0,0.05)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
    this.charts.push(chart);
  }

  initializeHourlyChart(): void {
    if (!this.hourlyChartCanvas) return;

    const ctx = this.hourlyChartCanvas.nativeElement.getContext("2d");
    const hourlyData = [
      15, 45, 55, 40, 25, 30, 35, 42, 38, 45, 50, 55, 48, 35, 30, 25,
    ];
    const maxValue = Math.max(...hourlyData);
    const peakIndex = hourlyData.indexOf(maxValue);

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "6 AM",
          "7 AM",
          "8 AM",
          "9 AM",
          "10 AM",
          "11 AM",
          "12 PM",
          "1 PM",
          "2 PM",
          "3 PM",
          "4 PM",
          "5 PM",
          "6 PM",
          "7 PM",
          "8 PM",
          "9 PM",
        ],
        datasets: [
          {
            label: "Entries",
            data: hourlyData,
            backgroundColor: hourlyData.map((_, index) =>
              index === peakIndex ? "#f5a623" : "rgba(28, 43, 58, 0.6)",
            ),
            borderRadius: 4,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0,0,0,0.05)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
    this.charts.push(chart);
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      Verified: "fa-check-circle",
      Pending: "fa-clock",
      Failed: "fa-times-circle",
    };
    return icons[status] || "fa-circle";
  }

  getTrendIcon(trend: string): string {
    const icons: { [key: string]: string } = {
      up: "fa-arrow-up",
      down: "fa-arrow-down",
      minus: "fa-minus",
    };
    return icons[trend] || "fa-minus";
  }


  initializeDriverBreakdownChart(): void {
    if (!this.driverBreakdownChartCanvas) return;
    const ctx = this.driverBreakdownChartCanvas.nativeElement.getContext("2d");
    const chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Unique", "Repeat"],
        datasets: [
          {
            data: [this.uniqueDrivers, this.repeatDrivers],
            backgroundColor: ["#1c2b3a", "#e9ecef"],
            borderWidth: 2,
            borderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.raw} drivers`,
            },
          },
        },
      },
    });
    this.charts.push(chart);
  }

  // Export Weekly Summary
  exportWeekly(): void {
    const data = [
      ['Terminal', 'Completions (Last 7 Days)'],
      ...this.weeklyData.map(d => [d.terminal, d.completions])
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Weekly Summary');
    XLSX.writeFile(wb, `Weekly_Summary_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  // Export Monthly Report
  exportMonthly(): void {
    const data = [
      ['Terminal', 'Certifications (Current Month)'],
      ...this.monthlyData.map(d => [d.terminal, d.certifications])
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Monthly Report');
    XLSX.writeFile(wb, `Monthly_Report_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  // Export Driver Breakdown
  exportDriverBreakdown(): void {
    const data = [
      ['Driver Type', 'Count'],
      ['Unique', this.uniqueDrivers],
      ['Repeat', this.repeatDrivers],
      ['Total', this.uniqueDrivers + this.repeatDrivers],
      ['Unique Percentage', `${this.uniquePercentage}%`]
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Driver Breakdown');
    XLSX.writeFile(wb, `Driver_Breakdown_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

   exportToExcel(): void {
    // We can reuse the exportComplianceExcel logic, or make a combined export.
    this.exportComplianceExcel();
  }

  // Export Volume by Location
  exportVolume(): void {
    const data = [
      ['Terminal', 'This Week', 'This Month', 'Total'],
      ...this.locationVolume.map(d => [d.terminal, d.weekly, d.monthly, d.total])
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Volume by Location');
    XLSX.writeFile(wb, `Volume_By_Location_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

    exportComplianceExcel(): void {
    const wb = XLSX.utils.book_new();

    // Weekly
    const weeklyData = [
      ['Terminal', 'Completions (Last 7 Days)'],
      ...this.weeklyData.map(d => [d.terminal, d.completions])
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(weeklyData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Weekly Summary');

    // Monthly
    const monthlyData = [
      ['Terminal', 'Certifications (Current Month)'],
      ...this.monthlyData.map(d => [d.terminal, d.certifications])
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(monthlyData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Monthly Report');

    // Driver Breakdown
    const driverData = [
      ['Driver Type', 'Count'],
      ['Unique', this.uniqueDrivers],
      ['Repeat', this.repeatDrivers],
      ['Total', this.uniqueDrivers + this.repeatDrivers],
      ['Unique Percentage', `${this.uniquePercentage}%`]
    ];
    const ws3 = XLSX.utils.aoa_to_sheet(driverData);
    XLSX.utils.book_append_sheet(wb, ws3, 'Driver Breakdown');

    // Volume by Location
    const volumeData = [
      ['Terminal', 'This Week', 'This Month', 'Total'],
      ...this.locationVolume.map(d => [d.terminal, d.weekly, d.monthly, d.total])
    ];
    const ws4 = XLSX.utils.aoa_to_sheet(volumeData);
    XLSX.utils.book_append_sheet(wb, ws4, 'Volume by Location');

    XLSX.writeFile(wb, `Compliance_Report_${new Date().toISOString().slice(0,10)}.xlsx`);
  }


    // ===== DATE FILTER HANDLERS =====
  onWeekChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedWeekOffset = parseInt(target.value, 10);
    this.weeklyData = this.weeklyDataMap[this.selectedWeekOffset];
  }

  onMonthChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedMonthOffset = parseInt(target.value, 10);
    this.monthlyData = this.monthlyDataMap[this.selectedMonthOffset];
  }
}
