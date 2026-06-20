import { Injectable } from '@angular/core';
import { PermissionsActions } from '@shared/constants/permissionsActions.constant';
import { PermissionsService } from './PermissionsService';
import { currentUser } from '@shared/utils/current-user';


@Injectable({
  providedIn: 'root'
})
export class PermissionHelperService {

  constructor(
    private permissionsService: PermissionsService,
  ) {}

  getPermissions(pageId: number) {
    const user = currentUser();

    // Default permissions
    let permissions = {
      canCreate: false,
      canEdit: false,
      canView: false,
      canDelete: false,
      canUnlock: false
    };

    // 🔒 Role restriction
    if (user?.role_id === 3) {
      permissions.canView = true; // Only view allowed
      return permissions;
    }else if(user?.role_id === 1 || user?.role_id === 2){
        permissions.canCreate = true; // allowed
        permissions.canEdit = true; // allowed
        permissions.canView = true; // allowed
        permissions.canDelete = true; // allowed
      return permissions;

    }

    // ✅ Normal permission check
    permissions.canCreate = this.permissionsService.hasPermission(pageId, PermissionsActions.CREATE.name);
    permissions.canEdit = this.permissionsService.hasPermission(pageId, PermissionsActions.EDIT.name);
    permissions.canView = this.permissionsService.hasPermission(pageId, PermissionsActions.VIEW.name);
    permissions.canDelete = this.permissionsService.hasPermission(pageId, PermissionsActions.DELETE.name);

    return permissions;
  }
}