import { BusinessCategory } from "./businesscategory-types";
import { DistributorAccounts } from "./distributor-accounts-type";
import { PaymentTerm } from "./payment-term";

export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  pageSize: number;
};

type City = {
  districtUId: number;
  isLoading: boolean;
  name_en: string;
  name_si: string;
  name_ta: string;
  postcode: string;
};

type District = {
  provinceUId: number;
  isLoading: boolean;
  name_en: string;
  name_si: string;
  name_ta: string;
};

type Province = {
  isLoading: boolean;
  nameEN: string;
  nameSI: string;
  nameTA: string;
};

type Title = {
  description: string;
};

export interface Distributor {
  uId: number;
  distributorID: string;
  distributorName: string;
  address: string;
  addressLine1: string;
  addressLine2: string;
  appointedDate: Date;
  businessCategoryUId: number;
  city: City;
  createdBy: string;
  creationDate: string;
  district: District;
  districtUId: number;
  isArchive: boolean;
  mobileNo: string;
  modifiedBy: string;
  modifiedDate: string;
  ownerAddr: string;
  ownerAddressLine1: string;
  ownerAddressLine2: string;
  ownerName: string;
  ownerTpNo: string;
  paymentTermUId: number;
  phone: string;
  province: Province;
  provinceUId: number;
  title: Title;
  titleUId: number;
  totalRecordCount: number;
  townUId: number;
  active: boolean;
  vatNo: string;
  businessCategory: BusinessCategory | null;
  paymentTerm: PaymentTerm | null;
  phoneCountryCode: string;
  ownerTpNoCountryCode: string;
  mobileNoCountryCode: string;
  priceListAssignmentUIds?: number[] | null;
  priceListAssignmentDefaultUId?: number | null;
  priceListTypeDefault?: priceListTypeDefault;
  priceListType?: priceListTypeDefault[] | null;

  cashAccountAssignmentUIds?: number[] | null;
  cashAccountAssignmentDefaultUId?: number | null;
  cashAccountDefault?: accountAssignment;
  cashAccount?: accountAssignment[] | null;

  chequeAccountAssignmentUIds?: number[] | null;
  chequeAccountAssignmentDefaultUId?: number | null;
  chequeAccountDefault?: accountAssignment;
  chequeAccount?: accountAssignment[] | null;

  outstandingAccountAssignmentUIds?: number[] | null;
  outstandingAccountAssignmentDefaultUId?: number | null;
  outstandingAccountDefault?: accountAssignment;
  outstandingAccount?: accountAssignment[] | null;
}

export interface DistributorMappingList {
  uId: number;
  distributorName: string;
  distributorCode: string;
  hasOutlets: boolean;
  hasRoutes: boolean;
  hasRepresentatives: boolean;
  hasProducts: boolean;
}

export type DistributorSliceState = {
  isLoading: boolean;
  error: any;
  message: any;
  paginationDetails: PaginationInfo | null;
  distributors: Distributor[];
  distributor: Distributor | null;
  distributorMapping: DistributorMappingList[];
  newPage: number;
  newRowsPerPage: number;
};

export type FormattedDistributor = {
  id: number;
  distributorID: string;
  distributorName: string;
  district: string;
  city: number;
  phone: number;
  ownerName: string;
};

export interface priceListTypeDefault {
  priceListTypeId: string;
  priceListTypeName: string;
  priceListTypeDescription: string;
  priceTypeUId: number;
  companyUId: number;
  uId: number;
}

export interface accountAssignment {
  uId: string;
  accountId: string;
  accountName: string;
  accountNumber: number;
  description: string;
}
