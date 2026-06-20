import { AfterViewInit, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryService } from '@shared/_http/country.service';
import { CountryDetailsData, CountryTypeSearchGroup } from '@shared/configs/country-config';
import { responseMessages } from '@shared/constants/response-msgs.constant';
import { IFormStructure } from '@shared/models/form';
import { RowData } from '@shared/models/table';
import { ToastService } from '@shared/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cu-country',
  templateUrl: './cu-country.component.html',
  styleUrl: './cu-country.component.scss',
  standalone: false
})
export class CuCountryComponent implements OnInit, AfterViewInit {

  subs: any;
  routeName: any;
  routeId: any;
  CountryTypeSearchGroupStructure!: IFormStructure[];
  CountryDetailsData: RowData = CountryDetailsData;

  constructor(private router: Router, private activatedroute: ActivatedRoute, private countryservice: CountryService, private toastService: ToastService) { }


  ngOnInit(): void {
    this.subs = new Subscription()
    this.CountryTypeSearchGroupStructure = JSON.parse(JSON.stringify(CountryTypeSearchGroup));
    this.activatedroute.url.subscribe(urlSegments => {
      this.routeName = urlSegments[0]?.path;
    });
    this.activatedroute.paramMap.subscribe(params => {
      this.routeId = params.get('id');
    });
    this.initialization()
  }

  ngAfterViewInit(): void {
    if (this.routeId)
      this.getCountry()
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  initialization(): void {
    this.CountryTypeSearchGroupStructure.forEach((ele, index) => {

    })
  }

  getCountry() {
    this.subs.add(this.countryservice.getCountry(this.routeId).subscribe({
      next: (value) => {
        this.CountryDetailsData.data = value.data
      }
    }))
  }

  handleSubmit(event: any) {
    let formData = JSON.parse(JSON.stringify(event["formValue"]))
    switch (this.routeName) {
      case 'create':
        this.subs.add(this.countryservice.createCountry(formData).subscribe({
          next: (value) => {
            this.toastService.open(value.message, 'success');
            this.router.navigateByUrl("/country")
          },
          error: (err) => {
            this.toastService.open(err.error.message, 'error');
          }
        }))
        break;
      case 'edit':
        this.subs.add(this.countryservice.updateCountry(formData, this.routeId).subscribe({
          next: (value) => {
            this.toastService.open(value.message, 'success');
            this.router.navigateByUrl("/country")
          },
          error: (err) => {
            this.toastService.open(err.error.message, 'error');
          }
        }))
        break;

    }
  }

}


