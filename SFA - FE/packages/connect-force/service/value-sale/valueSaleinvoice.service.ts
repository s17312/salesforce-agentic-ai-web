import { setDistributorUId } from "@/redux/slices/tour/tour-sales-slice";
import { setTourValueSales } from "@/redux/slices/tour/tour-value-sales-slice";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

//PUT /api/saleInvoiceView/updateSaleInvoiceView/45
export const updateValueSaleInvoiceView = async (id: any, data: any) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}saleInvoiceView/updateSaleInvoiceView/${id}`,
      data
    );

    return response.data.result.message;
  } catch (error) {
    throw new Error();
  }
};

//PATCH /api/tourschedule/update/tourInvoiceStatus/{id}
export const updateValueTourScheduleStatus = async (scheduleID: number,statusUId: number) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}tourschedule/update/tourInvoiceStatus/${scheduleID}`,
      { statusUId: statusUId }
    );
  } catch (error) {
    throw new Error();
  }
};

// GET All SalesInvoiceView
export const getAllValueTourLoadings = async (scheduleID: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}saleInvoiceView?TourScheduleUId=${scheduleID}`
    );
    dispatch(setTourValueSales(get(response, "data.SaleInvoiceView", [])));
    dispatch(setDistributorUId(get(response, "data.SaleInvoiceView[0].tourSchedule.distributorUId", null)));
  } catch (error) {
    throw new Error();
  }
};

// /api/saleInvoiceView/addSameSaleInvoiceView/{saleInvoiceViewUId }
export const addSameValueSaleInvoiceView = async (
  saleInvoiceViewUId: number
) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}saleInvoiceView/addSameSaleInvoiceView/${saleInvoiceViewUId}`
    );

    return response.data.message;
  } catch (error) {
    throw new Error();
  }
};

// POST api/salesview/createsaleInvoiceview
export const createValueSaleInvoiceView = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}saleInvoiceView/createSaleInvoiceView`,
      data
    );

    return response.data.message;
  } catch (error) {
    throw new Error();
  }
};

// api/saleInvoiceView/submitSaleInvoiceView?TourScheduleUId={scheduleID}
export const submitValueSaleInvoiceView = async (scheduleID: number) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}saleInvoiceView/submitSaleInvoiceView?TourScheduleUId=${scheduleID}`
    );

    return response.data.message;
  } catch (error) {
    throw new Error();
  }
};

// /api/saleInvoiceView/deleteSaleInvoiceView?TourScheduleUId=123&OutletUId=123&InvoiceUId=123&SaleInvoiceTypeUId=123
export const deleteValueSaleInvoiceView = async (
  scheduleID: number,
  outletID: number,
  invoiceID: number,
  saleInvoiceTypeUId: number
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}saleInvoiceView/deleteSaleInvoiceView?TourScheduleUId=${scheduleID}&OutletUId=${outletID}&InvoiceUId=${invoiceID}&SaleInvoiceTypeUId=${saleInvoiceTypeUId}`
    );

    return response.data.message;
  } catch (error) {
    throw new Error();
  }
};
