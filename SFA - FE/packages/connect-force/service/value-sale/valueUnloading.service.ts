import { setReturnProducts } from "@/redux/slices/tour/tour-sales-return";
import {
  setPriceListsByDistributorId,
  setUnloadingProducts,
  setValueUnloadingDetails,
  setValueUnloadingHeader,
} from "@/redux/slices/tour/tour-value-sales-slice";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

// GET /api/valueUnloadingGetByScheduleId/{ScheduleId}
export const getValueUnloadingByScheduleId = async (scheduleId: string) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}valueUnloadingGetByScheduleId/${scheduleId}`
    );
    dispatch(
      setValueUnloadingHeader(get(response, "data.result.unloadingHeader", []))
    );
    dispatch(
      setValueUnloadingDetails(get(response, "data.result.unloadingDetail", []))
    );
  } catch (error) {
    throw new Error();
  }
};

// POST /api/valueUnloading/submit
export const submitValueUnloading = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}valueUnloading/submit`,
      data
    );

    return response;
  } catch (error) {
    throw new Error();
  }
};

// GET /getPriceList/{distributorId}
export const getPriceListsByDistributorIdValueInvoice = async (
  distributorId: number
) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}distributorStockAdjustment/getPriceList/${distributorId}`
    );
    dispatch(setPriceListsByDistributorId(get(response, "data", [])));
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};

// GET return products
// saleinvoicereturn?PriceListTypeUId=49&DistributorUId=19184&Active=true
export const getReturnProductsValueUnloading = async (
  priceListTypeID: number,
  distributorId: number
) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}saleinvoicereturn?PriceListTypeUId=${priceListTypeID}&DistributorUId=${distributorId}&Active=true`
    );
    dispatch(setUnloadingProducts(get(response, "data.SaleInvoiceReturn", [])));
  } catch (error) {
    throw new Error();
  }
};
