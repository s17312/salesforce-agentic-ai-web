import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setDistributorOptionsStockView,
  setProductCategoriesStockView,
  setProductGroupsStockView,
  setProductsStockView,
  setWarehouseOptionsStockView,
  setDistributorView,
  setDSV_PriceLists,
  setWarehouseCategories,
} from "@/redux/slices/inventory/distributor-stock-slice";
import { setPaginationDetails, setWarehouseCategoryError, startLoading } from "@/redux/slices/warehouse-category-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "currentStock";

interface GetProductParams {
  distributorId: number;
  warehouseUIds?: number[];
  productCategoryUIds?: number[];
  productGroupUIds?: number[];
};

interface GetProductCatGroupParams {
  distributorId: number;
  warehouseUIds?: number[];
}

export const getAllCurrentStockDetailByDistributorId = async ({
  stockRefIds = [],
  priceListTypeIds = [],
  wareHouseIds = [],
  productIds = [],
  productGroupIds = [],
  productCategoryIds = [],
  offset = 1,
  count = 999999
}: {
  stockRefIds?: number[];
  priceListTypeIds?: number[];
  wareHouseIds?: number[];
  productIds?: number[];
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
      Offset: offset.toString(),
      Count: count.toString(),
    });

    const url = `${NEXT_PUBLIC_API_URL}${baseUrl}/distributor?${queryParams}`
      + `&stockRoleTypeUId=2&stockRoleTypeUId=3`
      + `${stockRefIds.length ? `&stockRefIds=${stockRefIds.join("&stockRefIds=")}` : ""}`
      + `${priceListTypeIds.length ? `&priceListTypeIds=${priceListTypeIds.join("&priceListTypeIds=")}` : ""}`
      + `${productIds.length ? `&productIds=${productIds.join("&productIds=")}` : ""}`
      + `${wareHouseIds.length ? `&wareHouseIds=${wareHouseIds.join("&wareHouseIds=")}` : ""}`
      + `${productGroupIds.length ? `&productGroupIds=${productGroupIds.join("&productGroupIds=")}` : ""}`
      + `${productCategoryIds.length ? `&productCategoryIds=${productCategoryIds.join("&productCategoryIds=")}` : ""}`;

    const response = await axiosInstance.get(url);

    const currentStock = get(response, "data.DistributorCurrentStock", []);
    dispatch(setDistributorOptionsStockView(currentStock));
    return currentStock;
  } catch (error) {
    dispatch(setDistributorOptionsStockView([]));
    throw new Error();
  }
};

export const getDistributorsByCompanyUId = async (id: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}companydistributor/distributorDetails/company?CompanyId=${id}&IsChecked=true&IsActive=true`
    );
    const currentDistributors = get(response, "data.result.items", []);
    dispatch(setDistributorView(currentDistributors));
    return currentDistributors;
  } catch (error) {
    dispatch(setDistributorView([]));
    throw new Error();
  }
};

export const getWarehousesByDistributorUId = async (id: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/getWarehousesByDistributorUId?DistributorUId=${id}`
    );
    const currentWarehouses = get(response, "data.Warehouses", []);
    dispatch(setWarehouseOptionsStockView(currentWarehouses));
    return currentWarehouses;
  } catch (error) {
    dispatch(setWarehouseOptionsStockView([]));
    throw new Error();
  }
};

export const getProductCategoriesByDistributorUId = async (id: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/getProductCategoriesByDistributorUId?DistributorUId=${id}`
    );
    const currentProductCategories = get(
      response,
      "data.ProductCategories",
      []
    );
    dispatch(setProductCategoriesStockView(currentProductCategories));
    return get(response, "data.ProductCategories", []);
  } catch (error) {
    throw new Error();
  }
};

export const getProductGroupsByDistributorUId = async (id: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/getProductGroupsByDistributorUId?DistributorUId=${id}`
    );
    const currentProductGroups = get(response, "data.ProductGroups", []);
    dispatch(setProductGroupsStockView(currentProductGroups));
    return get(response, "data.ProductGroups", []);
  } catch (error) {
    throw new Error();
  }
};

