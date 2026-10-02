export type AssetBrandState = {
  isLoading: boolean;
  error: string | null;
  paginationDetails: Pagination | null;
  assetBrandDetails: AssetBrand[];
  isActive: true;
  assetBrand: AssetBrand | null;
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

export type AssetBrand = {
  uId: number;
  assetBrandId: string;
  assetBrandName: string;
  description: string;
  createdBy: string;
  creationDate: string;
  isArchive: boolean;
  modifiedBy: string;
  modifiedDate: string;
  totalRecordCount: number;
  active: boolean;
};

export type FormValuesPropsAssetBrand = {
  assetBrandId: string | null;
  assetBrandName: string | null;
  description?: string | null;
  createdBy: string;
  creationDate: string;
  modifiedBy: string;
  modifiedDate: string;
  active: boolean;
};
