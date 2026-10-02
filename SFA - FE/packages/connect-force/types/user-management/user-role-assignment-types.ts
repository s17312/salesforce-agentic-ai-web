export type UserRoleAssignmentState = {
    isLoading: boolean;
    error: string | null;
    paginationDetails: Pagination | null;
    userRoleAssignmentDetails: UserRoleAssignment[];
    distributorView: any[];
    repBydistri: any[];
    isActive: boolean;
    userRoleAssignment: UserRoleAssignment | null;
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

export type KeyValue = {
    key: string | number;
    value: string;
  };

export type UserRoleAssignment = {
    uId: number;
    userDetailsUId: number;
    userRoleUId: number;
    companyUId?: number;
    distributorUIds?: number[] | null | undefined; 
    representativeUIds?: number[];
    userName: string;
    roleName: string;
    companyName: string;
    distributors: KeyValue[];
    representatives: KeyValue[];
    creationDate: string;
    createdBy: string;
    isArchive: boolean;
    modifiedBy: string;
    modifiedDate: string;
    totalRecordCount: number;
    active: boolean;
}

export type FormValuesPropsUserRoleAssignment = {
    userDetailsUId: number | null;
    userRoleUId: number | null;
    companyUId?: number | null;
    distributorUIds?: number[] | null;
    representativeUIds?: number[] | null;
    creationDate?: string | null;
    createdBy?: string | null;
    modifiedBy?: string | null;
    modifiedDate?: string | null;
    active?: boolean | null;
}