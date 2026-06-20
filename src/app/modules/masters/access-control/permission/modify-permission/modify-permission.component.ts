import { AfterViewInit, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionControllerService } from '@shared/_http/permissions.service';
import { PermissionDetails, PermissionFormGroup } from '@shared/configs/permission-config';
import { responseMessages } from '@shared/constants/response-msgs.constant';
import { IFormStructure } from '@shared/models/form';
import { RowData } from '@shared/models/table';
import { LoaderService } from '@shared/services/loader.service';
import { ToastService } from '@shared/services/toast.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-modify-permission',
  standalone: false,
  templateUrl: './modify-permission.component.html',
  styleUrl: './modify-permission.component.scss'
})
export class ModifyPermissionComponent implements OnInit, AfterViewInit {

  subs: any;
  routeName: any;
  routeId: any;
  PermissionGroupStructure!: IFormStructure[];
  permissionDetailsData: RowData = PermissionDetails;

  constructor(private router: Router, private activatedroute: ActivatedRoute, private permissionService: PermissionControllerService, private toastService: ToastService,private loader:LoaderService) { }


  ngOnInit(): void {
    this.subs = new Subscription()
    this.PermissionGroupStructure = JSON.parse(JSON.stringify(PermissionFormGroup));
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
      this.getPermission()
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  initialization(): void {
    this.PermissionGroupStructure.forEach((ele, index) => {
      if (ele.type == 'select')
        this.setOptionValues(ele)
      if (this.routeName == 'view')
        ele.disable = true
    })
  }

  setOptionValues(ele: any) {
    switch (ele.listName) {
      case "service-type":
        this.subs.add(this.permissionService.getAllPermissions().subscribe({
          next: (value) => {
            ele.listData = value.data
          }
        }))
        break
    }
  }

  getPermission() {
    this.loader.hideLoader();
    this.subs.add(this.permissionService.getAllPermissionsByID(this.routeId).subscribe({
      next: (value) => {
        this.loader.hideLoader();
        this.permissionDetailsData.data = value.data
      },error:()=>{
        this.loader.hideLoader();
      }
    }))
  }

  handleSubmit(event: any) {
    let formData = JSON.parse(JSON.stringify(event["formValue"]));
    this.loader.showLoader();
    switch (this.routeName) {
      case 'create':
        this.subs.add(this.permissionService.createPermission(formData).subscribe({
          next: (value) => {
            this.loader.hideLoader();
            const message = responseMessages.codes.find(item => item.code == value.error_message)?.message ?? '';
            this.toastService.open(message, 'success');
            this.router.navigateByUrl("/permission")
          },
          error: (err) => {
            this.loader.hideLoader();
            const message = responseMessages.codes.find(item => item.code == err.error_message)?.message ?? 'Something went to wrong!';
            this.toastService.open(message, 'error');
          }
        }))
        break;
      case 'edit':
        this.subs.add(this.permissionService.updatePermission(formData, this.routeId).subscribe({
          next: (value) => {
            this.loader.hideLoader();
            const message = responseMessages.codes.find(item => item.code == value.error_message)?.message ?? '';
            this.toastService.open(message, 'success');
            this.router.navigateByUrl("/permission")
          },
          error: (err) => {
            this.loader.hideLoader();
            const message = responseMessages.codes.find(item => item.code == err.error_message)?.message ?? 'Something went to wrong!';
            this.toastService.open(message, 'error');
          }
        }))
        break;

    }
  }

}

