import { setReturnByInvoiceId, setReturnProducts, setReturnReasons } from "@/redux/slices/direct-sale/tour-sales-return";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

// GET All Return reasons
export const getAllReturnReasons = async () => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}returnreason?IsActive=true`
    );
    dispatch(setReturnReasons(get(response, "data.ReturnReason", [])));
  } catch (error) {
    throw new Error();
  }
};

// GET return products
// saleinvoicereturn?PriceListTypeUId=49&DistributorUId=19184&Active=true
export const getReturnProducts = async (
  priceListTypeID: number,
  distributorId: number
) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}saleinvoicereturn?PriceListTypeUId=${priceListTypeID}&DistributorUId=${distributorId}&Active=true`
    );
    dispatch(setReturnProducts(get(response, "data.SaleInvoiceReturn", [])));
  } catch (error) {
    throw new Error();
  }
};

// /api/saleinvoicereturn/INV144
export const getReturnInvoiceDetails = async (invoiceNo: any) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}saleinvoicedirectreturn/${invoiceNo}`
    );
    dispatch(setReturnByInvoiceId(get(response, "data.result", {})));
    return get(response, "data.SaleInvoiceReturn", {});
  } catch (error) {
    throw new Error();
  }
};

// /api/saleinvoicereturn/
export const getReturnInvoiceDetailsByReturnId = async (returnId: any) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}saleinvoicedirectreturn/getByReturnId/${returnId}`
    );
    dispatch(setReturnByInvoiceId(get(response, "data.result", {})));
    return get(response, "data.result", {});
  } catch (error) {
    throw new Error();
  }
};

// saleinvoicereturn/create
export const createReturnInvoice = async (payload: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}saleinvoicedirectreturn/create`,
      payload
    );
    return response.data.message;
  } catch (error) {
    throw new Error();
  }
};

// /api/saleinvoicereturn/update/45
export const updateReturnInvoice = async (invoiceId: any, payload: any) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}saleinvoicedirectreturn/update/${invoiceId}`,
      payload
    );
    return response.data.message;
  } catch (error) {
    throw new Error();
  }
};