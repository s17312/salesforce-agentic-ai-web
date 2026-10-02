export type AssetTransactioState = {
    isLoading: boolean;
    error: string | null;
    paginationDetails: Pagination | null;
    assetTransactionDetails: AssetTransaction[];
    isActive: true;
    assetTransaction: AssetTransaction | null;
    newPage: number;
    newRowsPerPage: number;
    message: string | null;
}

export type Pagination = {
    pageNo: number;
    pageSize: null;
    results: number;
    total: number;
};

export type AssetTransaction = {
    uId: number;    
    transactionId: string;
    assetUId: number;
    assetUIds?: number[] | null;
    fromLocationType: number;
    fromLocationUId: number;
    toLocationType: string;
    toLocationUId: number;
    transactionType: string;
    transactionDate: Date | null;
    active: boolean;
    isArchive: boolean;
    creationDate: string; 
    createdBy: number;
    modifiedDate: string | null;    
    modifiedBy: number | null;
    totalRecordCount: number;
    fromTransactionType: string | null;
    fromDistributor: number | null,
    fromRep: number | null,
    fromRoute: number | null,
    toDistributor: number | null,
    toRep: number | null,
    toRoute: number | null,
}

export type FormValuesPropsAssetTransaction = {
    fromTransactionType: string | null;
    transactionId: string;
    assetUIds: number[] | null;
    fromLocationType: number | null;
    fromLocationUId: number | null;
    toLocationType: string | null;
    toLocationUId: number | null;
    transactionType?: string | null;
    transactionDate: Date;
    active: boolean;
    isArchive: boolean;
    creationDate: string; 
    createdBy: number;
    modifiedDate?: string | null;    
    modifiedBy? : number | null;
    fromDistributor?: number | null,
    fromRep?: number | null,
    fromRoute?: number | null,
    toDistributor?: number | null,
    toRep?: number | null,
    toRoute?: number | null,
}

export type FormValuesPropsAssetTransactionValidation = {
    transactionId: string; 
    transactionDate: Date; 
  };