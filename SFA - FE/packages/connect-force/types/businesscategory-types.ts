export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  pageSize: number;
};

export interface BusinessCategory {
  uId: number;
  categoryId: string;
  category: string;
  Description: string;
  createdBy: string;
  creationDate: string;
  isArchive: boolean;
  modifiedBy: string;
  modifiedDate: string;
  totalRecordCount: number;
  active: boolean;
}

export type BusinessCategorySliceState = {
  isLoading: boolean;
  error: any;
  paginationDetails: PaginationInfo | null;
  businessCategorys: BusinessCategory[];
  businesscategory: BusinessCategory | null;
  newPage: number;
  newRowsPerPage: number;
};

export type FormattedBusinessCategory = {
  id: number;
  categoryId: string;
  category: string;
  Description: string;
};
