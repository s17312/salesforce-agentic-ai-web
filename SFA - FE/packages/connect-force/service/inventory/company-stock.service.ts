import {
  setCompanyOptionsStockView,
  setCSV_PriceLists,
  setProductCategoriesStockView,
  setProductGroupsStockView,
  setProductsStockView,
  setWarehouseOptionsStockView,
} from "@/redux/slices/inventory/company-stock-slice";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "currentStock";

interface GetProductParams {
  companyId: number;
  warehouseUIds?: number[];
  productCategoryUIds?: number[];
  productGroupUIds?: number[];
}

interface GetProductCatGroupParams {
  companyId: number;
  warehouseUIds?: number[];
}

export const getAllCurrentStockDetailByCompanyId = async ({
  stockRoleTypeUId = 1,
  stockRefIds = [],
  priceListTypeIds = [],
  productIds = [],
  wareHouseIds = [],
  productGroupIds = [],
  productCategoryIds = [],
  offset = 1,
  count = 999999,
}: {
  stockRoleTypeUId?: number;
  stockRefIds?: number[];
  priceListTypeIds?: number[];
  productIds?: number[];
  wareHouseIds?: number[];
  productGroupIds?: number[];
  productCategoryIds?: number[];
  offset?: number;
  count?: number;
}) => {
  try {
    stockRefIds = stockRefIds.flat();
    priceListTypeIds = priceListTypeIds.flat();
    productIds = productIds.flat();
    wareHouseIds = wareHouseIds.flat();
    productGroupIds = productGroupIds.flat();
    productCategoryIds = productCategoryIds.flat();

    const queryParams = new URLSearchParams({
      stockRoleTypeUId: stockRoleTypeUId.toString(),
      Offset: offset.toString(),
      Count: count.toString(),
    });

    const url = `${NEXT_PUBLIC_API_URL}${baseUrl}/company?${queryParams}`
      + `${stockRefIds.length ? `&stockRefIds=${stockRefIds.join("&stockRefIds=")}` : ""}`
      + `${priceListTypeIds.length ? `&priceListTypeIds=${priceListTypeIds.join("&priceListTypeIds=")}` : ""}`
      + `${productIds.length ? `&productIds=${productIds.join("&productIds=")}` : ""}`
      + `${wareHouseIds.length ? `&wareHouseIds=${wareHouseIds.join("&wareHouseIds=")}` : ""}`
      + `${productGroupIds.length ? `&productGroupIds=${productGroupIds.join("&productGroupIds=")}` : ""}`
      + `${productCategoryIds.length ? `&productCategoryIds=${productCategoryIds.join("&productCategoryIds=")}` : ""}`;

    const response = await axiosInstance.get(url);

    const currentStock = get(response, "data.CompanyCurrentStock", []);
    dispatch(setCompanyOptionsStockView(currentStock));
  } catch (error) {
    dispatch(setCompanyOptionsStockView([]));
    throw new Error();
  }
};

export const getWarehousesByCompanyUId = async (id: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/getWarehousesByCompanyUId?CompanyUId=${id}`
    );
    const currentWarehouses = get(response, "data.Warehouses", []);
    dispatch(setWarehouseOptionsStockView(currentWarehouses));
    // return currentWarehouses;
  } catch (error) {
    dispatch(setWarehouseOptionsStockView([]));
    throw new Error();
  }
};

export const getProductCategoriesByCompanyUId = async (id: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/getProductCategoriesByCompanyUId?CompanyUId=${id}`
    );
    const currentProductCategories = get(
      response,
      "data.ProductCategories",
      []
    );
    dispatch(setProductCategoriesStockView(currentProductCategories));
    // return get(response, "data.ProductCategories", []);
  } catch (error) {
    throw new Error();
  }
};

export const getProductGroupsByCompanyUId = async (id: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/getProductGroupsByCompanyUId?CompanyUId=${id}`
    );
    const currentProductGroups = get(response, "data.ProductGroups", []);
    dispatch(setProductGroupsStockView(currentProductGroups));
    // return get(response, "data.ProductGroups", []);
  } catch (error) {
    throw new Error();
  }
};

// /api/currentStock/getProductByCompanyWarehouseProductCategoryGroupUId
export const getProductByCompanyWarehouseProductCategoryGroupUId = async ({
  companyId,
  warehouseUIds = [],
  productCategoryUIds = [],
  productGroupUIds = [],
}: {
  companyId: number;
  warehouseUIds?: number[];
  productCategoryUIds?: number[];
  productGroupUIds?: number[];
}) => {
  try {
    warehouseUIds = warehouseUIds.flat();
    productCategoryUIds = productCategoryUIds.flat();
    productGroupUIds = productGroupUIds.flat();

    const url = `${NEXT_PUBLIC_API_URL}${baseUrl}/getProductByCompanyWarehouseProductCategoryGroupUId?CompanyUId=${companyId}`
      + `${warehouseUIds.length ? `&WarehouseUIds=${warehouseUIds.join("&WarehouseUIds=")}` : ""}`
      + `${productCategoryUIds.length ? `&ProductCategoryUIds=${productCategoryUIds.join("&ProductCategoryUIds=")}` : ""}`
      + `${productGroupUIds.length ? `&ProductGroupUIds=${productGroupUIds.join("&ProductGroupUIds=")}` : ""}`;
    const response = await axiosInstance.get(url);

    const currentProducts = get(response, "data.Products", []);
    dispatch(setProductsStockView(currentProducts));
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
};

export const getProductCategoriesByCompanyUIdAndWarehouseUId = async ({
  companyId,
  warehouseUIds = [],
}: GetProductCatGroupParams) => {
  try {
    warehouseUIds = warehouseUIds.flat();

    const url = `${NEXT_PUBLIC_API_URL}${baseUrl}/getProductCategoriesByCompanyUIdAndWarehouseUId?CompanyUId=${companyId}`
      + `${warehouseUIds.length ? `&WarehouseUIds=${warehouseUIds.join("&WarehouseUIds=")}` : ""}`;
    const response = await axiosInstance.get(url);

    const currentProductCategories = get(response, "data.ProductCategories", []);
    dispatch(setProductCategoriesStockView(currentProductCategories));
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
};

export const getProductGroupsByCompanyUIdAndWarehouseUId = async ({
  companyId,
  warehouseUIds = [],
}: GetProductCatGroupParams) => {
  try {
    warehouseUIds = warehouseUIds.flat();

    const url = `${NEXT_PUBLIC_API_URL}${baseUrl}/getProductGroupsByCompanyUIdAndWarehouseUId?CompanyUId=${companyId}`
      + `${warehouseUIds.length ? `&WarehouseUIds=${warehouseUIds.join("&WarehouseUIds=")}` : ""}`;
    const response = await axiosInstance.get(url);

    const currentProductGroups = get(response, "data.ProductGroups", []);
    dispatch(setProductGroupsStockView(currentProductGroups));
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
};

// GET /getPriceList/{companyId}
export const getCompanyPriceLists = async (companyId: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}companyStockAdjustment/getPriceList/${companyId}`
    );
    dispatch(setCSV_PriceLists(get(response, "data", [])));
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};

