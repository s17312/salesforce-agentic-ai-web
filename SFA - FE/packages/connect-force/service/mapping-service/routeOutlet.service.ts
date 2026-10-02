import {
  setRouteOutlets,
  setRouteOutletsIsTrue,
  setRouteOutletsMsg,
} from "@/redux/slices/mappers/route-outlet-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "routeoutlet";

export const getAllOutletsByRouteId = async (uid: number) => {
  try {
    await axiosInstance
      .get<any>(`${NEXT_PUBLIC_API_URL}${baseUrl}/route?RouteUId=${uid}&IsActive=true`)
      .then((response) => {
        const outletData = get(response, "data.result.items", []);
        dispatch(setRouteOutlets(outletData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

export const routeOutletBulkUpdate = async (uid: number, data: any) => {
  try {
    await axiosInstance
      .put(`${NEXT_PUBLIC_API_URL}${baseUrl}/bulkupdate/${uid}`, data)
      .then((response) => {
        const responceMsg = get(response, "data.message", []);
        dispatch(setRouteOutletsMsg(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllOutletsByRouteIdIsTrue = async (uid: number) => {
  try {
    await axiosInstance
      .get<any>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/route?RouteUId=${uid}&IsChecked=true`
      )
      .then((response) => {
        const outletData = get(response, "data.result.items", []);
        dispatch(setRouteOutletsIsTrue(outletData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};
