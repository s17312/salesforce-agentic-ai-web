import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllPaymentTerms,
  setPaginationDetails,
  setPaymentTerm,
  setPaymentTermError,
} from "@/redux/slices/payment-term-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { PaymentTermPagedResult } from "connect-force-api-client";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "paymentterm";

export const getAllPaymentTerms = async () => {
  try {
    await axiosInstance
      .get<PaymentTermPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?sortColumn=uId&sortOrder=desc`
      )
      .then((response) => {
        const paymenttermData = get(response, "data.PaymentTerm", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllPaymentTerms(paymenttermData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setPaymentTermError(serverDownErrorMessage));
    throw new Error();
  }
};

export const getAllActivePaymentTerms = async () => {
  try {
    await axiosInstance
      .get<PaymentTermPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?IsActive=true`
      )
      .then((response) => {
        const paymenttermData = get(response, "data.PaymentTerm", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllPaymentTerms(paymenttermData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setPaymentTermError(serverDownErrorMessage));
    throw new Error();
  }
};

export const getPaymentTermById = async (uid: number) => {
  try {
    await axiosInstance
      .get<PaymentTermPagedResult>(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const curruntPaymentTermData = get(response, "data.result", []);
        dispatch(setPaymentTerm(curruntPaymentTermData));
      });
  } catch (error: ErrorType | any) {
    dispatch(setPaymentTermError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const createPaymentTerm = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setPaymentTermError(serverDownErrorMessage));
    const newError = error.response.data.details[0].description;
    throw new Error(newError);
  }
};

export const updatePaymentTerm = async (uid: number | undefined, data: any) => {
  try {
    const payload = {
      paymentTerm: {
        ...data,
      },
    };
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      payload
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setPaymentTermError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const updatePaymentTermStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedPaymentTermData = get(response, "data.result", []);
    dispatch(
      setAllPaymentTerms({ data: updatedPaymentTermData, update: true })
    );

    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setPaymentTermError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};
