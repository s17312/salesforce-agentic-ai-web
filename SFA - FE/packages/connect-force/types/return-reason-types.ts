export type ReturnReasonState = {
    isLoading: boolean;
    error: string | null;
    paginationDetails: Pagination | null;
    returnReasonDetails: ReturnReason[];
    isActive: true;
    returnReason: ReturnReason | null;
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

export type ReturnReason = {
    uId: number;
    reasonId: string;
    name: string;
    eligible: boolean;
    description: string;
    createdBy: string;
    creationDate: string;
    isArchive: boolean;
    modifiedBy: string;
    modifiedDate: string;
    totalRecordCount: number;
    active: boolean;
};

export type FormValuesPropsReturnReason = {
    uId?: number;
    reasonId?: string | null;
    name?: string | null;
    eligible?: boolean | null;
    description?: string | null;
};