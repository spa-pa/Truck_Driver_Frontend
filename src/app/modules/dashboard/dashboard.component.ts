import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { DashboardService } from "@shared/_http/dashboard.service";
import { DriverTrainingService } from "@shared/_http/driver-training.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent implements OnInit {
  activeTab: string = "gate";

  // ----- Scanned Certifications -----
  scannedCertificationsData: any[] = [];

  // ----- Drivers Training Data -----
  driversTrainingData: any[] = [];

  counts: any = {
    total_drivers: 0,
    active_certificates: 0,
    todays_gate_entries: 0,
    todays_certificates_generated: 0,
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

  //Show Certifications Scanned Summary
  get displayedCertifications(): any[] {
    return this.scannedCertificationsData.slice(0, 10);
  }

  //Show Gate Entries 
  get displayedGateEntries(): any[] {
    return this.scannedCertificationsData.slice(0, 5);
  }

  constructor(
    private dashboardService: DashboardService,
    private driverTrainingService: DriverTrainingService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getDashboardCounts();
    //this.loadDriverCertifications();
    this.loadScannedCertifications();
    //this.loadAlldriversTraining();
  }

  // Get dashboard counts from API
  getDashboardCounts(): void {
    this.dashboardService.getDashboardCount().subscribe({
      next: (response) => {
        if (response?.success && response.data) {
          this.counts = response.data;
        }
      },
      error: (error) => {
        console.error("Error fetching dashboard counts:", error);
      },
    });
  }

  loadScannedCertifications() {
    this.dashboardService.getAllScannedCertificationsData().subscribe({
      next: (response) => {
        if (response?.success && Array.isArray(response.data)) {
          this.scannedCertificationsData = response.data;
        } else {
          this.scannedCertificationsData = [];
        }
      },
      error: (error) => {
        console.error("Error fetching dashboard all data:", error);
        this.scannedCertificationsData = [];
      },
    });
  }

  loadAlldriversTraining(){
    debugger
   this.driverTrainingService.getAlldriverTraining().subscribe({
      next: (response) => {
        if (response?.success && Array.isArray(response.data)) {
          this.driversTrainingData = response.data;
        } else {
          this.driversTrainingData = [];
        }
      },
      error: (error) => {
        console.error("Error fetching dashboard all data:", error);
        this.driversTrainingData = [];
      },
   })
  }

  // Tab switching method
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }


   navigateToAllCertifications(): void {
    this.router.navigate(['/driver-entry']); // Adjust route as needed
  }
}