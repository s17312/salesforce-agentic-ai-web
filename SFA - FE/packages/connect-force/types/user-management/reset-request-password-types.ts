export type ResetRequestPasswordState = {
  isLoading: boolean;
  error: string | null;
  paginationDetails: Pagination | null;
  requestedListDetails: ResetRequestedPasswords[];
  requestedDetail: ResetRequestedPasswords | null;
  isActive: true;
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

export type ResetRequestedPasswords = {
  uId: number;
  userDetailsUId: number;
  reason: string;
  userName: string;
  requestedOn: Date;
  status: number;
};
