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
  pageOrParams?:
    | number
    | {
        page?: number;
        pageSize?: number;
        searchKeyword?: string;
        sortColumn?: string;
        sortOrder?: string;
        isActive?: boolean | string;
      },
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  try {
    const params = new URLSearchParams();
    let pageNum = 1;
    let sizeNum = 100;
    let searchVal = "";
    let sortCol = "";
    let sortOrd = "";

    if (typeof pageOrParams === "object" && pageOrParams !== null) {
      pageNum = pageOrParams.page ?? 1;
      sizeNum = pageOrParams.pageSize ?? 10;
      searchVal = pageOrParams.searchKeyword || "";
      sortCol = pageOrParams.sortColumn || "";
      sortOrd = pageOrParams.sortOrder || "";
      if (pageOrParams.isActive !== undefined && pageOrParams.isActive !== "") {
        params.append("IsActive", String(pageOrParams.isActive));
      }
    } else {
      if (pageOrParams) pageNum = pageOrParams;
      if (pageSize) sizeNum = pageSize;
      if (search) searchVal = search;
      if (sortBy) sortCol = sortBy;
      if (sortOrder) sortOrd = sortOrder;
    }

    if (pageNum) params.append("page", pageNum.toString());
    if (sizeNum) params.append("pageSize", sizeNum.toString());
    if (searchVal) params.append("searchKeyword", searchVal);
    if (sortCol) params.append("sortColumn", sortCol);
    if (sortOrd) params.append("sortOrder", sortOrd);

    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
    );
    const warehouseData = get(response, "data.Warehouse", get(response, "data.result", []));
    const paginationInfo = get(response, "data.pagingView", get(response, "data.paging", {}));
    dispatch(setAllWarehouses(warehouseData));
    dispatch(setPaginationDetails(paginationInfo));
    return {
      data: warehouseData,
      total: paginationInfo?.total ?? 0,
      paging: paginationInfo,
    };
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
