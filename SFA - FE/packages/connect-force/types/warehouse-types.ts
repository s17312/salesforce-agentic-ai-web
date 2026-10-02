export type warehouseType = {
  uId: number;
  warehouseTypeId: string;
  warehouseTypeName: string;
  description: string;
  createdBy: string;
  creationDate: string;
  isArchive: boolean;
  modifiedBy: string;
  modifiedDate: string;
  totalRecordCount: number;
  active: boolean;
};

export type pagination = {
  pageNo: number;
  pageSize: null;
  results: number;
  total: number;
};

export type RegisterWarehouseType = {
  uId?: number;
  warehouseTypeId?: string | null;
  warehouseTypeName?: string | null;
  description?: string | null;
}

export type WarehouseTypeProps = {
  currentWarehouseType?: warehouseType | undefined;
  isEdit?: boolean;
};

export type WarehouseTypeState = {
  isLoading: boolean;
  error: string | null;
  message: string | null;
  paginationDetails: pagination | null;
  warehouseTypes: warehouseType[];
  isActive: true;
  warehouseType: warehouseType | null;
  newPage: number;
  newRowsPerPage: number;
};
