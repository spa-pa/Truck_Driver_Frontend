import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExpiryConfigService } from '@shared/_http/expiry-config.service';
import { ExpiryConfigDetailsData, ExpiryConfigSearchGroup } from '@shared/configs/expiry-config';
import { IFormStructure } from '@shared/models/form';
import { RowData } from '@shared/models/table';
import { ToastService } from '@shared/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cu-expiry-config',
  templateUrl: './cu-expiry-config.component.html',
  styleUrl: './cu-expiry-config.component.scss',
  standalone: false
})
export class CuExpiryConfigComponent implements OnInit, AfterViewInit {

  subs: any;
  routeName: any;
  routeId: any;
  ExpiryConfigGroupStructure!: IFormStructure[];
  ExpiryConfigDetailsData: RowData = ExpiryConfigDetailsData;

  constructor(private router: Router, private activatedroute: ActivatedRoute, private expiryConfigService: ExpiryConfigService, private toastService: ToastService
  ) { }


  ngOnInit(): void {
    this.subs = new Subscription()
    this.ExpiryConfigGroupStructure = JSON.parse(JSON.stringify(ExpiryConfigSearchGroup));
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
    this.ExpiryConfigGroupStructure.forEach((ele, index) => {
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
    this.subs.add(this.expiryConfigService.getExpiryConfig(this.routeId).subscribe({
      next: (value) => {
        this.ExpiryConfigDetailsData.data = value.data
      }
    }))
  }

  handleSubmit(event: any) {
    let formData = JSON.parse(JSON.stringify(event["formValue"]))
    switch (this.routeName) {
      case 'create':
        this.subs.add(this.expiryConfigService.createExpiryConfig(formData).subscribe({
          next: (value) => {
            this.toastService.open(value.message, 'success');
            this.router.navigateByUrl("/expiry-config")
          },
          error: (err) => {
            this.toastService.open(err.error.message, 'error');
          }
        }))
        break;
      case 'edit':
        this.subs.add(this.expiryConfigService.updateExpiryConfig(formData, this.routeId).subscribe({
          next: (value) => {
            this.toastService.open(value.message, 'success');
            this.router.navigateByUrl("/expiry-config")
          },
          error: (err) => {
            this.toastService.open(err.error.message, 'error');
          }
        }))
        break;

    }
  }

}



