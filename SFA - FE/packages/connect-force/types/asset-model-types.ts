export type AssetModelState = {
    isLoading: boolean;
    error: string | null;
    paginationDetails: Pagination | null;
    assetModelDetails: AssetModel[];
    isActive: true;
    assetModel: AssetModel | null;
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
  
  export type AssetModel = {
    uId: number;
    assetModelId: string;
    assetModelName: string;
    description: string;
    createdBy: string;
    creationDate: string;
    isArchive: boolean;
    modifiedBy: string;
    modifiedDate: string;
    totalRecordCount: number;
    active: boolean;
  };
  
  export type FormValuesPropsAssetModel = {
    assetModelId: string | null;
    assetModelName: string | null;
    description?: string | null;
    createdBy: string;
    creationDate: string;
    modifiedBy: string;
    modifiedDate: string;
    active: boolean;
  };
  