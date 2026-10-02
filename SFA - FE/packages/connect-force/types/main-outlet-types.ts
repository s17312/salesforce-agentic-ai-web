export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  pageSize: number;
};

export type MainOutletSliceState = {
  isLoading: boolean;
  error: any;
  paginationDetails: PaginationInfo | null;
  mainOutlets: MainOutlet[];
  parentOutlets: MainOutlet[];
  mainOutlet: MainOutlet | null;
  newPage: number;
  newRowsPerPage: number;
  message: any;
};

export type MainOutlet = {
  outletID: string;
  name: string;
  address: string;
  addressLine1: string;
  addressLine2: string;
  contactNo: string;
  brNo: string;
  vatNo: string;
  motherCompanyAddress: string;
  motherCompanyAddressLine1: string;
  motherCompanyAddressLine2: string;
  ownerName: string;
  ownerNIC: string;
  ownerContactNo: string;
  uId: number;
  isArchive: boolean;
  active: boolean;
  creationDate: string;
  modifiedDate: string;
  totalRecordCount: number;
  createdBy: string;
  modifiedBy: string;
};

export type CreateMainOutletFormValues = {
  outletID: string;
  name: string;
  address: string;
  addressLine1: string;
  addressLine2: string;
  contactNo: string | null | undefined;
  brNo: string;
  vatNo: string;
  motherCompanyAddress: string;
  motherCompanyAddressLine1: string;
  motherCompanyAddressLine2: string;
  ownerName: string;
  ownerNIC: string;
  ownerContactNo: string | null | undefined;
};
