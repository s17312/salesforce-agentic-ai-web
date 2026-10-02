export type GRNTypeState = {
  isLoading: boolean;
  error: string | null;
  paginationDetails: Pagination | null;
  grnTypeDetails: GRNType[];
  isActive: true;
  grnType: GRNType | null;
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

export type GRNType = {
  uId: number;
  grnTypeId: string;
  grnTypeName: string;
  description: string;
  createdBy: string;
  creationDate: string;
  isArchive: boolean;
  modifiedBy: string;
  modifiedDate: string;
  totalRecordCount: number;
  active: boolean;
};

export type FormValuesPropsGRNType = {
  grnTypeId: string | null;
  grnTypeName: string | null;
  description?: string | null;
  createdBy: string;
  creationDate: string;
  modifiedBy: string;
  modifiedDate: string;
  active: boolean;
};
