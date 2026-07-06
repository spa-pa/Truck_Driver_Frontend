import { Component, TemplateRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { CertificateScannedService } from "@shared/_http/certificate-scanned.service";
import { DriverEntriesDetailsData } from "@shared/configs/driver-entries-config";
import { DriverTrainingDetailsData } from "@shared/configs/driver-training-config";
import { RowData } from "@shared/models/table";
import { Subscription } from "rxjs";
import { ExcelExportService } from "@shared/services/excel-export.service";
import { currentUser } from "@shared/utils/current-user";
import { TerminalService } from "@shared/_http/terminal.service";

@Component({
  selector: "app-driver-entry-list",
  standalone: false,
  templateUrl: "./driver-entry-list.component.html",
  styleUrl: "./driver-entry-list.component.scss",
})
export class DriverEntryListComponent {
  DriverEntriesDetailsData: RowData = DriverEntriesDetailsData;
  subs: any;
  certificationId: any;

  // User info
  userRole: string = "";
  userId: number | null = null;
  userTerminalId: number | null = null;

  // Terminal dropdown (Super Admin only)
  terminalList: any[] = [];
  selectedTerminalId: number | null = null;

  private modalRef: NgbModalRef | null = null;

  @ViewChild("certificationModal") certificationModal!: TemplateRef<any>;

  constructor(
    private router: Router,
    private certificateScannedService: CertificateScannedService,
    private modalService: NgbModal,
    private excelService: ExcelExportService,
    private terminalService: TerminalService,
  ) {}

  ngOnInit(): void {
    this.loadUserFromStorage();
    this.subs = new Subscription();
  }

  private loadUserFromStorage(): void {
    const user = currentUser();
    this.userId = user.role_id;
    this.userRole = user.role_name;
    this.userTerminalId = user.terminal_id || null;

    if (this.userId === 1) {
      // Load terminals and then data for all terminals
      this.loadTerminals();
    } else {
      // Admin: load data for their terminal only
      this.loadData(this.userTerminalId);
    }
  }

  private loadTerminals(): void {
    this.terminalService.getAllTerminals().subscribe({
      next: (response) => {
        if (response?.success && Array.isArray(response.data)) {
          this.terminalList = response.data;
          // Default to "All Terminals" (null)
          this.selectedTerminalId = null;
          this.loadData(null);
        }
      },
      error: (error) => console.error("Error loading terminals:", error),
    });
  }

  onTerminalChange(): void {
    this.loadData(this.selectedTerminalId);
  }

  private loadData(terminalId: number | null): void {
    if (terminalId === null) {
      // No parameter → all terminals
      this.getAllCertificateScanned();
    } else {
      // With terminal ID
      this.getAllCertificateScanned(terminalId);
    }
  }

  getAllCertificateScanned(terminalId?: number): void {
    this.subs.add(
      this.certificateScannedService
        .getAllCertificateScanned(terminalId)
        .subscribe({
          next: (value) => {
            if (value?.success && Array.isArray(value.data)) {
              this.DriverEntriesDetailsData.data = value.data;
            } else {
              this.DriverEntriesDetailsData.data = [];
            }
          },
          error: (error) => {
            console.error("Error fetching certificate scanned data:", error);
            this.DriverEntriesDetailsData.data = [];
          },
        }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  handleCreateAction() {
    this.router.navigateByUrl("/city/create");
  }

  handleDeleteAction(event: any) {
    this.subs.add(
      this.certificateScannedService.deleteCertificateScanned(event).subscribe({
        next: (value) => {
          this.getAllCertificateScanned();
        },
      }),
    );
  }

  handleEditAction(event: any) {
    // this.router.navigateByUrl(`/city/edit/${event}`)
  }

  handleViewAction(event: any) {
    this.certificationId = event;
    this.modalRef = this.modalService.open(this.certificationModal, {
      size: "xl",
      centered: true,
      backdrop: "static",
    });
  }
  handleExportAction(): void {
    this.excelService.exportAsExcelFile(
      this.DriverEntriesDetailsData.data,
      "driver_entries_list",
      this.DriverEntriesDetailsData.excelKeys,
    );
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
  }
}
