export type PaginationInfo = {
    pageNo: number;
    pageSize: number;
    results: number;
    total: number;
  };
  type ProductGroup = {
    productGroupId: string;
    productGroupName: string;
    description: string;
    isLoading: boolean;
  };
  type ProductCategory = {
    categoryID: string;
    categoryName: string;
    description: string;
    isLoading: boolean;
  };
type UOM = {
    uOMId: string;
    shortName: string;
    description: string;
    isLoading: boolean;
  };
  export interface Product {
    uId: number;
    productID:string;
    productName: string;
    description: string;
    productGroupUId: number;
    productGroup: ProductGroup;
    productCategoryUId: number;
    productCategory: ProductCategory;
    isReturnable: boolean;
    minOrderLevel: number;
    maxOrderLevel: number;
    qty: number;
    uom: UOM;
    uomuId: number;
    barcodeID: string;
    creationDate: string;
    createdBy: string;
    modifiedBy: string;
    modifiedDate: string;
    isArchive: boolean;
    active: boolean;
    imgData?: any;
    productCategoryName?: string;
    productGroupName?: string;
    salesUnitTypeAssignmentUIds?: number[] | null;
    salesUnitTypeAssignmentDefaultUId?: number | null;
    salesUnitTypeDefault?: SalesUnitType;
    salesUnitType?: SalesUnitType[] | null;
  };
  export type ProductSliceState = {
    isLoading: boolean;
    error: any;
    paginationDetails: PaginationInfo | null;
    products: Product[];
    product: Product | null;
    message: string | null;
    newPage: number;
    newRowsPerPage: number;
  };
  export type FormattedOutlet = {
    id: number;
    productID: string;
    productName: string;
    productGroup: string;
    productCategory: string;
   
  };

  export type SalesUnitType = {
    uId: number;
    unitId: string;
    unitName: string;
    description: string;
    isBaseUnit: boolean;
    baseUnitId: number;
    ratio: number;
}
  