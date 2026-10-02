import {
  setOutletInvoices,
  setOutletInvoicesDirectPayment,
} from "@/redux/slices/tour/tour-sales-payment";
import { setTempPayments } from "@/redux/slices/tour/tour-value-sales-slice";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

// GET /api/invoicePayment/tempPayments?TourScheduleUId={}&OutletUId={}
export const getTempPayments = async (scheduleID: any, outletID: any) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}invoicePayment/tempPayments?TourScheduleUId=${scheduleID}&OutletUId=${outletID}`
    );
    dispatch(setTempPayments(get(response, "data.result", [])));
  } catch (error) {
    throw new Error();
  }
};

export const getAllInvoicePayments = async ({
  distributorUId,
  representativeUId,
  routeUId,
  outletUId,
  fromDate,
  toDate,
  page,
  pageSize,
  sortColumn,
  searchKeyword,
  sortOrder,
}: {
  distributorUId: number;
  representativeUId?: number;
  routeUId?: number;
  outletUId?: number;
  fromDate?: string;
  toDate?: string;
  page?: any;
  pageSize?: any;
  sortColumn?: any;
  searchKeyword?: any;
  sortOrder?: any;
}) => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}invoicePayment/allpayments`,
      {
        params: {
          DistributorUId: distributorUId,
          RepresentativeUId: representativeUId,
          RouteUId: routeUId,
          OutletUId: outletUId,
          fromDate: fromDate,
          toDate: toDate,
          page,
          pageSize,
          sortColumn,
          searchKeyword,
          sortOrder,
        },
      }
    );
    dispatch(
      setOutletInvoicesDirectPayment(get(response, "data.result.items", []))
    );
  } catch (error) {
    throw new Error("Failed to fetch invoice payments");
  }
};

export const getTempOutletPaymentsAll = async ({
  distributorUId,
  representativeUId,
  routeUId,
  outletUId,
  fromDate,
  toDate,
  page,
  pageSize,
  sortColumn,
  searchKeyword,
  sortOrder,
}: {
  distributorUId: number;
  representativeUId?: number;
  routeUId?: number;
  outletUId?: number;
  fromDate?: string;
  toDate?: string;
  page?: any;
  pageSize?: any;
  sortColumn?: any;
  searchKeyword?: any;
  sortOrder?: any;
}) => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_API_URL}invoicePayment/tempOutletPaymentsAll`,
      {
        params: {
          DistributorUId: distributorUId,
          RepresentativeUId: representativeUId,
          RouteUId: routeUId,
          OutletUId: outletUId,
          fromDate: fromDate,
          toDate: toDate,
          page,
          pageSize,
          sortColumn,
          searchKeyword,
          sortOrder,
        },
      }
    );
    dispatch(setTempPayments(get(response, "data.result.items", [])));
  } catch (error) {
    throw new Error("Failed to fetch invoice payments");
  }
};

// POST /api/invoicePayment/tempCreate
export const createTempInvoicePayment = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}invoicePayment/tempCreate`,
      data
    );
    return response.data.result;
  } catch (error) {
    throw new Error();
  }
};

// PATCH /api/invoicePayment/update/{paymentId}
export const deleteTempPayment = async (paymentId: any) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}invoicePayment/update/${paymentId}`
    );
    return response.data.result;
  } catch (error) {
    throw new Error();
  }
};
