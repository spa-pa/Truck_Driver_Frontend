import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DriverCertificationService } from '@shared/_http/driver-certification.service';
import { DriverTrainingDetailsData } from '@shared/configs/driver-training-config';
import { RowData } from '@shared/models/table';
import { Subscription } from 'rxjs';
import { DriverCertificationComponent } from '../driver-certification/driver-certification.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

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

  private modalRef: NgbModalRef | null = null;
  constructor(private router: Router, private driverCertificationService: DriverCertificationService, private modalService: NgbModal) { }


  ngOnInit(): void {
    this.subs = new Subscription()
    this.getAllDriverCertification();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  getAllDriverCertification() {
    this.subs.add(this.driverCertificationService.getAllDriverCertification().subscribe({
      next: (value) => {
        this.DriverTrainingDetailsData.data = value.data;
      }
    }))
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
    this.certificationId = event;
    this.modalService.open(this.certificationModal, {
      size: 'xl',
      centered: true,
      backdrop: 'static'
    });
    // this.router.navigateByUrl(`/country/edit/${event}`)
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

