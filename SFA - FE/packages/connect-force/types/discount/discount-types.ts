export type DiscountState = {
  isLoading: boolean;
  error: string | null;
  paginationDetails: Pagination | null;
  discountDetails: Discount[];
  isActive: true;
  discount: Discount | null;
  newPage: number;
  newRowsPerPage: number;
  message: string | null;
  discountProducts: DiscountProduct[];
  discountTypeDetails: DiscountType[];
  valueDiscountTypeDetails: ValueDiscountType[];
  discountMappingList: DiscountMappingList[];
};
interface DiscountProduct {
  productUId: number;
  productID: string;
  productName: string;
  productGroup: string;
  productCategory: string;
  checkedStatus: boolean;
}

export type DiscountMappingList = {
  uId: number;
  discountID: string | null;
  discountName: string | null;
  discountTypeName: string | null;
  valueDiscountTypeName: string | null;
};

export type DiscountType = {
  discountTypeID: number;
  description: string;
  name: string;
};

export type ValueDiscountType = {
  val_type_ID: number;
  description: string;
  name: string;
};

export type Pagination = {
  pageNo: number;
  pageSize: null;
  results: number;
  total: number;
};

export type Discount = {
  uId: number;
  companyId: number;
  discountID: string | null;
  name: string | null;
  description?: string | null;
  discountTypeID: number;
  startDate: string | null;
  endDate: string | null;
  startdate: string | null;
  enddate: string | null;

  req_Product: string[];
  req_Quantity: number;
  applied_product: number;
  applied_quantity: number;
  productDiscountBudjet: number;

  applied_discount_ID: number | null;
  applied_discount_amt: number | null;
  applied_discount_products: string | null;
  req_quantity_value_product: number | null;
  valueDiscountBudjet: number;

  createdBy: string;
  creationDate: string;
  isArchive: boolean;
  modifiedBy: string | null;
  modifiedDate: string | null;
  totalRecordCount: number;
  active: boolean;
};

export type FormValuesPropsDiscount = {
  uId: number;
  companyId: number;
  discountID: string | null;
  name: string | null;
  description?: string | null;
  discountTypeID: number | null;
  startdate: string | null;
  enddate: string | null;

  req_Product: number[] | string[] | null;
  req_Quantity: number | null;
  applied_product: number | null;
  applied_quantity: number | null;
  productDiscountBudjet: number | null;

  applied_discount_ID: number | null;
  applied_discount_amt: number | null;
  applied_discount_products: string | null;
  req_quantity_value_product: number | null;
  valueDiscountBudjet: number | null;

  createdBy: string;
  creationDate: string;
  isArchive: boolean;
  modifiedBy: string | null;
  modifiedDate: string | null;
  totalRecordCount: number;
  active: boolean;
};
