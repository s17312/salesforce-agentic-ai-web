import { PriceType } from "./price-type-types";

export type PriceListTypeState = {
  isLoading: boolean;
  error: string | null;
  paginationDetails: Pagination | null;
  priceListTypeDetails: PriceListType[];
  isActive: true;
  priceListType: PriceListType | null;
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

export type PriceListType = {
  uId: number;
  priceListTypeId: string;
  priceListTypeName: string;
  priceTypeUId: number;
  priceListTypeDescription: string;
  priceTypeName?: string;
  priceType?: PriceType | null;
  createdBy: string;
  creationDate: string;
  isArchive: boolean;
  modifiedBy: string;
  modifiedDate: string;
  totalRecordCount: number;
  active: boolean;
};

export type FormValuesPropsPriceListType = {
  priceListTypeId: string | null;
  priceListTypeName: string | null;
  priceListTypeDescription: string | null;
  priceTypeUId: number | null;
  priceTypeName?: string | null;
  priceType?: PriceType | null;
};
