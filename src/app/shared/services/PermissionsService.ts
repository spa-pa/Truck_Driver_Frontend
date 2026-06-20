import { Injectable } from '@angular/core';
import { EncryptedStorage } from '@shared/utils/encrypted-storage';
import { GlobalConfig } from '@shared/configs/global-config';
import { PermissionsActions } from '@shared/constants/permissionsActions.constant';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private permissions: any[] = [];

  constructor() {
    this.loadPermissions();
  }

  // Method to load or refresh permissions
  loadPermissions(): void {
    this.permissions = JSON.parse(
      new EncryptedStorage().getItem(new GlobalConfig().pagePermissions) || '[]'
    );
  }

  // hasPermission(pageId: number, action: string): boolean {
  //   const page = this.permissions.find(p => p.page_id === pageId);
  //   if (!page) return false;
  //   console.log('hasPermission page = ',page);
  //   switch (action) {
  //     case 'create':
  //       return (page.permission & 1) === 1; // Check if 'create' bit is set
  //     case 'edit':
  //       return (page.permission & 2) === 2; // Check if 'edit' bit is set
  //     case 'delete':
  //       return (page.permission & 4) === 4; // Check if 'delete' bit is set
  //     case 'view':
  //       return (page.permission & 8) === 8; // Check if 'view' bit is set
  //     case 'unlock':
  //       return (page.permission & 16) === 16; // Check if 'unlock' bit is set
  //     case 'upload':
  //       return (page.permission & 32) === 32; // Check if 'upload' bit is set
  //     case 'Proceed':
  //       return (page.permission & 64) === 64; // Check if 'Proceed' bit is set
  //     case 'create_job_id':
  //       return (page.permission & 128) === 128; // Check if 'create_job_id' bit is set
  //     case 'can_add_other_service':
  //       return (page.permission & 256) === 256; // Check if 'create_job_id' bit is set
  //     case 'send_to_PMS':
  //       return (page.permission & 512) === 512; // Check if 'create_job_id' bit is set
  //     case 'approve':
  //       return (page.permission & 1024) === 1024; // Check if 'create_job_id' bit is set
  //     case 'reject':
  //       return (page.permission & 2048) === 2048; // Check if 'create_job_id' bit is set
  //     case 'rollback':
  //       return (page.permission & 4096) === 4096; // Check if 'create_job_id' bit is set
  //     case 'can_released_job_id':
  //       return (page.permission & 8192) === 8192; // Check if 'create_job_id' bit is set
  //     default:
  //       return false;
  //   }
  // }
  hasPermission(pageId: number, action: string): boolean {

    // const page = this.permissions.find(p => p.page_id === pageId);
    // if (!page) return false;
    // // console.log('hasPermission page = ', page);
    // const permissionAction = Object.values(PermissionsActions).find(
    //     perm => perm.name === action
    // );

    // if (!permissionAction) return false;

    // return (page.permission & permissionAction.value) === permissionAction.value;

    const page = this.permissions.find(p => p.page_id === pageId);
    if (!page) return false;
    console.log('hasPermission page = ', page);

    const permissionAction = Object.values(PermissionsActions).find(
      perm => perm.name === action
    );

    if (!permissionAction) return false;

    // Split description by '+' and normalize
    const actions = page.description.split('+').map((a: any) => a.trim().toLowerCase());

    // Check if any action contains the search term
    return actions.some((a: any) => a.includes(action.toLowerCase()));
  }
}
