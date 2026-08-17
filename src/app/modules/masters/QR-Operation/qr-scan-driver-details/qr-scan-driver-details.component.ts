import { CommonModule } from "@angular/common";
import { Component, ViewChild, inject } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { DriverCertificationComponent } from "@modules/masters/driver/driver-certification/driver-certification.component";
import { QRScannerModalComponent } from "@shared/component/header/qr/qr-scanner-modal/qr-scanner-modal.component";
import { DriverCertificationService } from "@shared/_http/driver-certification.service";

import { currentUser } from "@shared/utils/current-user";
import { CertificateScannedService } from "@shared/_http/certificate-scanned.service";
import { ToastService } from "@shared/services/toast.service";
import { Subscription } from "rxjs";

// Interface for search parameters
interface SearchParams {
  mobileNo: string;
  licenseNo: string;
}

@Component({
  selector: "app-qr-scan-driver-details",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    QRScannerModalComponent,
    DriverCertificationComponent,
  ],
  templateUrl: "./qr-scan-driver-details.component.html",
  styleUrl: "./qr-scan-driver-details.component.scss",
})
export class QRScanDriverDetailsComponent {
  @ViewChild("certification")
  certificationComponent!: DriverCertificationComponent;
  @ViewChild("qrScannerModal") qrScannerModal!: QRScannerModalComponent;

  certificationId: string = "";

  searchParams: SearchParams = {
    mobileNo: "",
    licenseNo: "",
  };

  searchLoading: boolean = false;
  searchError: boolean = false;
  searchErrorMessage: string = "";

  subs: Subscription = new Subscription();
  isManualSearch: boolean = false;

  constructor(
    private driverCertificationService: DriverCertificationService,
    private certificateScannedService: CertificateScannedService,
    private toastService: ToastService,
  ) {}

  onScanComplete(data: any): void {
    this.searchError = false;
    this.searchErrorMessage = "";

    if (data?.parsed?.certification_id) {
      this.isManualSearch = false;
      this.certificationId = data.parsed.certification_id;

      setTimeout(() => {
        const element = document.querySelector(".certification-section");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    } else {
      console.warn("[QRScan] No certification_id found in scanned data");
    }
  }

  onSearch(): void {
    if (!this.searchParams.mobileNo && !this.searchParams.licenseNo) {
      this.searchError = true;
      this.searchErrorMessage =
        "Please enter either mobile number or license number.";
      return;
    }

    this.searchError = false;
    this.searchErrorMessage = "";
    this.searchLoading = true;

    const params: any = {};
    if (this.searchParams.mobileNo) {
      params.mobileNo = this.searchParams.mobileNo.trim();
    }
    if (this.searchParams.licenseNo) {
      params.licenseNo = this.searchParams.licenseNo.trim();
    }

    this.driverCertificationService
      .searchDriverCertification(params)
      .subscribe({
        next: (response: any) => {
          this.searchLoading = false;

          if (response?.data?.certification_id) {
            this.isManualSearch = true;
            this.certificationId = response.data.certification_id;

            setTimeout(() => {
              const element = document.querySelector(".certification-section");
              if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }, 500);
          } else if (response?.certification_id) {
            this.isManualSearch = true;
            this.certificationId = response.certification_id;
            setTimeout(() => {
              const element = document.querySelector(".certification-section");
              if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }, 500);
          } else {
            this.searchError = true;
            this.searchErrorMessage =
              response?.message ||
              "No certification found matching the provided details.";
          }
        },
        error: (err: any) => {
          this.searchLoading = false;
          this.searchError = true;

          if (err?.error?.message) {
            this.searchErrorMessage = err.error.message;
          } else if (err?.status === 404) {
            this.searchErrorMessage =
              "No certification found matching the provided details.";
          } else {
            this.searchErrorMessage =
              "An error occurred while searching. Please try again.";
          }

          console.error("[QRScan] Search error:", err);
        },
      });
  }

  gateIn(): void {
    const payload = {
      terminal_id: currentUser().terminal_id,
      certification_id: this.certificationId,
    };

    this.subs.add(this.certificateScannedService.createCertificateScanned(payload).subscribe({
      next: (value) => {
        if (value?.data?.driver_certification_id) {
          this.isManualSearch = false;
          this.toastService.open("Gate In Successful", "success");
        }
      },
      error: (err) => {
        this.toastService.open("Failed to perform Gate In", "error");
      },
    }));
  }

  refreshCertification(): void {
    if (this.certificationComponent) {
      this.certificationComponent.refresh();
    }
  }

  clearCertification(): void {
    this.isManualSearch = false;
    this.certificationId = "";
    this.searchParams = { mobileNo: "", licenseNo: "" };
    this.searchError = false;
    this.searchErrorMessage = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  rescan(): void {
    this.isManualSearch = false;
    this.certificationId = "";
    this.searchParams = { mobileNo: "", licenseNo: "" };
    this.searchError = false;
    this.searchErrorMessage = "";

    if (this.certificationComponent) {
      this.certificationComponent.certification = null;
      this.certificationComponent.error = null;
      this.certificationComponent.isLoading = false;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (this.qrScannerModal) {
      setTimeout(() => {
        this.qrScannerModal.openModal();
      }, 300);
    }
  }

  openQRModal(): void {
    if (this.qrScannerModal) {
      this.qrScannerModal.openModal();
    }
  }

   ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
}
