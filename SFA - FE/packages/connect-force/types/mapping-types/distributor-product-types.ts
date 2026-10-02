export interface ProductsByDistributorId {
  productUId?: number;
  productID?: string;
  productName?: string;
  checkedStatus?: boolean;
}

export interface ProductsByDistributorIdPagedResults {
  items?: Array<ProductsByDistributorId> | null;
}
