export class GlobalConfig {
  authToken = '_truck-at';
  dashboardRoute = '/dashboard';
  loginRoute = '/auth/login';
  userDetails = '_truck-user';
  userId = '_truck-userId';
  userName = '_truck-userName';
  roleId = '-truck-roleId';
  companyId = '-truck-compId';
  customerId = "-customerPortal-custId"
  hubIds = "-customerPortal-hubIds"
  pagePermissions = "_pagePermissions"
  menu = '-truck-menu';
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
