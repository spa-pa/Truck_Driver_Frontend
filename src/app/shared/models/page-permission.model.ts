// page-permission.model.ts
export interface PagePermission {
    page_id: string;
    permissions: string[];
}
  
  export interface PermissionsResponse {
    permissions: string[];  // List of all possible permissions (e.g., ['VIEW', 'EDIT'])
    pages: PagePermission[];  // List of pages with their associated permissions
  }
  
  export interface PagePermission {
    page_id: string;
    page_name:string;
    permissions: string[];  // Subset of permissions that this page has
  }