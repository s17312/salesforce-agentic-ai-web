import {
  setDistributorWarehouseProducts,
  setDS_ReturnTransfer,
  setDS_ReturnTransfers,
} from "@/redux/slices/inventory/distributor-stock-return-transfer-slice";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "distributorStockReturn";

export const getAllDistributorStockReturnTransfer = async () => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?sortColumn=stockReturnHeaderId&sortOrder=desc`
    );
    dispatch(
      setDS_ReturnTransfers(get(response, "data.DistributorStockReturn", []))
    );
    return get(response, "data.DistributorStockReturn", []);
  } catch (error) {
    throw new Error();
  }
};

export const deleteDistributorStockReturnTransfer = async (id: number) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${id}`,
      { isDelete: true }
    );
    return get(response, "data.result", []);
  } catch (error) {
    throw new Error();
  }
};

export const getProductByDistributorIDAndWarehouseID = async (
  distributorId: number,
  warehouseId: number
) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}currentStock/getProduct/${distributorId}/warehouse/${warehouseId}`
    );
    dispatch(setDistributorWarehouseProducts(get(response, "data", [])));
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};

export const createDistributorStockReturnTransfer = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    return get(response, "data.result", []);
  } catch (error) {
    throw new Error();
  }
};

export const submitDistributorStockReturnTransfer = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/submit`,
      data
    );
    return get(response, "data.result", []);
  } catch (error) {
    throw new Error();
  }
};

export const getDistributorStockReturnTransferById = async (id: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/${id}`
    );
    dispatch(setDS_ReturnTransfer(get(response, "data.result", [])));
    return get(response, "data.result", []);
  } catch (error) {
    throw new Error();
  }
};

export const updateDistributorStockReturnTransfer = async (
  id: number,
  data: any
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${id}`,
      data
    );
    return get(response, "data.result", []);
  } catch (error) {
    throw new Error();
  }
};
