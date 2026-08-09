import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DriverCertificationService } from '@shared/_http/driver-certification.service';
import { DriverTrainingDetailsData } from '@shared/configs/driver-training-config';
import { RowData } from '@shared/models/table';
import { Subscription } from 'rxjs';
import { DriverCertificationComponent } from '../driver-certification/driver-certification.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ExcelExportService } from '@shared/services/excel-export.service';
import { currentUser } from "@shared/utils/current-user";
import { TerminalService } from "@shared/_http/terminal.service";

@Component({
  selector: 'app-driver-training-list',
  standalone: false,
  templateUrl: './driver-training-list.component.html',
  styleUrl: './driver-training-list.component.scss'
})

export class DriverTrainingListComponent implements OnInit {

  @ViewChild('certificationModal') certificationModal!: TemplateRef<any>;

  @ViewChild('certification') certificationComponent!: DriverCertificationComponent;
  DriverTrainingDetailsData: RowData = DriverTrainingDetailsData;
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

  constructor(
    private router: Router,
    private driverCertificationService: DriverCertificationService,
    private modalService: NgbModal,
    private excelService: ExcelExportService,
    private terminalService: TerminalService,
  ) { }


  ngOnInit(): void {
    this.subs = new Subscription();
    this.loadUserFromStorage();
    //this.getAllDriverCertification();
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
      this.getAllDriverCertification();
    } else {
      // With terminal ID
      this.getAllDriverCertification(terminalId);
    }
  }

  getAllDriverCertification(terminalId?: number): void {
    this.subs.add(
      this.driverCertificationService
        .getAllDriverCertification(terminalId)
        .subscribe({
          next: (value) => {
            if (value?.success && Array.isArray(value.data)) {
              this.DriverTrainingDetailsData.data = value.data;
            } else {
              this.DriverTrainingDetailsData.data = [];
            }
          },
          error: (error) => {
            console.error("Error fetching driver certification data:", error);
            this.DriverTrainingDetailsData.data = [];
          },
        }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }


  handleCreateAction() {
    this.router.navigateByUrl("/country/create")
  }

  handleDeleteAction(event: any) {
    this.subs.add(this.driverCertificationService.deleteDriverCertification(event).subscribe({
      next: (value) => {
        this.getAllDriverCertification()
      }
    }))
  }

  handleEditAction(event: any) {
    // this.certificationId = event;
    // this.modalRef = this.modalService.open(this.certificationModal, {
    //   size: 'xl',
    //   centered: true,
    //   backdrop: 'static'
    // });
    this.router.navigateByUrl(`/training-result/edit/${event}`)
  }

  handleViewAction(event: any) {
    this.certificationId = event;
    this.modalRef = this.modalService.open(this.certificationModal, {
      centered: true,
      backdrop: 'static',
      fullscreen: true,
      size: 'xl'
    });
  }

  handleExportAction(): void {
    this.excelService.exportAsExcelFile(this.DriverTrainingDetailsData.data, "driver_training_list", this.DriverTrainingDetailsData.excelKeys);
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
  }

}

