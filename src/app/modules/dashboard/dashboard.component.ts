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

Chart.register(...registerables);

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild("trendsChart") trendsChartCanvas!: ElementRef;
  @ViewChild("languageChart") languageChartCanvas!: ElementRef;
  @ViewChild("terminalChart") terminalChartCanvas!: ElementRef;
  @ViewChild("hourlyChart") hourlyChartCanvas!: ElementRef;

  private charts: Chart[] = [];

  activeTab: string = "gate";

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

  // Recent certifications data
  recentCertifications = [
    {
      name: "Rajesh Kumar",
      certificate: "CT20260101-001",
      status: "Verified",
      statusClass: "success",
      time: "2 min ago",
      icon: "user",
      iconClass: "primary",
    },
    {
      name: "Priya Sharma",
      certificate: "CT20260101-002",
      status: "Verified",
      statusClass: "success",
      time: "15 min ago",
      icon: "user",
      iconClass: "success",
    },
    {
      name: "Amit Patel",
      certificate: "CT20260101-003",
      status: "Pending",
      statusClass: "warning",
      time: "32 min ago",
      icon: "user",
      iconClass: "warning",
    },
    {
      name: "Suresh Reddy",
      certificate: "CT20260101-004",
      status: "Failed",
      statusClass: "danger",
      time: "1 hour ago",
      icon: "user",
      iconClass: "danger",
    },
    {
      name: "Ananya Singh",
      certificate: "CT20260101-005",
      status: "Verified",
      statusClass: "success",
      time: "2 hours ago",
      icon: "user",
      iconClass: "info",
    },
  ];

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

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.getDashboardCounts();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeCharts();
    }, 500);
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
}
