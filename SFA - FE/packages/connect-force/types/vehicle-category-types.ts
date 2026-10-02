export type VehicleCategoryState = {
  isLoading: boolean;
  error: string | null;
  paginationDetails: Pagination | null;
  vehicleCategoryDetails: VehicleCategory[];
  isActive: true;
  vehicleCategory: VehicleCategory | null;
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

export type VehicleCategory = {
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

export type FormValuesPropsVehicleCategory = {
  categoryID: string | null;
  category: string | null;
  description?: string | null;
  createdBy: string;
  creationDate: string;
  modifiedBy: string;
  modifiedDate: string;
  active: boolean;
};
