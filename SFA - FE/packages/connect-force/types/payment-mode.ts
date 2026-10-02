export type PaginationInfo = {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    pageSize: number;
  };
  
  export interface PaymentMode {
    uId: number;
    paymentModeId: string;
    paymentModeType: string;
    description: string;
    createdBy: string;
    creationDate: string;
    isArchive: boolean;
    modifiedBy: string;
    modifiedDate: string;
    totalRecordCount: number;
    active: boolean;
  }
  
  export type PaymentModeSliceState = {
    isLoading: boolean;
    error: any;
    paginationDetails: PaginationInfo | null;
    businessCategorys: PaymentMode[];
    businesscategory: PaymentMode | null;
    newPage: number;
    newRowsPerPage: number;
  };
  
  export type FormattedPaymentMode = {
    uId: number;
    paymentModeId: string;
    paymentModeType: string;
    description: string;
  };
  