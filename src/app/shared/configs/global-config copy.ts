export class GlobalConfig {
  authToken = '_driver-safety-at';
  dashboardRoute = '/dashboard';
  loginRoute = '/auth/login';
  userDetails = '_driver-safety-user';
  userId = '_driver-safety-userId';
  userName = '_driver-safety-userName';
  roleId = '-driver-safety-roleId';
  companyId = '-driver-safety-compId';
  customerId = "-customerPortal-custId"
  hubIds = "-customerPortal-hubIds"
  pagePermissions = "_pagePermissions"
  menu = '_driver-safety-menu';
}

export interface ISearchConfig{
  isSearchBar: boolean,
  isSearch?: boolean,
  isFilter?: boolean,
  isCreateManifest?: boolean,
  isLockManifest?: boolean,
  isManifestReports?: boolean,
  isNewBooking?: boolean, 
  isManifestHistory?: boolean,
  isCloneManifest?: boolean,
  reportConfig?: {
    data:any,
    selectedOption: string
  }
}
