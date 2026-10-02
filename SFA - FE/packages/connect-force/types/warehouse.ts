import { Company } from "./company-types";
import { Distributor } from "./distributor-types";
import { Vehicle } from "./vehicle-types";
import { warehouseType } from "./warehouse-types";
import { WarehouseCategory } from "./warehousecaregory-types";

export type warehouse = {
  uId: number;
  warehouseID: string;
  name: string;
  description: string;
  warehouseTypeUId: number;
  warehouseCategoryUId: number;
  warehouseAssinmentUId: number;
  createdBy: string;
  creationDate: string;
  isArchive: boolean;
  modifiedBy: string;
  modifiedDate: string;
  totalRecordCount: number;
  active: boolean;
  warehouseCategoryName?: string;
  warehouseTypeName?: string;
  warehouseCategory?: WarehouseCategory | null;
  warehouseType?: warehouseType | null;
  assingmentName?: string;
  warehouseAssignment?: WarehouseAssignments | null;
  company?: Company | null;
  distributor?: Distributor | null;
  vehicle?: Vehicle | null;
};

export type pagination = {
  pageNo: number;
  pageSize: null;
  results: number;
  total: number;
};

export type RegisterWarehouse = {
  uId?: number;
  warehouseID?: string | null;
  name?: string | null;
  description?: string | null;
  warehouseTypeUId?: number | null;
  warehouseCategoryUId?: number | null;
  warehouseCategoryName?: string;
  warehouseTypeName?: string;
  warehouseCategory?: WarehouseCategory | null;
  warehouseType?: warehouseType | null;
  warehouseAssinmentUId: number | null;
  assingmentName?: string;
  warehouseAssignment?: WarehouseAssignments | null;
  company?: Company | null;
  distributor?: Distributor | null;
  vehicle?: Vehicle | null;
};

export type WarehouseProps = {
  currentWarehouse?: warehouse | undefined;
  isEdit?: boolean;
};

export type WarehouseState = {
  isLoading: boolean;
  error: string | null;
  message: string | null;
  paginationDetails: pagination | null;
  warehouses: warehouse[];
  isActive: true;
  warehouse: warehouse | null;
  newPage: number;
  newRowsPerPage: number;
  warehouseAssignments: WarehouseAssignments[];
};

export type WarehouseAssignments = {
  uId: number;
  assingmentId: string | null;
  assingmentName: string | null;
};
