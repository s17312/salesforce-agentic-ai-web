import {
  resetCS_Adjustment,
  setCS_Adjustment,
  setCS_AdjustmentId,
  setCS_Adjustments,
  setCS_Companies,
  setCS_PriceLists,
  setCS_Products,
  setCS_Warehouses,
} from "@/redux/slices/inventory/company-stock-adjustment-slice";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "companyStockAdjustment";

// ==============================
// ========== ADD ==========
// ==============================

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
    dispatch(setCS_AdjustmentId(currentAdjustmentNo));
    return currentAdjustmentNo;
  } catch (error) {
    dispatch(setCS_AdjustmentId(null));
    throw new Error();
  }
};

// GET /api/company
export const getAllActiveCompanies = async () => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}company?IsActive=true`
    );
    dispatch(setCS_Companies(get(response, "data.Company", [])));
    return get(response, "data.result", []);
  } catch (error) {
    throw new Error();
  }
};

// GET /getPriceList/{companyId}
export const getPriceLists = async (companyId: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/getPriceList/${companyId}`
    );
    dispatch(setCS_PriceLists(get(response, "data", [])));
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};

// GET getWarehousesByCompanyUId
export const getWarehousesByCompanyUId = async (companyId: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}currentStock/getWarehousesByCompanyUId?CompanyUId=${companyId}&IsActive=true`
    );
    dispatch(setCS_Warehouses(get(response, "data.Warehouses", [])));
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};

// GET getWarehousesByCompanyUId
export const getWarehousesByDistributorUId = async (
  companyId: number,
  warehouseTypeUId: number
) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}currentStock/getWarehousesByDistributorUId?DistributorUId=${companyId}&WarehouseTypeUId=${warehouseTypeUId}`
    );
    dispatch(setCS_Warehouses(get(response, "data.Warehouses", [])));
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};

// GET /getProduct/4043/warehouse/1014/pricelisttypeId/1
export const getProductByPriceList = async (
  companyId: number,
  warehouseId: number,
  priceListTypeId: number
) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/getProduct/${companyId}/warehouse/${warehouseId}/pricelisttype/${priceListTypeId}`
    );

    const products = get(response, "data", []);

    if (products?.responseCode === "400") {
      console.warn("Product fetch failed:", products.description);
      dispatch(setCS_Products([]));
      return [];
    }

    dispatch(setCS_Products(products));
    return products;
  } catch (error) {
    console.error("Unhandled error while fetching products", error);
    throw error;
  }
};

// POST /api/companyStockAdjustment/create
export const createCompanyStockAdjustment = async (data: any) => {
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

// POST /api/companyStockAdjustment/submit
export const submitCompanyStockAdjustment = async (data: any) => {
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

// ==============================
// ========== VIEW ALL ==========
// ==============================

// /api/companyStockAdjustment
export const getAllCompanyStockAdjustment = async () => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?sortColumn=stockAdjustmentHeaderId&sortOrder=desc`
    );
    dispatch(
      setCS_Adjustments(get(response, "data.CompanyStockAdjustment", []))
    );
    return get(response, "data.CompanyStockAdjustment", []);
  } catch (error) {
    throw new Error();
  }
};

// DELETE /api/companyStockAdjustment/update/{id}
export const deleteCompanyStockAdjustment = async (id: number) => {
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

// getStockAdjustmentById
// /api/companyStockAdjustment
export const getStockAdjustmentById = async (id: number) => {
  try {
    dispatch(resetCS_Adjustment());
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/${id}`
    );
    dispatch(setCS_Adjustment(get(response, "data.result", [])));
    return get(response, "data.result", []);
  } catch (error) {
    throw new Error();
  }
};

// ==============================
// ========== UPDATE ==========
// ==============================

// PUT /api/companyStockAdjustment/update/{id}
export const updateCompanyStockAdjustment = async (id: number, data: any) => {
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
