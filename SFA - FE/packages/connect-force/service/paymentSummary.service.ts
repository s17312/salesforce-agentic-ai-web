import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setPaymentSummaryDetails,
  setPaymentSummaryError,
  setPaymentSummaryMessage,
} from "@/redux/slices/payment-summary-slice";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const baseUrl = "invoicePayment";
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getPayemntSummary = async () => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}invoicePayment/paymentSummary`
    );
    dispatch(setPaymentSummaryDetails(get(response, "data.result", [])));
  } catch (error) {
    throw new Error();
  }
};

export const updateChequePayment = async (
  outletUId: number,
  tourScheduleUId: number,
  data: {
    chequeNo: string;
    bankCode: string;
    branchCode: string;
    chequeReturn: boolean;
    banked: boolean;
  }
) => {
  try {
    const response = await axiosInstance.put(
      `${process.env.NEXT_PUBLIC_API_URL}${baseUrl}/updateChequePayment/outletUId/${outletUId}/tourScheduleUId/${tourScheduleUId}`,
      data
    );

    const resData = response.data;
    dispatch(setPaymentSummaryMessage(resData.message));
    return resData.data;
  } catch (error: any) {
    console.error(
      error?.response?.data?.details?.[0]?.description || error.message
    );
    dispatch(setPaymentSummaryError(serverDownErrorMessage));
    throw new Error(
      error?.response?.data?.details?.[0]?.description || "Update failed"
    );
  }
};
