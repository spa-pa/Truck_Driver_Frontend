import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
// import { RoleAndPermissionsControllerService } from '@shared/_http/role-permission.service';
import { IFormStructure } from '@shared/models/form';
import { RowData } from '@shared/models/table';
import { ToastService } from '@shared/services/toast.service';
import { responseMessages } from '@shared/constants/response-msgs.constant';
import { RolePagePermissionGroup, RolePermissionDetails, RolePermissionFormGroup } from '@shared/configs/permission-config';
import { PermissionControllerService } from '@shared/_http/permissions.service';
import { Permission } from '@shared/models/Permission.model';
import { LoaderService } from '@shared/services/loader.service';
import { RoleService } from '@shared/_http/role.service';
import { YES_NO_LISTDATA } from '@shared/configs/yesNoSelect-config';

@Component({
  selector: 'app-modify-role-page-permission',
  standalone: false,
  templateUrl: './modify-role-page-permission.component.html',
  styleUrl: './modify-role-page-permission.component.scss'
})
export class ModifyRolePagePermissionComponent implements OnInit, AfterViewInit, OnDestroy {
  subs: Subscription = new Subscription();
  routeName: string | undefined;
  routeId: string | null = null;
  roleSearchGroupStructure: IFormStructure[] = [];
  roleDetailsData: RowData = RolePermissionDetails;
  permissionsArray: Permission[];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private permissionControllerService: PermissionControllerService,
    private toastService: ToastService,
    private roleService: RoleService,
    private loader: LoaderService,
    public cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.roleSearchGroupStructure = JSON.parse(JSON.stringify(RolePagePermissionGroup));
    this.activatedRoute.url.subscribe(urlSegments => {
      this.routeName = urlSegments[0]?.path;
    });
    this.activatedRoute.paramMap.subscribe(params => {
      this.routeId = params.get('id');
    });
    this.initialization();
  }

  ngAfterViewInit(): void {
    if (this.routeId) {
      this.getRolePagePermissionById();
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  initialization(): void {
    this.roleSearchGroupStructure.forEach(ele => {
      if (ele.type === 'select') {
        this.setOptionValues(ele);
      }
      if (this.routeName === 'view') {
        ele.disable = true;
      }
    });
  }

  setOptionValues(ele: IFormStructure): void {
    switch (ele.listName) {
      case 'page-id':
        this.subs.add(this.permissionControllerService.getAllPages().subscribe({
          next: (value) => {
            ele.listData = value.data
          }
        }))
        break;

      case 'role-id':
        this.subs.add(this.roleService.getAllRoles().subscribe({
          next: (value) => {
            ele.listData = value.data
          }
        }))
        break;

      case "permission-id":
        this.subs.add(this.permissionControllerService.getAllPermissions().subscribe({
          next: (value) => {
            ele.listData = value.data;
            this.permissionsArray = value.data;
          }
        }))
        break

      case "yesno":
        ele.listData = YES_NO_LISTDATA.yesno
        break
    }
  }

  getRolePagePermissionById(): void {
    this.loader.showLoader();
    this.subs.add(this.permissionControllerService.getAllRolePermissionsID(this.routeId).subscribe({
      next: value => {
        this.loader.hideLoader();
        this.roleDetailsData.data = value.data;
    
        const result = this.getPermissionsFromDescription(value.data.description);

        const resultArray: any = []
        result.forEach((permission: any) => {
          resultArray.push(permission.permission_id);
        });
        this.roleDetailsData.data.permission_id = resultArray;
        this.roleDetailsData.data = { ...this.roleDetailsData.data }
      }, error: () => {
        this.loader.hideLoader()
      }
    }));
  }

  getPermissionsFromDescription(description: string): Permission[] {
    // Split the description into an array of permission names
    const permissionNames = description.split(' + ').map(name => name.trim());

    // Find and return the permissions that match the names in the description
    return this.permissionsArray.filter(permission => permissionNames.includes(permission.permission_name));
  }

  handleSelectValueChange(event: any) {
    if (event.roleId) {
      this.roleDetailsData.data.roleName = event.roleName
      return
    }
    if (event?.page_id) {
      this.roleDetailsData.data.pageName = event.pageName
      this.setPermissionDataViaPageId(event.page_id);
    }
    if ('permission_id' in event[0]) {
      // Calculate the total permission values
      const totalPermissionValues = event.reduce((total: number, current: any) => {
        return total + (current.permissionValues || 0);
      }, 0);

      // Create the permission description
      const description = this.generatePermissionDescription(event);
      this.roleDetailsData.data.description = description;
      // this.roleDetailsData.data.permission = totalPermissionValues;
      const resultArray: any = []
      event.forEach((permission: any) => {
        resultArray.push(permission.permission_id);
      });
      this.roleDetailsData.data.permission_id = resultArray;
      this.roleDetailsData.data = { ...this.roleDetailsData.data }
      // this.roleDetailsData.data = { ...this.roleDetailsData.data }
      // Log or use the description as needed
    }
    this.cdr.detectChanges()
  }

  setPermissionDataViaPageId(id: any) {
    this.loader.showLoader();
    this.subs.add(this.permissionControllerService.getAllPagePermissionByPageId(id).subscribe({
      next: (value) => {
        this.loader.hideLoader();
        this.roleSearchGroupStructure.forEach((ele, index) => {
          if (ele.name === 'permission_id') {
            ele.listData = value.data
          }
        })
      }, error: (err) => {
        this.loader.hideLoader();
      }
    }))
  }

  generatePermissionDescription(permissions: Permission[]): string {
    const activePermissions: string[] = [];
    permissions.forEach(permission => {
      activePermissions.push(permission.permission_name);
    });
    return activePermissions.join(' + ');
  }

  handleSubmit(event: any): void {
    const formData = JSON.parse(JSON.stringify(event.formValue));

    this.loader.showLoader();
    switch (this.routeName) {
      case 'create':
        this.subs.add(this.permissionControllerService.createRolepermission(formData).subscribe({
          next: value => {
            this.loader.hideLoader();
            const message = responseMessages.codes.find(item => item.code === value.error_message)?.message ?? '';
            this.toastService.open(message, 'success');
            this.router.navigateByUrl('/role-permission');
          },
          error: err => {
            this.loader.hideLoader();
            const message = responseMessages.codes.find(item => item.code === err.error_message)?.message ?? 'Something went wrong!';
            this.toastService.open(message, 'error');
          }
        }));
        break;
      case 'edit':
        this.subs.add(this.permissionControllerService.updateRolepermission(formData, this.routeId!).subscribe({
          next: value => {
            this.loader.hideLoader();
            const message = responseMessages.codes.find(item => item.code === value.error_message)?.message ?? '';
            this.toastService.open(message, 'success');
            this.router.navigateByUrl('/role-permission');
          },
          error: err => {
            this.loader.hideLoader();
            const message = responseMessages.codes.find(item => item.code === err.error_message)?.message ?? 'Something went wrong!';
            this.toastService.open(message, 'error');
          }
        }));
        break;
    }
  }
}
