import {
  setAssignedRoute,
  setRepresentativeRoutes,
  setRepresentativeRoutesIsTrue,
  setRepresentativeRoutesMsg,
} from "@/redux/slices/mappers/representative-route";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import { RoutesByRepresentativeIdPagedResults } from "@/types/mapping-types/representative-route-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "representativeroute";

// Representative -> Route assign Mapping
export const assignRepresentativeRouteMapping = async (data: any) => {
  try {
    await axiosInstance
      .post(`${NEXT_PUBLIC_API_URL}${baseUrl}/create`, data)
      .then((response) => {
        const responceMsg = get(response, "data.message", []);
        dispatch(setRepresentativeRoutesMsg(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

// Representative -> Route unassign Mapping
export const unassignRepresentativeRouteMapping = async (data: any) => {
  try {
    await axiosInstance
      .put(`${NEXT_PUBLIC_API_URL}${baseUrl}/update`, data)
      .then((responce) => {
        const responceMsg = get(responce, "data.message", []);
        dispatch(setRepresentativeRoutesMsg(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

// Get All Route By Representative Id
export const getAllRouteByRepresentativeId = async (uid: number) => {
  try {
    await axiosInstance
      .get<RoutesByRepresentativeIdPagedResults>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?RepresentativeUId=${uid}&IsChecked=true`
      )
      .then((response) => {
        const routesData = get(response, "data.Route", []);
        dispatch(setAssignedRoute(routesData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(
      error.response?.data?.details?.[0]?.description || "An error occurred"
    );
  }
};

//update bulk route by representative
export const routeRepresentativeBulkUpdate = async (uid: number, data: any) => {
  try {
    await axiosInstance
      .put(`${NEXT_PUBLIC_API_URL}${baseUrl}/bulkupdate/${uid}`, data)
      .then((response) => {
        const responceMsg = get(response, "data.message", []);
        dispatch(setRepresentativeRoutesMsg(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

//get all mapped rep by route id
export const getAllRepresentativesByRouteIdTrue = async (uid: number) => {
  try {
    await axiosInstance
      .get<any>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/getallrepresentativebyroute?RouteUId=${uid}&IsChecked=true`
      )
      .then((response) => {
        const representativeData = get(response, "data.Representative", []);
        dispatch(setRepresentativeRoutesIsTrue(representativeData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

//get all rep by route id
export const getAllRepresentativesByRouteId = async (uid: number) => {
  try {
    await axiosInstance
      .get<any>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/getallrepresentativebyroute?RouteUId=${uid}&IsActive=true`
      )
      .then((response) => {
        const representativeData = get(response, "data.Representative", []);
        dispatch(setRepresentativeRoutes(representativeData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};
