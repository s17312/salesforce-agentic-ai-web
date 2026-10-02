export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  pageSize: number;
};
type OutletCategory = {
  outletCategoryId: string;
  outletCategoryName: string;
  description: string;
  isLoading: boolean;
};
type OutletClassification = {
  classificationID: string;
  classification: string;
  description: string;
  isLoading: boolean;
};
type OutletStatus = {
  outletStatusID: string;
  statusName: string;
  description: string;
  isLoading: boolean;
};
type PaymentMode = {
  paymentModeId: string;
  paymentModeType: string;
  description: string;
  isLoading: boolean;
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
export interface Outlet {
  uId: number; //
  parentOutletUId: number; //
  outletID: string; //
  name: string; //
  address: string; //
  addressLine1: string; //
  addressLine2: string; //
  motherCompanyAddress: string; //
  motherCompanyAddressLine1: string; //
  motherCompanyAddressLine2: string; //
  contactNo1CountryCode: string; //
  contactNo2CountryCode: string; //
  ownerContactNoCountryCode: string; //
  provinceUId: number; //
  province: Province; //
  districtUId: number; //
  district: District; //
  cityUId: number; //
  city: City; //
  createdBy: string;
  creationDate: string;
  isArchive: boolean;
  ownerName: string; //
  ownerNIC: string; //
  ownerContactNo: string; //
  contactNo1: string; //
  contactNo2: string; //
  modifiedBy: string;
  modifiedDate: string;
  outletCategoryUId: number; //
  outletCategory: OutletCategory; //
  outletClassificationUId: number; //
  outletClassification: OutletClassification; //
  brNo: string; //
  vatNo: string; //
  lat: string; //
  long: string; //
  qrCode: string; //
  isExclusive: boolean; //
  exclusiveRemark: string; //
  outletStatusUId: number; //
  outletStatus: OutletStatus; //
  paymentModeUId: number; //
  paymentMode: PaymentMode; //
  isDiscountEligible: boolean; //
  creditLimit: number; //
  creditInvoiceLimit: number; //
  creditDays: number; //
  additionalNotes: string; //
  isAssetAvailable: boolean; //
  totalRecordCount: number;
  active: boolean;
  priceListAssignmentUIds?: number[] | null;
  priceListAssignmentDefaultUId?: number | null;
  priceListTypeDefault?: priceListTypeDefault;
  priceListType?: priceListTypeDefault[] | null;
}
export interface OutletView {
  uId: string; //
  parentOutletUId: number | null;
  mainOutlet: { outletID: string; name: string };
  outletID: string; //
  name: string; //
  address: string; //
  addressLine1: string; //
  addressLine2: string; //
  motherCompanyAddress: string; //
  motherCompanyAddressLine1: string; //
  motherCompanyAddressLine2: string; //
  contactNo1CountryCode: string; //
  contactNo2CountryCode: string; //
  ownerContactNoCountryCode: string; //
  provinceUId: number; //
  province: Province; //
  districtUId: number; //
  district: District; //
  cityUId: number; //
  city: City; //
  createdBy: string;
  creationDate: string;
  isArchive: boolean;
  ownerName: string; //
  ownerNIC: string; //
  ownerContactNo: string; //
  contactNo1: string; //
  contactNo2: string; //
  modifiedBy: string;
  modifiedDate: string;
  outletCategoryUId: number; //
  outletCategory: OutletCategory; //
  outletClassificationUId: number; //
  outletClassification: OutletClassification; //
  brNo: string; //
  vatNo: string; //
  lat: string; //
  long: string; //
  qrCode: string; //
  isExclusive: boolean; //
  exclusiveRemark: string; //
  outletStatusUId: number; //
  outletStatus: OutletStatus; //
  paymentModeUId: number; //
  paymentMode: PaymentMode; //
  isDiscountEligible: boolean; //
  creditLimit: number; //
  creditInvoiceLimit: number; //
  creditDays: number; //
  additionalNotes: string; //
  isAssetAvailable: boolean; //
  totalRecordCount: number;
  active: boolean;
  priceListAssignmentUIds?: number[] | null;
  priceListAssignmentDefaultUId?: number | null;
  priceListTypeDefault?: priceListTypeDefault;
  priceListType?: priceListTypeDefault[] | null;
}
export type OutletSliceState = {
  isLoading: boolean;
  error: any;
  paginationDetails: PaginationInfo | null;
  outlets: Outlet[];
  outlet: Outlet | null;
  newPage: number;
  newRowsPerPage: number;
  message: any;
};
export type FormattedOutlet = {
  id: number;
  outletID: string;
  name: string;
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
