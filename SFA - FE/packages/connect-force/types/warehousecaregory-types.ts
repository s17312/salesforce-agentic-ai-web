export type WarehouseCategoryState = {
  isLoading: boolean;
  error: string | null;
  paginationDetails: Pagination | null;
  warehouseCategoryDetails: WarehouseCategory[];
  isActive: true;
  warehouseCategory: WarehouseCategory | null;
  newPage: number;
  newRowsPerPage: number;
  message: string | null;
};

export type WarehouseCategory = {
  uId: number;
  categoryID: string;
  category: string;
  description: string;
  createdBy: string;
  creationDate: string;
  isArchive: boolean;
  modifiedBy: string;
  modifiedDate: string;
  totalRecordCount: number;
  active: boolean;
};

export type Pagination = {
  pageNo: number;
  pageSize: null;
  results: number;
  total: number;
};

export type FormValuesPropsWarehouseCategory = {
  categoryID: string | null;
  category: string | null;
  description?: string | null;
  createdBy: string;
  creationDate: string;
  active: boolean;
  modifiedBy: string;
  modifiedDate: string;
};
