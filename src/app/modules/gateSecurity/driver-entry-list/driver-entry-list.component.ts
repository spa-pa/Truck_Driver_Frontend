import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CertificateScannedService } from '@shared/_http/certificate-scanned.service';
import { DriverEntriesDetailsData } from '@shared/configs/driver-entries-config';
import { DriverTrainingDetailsData } from '@shared/configs/driver-training-config';
import { RowData } from '@shared/models/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-driver-entry-list',
  standalone: false,
  templateUrl: './driver-entry-list.component.html',
  styleUrl: './driver-entry-list.component.scss'
})
export class DriverEntryListComponent {
  DriverEntriesDetailsData: RowData = DriverEntriesDetailsData;
  subs: any;
  certificationId: any;

  private modalRef: NgbModalRef | null = null;

  @ViewChild('certificationModal') certificationModal!: TemplateRef<any>;
  
  constructor(private router: Router, private certificateScannedService: CertificateScannedService, private modalService: NgbModal) { }


  ngOnInit(): void {
    this.subs = new Subscription()
    this.getAllCity();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  getAllCity() {
    this.subs.add(this.certificateScannedService.getAllCertificateScanned().subscribe({
      next: (value) => {
        this.DriverEntriesDetailsData.data = value.data;
      }
    }))
  }

  handleCreateAction() {
    this.router.navigateByUrl("/city/create")
  }

  handleDeleteAction(event: any) {
    this.subs.add(this.certificateScannedService.deleteCertificateScanned(event).subscribe({
      next: (value) => {
        this.getAllCity()
      }
    }))
  }

  handleEditAction(event: any) {
    // this.router.navigateByUrl(`/city/edit/${event}`)
  }

  handleViewAction(event: any) {
    this.certificationId = event;
    this.modalRef = this.modalService.open(this.certificationModal, {
      size: 'xl',
      centered: true,
      backdrop: 'static'
    });
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
  }
}
