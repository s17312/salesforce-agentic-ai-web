export type AssetTypeState = {
  isLoading: boolean;
  error: string | null;
  paginationDetails: Pagination | null;
  assetTypeDetails: AssetType[];
  isActive: true;
  assetType: AssetType | null;
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

export type AssetType = {
  uId: number;
  assetTypeId: string;
  assetTypeName: string;
  description: string;
  createdBy: string;
  creationDate: string;
  isArchive: boolean;
  modifiedBy: string;
  modifiedDate: string;
  totalRecordCount: number;
  active: boolean;
};

export type FormValuesPropsAssetType = {
  assetTypeId: string | null;
  assetTypeName: string | null;
  description?: string | null;
  createdBy: string;
  creationDate: string;
  modifiedBy: string;
  modifiedDate: string;
  active: boolean;
};
