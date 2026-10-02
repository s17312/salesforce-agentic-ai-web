import { PagedResultStatus } from "./paged-result-status";

export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  pageSize: number;
};

export type Pagination = {
  pageNo: number;
  pageSize: null;
  results: number;
  total: number;
};

type LegalEntryType = {
  legalEntryTypeId?: string | null;
  legalEntryTypeName?: string | null;
  description?: string | null;
};

export interface Company {
  uId?: number;
  companyId?: string | null;
  companyName?: string | null;
  legalEntryType?: LegalEntryType;
  legalEntryTypeUId?: number;
  registeredAddress?: string | null;
  phoneNo?: string | null;
  email?: string | null;
  taxID?: string | null;
  companySize?: string | null;
  industry?: string | null;
  siCcode?: string | null;
  comments?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  vatNo?: string | null;
  phoneNoCountryCode?: string | null;
  createdBy?: string | null;
  creationDate?: string | null;
  modifiedBy?: string | null;
  modifiedDate?: string | null;
  active?: boolean;
  priceListAssignmentUIds?: number[] | null;
  priceListAssignmentDefaultUId?: number | null;
  priceListTypeDefault?: priceListTypeDefault;
  priceListType?: priceListTypeDefault[] | null;
}

export interface CompanyPagedResult {
  items?: Array<Company> | null;
  paging?: PagedResultStatus;
}

export type CompanySliceState = {
  isLoading: boolean;
  error: any;
  message: any;
  paginationDetails: PaginationInfo | null;
  companies: Company[];
  company: Company | null;
  newPage: number;
  newRowsPerPage: number;
  companyMappingList: CompanyMappingList[];
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

export interface CompanyMappingList {
  uId: number;
  companyName: string;
  companyCode: string;
  hasProducts: boolean;
  hasDistributor: boolean;
}

export interface priceListTypeDefault {
  priceListTypeId: string;
  priceListTypeName: string;
  priceListTypeDescription: string;
  priceTypeUId: number;
  companyUId: number;
  uId: number;
}