export const getProductByDistributorWarehouseProductCategoryGroupUId = async ({
  distributorId,
  warehouseUIds = [],
  productCategoryUIds = [],
  productGroupUIds = []
}: GetProductParams) => {
  try {
    warehouseUIds = warehouseUIds.flat();
    productCategoryUIds = productCategoryUIds.flat();
    productGroupUIds = productGroupUIds.flat();

    const url = `${NEXT_PUBLIC_API_URL}${baseUrl}/getProductByDistributorWarehouseProductCategoryGroupUId?DistributorUId=${distributorId}`
      + `${warehouseUIds.length ? `&WarehouseUIds=${warehouseUIds.join("&WarehouseUIds=")}` : ""}`
      + `${productCategoryUIds.length ? `&ProductCategoryUIds=${productCategoryUIds.join("&ProductCategoryUIds=")}` : ""}`
      + `${productGroupUIds.length ? `&ProductGroupUIds=${productGroupUIds.join("&ProductGroupUIds=")}` : ""}`;
    const response = await axiosInstance.get(url);

    const currentProducts = get(response, 'data.Products', []);
    dispatch(setProductsStockView(currentProducts));
    return currentProducts;
  } catch (error) {
    throw new Error('Failed to fetch products');
  }
};

export const getProductCategoriesByDistributorUIdAndWarehouseUId = async ({
  distributorId,
  warehouseUIds = [],
}: GetProductCatGroupParams) => {
  try {
    warehouseUIds = warehouseUIds.flat();

    const url = `${NEXT_PUBLIC_API_URL}${baseUrl}/getProductCategoriesByDistributorUIdAndWarehouseUId?DistributorUId=${distributorId}`
      + `${warehouseUIds.length ? `&WarehouseUIds=${warehouseUIds.join("&WarehouseUIds=")}` : ""}`;
    const response = await axiosInstance.get(url);

    const currentProductCategories = get(response, "data.ProductCategories", []);
    dispatch(setProductCategoriesStockView(currentProductCategories));
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
};

export const getProductGroupsByDistributorUIdAndWarehouseUId = async ({
  distributorId,
  warehouseUIds = [],
}: GetProductCatGroupParams) => {
  try {
    warehouseUIds = warehouseUIds.flat();
    
    const url = `${NEXT_PUBLIC_API_URL}${baseUrl}/getProductGroupsByDistributorUIdAndWarehouseUId?DistributorUId=${distributorId}`
      + `${warehouseUIds.length ? `&WarehouseUIds=${warehouseUIds.join("&WarehouseUIds=")}` : ""}`;
    const response = await axiosInstance.get(url);

    const currentProductGroups = get(response, "data.ProductGroups", []);
    dispatch(setProductGroupsStockView(currentProductGroups));
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
};

// GET /getPriceList/{distributorId}
export const getDistriPriceListsById = async (distributorId: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}distributorStockAdjustment/getPriceList/${distributorId}`
    );
    dispatch(setDSV_PriceLists(get(response, "data", [])));
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};

//Get All Warehouse Categories
export const getAllWarehouseCategoryDetails = async (
  page?: number,
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string,
  isActive?: boolean
) => {
  dispatch(startLoading());
  try {
    const params = new URLSearchParams();

    if (page) params.append("page", page.toString());
    if (pageSize) params.append("pageSize", pageSize.toString());
    if (search) params.append("search", search);
    if (sortBy) params.append("sortColumn", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (isActive !== undefined) params.append("IsActive", isActive.toString());

    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}warehousecategory?${params.toString()}`
    );
    const warehouseCategoryDetails = get(
      response,
      "data.WarehouseCategory",
      []
    );
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setWarehouseCategories(warehouseCategoryDetails));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setWarehouseCategoryError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};
