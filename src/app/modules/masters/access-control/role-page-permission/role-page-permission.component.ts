import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionControllerService } from '@shared/_http/permissions.service';
import { RolePermissionDetails } from '@shared/configs/permission-config';
import { LoaderService } from '@shared/services/loader.service';
// import { RoleAndPermissionsControllerService } from '@shared/_http/role-permission.service';
// import { RolePermissionDetailsData } from '@shared/configs/role-page-permission-config';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-role-page-permission',
  standalone: false,
  templateUrl: './role-page-permission.component.html',
  styleUrl: './role-page-permission.component.scss'
})
export class RolePagePermissionComponent implements OnInit {
  roleDetailsData: any = RolePermissionDetails;
  subs: Subscription = new Subscription();

  constructor(private router: Router, private permissionControllerService: PermissionControllerService,private loader:LoaderService) { }

  ngOnInit(): void {
    this.getAllRolePagePermissions();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getAllRolePagePermissions() {
    this.loader.showLoader()
    this.subs.add(
      this.permissionControllerService.getAllRolePermissions().subscribe({
        next: (value) => {
          this.loader.hideLoader()
          console.log('getAllPageRolesPermission ' , value.data)
          this.roleDetailsData.data = value.data;
        },
        error: (error) => {
          this.loader.hideLoader()
          console.error('Error fetching role-page permissions:', error);
        }
      })
    );
  }

  handleCreateAction() {
    this.router.navigateByUrl('/role-permission/create');
  }

  handleDeleteAction(event: any) {
    this.loader.showLoader()
    this.subs.add(
      this.permissionControllerService.deleteRolePermissionById(event).subscribe({
        next: (value) => {
          this.loader.hideLoader()
          this.getAllRolePagePermissions();
        },
        error: (error) => {
          this.loader.hideLoader()
          console.error('Error deleting role-page permission:', error);
        }
      })
    );
  }

  handleEditAction(event: any) {
    this.router.navigateByUrl(`/role-permission/edit/${event}`);
  }

  handleViewAction(event: any) {
    this.router.navigateByUrl(`/role-permission/view/${event}`);
  }
}