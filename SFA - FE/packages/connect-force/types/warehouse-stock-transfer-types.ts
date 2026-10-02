export type Pagination = {
  pageNo: number;
  pageSize: number;
  results: number;
  total: number;
};

interface wst_detail {
  warehouseStockTransferHeader?: warehouseStockTransferHeader;
  warehouseStockTransferDetails?: warehouseStockTransferDetails[];
}

export type WarehouseStockTransferState = {
  isLoading: boolean;
  error: string | null;
  paginationDetails: Pagination | null;
  WarehouseStockTransferHeader: warehouseStockTransferHeader[];
  warehouseStockTransferDetails: warehouseStockTransferDetails[];
  isActive: true;
  currentWarehouseStockTransfer: warehouseStockTransferHeader | null;
  message: string | null;
  newPage: number;
  newRowsPerPage: number;
  WST_Distributors: any[];
  WST_FromWarehouses: any[];
  WST_RecivingWarehouses: any[];
  CompanyStockFromWarehouses: any[];
  CompanyStockReceivingWarehouses: any[];
  WST_Products: any[];
  Company_Warehouse_ST_Products: any[];
  WST_PriceList: any[];
  WST_Details: any[];
  WST_Detail: wst_detail | null;
  CompanyWST_Details: any[];
  CompanyWST_Detail: wst_detail | null;
};

export type warehouseStockTransferHeader = {
  uId?: number;
  companyUId: number;
  distributorUId: number;
  stockTransferId: string;
  stockTransferDate: string;
  fromWarehouseUId: number;
  fromWarehouseName?: string;
  recivingWarehouseUId: number;
  recivingWarehouseName?: string;
  totalVolume: number;
  totalValue: number;
  status: number;
  companyName?: string;
  distributorName?: string;
};

export type warehouseStockTransferDetails = {
  uId?: number;
  productUId: number;
  productID: string;
  productName: string;
  mrp: number;
  rate: number;
  updateQuantity: number;
  stockAvailable: number;
  transferQuantity: number;
  volume: number;
  value: number;
  createdBy: number;
  creationDate: string;
  modifiedBy: number;
  modifiedDate: string;
};

export type FormValuesPropsWarehouseStockTransfer = {
  stockTransferId: string;
  stockTransferDate: Date;
  distributorUId: number;
  fromWarehouseUId: number;
  recivingWarehouseUId: number;
  totalVolume: number;
  totalValue: number;
  status: number;
  quantity: any;
  warehouseStockTransferDetails: warehouseStockTransferDetails[];
};
