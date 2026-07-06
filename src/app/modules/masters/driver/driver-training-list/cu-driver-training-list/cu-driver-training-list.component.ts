import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CountryService } from '@shared/_http/country.service';
import { DriverCertificationService } from '@shared/_http/driver-certification.service';
import { StateService } from '@shared/_http/state.service';
import { DriverTrainingDetailsData, DriverTrainingTypeSearchGroup } from '@shared/configs/driver-training-config';
import { IFormStructure } from '@shared/models/form';
import { RowData } from '@shared/models/table';
import { ToastService } from '@shared/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cu-driver-training-list',
  templateUrl: './cu-driver-training-list.component.html',
  styleUrl: './cu-driver-training-list.component.scss',
  standalone: false
})
export class CuDriverTrainingListComponent implements OnInit, AfterViewInit {

  subs: any;
  routeName: any;
  routeId: any;
  DriverTrainingSearchGroupStructure!: IFormStructure[];
  DriverTrainingDetailsData: RowData = DriverTrainingDetailsData;

  constructor(private router: Router, private activatedroute: ActivatedRoute, private driverCertificationService: DriverCertificationService, private toastService: ToastService,
    private countryservice: CountryService, private stateservice: StateService
  ) { }


  ngOnInit(): void {
    this.subs = new Subscription()
    this.DriverTrainingSearchGroupStructure = JSON.parse(JSON.stringify(DriverTrainingTypeSearchGroup));
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
    this.DriverTrainingSearchGroupStructure.forEach((ele, index) => {
      if (this.routeName == 'view')
        ele.disable = true
      if (ele.type == 'select')
        this.setOptionValues(ele)
    })
  }

  setOptionValues(ele: any) {
    switch (ele.listName) {
    }
  }

  getCity() {
    this.subs.add(this.driverCertificationService.getDriverCertificationByCertificationId(this.routeId).subscribe({
      next: (value) => {
        this.DriverTrainingDetailsData.data = value.data
      }
    }))
  }

  handleSubmit(event: any) {
    let formData = JSON.parse(JSON.stringify(event["formValue"]));
    const driverCertificationId = formData.driver_certification_id
    switch (this.routeName) {
      case 'create':
        this.subs.add(this.driverCertificationService.createDriverCertification(formData).subscribe({
          next: (value) => {
            this.toastService.open(value.message, 'success');
            this.router.navigateByUrl("/training-result")
          },
          error: (err) => {
            this.toastService.open(err.error.message, 'error');
          }
        }))
        break;
      case 'edit':
        this.subs.add(this.driverCertificationService.updateDriverCertification(formData, driverCertificationId).subscribe({
          next: (value) => {
            this.toastService.open(value.message, 'success');
            this.router.navigateByUrl("/training-result")
          },
          error: (err) => {
            this.toastService.open(err.error.message, 'error');
          }
        }))
        break;

    }
  }

}