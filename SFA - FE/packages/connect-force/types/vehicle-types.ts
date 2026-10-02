import { Distributor } from "./distributor-types";
import { SalesRepresentative } from "./sales-representative-types";
import { VehicleCategory } from "./vehicle-category-types";

export type VehicleState = {
  isLoading: boolean;
  error: string | null;
  paginationDetails: Pagination | null;
  vehicleDetails: Vehicle[];
  isActive: true;
  vehicle: Vehicle | null;
  newPage: number;
  newRowsPerPage: number;
  message: string | null;
  distributorDetails?: any[];
  representativeDetails?: any[];
};

export type Pagination = {
  pageNo: number;
  pageSize: null;
  results: number;
  total: number;
};

export type Vehicle = {
  uId: number;
  vehicleID: string;
  plateNumber: string;
  vehicleCategoryUID: number;
  yearOfManufacture: string;
  insuranceDetails: string;
  insuranceRegisterDate: Date;
  insuranceExpiryDate: Date;
  vehicleCategoryName?: string;
  vehicleCategory?: VehicleCategory | null;
  createdBy: string;
  creationDate: string;
  isArchive: boolean;
  modifiedBy: string;
  modifiedDate: string;
  totalRecordCount: number;
  active: boolean;
  distributor?: Distributor | null;
  representative?: SalesRepresentative | null;
  distributorId?: number | null;
  representativeId?: number | null;
};

export type FormValuesPropsVehicle = {
  vehicleID: string | null;
  plateNumber: string | null;
  yearOfManufacture: string | null;
  insuranceDetails: string | null;
  insuranceRegisterDate: Date | null;
  insuranceExpiryDate: Date | null;
  vehicleCategoryUID: number | null;
  vehicleCategoryName?: string | null;
  vehicleCategory?: VehicleCategory | null;
  name?: string | null;
  distributorUId?: number | null;
  distributorName?: string;
  distributor?: Distributor | null;
  representativeUId?: number | null;
  representativeName?: string;
  representative?: SalesRepresentative | null;
};
