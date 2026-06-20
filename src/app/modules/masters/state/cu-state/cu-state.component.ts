import { AfterViewInit, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryService } from '@shared/_http/country.service';
import { StateService } from '@shared/_http/state.service';
import { StateDetailsData, StateTypeSearchGroup } from '@shared/configs/state-config';
import { responseMessages } from '@shared/constants/response-msgs.constant';
import { IFormStructure } from '@shared/models/form';
import { RowData } from '@shared/models/table';
import { ToastService } from '@shared/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cu-state',
  templateUrl: './cu-state.component.html',
  styleUrl: './cu-state.component.scss',
  standalone: false
})
export class CuStateComponent implements OnInit, AfterViewInit {

  subs: any;
  routeName: any;
  routeId: any;
  StateTypeSearchGroupStructure!: IFormStructure[];
  StateDetailsData: RowData = StateDetailsData;

  constructor(private router: Router, private activatedroute: ActivatedRoute, private stateservice: StateService, private toastService: ToastService, private countryService: CountryService) { }


  ngOnInit(): void {
    this.subs = new Subscription()
    this.StateTypeSearchGroupStructure = JSON.parse(JSON.stringify(StateTypeSearchGroup));
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
      this.getState()
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  initialization(): void {
    this.StateTypeSearchGroupStructure.forEach((ele, index) => {
      if (ele.type === 'select') {
        this.setOptionValues(ele);
      }

      if (ele.type == 'select')
        this.setOptionValues(ele)
    })
  }

  setOptionValues(ele: IFormStructure): void {
    switch (ele.listName) {
      case 'country':
        this.subs.add(this.countryService.getAllCountry().subscribe({
          next: value => {
            ele.listData = value.data;
          }
        }));
        break;
    }
  }

  getState() {
    this.subs.add(this.stateservice.getState(this.routeId).subscribe({
      next: (value) => {
        this.StateDetailsData.data = value.data
      }
    }))
  }

  handleSubmit(event: any) {
    let formData = JSON.parse(JSON.stringify(event["formValue"]))
    switch (this.routeName) {
      case 'create':
        this.subs.add(this.stateservice.createState(formData).subscribe({
          next: (value) => {
            this.toastService.open(value.message, 'success');
            this.router.navigateByUrl("/state")
          },
          error: (err) => {
            this.toastService.open(err.error.message, 'error');
          }
        }))
        break;
      case 'edit':
        this.subs.add(this.stateservice.updateState(formData, this.routeId).subscribe({
          next: (value) => {
            this.toastService.open(value.message, 'success');
            this.router.navigateByUrl("/state")
          },
          error: (err) => {
            this.toastService.open(err.error.message, 'error');
          }
        }))
        break;

    }
  }

}


