import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RoleService } from '@shared/_http/role.service';
import { UserMasterService } from '@shared/_http/user-master.service';
import { UserMasterDetailsData, UserMasterTypeSearchGroup } from '@shared/configs/user-master-config';
import { ACTIVE_INACTIVE_LISTDATA, YES_NO_LISTDATA } from '@shared/configs/yesNoSelect-config';
import { IFormStructure } from '@shared/models/form';
import { RowData } from '@shared/models/table';
import { ToastService } from '@shared/services/toast.service';
import { currentUser } from '@shared/utils/current-user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cu-user-master',
  templateUrl: './cu-user-master.component.html',
  styleUrl: './cu-user-master.component.scss',
  standalone: false
})
export class CuUserMasterComponent implements OnInit, AfterViewInit {

  subs: any;
  routeName: any;
  routeId: any;
  UserMasterTypeSearchGroup!: IFormStructure[];
  UserMasterDetailsData: RowData = UserMasterDetailsData;

  constructor(private router: Router, private activatedroute: ActivatedRoute, private userMasterService: UserMasterService, private toastService: ToastService, private roleService: RoleService) { }


  ngOnInit(): void {
    this.subs = new Subscription()
    this.UserMasterTypeSearchGroup = JSON.parse(JSON.stringify(UserMasterTypeSearchGroup));
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
    this.UserMasterTypeSearchGroup.forEach((ele, index) => {
      if (this.routeName == 'view')
        ele.disable = true
      if (ele.type == 'select')
        this.setOptionValues(ele)
    })
  }

  setOptionValues(ele: any) {
    switch (ele.listName) {
      case 'role':
        this.subs.add(this.roleService.getAllRoles().subscribe({
          next: (value) => {
            // ele.listData = value.data
            ele.listData = value.data.filter((role:any) => role.role_id !== 1);
          }
        }))
        break;
      case "yesno":
        ele.listData = ACTIVE_INACTIVE_LISTDATA.activeInactiveBoolean
        break
    }
  }

  getCity() {
    this.subs.add(this.userMasterService.getUserMaster(this.routeId).subscribe({
      next: (value) => {
        this.UserMasterDetailsData.data = value.data
      }
    }))
  }

  handleSubmit(event: any) {
    let formData = JSON.parse(JSON.stringify(event["formValue"]));
    const terminalId = currentUser().terminal_id;
    if (terminalId) {
      formData.terminal_id = terminalId
    }
    switch (this.routeName) {
      case 'create':
        this.subs.add(this.userMasterService.createUserMaster(formData).subscribe({
          next: (value) => {
            this.toastService.open(value.message, 'success');
            this.router.navigateByUrl("/user-master")
          },
          error: (err) => {
            this.toastService.open(err.error.message, 'error');
          }
        }))
        break;
      case 'edit':
        this.subs.add(this.userMasterService.updateUserMaster(formData, this.routeId).subscribe({
          next: (value) => {
            this.toastService.open(value.message, 'success');
            this.router.navigateByUrl("/user-master")
          },
          error: (err) => {
            this.toastService.open(err.error.message, 'error');
          }
        }))
        break;

    }
  }

}



