export type SalesUnitTypeState = {
    isLoading: boolean;
    error: string | null;
    paginationDetails: Pagination | null;
    salesUnitTypeDetails: SalesUnitType[];
    baseUnitTypeDetails: SalesUnitType[];
    isActive: true;
    salesUnitType: SalesUnitType | null;
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

export type SalesUnitType = {
    uId: number;
    unitId: string;
    unitName: string;
    description: string;
    isBaseUnit: boolean;
    baseUnitId: number;
    ratio: number;
    createdBy: string;
    creationDate: string;
    isArchive: boolean;
    modifiedBy: string;
    modifiedDate: string;
    totalRecordCount: number;
    active: boolean;
}

export type FormValuesPropsSalesUnitType = {
    unitId?: string | "";
    unitName?: string | "";
    description?: string | "";
    isBaseUnit?: boolean;
    baseUnitId?: number | null;
    baseUnitName?: string | "";
    ratio?: number | null;
    detailedName?: string | "";
    totQty?: number | null;
    createdBy: string;
    creationDate: string;
    modifiedBy: string;
    modifiedDate: string;
    active: boolean;
};