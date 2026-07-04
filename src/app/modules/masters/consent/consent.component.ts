import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConsentService } from '@shared/_http/consent.service';
import { TableComponent } from '@shared/component/table/table.component';
import { ConsentDetailsData } from '@shared/configs/consent-config';
import { RowData } from '@shared/models/table';
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

  constructor(private router: Router, private consentService: ConsentService) { }


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
    this.subs.add(this.consentService.deleteConsent(event).subscribe({
      next: (value) => {
        this.getAllConsents()
      }
    }))
  }

  handleEditAction(event: any) {
    this.router.navigateByUrl(`/consent/edit/${event}`)
  }

  handleViewAction(event: any) {
    this.router.navigateByUrl(`/consent/view/${event}`)
  }

}
