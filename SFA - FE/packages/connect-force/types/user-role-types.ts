export type UserRoleState = {
  isLoading: boolean;
  error: string | null;
  paginationDetails: Pagination | null;
  userRoleDetails: UserRole[];
  userRoleTypes: UserRoleTypes[];
  isActive: true;
  userRole: UserRole | null;
  newPage: number;
  newRowsPerPage: number;
  message: string | null;
};

export type Pagination = {
  pageNo: number;
  pageSize: null;
  results: number;
  total: number;
};

export type UserRole = {
  uId: number;
  roleId: string;
  roleName: string;
  roleType: number;
  roleTypeModel: UserRoleTypes | null;
  description: string;
  createdBy: string;
  creationDate: string;
  isArchive: boolean;
  modifiedBy: string;
  modifiedDate: string;
  totalRecordCount: number;
  active: boolean;
};

export type FormValuesPropsUserRole = {
  roleId: string | null;
  roleName: string | null;
  roleType: number | null;
  description?: string | null;
  createdBy: string;
  creationDate: string;
  modifiedBy: string;
  modifiedDate: string;
  active: boolean;
};

export type UserRoleTypes = {
  uId: number;
  roleTypeName: string;
  description?: string;
};

export type PropsUserRole = {
  roleId: string | null;
  roleName: string | null;
  roleType: number | null;
  roleTypeModel?: UserRoleTypes | null;
  description?: string | null;
  createdBy: string;
  creationDate: string;
  modifiedBy: string;
  modifiedDate: string;
  active: boolean;
};
