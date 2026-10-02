import { Distributor } from "./distributor-types";

export type SalesRepresentativeState = {
  isLoading: boolean;
  error: string | null;
  paginationDetails: Pagination | null;
  salesRepresentativeDetails: SalesRepresentative[];
  isActive: true;
  salesRepresentative: SalesRepresentative | null;
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

export type SalesRepresentative = {
  uId: number;
  representativeID: string;
  name: string;
  email: string;
  contactNo: string;
  contactNoCountryCode: string;
  address: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  dateOfBirth: string;
  nic: string;
  reference: string;
  distributorUId: number;
  distributor?: Distributor | null;
  createdBy: string;
  creationDate: string;
  isArchive: boolean;
  modifiedBy: string;
  modifiedDate: string;
  totalRecordCount: number;
  active: boolean;
};

export type FormValuesPropsSalesRepresentative = {
  representativeID: string | null;
  name: string | null;
  email: string | null;
  contactNo: string | null | undefined;
  contactNoCountryCode: string | null | undefined;
  addressLine1: string | null;
  addressLine2?: string | null;
  addressLine3?: string | null;
  dateOfBirth?: string | null;
  nic?: string | null;
  reference?: string | null;
  distributorUId?: number | null;
  distributor?: Distributor | null;
  createdBy: string;
  creationDate: string;
  modifiedBy: string;
  modifiedDate: string;
  active: boolean;
};
