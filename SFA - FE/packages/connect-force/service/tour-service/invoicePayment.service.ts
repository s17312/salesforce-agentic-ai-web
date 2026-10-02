import {
  setBanks,
  setBranchesByBankID,
  setOutletInvoices,
  setOutStanding,
  setSelectedOutletInvoices,
} from "@/redux/slices/tour/tour-sales-payment";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

// GET /api/invoicePayment/outlet
export const getInvoicesByOutlet = async (outletID: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}invoicePayment/outlet?OutletID=${outletID}&sortColumn=invoiceDate&sortOrder=desc`
    );
    dispatch(setOutletInvoices(response.data.result.items));
  } catch (error) {
    throw new Error();
  }
};

// GET /api/invoicePayment/outletInvoice
export const getInvoicesByOutletInvoice = async (outletID: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}invoicePayment/outletInvoice?OutletID=${outletID}&sortColumn=invoiceDate&sortOrder=desc`
    );
    dispatch(setOutletInvoices(response.data.result.items));
  } catch (error) {
    throw new Error();
  }
};

// GET /api/invoicePayment/Invoice
export const getInvoicePayments = async (
  invoiceIds: number[],
  saleInvoiceTypeUIds: number[]
) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}invoicePayment/Invoice?invoiceUIds=${invoiceIds.join(
        "&invoiceUIds="
      )}&saleInvoiceTypeUIds=${saleInvoiceTypeUIds.join(
        "&saleInvoiceTypeUIds="
      )}`
    );
    dispatch(setSelectedOutletInvoices(response.data.result.invoiceDetail));
  } catch (error) {
    throw new Error();
  }
};

// GET /api/invoicePayment/getOutletBalance/{outletId}
export const getOutletBalance = async (outletId: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}invoicePayment/getOutletBalance/${outletId}`
    );
    dispatch(setOutStanding(response.data.result));
    return response.data.result;
  } catch (error) {
    throw new Error();
  }
};

// GET /api/bank
export const getBanks = async () => {
  try {
    const response = await axiosInstance.get(`${NEXT_PUBLIC_API_URL}bank`);
    dispatch(setBanks(response.data.Bank));
  } catch (error) {
    throw new Error();
  }
};

// /api/bankbranch/{bankId}
export const getBankBranchesByBankdID = async (bankId: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}bankbranch/${bankId}`
    );
    dispatch(setBranchesByBankID(response.data.result.branchDetails));
  } catch (error) {
    throw new Error();
  }
};

// POST /api/invoicePayment/create
export const createInvoicePayment = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}invoicePayment/create`,
      data
    );
    return response.data.result;
  } catch (error) {
    throw new Error();
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