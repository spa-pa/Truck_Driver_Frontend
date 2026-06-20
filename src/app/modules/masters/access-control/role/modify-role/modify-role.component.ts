import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

// Import services and models from your project
import { ToastService } from '@shared/services/toast.service';
import { IFormStructure } from '@shared/models/form';
import { RowData } from '@shared/models/table';
import { responseMessages } from '@shared/constants/response-msgs.constant';
import { RoleDetails, RoleFormGroup } from '@shared/configs/permission-config';
import { PermissionControllerService } from '@shared/_http/permissions.service';
import { LoaderService } from '@shared/services/loader.service';
import { MenuService } from '@shared/_http/menu.service';
import { RoleService } from '@shared/_http/role.service';

@Component({
  selector: 'app-modify-role',
  standalone: false,
  templateUrl: './modify-role.component.html',
  styleUrl: './modify-role.component.scss'
})
export class ModifyRoleComponent implements OnInit, AfterViewInit, OnDestroy {
  subs: Subscription = new Subscription();
  routeName: string | undefined;
  routeId: string | null = null;
  roleSearchGroupStructure: IFormStructure[] = [];
  roleDetailsData: RowData = RoleDetails;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private roleControllerService: RoleService,
    private toastService: ToastService,
    private loader:LoaderService,
    private menuService:MenuService
  ) {}

  ngOnInit(): void {
    this.roleSearchGroupStructure = JSON.parse(JSON.stringify(RoleFormGroup));
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
      this.getRole();
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
      // case 'country':
      //   this.subs.add(this.countryService.getAllCountry().subscribe({
      //     next: value => {
      //       ele.listData = value.data;
      //     }
      //   }));
      //   break;
      case 'menu-set':
        this.subs.add(this.menuService.getAllMenu().subscribe({
          next: value => {
            
            ele.listData = value.data;
          }
        }));
        break;
    }
  }

  getRole(): void {
    this.loader.showLoader();
    this.subs.add(this.roleControllerService.getRole(this.routeId!).subscribe({
      next: value => {
        this.loader.hideLoader();
        this.roleDetailsData.data = value.data;
      },error:()=>{this.loader.hideLoader();}
    }));
  }

  handleSubmit(event: any): void {
    const formData = JSON.parse(JSON.stringify(event.formValue));
    this.loader.showLoader();
    switch (this.routeName) {
      case 'create':
        this.subs.add(this.roleControllerService.createRole(formData).subscribe({
          next: value => {
            this.loader.hideLoader();
            const message = responseMessages.codes.find(item => item.code === value.error_message)?.message ?? '';
            this.toastService.open(message, 'success');
            this.router.navigateByUrl('/role');
          },
          error: err => {
            this.loader.hideLoader();
            const message = responseMessages.codes.find(item => item.code === err.error_message)?.message ?? 'Something went wrong!';
            this.toastService.open(message, 'error');
          }
        }));
        break;
      case 'edit':
        this.subs.add(this.roleControllerService.updateRole(formData, this.routeId!).subscribe({
          next: value => {
            this.loader.hideLoader();
            const message = responseMessages.codes.find(item => item.code === value.error_message)?.message ?? '';
            this.toastService.open(message, 'success');
            this.router.navigateByUrl('/role');
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
