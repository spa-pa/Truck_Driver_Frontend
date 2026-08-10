import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConsentService } from '@shared/_http/consent.service';
import { TableComponent } from '@shared/component/table/table.component';
import { ConsentDetailsData } from '@shared/configs/consent-config';
import { RowData } from '@shared/models/table';
import { ToastService } from '@shared/services/toast.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-consent',
  imports: [TableComponent],
  templateUrl: './consent.component.html',
  styleUrl: './consent.component.scss'
})
export class ConsentComponent implements OnInit{
  ConsentDetailsData: RowData = ConsentDetailsData;
  subs: any;

  constructor(private router: Router, private consentService: ConsentService, private toastService: ToastService) { }


  ngOnInit(): void {
    this.subs = new Subscription()
    this.getAllConsents();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  getAllConsents() {
    this.subs.add(this.consentService.getAllConsents().subscribe({
      next: (value) => {
        this.ConsentDetailsData.data = value.data;
      }
    }))
  }


  handleCreateAction() {
    this.router.navigateByUrl("/consent/create")
  }


  handleDeleteAction(event: any) {
  this.subs.add(
    this.consentService.deleteConsent(event).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastService.open(response.message, 'success');
          this.getAllConsents();
        } else {
          this.toastService.open(response.message || 'Deletion failed', 'error');
        }
      },
      error: (err) => {
        this.toastService.open('An error occurred while deleting the consent.', 'error');
      }
    })
  );
}

  handleEditAction(event: any) {
    this.router.navigateByUrl(`/consent/edit/${event}`)
  }

  handleViewAction(event: any) {
    this.router.navigateByUrl(`/consent/view/${event}`)
  }

}
