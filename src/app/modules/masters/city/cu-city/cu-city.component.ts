import { AfterViewInit, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CityService } from '@shared/_http/city.service';
import { CountryService } from '@shared/_http/country.service';
import { StateService } from '@shared/_http/state.service';
import { CityDetailsData, CityTypeSearchGroup } from '@shared/configs/city-config';
import { responseMessages } from '@shared/constants/response-msgs.constant';
import { IFormStructure } from '@shared/models/form';
import { RowData } from '@shared/models/table';
import { ToastService } from '@shared/services/toast.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-cu-city',
  templateUrl: './cu-city.component.html',
  styleUrl: './cu-city.component.scss',
  standalone: false
})
export class CuCityComponent implements OnInit, AfterViewInit {

  subs: any;
  routeName: any;
  routeId: any;
  CityTypeSearchGroupStructure!: IFormStructure[];
  CityDetailsData: RowData = CityDetailsData;

  constructor(private router: Router, private activatedroute: ActivatedRoute, private cityservice: CityService, private toastService: ToastService,
    private countryservice: CountryService, private stateservice: StateService
  ) { }


  ngOnInit(): void {
    this.subs = new Subscription()
    this.CityTypeSearchGroupStructure = JSON.parse(JSON.stringify(CityTypeSearchGroup));
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
      this.getCity()
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  initialization(): void {
    this.CityTypeSearchGroupStructure.forEach((ele, index) => {
      if (this.routeName == 'view')
        ele.disable = true
      if (ele.type == 'select')
        this.setOptionValues(ele)
    })
  }

  setOptionValues(ele: any) {
    switch (ele.listName) {
      case "country":
        this.subs.add(this.countryservice.getAllCountry().subscribe({
          next: (value) => {
            ele.listData = value.data
          }
        }))
        break
      case "state":
        this.subs.add(this.stateservice.getAllState().subscribe({
          next: (value) => {
            ele.listData = value.data
          }
        }))
        break
    }
  }

  getCity() {
    this.subs.add(this.cityservice.getCity(this.routeId).subscribe({
      next: (value) => {
        this.CityDetailsData.data = value.data
      }
    }))
  }

  handleSubmit(event: any) {
    let formData = JSON.parse(JSON.stringify(event["formValue"]))
    switch (this.routeName) {
      case 'create':
        this.subs.add(this.cityservice.createCity(formData).subscribe({
          next: (value) => {
            this.toastService.open(value.message, 'success');
            this.router.navigateByUrl("/city")
          },
          error: (err) => {
            this.toastService.open(err.error.message, 'error');
          }
        }))
        break;
      case 'edit':
        this.subs.add(this.cityservice.updateCity(formData, this.routeId).subscribe({
          next: (value) => {
            this.toastService.open(value.message, 'success');
            this.router.navigateByUrl("/city")
          },
          error: (err) => {
            this.toastService.open(err.error.message, 'error');
          }
        }))
        break;

    }
  }

}



