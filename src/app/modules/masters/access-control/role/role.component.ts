import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { responseMessages } from '@shared/constants/response-msgs.constant';
import { ToastService } from '@shared/services/toast.service';
import { RoleDetails } from '@shared/configs/permission-config';
import { PermissionControllerService } from '@shared/_http/permissions.service';
import { LoaderService } from '@shared/services/loader.service';
import { RoleService } from '@shared/_http/role.service';

@Component({
  selector: 'app-role',
  standalone: false,
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent implements OnInit, OnDestroy {
  roleDetailsData: any = RoleDetails; // Assuming RoleDetailsData is defined in role-config.ts
  subs: Subscription = new Subscription();

  constructor(private router: Router, private roleControllerService: RoleService,public toastService:ToastService,private loader:LoaderService) { }

  ngOnInit(): void {
    this.getAllRoles();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getAllRoles() {
    this.loader.showLoader();
    this.subs.add(
      this.roleControllerService.getAllRoles().subscribe({
        next: (value) => {
          this.loader.hideLoader();
          this.roleDetailsData.data = value.data;
        },
        error: (err) => {
          console.error('Error fetching roles:', err);
          this.loader.hideLoader();
          const message = responseMessages.codes.find(item => item.code === err.error_message)?.message ?? '';
          this.toastService.open(message, 'error');
        }
      })
    );
  }

  handleCreateAction() {
    this.router.navigateByUrl('/role/create');
  }

handleDeleteAction(event: any) {
  this.loader.showLoader();
    this.subs.add(
      this.roleControllerService.deleteRole(event).subscribe({
        next: (value) => {
          this.loader.hideLoader();
          this.getAllRoles();
          const message = responseMessages.codes.find(item => item.code === value.message)?.message ?? '';
          this.toastService.open(message, 'success');
        },
        error: (error) => {
          this.loader.hideLoader();
          console.error('Error deleting role:', error);
          const message = responseMessages.codes.find(item => item.code === error.error_message)?.message ?? '';
          this.toastService.open(message, 'error');
        }
      })
    );
  }

  handleEditAction(event: any) {
    this.router.navigateByUrl(`/role/edit/${event}`);
  }

  handleViewAction(event: any) {
    this.router.navigateByUrl(`/role/view/${event}`);
  }

}
