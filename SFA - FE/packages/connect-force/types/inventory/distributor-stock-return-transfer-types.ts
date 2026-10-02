export type DistributorStockReturnState = {
  isLoading: boolean;
  error: string | null;
  paginationDetails: Pagination | null;
  DS_ReturnTransfer: DistributorStockReturnData | null;
  DS_ReturnTransfers: DistributorStockReturn[];
  isActive: true;
  distributorWarehouseProducts: DistributorWarehouseProducts[];
  newPage: number;
  newRowsPerPage: number;
};

export type Pagination = {
  pageNo: number;
  pageSize: null;
  results: number;
  total: number;
};

export type DistributorStockReturnData = {
  stockReturnHeader: StockReturnHeader;
  stockReturnDetail: StockReturnDetail[];
};

export type StockReturnHeader = {
  stockReturnHeaderId: number;
  stockReturnNo: string;
  stockReturnDate: string;
  wareHouseUId: number;
  distributorUId: number;
  totalQuantity: number;
  totalVolume: number;
  totalValue: number;
  wareHouseName: string;
  distributorName: string;
  statusName: string;
  createdBy: number;
  creationDate: string;
  modifiedBy: number;
  modifiedDate: string;
};

export type StockReturnDetail = {
  stockReturnDetailId: number;
  productUId: number;
  productID: number;
  productName: string;
  stockAvailable: number;
  mrp: number;
  rate: number;
  returnQuantity: number;
  volume: number;
  value: number;
  baseUnitId?: number;
  baseUnitName?: string;
  createdBy: number;
  creationDate: string;
  modifiedBy: number;
  modifiedDate: string;
};

export type DistributorStockReturn = {
  stockReturnHeaderId: number;
  totalQuantity: string;
  totalVolume: string;
  totalValue: string;
  stockReturnNo: string;
  wareHouseName: string;
  distributorName: string;
  statusName: string;
  uId: number;
  isArchive: boolean;
  active: boolean;
  createdBy: string;
  creationDate: string;
  modifiedBy: string;
  modifiedDate: string;
  totalRecordCount: number;
};

export type DistributorWarehouseProducts = {
  productUID: number;
  productID: number;
  productName: string;
  createdBy: number;
  creationDate: string;
  modifiedBy: number;
  modifiedDate: string;
  totalRecordCount: number;
  isArchive: boolean;
  active: boolean;
  uId: number;
  availableStock: number;
  mrp: number;
  rate: number;
  priceListUID: number;
  batchNumber: string;
  uom: string;
  uomId: number;
  baseUnitId: number;
  baseUnitName: string;
  uomQty: number;
  productWeight: number;
};
