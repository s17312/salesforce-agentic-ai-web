import { setDistributorProductMsg } from "@/redux/slices/mappers/distributor-product-slice";
import {
  setDistributorRouteMsg,
  setDistributorRoutes,
  setDistributorRoutesIsTrue,
} from "@/redux/slices/mappers/distributor-route-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import { RoutesByDistributorIdPagedResults } from "@/types/mapping-types/distributor-route-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "distributorroute";

export const getAllRoutesByDistributorId = async (uid: number) => {
  try {
    await axiosInstance
      .get<RoutesByDistributorIdPagedResults>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/route/${uid}`
      )
      .then((response) => {
        const routeData = get(response, "data.result", []);
        dispatch(setDistributorRoutes(routeData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllRoutesByDistributorIdIsChecked = async (uid: number) => {
  try {
    await axiosInstance
      .get<RoutesByDistributorIdPagedResults>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/distributor/${uid}`
      )
      .then((response) => {
        const routeData = get(response, "data.result", []);
        dispatch(setDistributorRoutesIsTrue(routeData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

export const distributorRouteBulkUpdate = async (uid: number, data: any) => {
  try {
    await axiosInstance
      .put(`${NEXT_PUBLIC_API_URL}${baseUrl}/bulkupdate/${uid}`, data)
      .then((response) => {
        const responseMsg = get(response, "data.message", []);
        dispatch(setDistributorRouteMsg(responseMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};
