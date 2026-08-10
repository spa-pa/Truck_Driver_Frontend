import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserMasterService } from '@shared/_http/user-master.service';
import { UserMasterDetailsData } from '@shared/configs/user-master-config';
import { RowData } from '@shared/models/table';
import { ToastService } from '@shared/services/toast.service';
import { currentUser } from '@shared/utils/current-user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrl: './user-master.component.scss',
  standalone: false
})
export class UserMasterComponent {
  UserMasterDetailsData: RowData = UserMasterDetailsData;
  subs: any;

  constructor(private router: Router, private userMasterService: UserMasterService, private toastService: ToastService) { }


  ngOnInit(): void {
    this.subs = new Subscription()
    this.getAllUserMaster();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  getAllUserMaster() {
    const terminalId = currentUser().terminal_id;
    this.subs.add(this.userMasterService.getAllUserMasterByTerminal(terminalId).subscribe({
      next: (value) => {
        this.UserMasterDetailsData.data = value.data.map((item: any) => ({
          ...item,
          is_active: item.is_active ? 'true' : 'false'
        }));
      }
    }))
  }

  handleCreateAction() {
    this.router.navigateByUrl("/user-master/create")
  }

    handleDeleteAction(event: any) {
   this.subs.add(
    this.userMasterService.deleteUserMaster(event).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastService.open(response.message, 'success');
          this.getAllUserMaster();
        } else {
          this.toastService.open(response.message || 'Deletion failed', 'error');
        }
      },
      error: (err) => {
        this.toastService.open('An error occurred while deleting the user.', 'error');
      }
    })
  );
}

  handleEditAction(event: any) {
    this.router.navigateByUrl(`/user-master/edit/${event}`)
  }

  handleViewAction(event: any) {
    this.router.navigateByUrl(`/user-master/view/${event}`)
  }
}
