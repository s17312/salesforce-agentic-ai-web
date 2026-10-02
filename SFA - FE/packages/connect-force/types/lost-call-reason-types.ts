export type LostCallReasonState = {
  isLoading: boolean;
  error: string | null;
  paginationDetails: Pagination | null;
  lostCallReasonDetails: LostCallReason[];
  isActive: true;
  lostCallReason: LostCallReason | null;
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

export type LostCallReason = {
  uId: number;
  reasonID: string;
  reason: string;
  description: string;
  createdBy: string;
  creationDate: string;
  isArchive: boolean;
  modifiedBy: string;
  modifiedDate: string;
  totalRecordCount: number;
  active: boolean;
};

export type FormValuesPropsLostCallReason = {
  reasonID: string | null;
  reason: string | null;
  description?: string | null;
  createdBy: string;
  creationDate: string;
  modifiedBy: string;
  modifiedDate: string;
  active: boolean;
};
