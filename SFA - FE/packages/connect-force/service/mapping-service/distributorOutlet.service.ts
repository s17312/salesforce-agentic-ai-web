import {
  setDistributorOutletMsg,
  setDistributorOutlets,
  setDistributorOutletsIsTrue,
} from "@/redux/slices/mappers/distributor-outlet-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import { OutletsByDistributorIdPagedResults } from "@/types/mapping-types/distributor-outlet-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "distributoroutlet";

// Distributor -> Outlet Mapping

export const getAllOutletByDistributorId = async (uid: number) => {
  try {
    await axiosInstance
      .get<OutletsByDistributorIdPagedResults>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/outlet/${uid}`
      )
      .then((response) => {
        const outletData = get(response, "data.result", []);
        dispatch(setDistributorOutlets(outletData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllOutletByDistributorIdIsChecked = async (uid: number) => {
  try {
    await axiosInstance
      .get<OutletsByDistributorIdPagedResults>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/distributor/${uid}`
      )
      .then((response) => {
        const outletData = get(response, "data.result", []);
        dispatch(setDistributorOutletsIsTrue(outletData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

export const distributorOutletBulkUpdate = async (uid: number, data: any) => {
  try {
    await axiosInstance
      .put(`${NEXT_PUBLIC_API_URL}${baseUrl}/bulkupdate/${uid}`, data)
      .then((response) => {
        const responceMsg = get(response, "data.message", []);
        dispatch(setDistributorOutletMsg(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};
