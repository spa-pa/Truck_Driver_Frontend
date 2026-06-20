import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CountryService } from '@shared/_http/country.service';
import { CountryDetailsData } from '@shared/configs/country-config';
import { RowData } from '@shared/models/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss',
  standalone: false
})
export class CountryComponent implements OnInit {

  CountryDetailsData: RowData = CountryDetailsData;
  subs: any;

  constructor(private router: Router, private countryservice: CountryService) { }


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
    this.subs.add(this.countryservice.deleteCountry(event).subscribe({
      next: (value) => {
        this.getAllCountry()
      }
    }))
  }

  handleEditAction(event: any) {
    this.router.navigateByUrl(`/country/edit/${event}`)
  }

  handleViewAction(event: any) {
    this.router.navigateByUrl(`/country/view/${event}`)
  }

}

