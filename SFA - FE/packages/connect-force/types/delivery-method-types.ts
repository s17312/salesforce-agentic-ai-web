export type DeliveryMethodState = {
  isLoading: boolean;
  error: string | null;
  paginationDetails: Pagination | null;
  deliveryMethodDetails: DeliveryMethod[];
  isActive: true;
  deliveryMethod: DeliveryMethod | null;
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

export type DeliveryMethod = {
  uId: number;
  deliveryMethodId: string;
  deliveryMethodName: string;
  description: string;
  createdBy: string;
  creationDate: string;
  isArchive: boolean;
  modifiedBy: string;
  modifiedDate: string;
  totalRecordCount: number;
  active: boolean;
};

export type FormValuesPropsDeliveryMethod = {
  deliveryMethodId: string | null;
  deliveryMethodName: string | null;
  description?: string | null;
  createdBy: string;
  creationDate: string;
  modifiedBy: string;
  modifiedDate: string;
  active: boolean;
};
