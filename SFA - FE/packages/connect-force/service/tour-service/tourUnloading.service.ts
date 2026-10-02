import {
  setDamageWarehousesList,
  setPrimaryWarehousesList,
  setTourUnloadingDetails,
  setUnloadUnloadingReason,
  setWarehouseList,
} from "@/redux/slices/tour/tour-sales-unloading";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

// GET /api/unloadingGetByScheduleId/{scheduleId}
export const getTourUnloadingByScheduleId = async (scheduleId: string) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}unloadingGetByScheduleId/${scheduleId}`
    );
    dispatch(setTourUnloadingDetails(get(response, "data.result", [])));
  } catch (error) {
    throw new Error();
  }
};

// GET /api/getWarehousesByDistributorUId/{DistributorUId}
export const getUnloadingWarehousesByDistributorUId = async (
  DistributorId: number
) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}currentStock/getWarehousesByDistributorUId?DistributorUId=${DistributorId}`
    );
    dispatch(setWarehouseList(get(response, "data.Warehouses", [])));
  } catch (error) {
    throw new Error();
  }
};

// GET /api/unloadingReason
export const getUnloadingReasons = async () => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}unloadingReason?IsActive=true`
    );
    dispatch(
      setUnloadUnloadingReason(get(response, "data.UnloadingReason", []))
    );
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};

// CREATE /api/unloading/create
export const createTourUnloading = async (payload: any) => {
  try {
    await axiosInstance.post(`${NEXT_PUBLIC_API_URL}unloading/create`, payload);
  } catch (error) {
    throw new Error();
  }
};

// GET /api/unloadingGetWarehouseByDistributor/{distributorUId}/WarehouseTypeUId/{warehouseTypeUId}
export const getPrimaryWarehouseByDistributor = async (
  distributorUId: number
) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}unloadingGetWarehouseByDistributor/${distributorUId}/WarehouseTypeUId/1`
    );
    dispatch(setPrimaryWarehousesList(get(response, "data.result", [])));
  } catch (error) {
    throw new Error();
  }
};

// GET /api/unloadingGetWarehouseByDistributor/{distributorUId}/WarehouseTypeUId/{warehouseTypeUId}
export const getDamageWarehouseByDistributor = async (
  distributorUId: number
) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}unloadingGetWarehouseByDistributor/${distributorUId}/WarehouseTypeUId/2`
    );
    dispatch(setDamageWarehousesList(get(response, "data.result", [])));
  } catch (error) {
    throw new Error();
  }
};

// POST /api/unloading/create
export const createUnloading = async (payload: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}unloading/create`,
      payload
    );
    return response.data.result;
  } catch (error) {
    throw new Error();
  }
};

// POST /api/unloading/submit
export const submitUnloading = async (payload: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}unloading/submit`,
      payload
    );
    return response.data.result;
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};
