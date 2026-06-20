import { AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PagePermissionService } from '@shared/_http/page-permission.service';
import { PageService } from '@shared/_http/pages.service';
import { PermissionService } from '@shared/_http/permission.service';
import { PermissionControllerService } from '@shared/_http/permissions.service';
import { PagePermissionDetailsData, PagePermissionSearchGroup } from '@shared/configs/page-permission-config';
import { responseMessages } from '@shared/constants/response-msgs.constant';
import { Permission } from '@shared/models/Permission.model';
import { IFormStructure } from '@shared/models/form';
import { RowData } from '@shared/models/table';
import { ToastService } from '@shared/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modify-page-permission',
  standalone: false,
  templateUrl: './modify-page-permission.component.html',
  styleUrls: ['./modify-page-permission.component.scss']
})
export class ModifyPagePermissionComponent implements OnInit, AfterViewInit, OnDestroy {

  subs: Subscription;
  routeName: string;
  routeId: string | null;
  PagePermissionSearchGroupStructure: IFormStructure[] = PagePermissionSearchGroup;
  PagePermissionDetailsData: RowData = PagePermissionDetailsData;
  permissionsArray: Permission[];
  constructor(
    private router: Router, 
    private activatedroute: ActivatedRoute, 
    private pageControllerService:PageService,
    private pagePermissionService: PagePermissionService, 
    private permissionControllerService: PermissionControllerService, 
    private permissionService: PermissionService, 
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.subs = new Subscription();
    this.activatedroute.url.subscribe(urlSegments => {
      this.routeName = urlSegments[0]?.path ?? '';
    });
    this.activatedroute.paramMap.subscribe(params => {
      this.routeId = params.get('id');
    });
    this.initialization();
  }

  ngAfterViewInit(): void {
    if (this.routeId) {
      this.getPagePermission();
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  initialization(): void {
    this.PagePermissionSearchGroupStructure.forEach((ele) => {
      if (ele.type == 'select')
        this.setOptionValues(ele)
      if (this.routeName === 'view') {
        ele.disable = true;
      }
    });
  }

  setOptionValues(ele: any) {
    switch (ele.listName) {
      case "page-id":
        this.subs.add(this.pageControllerService.getAllPage().subscribe({
          next: (value) => {
            ele.listData = value.data
          }
        }))
        break

      case "permission-id":
        this.subs.add(this.permissionControllerService.getAllPermissions().subscribe({
          next: (value) => {
            ele.listData = value.data;
            this.permissionsArray = value.data;
          }
        }))
        break

    }
  }

  getPagePermission(): void {
    if (this.routeId) {
      this.subs.add(this.pagePermissionService.getPagePermission(this.routeId).subscribe({
        next: (value) => {
          this.PagePermissionDetailsData.data = value.data;
          console.log('this.PagePermissionDetailsData = ', this.PagePermissionDetailsData.data);
          const description = value.data;

          // Call the function with the description string instead of an array
          const result = this.getPermissionsFromDescription(description);
          const resultArray: any = []
          result.forEach(permission => {
            resultArray.push(permission.permission_id);
          });
          this.PagePermissionDetailsData.data.permission_id = resultArray;
          this.PagePermissionDetailsData.data = { ...this.PagePermissionDetailsData.data }
        }
      }));
    }
  }

  getPermissionsFromDescription(description: string): any[] {
    // Split the description into an array of permission names
    const permissionNames = description.split(' + ').map(name => name.trim().toLowerCase());

    // Find and return the permissions that match the names in the description
    return this.permissionsArray.filter(permission =>
      permissionNames.includes(permission.permission.toLowerCase()),
    );
  }

  handleSubmit(event: any): void {
    const formData = { ...event.formValue };
    // formData.permissionIdList = formData.permission_id;
    // Create the pagePermissionList array
    formData.pagePermissionList = formData.permissionId.map((permissionId: string) => ({
      pageId: formData.pageId, // assuming formData has page_id
      permissionId: permissionId
    }));

    // Remove permission_id from formData as it's now part of pagePermissionList
    delete formData.permission_id;
    switch (this.routeName) {
      case 'create':
        this.subs.add(this.permissionControllerService.createPagePermission(formData).subscribe({
          next: (value) => {
            const message = responseMessages.codes.find(item => item.code === value.error_message)?.message ?? 'Success';
            this.toastService.open(message, 'success');
            this.router.navigateByUrl("/page-permission");
          },
          error: (err) => {
            const message = responseMessages.codes.find(item => item.code === err.error_message)?.message ?? 'Something went wrong!';
            this.toastService.open(message, 'error');
          }
        }));
        break;
      case 'edit':
        if (this.routeId) {
          this.subs.add(this.permissionControllerService.updatePagePermission(formData).subscribe({
            next: (value) => {
              const message = responseMessages.codes.find(item => item.code === value.error_message)?.message ?? 'Success';
              this.toastService.open(message, 'success');
              this.router.navigateByUrl("/page-permission");
            },
            error: (err) => {
              const message = responseMessages.codes.find(item => item.code === err.error_message)?.message ?? 'Something went wrong!';
              this.toastService.open(message, 'error');
            }
          }));
        }
        break;
    }
  }

  handleSwitchChange(item: any, event: boolean): void {
    item.value = event;
  }
}
