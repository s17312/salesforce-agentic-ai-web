import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllRoutes,
  setPaginationDetails,
  setRoute,
  setRouteError,
  setRouteMessage,
} from "@/redux/slices/route-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { RoutePagedResult } from "connect-force-api-client";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "route";

export const getAllRoutes = async () => {
  try {
    await axiosInstance
      .get<RoutePagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?sortColumn=uId&sortOrder=desc`
      )
      .then((response) => {
        const routeData = get(response, "data.Route", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllRoutes(routeData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setRouteError(serverDownErrorMessage));
    throw new Error();
  }
};

export const getAllActiveRoutes = async () => {
  try {
    await axiosInstance
      .get<RoutePagedResult>(`${NEXT_PUBLIC_API_URL}${baseUrl}?IsActive=true`)
      .then((response) => {
        const routeData = get(response, "data.Route", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllRoutes(routeData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setRouteError(serverDownErrorMessage));
    throw new Error();
  }
};

export const getRouteById = async (uid: number) => {
  try {
    await axiosInstance
      .get<RoutePagedResult>(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const curruntRouteData = get(response, "data.result", []);
        dispatch(setRoute(curruntRouteData));
      });
  } catch (error: ErrorType | any) {
    const newError = error.response.data.details[0].description;
    dispatch(setRouteError(newError));
    throw new Error(newError);
  }
};

export const createRoute = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setRouteMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    const newError = error.response.data.details[0].description;
    dispatch(setRouteError(newError));
    throw new Error(newError);
  }
};

export const updateRoute = async (uid: number | undefined, data: any) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setRouteMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    const newError = error.response.data.details[0].description;
    dispatch(setRouteError(newError));
    throw new Error(newError);
  }
};

export const updateRouteStatus = async (uid: number | undefined, data: any) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedBusinessData = get(response, "data.result", []);
    dispatch(setAllRoutes({ data: updatedBusinessData, update: true }));

    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setRouteError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

// Route Mapping
export const getAllRoutesForMapping = async () => {
  try {
    await axiosInstance
      .get<RoutePagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/mapping`
      )
      .then((response) => {
        const routeData = get(response, "data.result.routeMappingList", []);
        dispatch(setAllRoutes(routeData));
      });
  } catch (error) {
    dispatch(setRouteError(serverDownErrorMessage));
    throw new Error();
  }
};