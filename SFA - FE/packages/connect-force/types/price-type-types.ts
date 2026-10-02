export type PriceTypeState = {
  isLoading: boolean;
  error: string | null;
  paginationDetails: Pagination | null;
  priceTypeDetails: PriceType[];
  isActive: true;
  priceType: PriceType | null;
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

export type PriceType = {
  uId: number;
  priceTypeID: string;
  name: string;
  description: string;
  createdBy: string;
  creationDate: string;
  isArchive: boolean;
  modifiedBy: string;
  modifiedDate: string;
  totalRecordCount: number;
  active: boolean;
};

export type FormValuesPropsPriceType = {
  priceTypeID: string | null;
  name: string | null;
  description: string | null;
};
