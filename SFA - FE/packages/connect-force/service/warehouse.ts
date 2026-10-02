import { serverDownErrorMessage } from "@/data/common-errors";
import { setWarehouseOptionsStockView } from "@/redux/slices/inventory/distributor-stock-slice";
import {
  setAllWarehouses,
  setPaginationDetails,
  setWarehouse,
  setWarehouseAssignments,
  setWarehouseError,
} from "@/redux/slices/warehouse-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "warehouse";

export const getAllWarehouse = async (
  page?: number,
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  try {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (pageSize) params.append("pageSize", pageSize.toString());
    if (search) params.append("search", search);
    if (sortBy) params.append("sortColumn", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);

    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
    );
    const warehouseData = get(response, "data.Warehouse", []);
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllWarehouses(warehouseData));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error) {
    dispatch(setWarehouseError(serverDownErrorMessage));
    throw new Error();
  }
};

export const updateWarehouseStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedWarehouseData = get(response, "data.result", []);
    dispatch(
      setAllWarehouses({
        data: updatedWarehouseData,
        update: true,
      })
    );
    const resData = response.data;
    return resData;
  } catch (error: ErrorType | any) {
    dispatch(setWarehouseError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const createWarehouse = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setWarehouseError(serverDownErrorMessage));
    const newError = error.response.data.details[0].description;
    throw new Error(newError);
  }
};

export const updateWarehouse = async (uid: number | undefined, data: any) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setWarehouseError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const getWarehouseById = async (uid: number) => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const currentWarehouseData = get(response, "data.result", []);
        dispatch(setWarehouse(currentWarehouseData));
      });
  } catch (error: ErrorType | any) {
    dispatch(setWarehouseError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllAssignmentsByWarehouseCategory = async (uid: number) => {
  try {
    await axiosInstance
      .get(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/getAllByWarehouseCategory?WhearhouseCategoryUId=${uid}&IsActive=true`
      )
      .then((response) => {
        const currentAssignments = get(
          response,
          "data.WarehouseAssingment",
          []
        );
        dispatch(setWarehouseAssignments(currentAssignments));
      });
  } catch (error: ErrorType | any) {
    dispatch(setWarehouseError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const getWarehousesByDistributorUIdAndWarehouseCatId = async (distributorId: number, warehouseCategoryId: number) => {
  try {
    dispatch(setWarehouseOptionsStockView([]));
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}warehouse/getWarehousesByDistributorUIdAndWarehouseCatId?DistributorUId=${distributorId}&WarehouseCategoryUId=${warehouseCategoryId}`
    );
    const currentWarehouses = get(response, "data.Warehouses", []);
    dispatch(setWarehouseOptionsStockView(currentWarehouses));
    return currentWarehouses;
  } catch (error) {
    dispatch(setWarehouseOptionsStockView([]));
    throw new Error();
  }
};
