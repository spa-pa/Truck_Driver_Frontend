import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CountryService } from '@shared/_http/country.service';
import { CountryDetailsData } from '@shared/configs/country-config';
import { RowData } from '@shared/models/table';
import { Subscription } from 'rxjs';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss',
  standalone: false
})
export class CountryComponent implements OnInit {

  CountryDetailsData: RowData = CountryDetailsData;
  subs: any;

  constructor(private router: Router, private countryservice: CountryService, private toastService: ToastService) { }


  ngOnInit(): void {
    this.subs = new Subscription()
    this.getAllCountry();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  getAllCountry() {
    this.subs.add(this.countryservice.getAllCountry().subscribe({
      next: (value) => {
        this.CountryDetailsData.data = value.data;
      }
    }))
  }


  handleCreateAction() {
    this.router.navigateByUrl("/country/create")
  }

handleDeleteAction(event: any) {
  this.subs.add(
    this.countryservice.deleteCountry(event).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastService.open(response.message, 'success');
          this.getAllCountry();
        } else {
          this.toastService.open(response.message || 'Deletion failed', 'error');
        }
      },
      error: (err) => {
        this.toastService.open('An error occurred while deleting the country.', 'error');
      }
    })
  );
}

  handleEditAction(event: any) {
    this.router.navigateByUrl(`/country/edit/${event}`)
  }

  handleViewAction(event: any) {
    this.router.navigateByUrl(`/country/view/${event}`)
  }

}

