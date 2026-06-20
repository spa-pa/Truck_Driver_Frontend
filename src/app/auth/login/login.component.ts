import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { LoginService } from '@shared/_http/login.service';
import { ToastService } from '@shared/services/toast.service';
import { EncryptedStorage } from '@shared/utils/encrypted-storage';
import { GlobalConfig } from '@shared/configs/global-config';
import { NavmenuService } from '@shared/services/navmenu.service';
import { PermissionsService } from '@shared/services/PermissionsService';
import { AdminMenu } from '@shared/constants/routeTemp';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public show: boolean = false;
  public loginForm: FormGroup;
  encryptedStorage = new EncryptedStorage();
  globalConfig = new GlobalConfig();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastService,
    private navmenu: NavmenuService,
    private permissionsService: PermissionsService
  ) {
    const userData = localStorage.getItem(this.globalConfig.authToken);

    if (userData?.length) {
      this.navmenu.intializeMenu(JSON.parse(this.globalConfig.menu));
      this.router.navigate([this.globalConfig.dashboardRoute]);
    } else {
      this.router.navigate([this.globalConfig.loginRoute]);
    }

    this.loginForm = this.fb.group({
      user_name: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  showPassword(): void {
    this.show = !this.show;
  }

  login() {
    if (this.loginForm.invalid) return;

    this.loginService.login(this.loginForm.value).subscribe({
      next: (value) => {

        const config = new GlobalConfig();
        const user = value.user;
        new EncryptedStorage().clearAll();
        new EncryptedStorage().setItem(config.authToken, value.token, false);
        new EncryptedStorage().setItem(config.userDetails, JSON.stringify(user), false);
        new EncryptedStorage().setItem(config.roleId, JSON.stringify(user.role_id), false);
        new EncryptedStorage().setItem(config.userName, JSON.stringify(user.name), false);
        new EncryptedStorage().setItem(config.menu, JSON.stringify(AdminMenu.menu), false);
        this.navmenu.intializeMenu(AdminMenu.menu);
        new EncryptedStorage().setItem(config.menu, JSON.stringify(AdminMenu.menu), false);
        this.router.navigate([config.dashboardRoute]);

        this.toastService.open("Login Successful", "success");

        // this.encryptedStorage.clearAll();
        // const menuData = JSON.parse(value.user.menus);

        // // const permissions = value.role_page_permission;
        // // new EncryptedStorage().setItem(new GlobalConfig().pagePermissions, JSON.stringify(permissions), false);

        // this.encryptedStorage.setItem(this.globalConfig.authToken, value.token, false);
        // if (value.user.role_id === 1) {
        //   // new EncryptedStorage().setItem(new GlobalConfig().pagePermissions, JSON.stringify(permissions), false);
        //   this.encryptedStorage.setItem(this.globalConfig.userDetails, JSON.stringify(value.user), false)
        //   this.encryptedStorage.setItem(this.globalConfig.menu, JSON.stringify(menuData), false);
        //   this.navmenu.intializeMenu(menuData);
        //   this.router.navigate([this.globalConfig.dashboardRoute]);
        // } else {
        //   // const filteredMenu = this.filterMenuByPermissions(menuData, permissions);
        //   const filteredMenu = menuData;

        //   new EncryptedStorage().setItem(new GlobalConfig().menu, JSON.stringify(filteredMenu), false);
        //   new EncryptedStorage().setItem(new GlobalConfig().userDetails, JSON.stringify({
        //     ...value.user,
        //     menu: JSON.stringify(filteredMenu)  // Update with filtered menu
        //   }), false);
        //   this.navmenu.intializeMenu(filteredMenu);
        //   // this.permissionsService.loadPermissions();
        //   // if (permissions && permissions.length > 0) {
        //   //   const sortedPermissions = permissions.sort((a: any, b: any) => a.role_page_permission_id - b.role_page_permission_id);
        //   //   const firstRoute = sortedPermissions[0]?.page_url;
        //   //   this.router.navigate([firstRoute]);
        //   // } else {
        //   //   new EncryptedStorage().clearAll();
        //   //   this.router.navigate(['/auth/login'])
        //   //   this.toastService.open('Permission not granted. Please contact the administrator.', "error");
        //   //   return;
        //   // }
        // }
        // this.router.navigate([this.globalConfig.dashboardRoute]);
      },
      error: (err: HttpErrorResponse) => {
        this.toastService.open(err.message, "error");
      },
    });
  }


  private filterMenuByPermissions(menu: any[], permissions: any[]) {
    // Create a map of page URLs to permissions for quick lookup
    const permissionMap = new Map<string, any>();
    permissions.forEach(p => permissionMap.set(p.page_url, p));

    // Recursive function to filter menu items
    function filterItems(items: any[]): any[] {
      return items
        .map(item => {
          if (item.path) {
            // If it's a link, include it only if it has permission
            return permissionMap.has(item.path) ? { ...item } : null;
          } else if (item.children) {
            // If it has children, recursively filter them
            const filteredChildren = filterItems(item.children);
            if (filteredChildren.length > 0) {
              return { ...item, children: filteredChildren };
            }
          }
          return null;
        })
        .filter(Boolean); // remove nulls
    }

    return filterItems(menu);
  }

}
