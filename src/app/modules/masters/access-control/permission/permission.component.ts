import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionControllerService } from '@shared/_http/permissions.service';
import { PermissionDetails } from '@shared/configs/permission-config';
import { RowData } from '@shared/models/table';
import { LoaderService } from '@shared/services/loader.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-permission',
  standalone: false,
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.scss'
})
export class PermissionComponent {

  permissionDetailsData: RowData = PermissionDetails;
  subs: any;

  constructor(private router: Router, private permissionService: PermissionControllerService,private loader:LoaderService) { }


  ngOnInit(): void {
    this.subs = new Subscription()
    this.getAllPermissions();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  getAllPermissions() {
    this.loader.showLoader();
    this.subs.add(this.permissionService.getAllPermissions().subscribe({
      next: (value) => {
        this.loader.hideLoader();
        this.permissionDetailsData.data = value.data;
      },error:()=>{
        this.loader.hideLoader();
      }
    }))
  }


  handleCreateAction() {
    this.router.navigateByUrl("/permission/create")
  }

  handleDeleteAction(event: any) {
    this.subs.add(this.permissionService.deletePermissionsById(event).subscribe({
      next: (value) => {
        this.getAllPermissions()
      }
    }))
  }

  handleEditAction(event: any) {
    this.router.navigateByUrl(`/permission/edit/${event}`)
  }

  handleViewAction(event: any) {
    this.router.navigateByUrl(`/permission/view/${event}`)
  }
}
