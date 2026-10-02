import {
  setTourLoadingById,
  setTourLoadingProducts,
  setTourLoadings,
  setTourLoadingWarehouses,
} from "@/redux/slices/tour/tour-schedule-slice";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

// GET All Tour Loadings by scheduleID
export const getAllTourLoadings = async (scheduleID: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}loadingGetByScheduleId/${scheduleID}`
    );

    dispatch(setTourLoadings(get(response, "data.result", [])));
  } catch (error) {
    throw new Error();
  }
};

// GET /api/currentStock/getWarehousesByDistributorUId?DistributorUId={}
export const getTourLoadingWarehouses = async (distributorID: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}currentStock/getWarehousesByDistributorUId?DistributorUId=${distributorID}`
    );
    dispatch(setTourLoadingWarehouses(get(response, "data.Warehouses", [])));
  } catch (error) {
    throw new Error();
  }
};

// GET /api/loadingproducts
export const getTourLoadingProducts = async (
  distributorID: number,
  warehouseId: number
) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}loadingproducts?StockRefId=${distributorID}&WarehouseId=${warehouseId}&WareHouseTypeUId=1`
    );
    dispatch(setTourLoadingProducts(get(response, "data.Loading", [])));
  } catch (error) {
    throw new Error();
  }
};

// GET /api/loading/id
export const getTourLoadingById = async (loadingID: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}loading/${loadingID}`
    );
    dispatch(setTourLoadingById(get(response, "data.result", [])));
  } catch (error) {
    throw new Error();
  }
};

// POST /api/loading/create
export const createTourLoading = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}loading/create`,
      data
    );
    return response.data.message;
  } catch (error) {
    throw new Error();
  }
};

// PUT /api/loadingupdate/{id}
export const updateTourLoading = async (loadingID: number, data: any) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}loadingupdate/${loadingID}`,
      data
    );

    return response.data.result.message;
  } catch (error) {
    throw new Error();
  }
};

// /api/loadingupdate/{id}
export const deleteTourLoading = async (loadingID: number) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}loadingupdate/${loadingID}`,
      { status: 2 }
    );
    return response.data.message;
  } catch (error) {
    throw new Error();
  }
};

//PATCH /api/tourschedule/update/tourstatus/{id}
export const updateTourScheduleStatus = async (scheduleID: number) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}tourschedule/update/tourstatus/${scheduleID}`,
      { statusUId: 3 }
    );
  } catch (error) {
    throw new Error();
  }
};
