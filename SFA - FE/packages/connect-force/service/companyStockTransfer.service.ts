import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setCompany_Warehouse_ST_Products,
  setCompanyStockFromWarehouses,
  setCompanyStockReceivingWarehouses,
  setCompanyWST_Details,
  setCompanyWSTDetail,
  setWarehouseStockTransferError,
  setWarehouseStockTransferMessage,
} from "@/redux/slices/warehouse-stock-transfer-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "companyWarehouseStockTransfer";

export const getAllCompanyWarehouseStockTransfer = async () => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?sortColumn=stockTransferId&sortOrder=desc`
    );
    dispatch(
      setCompanyWST_Details(
        get(response, "data.CompanyWarehouseStockTransfer", [])
      )
    );
    return get(response, "data.CompanyWarehouseStockTransfer", []);
  } catch (error) {
    throw new Error();
  }
};

export const createCompanyWarehouseStockTransfer = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    dispatch(
      setWarehouseStockTransferMessage(get(response, "data", []).message)
    );
    return get(response, "data", []);
  } catch (error: ErrorType | any) {
    dispatch(
      setWarehouseStockTransferError(
        error.response.data?.description[0]?.message || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].message);
  }
};

export const getCompanyWarehouseStockTransferById = async (id: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/${id}`
    );
    dispatch(setCompanyWSTDetail(get(response, "data.result", [])));
    return get(response, "data.result", []);
  } catch (error) {
    throw new Error();
  }
};

export const updateCompanyWarehouseStockTransfer = async (
  uId: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}update/${uId}`,
      data
    );
    dispatch(
      setWarehouseStockTransferMessage(get(response, "data", []).message)
    );
    return get(response, "data", []);
  } catch (error: ErrorType | any) {
    dispatch(
      setWarehouseStockTransferError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getWarehousesByCompanyUId = async (CompanyId: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}currentStock/getWarehousesByCompanyUId?CompanyUId=${CompanyId}&IsActive=true`
    );
    dispatch(
      setCompanyStockFromWarehouses(get(response, "data.Warehouses", []))
    );
    dispatch(
      setCompanyStockReceivingWarehouses(get(response, "data.Warehouses", []))
    );
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};

export const getProductByCompanyANDWarehouseUId = async (
  companyId: number,
  warehouseId: number
) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}currentStock/getCompanyProduct/${companyId}/warehouse/${warehouseId}`
    );
    dispatch(setCompany_Warehouse_ST_Products(get(response, "data", [])));
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};
