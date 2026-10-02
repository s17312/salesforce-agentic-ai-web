export type UnloadingReasonState = {
    isLoading: boolean;
    error: string | null;
    paginationDetails: Pagination | null;
    unloadingReasonDetails: UnloadingReason[];
    isActive: true;
    unloadingReason: UnloadingReason | null;
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
  
  export type UnloadingReason = {
    uId: number;
    unloadingReasonId: string;
    unloadingReasonName: string;
    description: string;
    createdBy: string;
    creationDate: string;
    isArchive: boolean;
    modifiedBy: string;
    modifiedDate: string;
    totalRecordCount: number;
    active: boolean;
  };
  
  export type FormValuesPropsUnloadingReason = {
    unloadingReasonId: string | null;
    unloadingReasonName: string | null;
    description?: string | null;
    createdBy: string;
    creationDate: string;
    modifiedBy: string;
    modifiedDate: string;
    active: boolean;
  };
  