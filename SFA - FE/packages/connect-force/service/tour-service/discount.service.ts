import {
  setAppliedSalesDiscount,
  setInvoiceDiscountList,
} from "@/redux/slices/tour/tour-sales-discount-slice";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

// /api/salesdiscount/salesdiscount/{SaleInvoiceHeaderId}
export const getSalesDiscountByInvoiceId = async (id: any) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}salesdiscount/salesdiscount/${id}`
    );
    dispatch(
      setInvoiceDiscountList(
        get(response, "data.result.salesDiscountViewDetailsDTOs", [])
      )
    );
  } catch (error) {
    throw new Error();
  }
};

// GET  appliedsalesdiscount /api/salesdiscount/appliedsalesdiscount/{SaleInvoiceHeaderId}
export const getAppliedSalesDiscountByInvoiceId = async (id: any) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}salesdiscount/appliedsalesdiscount/${id}`
    );
    dispatch(setAppliedSalesDiscount(get(response, "data.result", [])));
  } catch (error) {
    throw new Error();
  }
};

// /api/salesdiscount/savesalesdiscount
export const saveSalesDiscount = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}salesdiscount/savesalesdiscount`,
      data
    );
    return response.data.message;
  } catch (error) {
    throw new Error();
  }
};

// /api/salesdiscount/savesalesdiscount
export const saveDirectSalesDiscount = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}salesdiscount/savedirectsalesdiscount`,
      data
    );
    return response.data.message;
  } catch (error) {
    throw new Error();
  }
};
