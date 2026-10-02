export type AssetAllocationTypeState = {
    isLoading: boolean;
    error: string | null;
    paginationDetails: Pagination | null;
    assetAllocationTypeDetails: AssetAllocationType[];
    isActive: true;
    assetAllocationType: AssetAllocationType | null;
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

export type AssetAllocationType = {
    uId: number;
    assetAllocationTypeId: string;
    allocationType: string;
    active: boolean;
}