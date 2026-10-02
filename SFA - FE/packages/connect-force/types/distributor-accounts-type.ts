export type DistributorAccountsState = {
  isLoading: boolean;
  error: string | null;
  paginationDetails: Pagination | null;
  distributorAccountsDetails: DistributorAccounts[];
  distributorAssignedAccountsDetails: any[];
  isActive: true;
  distributorAccount: DistributorAccounts | null;
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

export type DistributorAccounts = {
  uId: number;
  accountId: string;
  accountName: string;
  accountNumber: string;
  description: string;
  createdBy: string;
  creationDate: string;
  isArchive: boolean;
  modifiedBy: string;
  modifiedDate: string;
  totalRecordCount: number;
  active: boolean;
};

export type FormValuesPropsDistributorAccounts = {
  accountId: string | null;
  accountName: string | null;
  accountNumber: string | null;
  description?: string | null;
  createdBy: string;
  creationDate: string;
  modifiedBy: string;
  modifiedDate: string;
  active: boolean;
};
