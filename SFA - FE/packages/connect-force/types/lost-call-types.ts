import { Outlet } from "./outlet-types";
import { PaymentMode } from "./payment-mode";
import { Route } from "./route-types";
import { SalesRepresentative } from "./sales-representative-types";

export type LostCallState = {
  isLoading: boolean;
  error: string | null;
  paginationDetails: Pagination | null;
  lostCallDetails: LostCallData[];
  isActive: true;
  lostCall: LostCallData | null;
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

export type FormValuesPropsLostCall = {
  uId?: number;
  tourScheduleUId: number | null;
  lostCallDate: string | null;
  repUId: number | null;
  routeUId: number | null;
  outletUId: number | null;
  lostCallReasonUId: number | null;
  distributorUId: number | null;
};

export type LostCallData = {
  uId: number;
  outlet: Outlet;
  paymentMode: PaymentMode;
  representative: SalesRepresentative;
  route: Route;
  tourSchedule: TourSchedule;
  invoiceIDOrLostCallID: string;
  manualInvoiceNumber: string;
  tourScheduleUId: number;
  lostCallDate: string;
  repUId: number;
  routeUId: number;
  outletUId: number;
  lostCallReasonUId: number;
  salesAction?: string;
  salesDate: string;
  createdBy: string;
  creationDate: string;
  isArchive: boolean;
  modifiedBy: string;
  modifiedDate: string;
  totalRecordCount: number;
  active: boolean;
};

export type TourSchedule = {
  tourScheduleUId: number;
  tourID: string;
  scheduleDate: string;
  distributorUId: number;
  representativeUId: number;
  routeUIds: string;
  driverName: string;
  porterName: string;
  startMilage: number;
  endMilage: number;
  vehicleUId: number;
  statusUId: number;
  targetValue: number;
  targetVolume: number;
};
