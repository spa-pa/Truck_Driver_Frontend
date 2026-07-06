import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { DashboardService } from "@shared/_http/dashboard.service";
import { DriverTrainingService } from "@shared/_http/driver-training.service";
import { TerminalService } from "@shared/_http/terminal.service";
import { GlobalConfig } from "@shared/configs/global-config";
import { currentUser } from "@shared/utils/current-user";
import { EncryptedStorage } from "@shared/utils/encrypted-storage";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent implements OnInit {
  // Data arrays
  scannedCertificationsData: any[] = [];
  driversTrainingData: any[] = [];

  // User info
  userRole: string = "";
  userId: number | null = null;
  userTerminalId: number | null = null;

  // Terminal dropdown (Super Admin only)
  terminalList: any[] = [];
  selectedTerminalId: number | null = null;

  counts: any = {
    total_drivers: 0,
    active_certificates: 0,
    todays_gate_entries: 0,
    todays_certificates_generated: 0,
  };

  get displayedTrainingCertifications(): any[] {
    return this.driversTrainingData.slice(0, 10);
  }

  //Show Certifications Scanned Summary
  get displayedScannedCertifications(): any[] {
    return this.scannedCertificationsData.slice(0, 10);
  }

  constructor(
    private dashboardService: DashboardService,
    private terminalService: TerminalService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const user = currentUser();
    this.userId = user.role_id;
    this.userRole = user.role_name;
    this.userTerminalId = user.terminal_id || null;

    if (this.userRole === "SUPER ADMIN") {
      // Load terminal list for dropdown, then load data for all terminals
      this.loadTerminals();
    } else {
      // Admin: load data for their terminal only
      this.loadDashboardData(this.userTerminalId);
    }
  }

  private loadTerminals(): void {
    this.terminalService.getAllTerminals().subscribe({
      next: (response) => {
        if (response?.success && Array.isArray(response.data)) {
          this.terminalList = response.data;
          // Set default selection to "All Terminals" (null)
          this.selectedTerminalId = null;
          // Load data for all terminals
          this.loadDashboardData(null);
        }
      },
      error: (error) => console.error("Error loading terminals:", error),
    });
  }

  // Called when Super Admin changes the dropdown
  onTerminalChange(): void {
    this.loadDashboardData(this.selectedTerminalId);
  }

  private loadDashboardData(terminalId: number | null): void {
    if (terminalId === null) {
      // Call APIs without any terminal_id parameter
      this.getDashboardCounts();
      this.loadScannedCertifications();
      this.loadAlldriversTraining();
    } else {
      // Call APIs with the selected terminal_id
      this.getDashboardCounts(terminalId);
      this.loadScannedCertifications(terminalId);
      this.loadAlldriversTraining(terminalId);
    }
  }

  // Get dashboard counts from API
  getDashboardCounts(terminalId?: number): void {
    this.dashboardService.getDashboardCount(terminalId).subscribe({
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

  loadScannedCertifications(terminalId?: number): void {
    this.dashboardService
      .getAllScannedCertificationsData(terminalId)
      .subscribe({
        next: (response) => {
          if (response?.success && Array.isArray(response.data)) {
            this.scannedCertificationsData = response.data;
          } else {
            this.scannedCertificationsData = [];
          }
        },
        error: (error) => {
          console.error("Error fetching scanned certifications:", error);
          this.scannedCertificationsData = [];
        },
      });
  }

  loadAlldriversTraining(terminalId?: number): void {
    this.dashboardService.getAllDriverCertification(terminalId).subscribe({
      next: (response) => {
        if (response?.success && Array.isArray(response.data)) {
          this.driversTrainingData = response.data;
        } else {
          this.driversTrainingData = [];
        }
      },
      error: (error) => {
        console.error("Error fetching training certifications:", error);
        this.driversTrainingData = [];
      },
    });
  }

  navigateToAllTraining() {
    this.router.navigate(["/training-result"]);
  }

  navigateToAllCertifications(): void {
    this.router.navigate(["/driver-entry"]);
  }
}
