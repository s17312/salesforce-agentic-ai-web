
import {
  setDS_Adjustment,
  setDS_AdjustmentId,
  setDS_Adjustments,
  setDS_Companies,
  setDS_PriceLists,
  setDS_Products,
  setDS_Warehouses,
  setDS_Distributors,
  resetDS_Adjustment,
} from "@/redux/slices/inventory/distributor-stock-adjustment-slice";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "distributorStockAdjustment";

// GET /getAdjustmentNo
export const getAdjustmentNo = async () => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/getAdjustmentNo`
    );
    const currentAdjustmentNo = get(
      response,
      "data.result.stockAdjustmentNo",
      []
    );
    dispatch(setDS_AdjustmentId(currentAdjustmentNo));
    return currentAdjustmentNo;
  } catch (error) {
    dispatch(setDS_AdjustmentId(null));
    throw new Error();
  }
};

// GET /api/company
export const getAllActiveCompanies = async () => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}company?IsActive=true`
    );
    dispatch(setDS_Companies(get(response, "data.Company", [])));
    return get(response, "data.result", []);
  } catch (error) {
    throw new Error();
  }
};

// GET getDistributorByCompanyUId
export const getDistributorsByCompanyUId = async (companyId: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}companydistributor/distributorDetails/company?CompanyId=${companyId}&IsChecked=true&IsActive=true`
    );
    dispatch(setDS_Distributors(get(response, "data.result.items", [])));
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};

// GET /getPriceList/{distributorId}
export const getPriceListsById = async (distributorId: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/getPriceList/${distributorId}`
    );
    dispatch(setDS_PriceLists(get(response, "data", [])));
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};

// ==============================
// ========== VIEW ALL ==========
// ==============================

// /api/DistributorStockAdjustment
export const getAllDistributorStockAdjustment = async () => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?sortColumn=stockAdjustmentHeaderId&sortOrder=desc`
    );
    dispatch(
      setDS_Adjustments(get(response, "data.DistributorStockAdjustment", []))
    );
    return get(response, "data.DistributorStockAdjustment", []);
  } catch (error) {
    throw new Error();
  }
};

// DELETE /api/distributorStockAdjustment/update/{id}
export const deleteDistributorStockAdjustment = async (id: number) => {
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

// GET /getProduct/4043/warehouse/1014/pricelisttypeId/1
export const getProductByPriceList = async (
  distributorId: number,
  warehouseId: number,
  priceListTypeId: number
) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/getProduct/${distributorId}/warehouse/${warehouseId}/pricelisttype/${priceListTypeId}`
    );

    const products = get(response, "data", []);
    if (products?.responseCode === "400") {
      console.warn("Product fetch failed:", products.description);
      dispatch(setDS_Products([]));
      return [];
    }

    dispatch(setDS_Products(products));
    return products;
  } catch (error) {
    console.error("Unhandled error while fetching products", error);
    throw error;
  }
};

// GET getWarehousesByDistributorUId
export const getWarehousesByDistributorUId = async (DistributorId: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}currentStock/getWarehousesByDistributorUId?DistributorUId=${DistributorId}&IsActive=true`
    );
    dispatch(setDS_Warehouses(get(response, "data.Warehouses", [])));
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};

// POST /api/distributorStockAdjustment/create
export const createDistributorStockAdjustment = async (data: any) => {
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

// POST /api/distributorStockAdjustment/submit
export const submitDistributorStockAdjustment = async (data: any) => {
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

// /api/distributorStockAdjustment
export const getStockAdjustmentById = async (id: number) => {
  try {
    dispatch(resetDS_Adjustment());
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/${id}`
    );
    dispatch(setDS_Adjustment(get(response, "data.result", [])));
    return get(response, "data.result", []);
  } catch (error) {
    throw new Error();
  }
};

// PUT /api/distributorStockAdjustment/update/{id}
export const updateDistributorStockAdjustment = async (
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

// GET getDamageWarehousesByDistributorUId
export const getDamageWarehousesByDistributorUId = async (DistributorId: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}currentStock/getWarehousesByDistributorUId?DistributorUId=${DistributorId}&WarehouseTypeUId=2&IsActive=true`
    );
    dispatch(setDS_Warehouses(get(response, "data.Warehouses", [])));
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};
