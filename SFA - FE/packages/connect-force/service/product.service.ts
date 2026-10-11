import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllProducts,
  setProduct,
  setProductError,
  setPaginationDetails,
  startLoading,
  setProductMessage,
} from "@/redux/slices/product-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { ProductPagedResult } from "connect-force-api-client";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "Product";

export const createProduct = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setProductMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setProductError(
        error.detail.details[0].description || serverDownErrorMessage
      )
    );
    throw new Error(error.detail.details[0].description);
  }
};

export const createBulkProductList = async (file: File) => {
  const form = new FormData();
  form.append("uploadedFile", file);

  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/temp/create/bulk`,
      form,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const resData = response.data;

    return resData.data;
  } catch (error: any) {
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllProducts = async (
  pageOrParams?: number | {
    page?: number;
    pageSize?: number;
    searchKeyword?: string;
    search?: string;
    sortColumn?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    isActive?: boolean;
  },
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string,
  isActive?: boolean
) => {
  dispatch(startLoading());
  try {
    const params = new URLSearchParams();

    let p: number | undefined;
    let ps: number | undefined;
    let kw: string | undefined;
    let col: string | undefined;
    let ord: string | undefined;
    let active: boolean | undefined;

    if (typeof pageOrParams === 'object' && pageOrParams !== null) {
      p = pageOrParams.page;
      ps = pageOrParams.pageSize;
      kw = pageOrParams.searchKeyword || pageOrParams.search;
      col = pageOrParams.sortColumn || pageOrParams.sortBy;
      ord = pageOrParams.sortOrder;
      active = pageOrParams.isActive;
    } else {
      p = pageOrParams;
      ps = pageSize;
      kw = search;
      col = sortBy;
      ord = sortOrder;
      active = isActive;
    }

    if (p) params.append("page", p.toString());
    if (ps) params.append("pageSize", ps.toString());
    if (kw) params.append("searchKeyword", kw);
    params.append("sortColumn", col || "uId");
    params.append("sortOrder", ord || "desc");
    if (active !== undefined) params.append("IsActive", active.toString());

    await axiosInstance
      .get<ProductPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
      )
      .then((response) => {
        const distributionData = get(response, "data.Product", []);
        const paginationInfo = get(response, "data.pagingView", get(response, "data.paging", {}));
        dispatch(setAllProducts(distributionData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error: ErrorType | any) {
    dispatch(setProductError(serverDownErrorMessage));
    throw new Error(error?.response?.data?.details?.[0]?.description || serverDownErrorMessage);
  }
};

export const getAllActiveProducts = async (
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
    await axiosInstance
      .get<ProductPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
      )
      .then((response) => {
        const distributionData = get(response, "data.Product", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllProducts(distributionData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error: ErrorType | any) {
    dispatch(setProductError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllProductsMapping = async () => {
  dispatch(startLoading());
  try {
    await axiosInstance
      .get<ProductPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/productMappingViewAll`
      )
      .then((response) => {
        const distributionData = get(response, "data.result.productList", []);
        dispatch(setAllProducts(distributionData));
      });
  } catch (error: ErrorType | any) {
    dispatch(setProductError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const getProductById = async (uid: number) => {
  dispatch(startLoading());
  try {
    await axiosInstance
      .get<ProductPagedResult>(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const curruntProductData = get(response, "data.result", []);
        dispatch(setProduct(curruntProductData));
      });
  } catch (error: ErrorType | any) {
    dispatch(setProductError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateProduct = async (uid: number | undefined, data: any) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setProductMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setProductError(
        error.detail.details[0].description || serverDownErrorMessage
      )
    );
    throw new Error(error.detail.details[0].description);
  }
};

//patch for active inactive
export const updateProductStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedProductData = get(response, "data.result", []);
    dispatch(
      setAllProducts({
        data: updatedProductData,
        update: true,
      })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    console.error(error.response.data.details[0].description);
    dispatch(setProductError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

//Optimize the product list API
export const getAllProductsList = async (
  pageOrParams?: number | {
    page?: number;
    pageSize?: number;
    searchKeyword?: string;
    search?: string;
    sortColumn?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    isActive?: boolean;
  },
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string,
  isActive?: boolean
) => {
  dispatch(startLoading());
  try {
    const params = new URLSearchParams();

    let p: number | undefined;
    let ps: number | undefined;
    let kw: string | undefined;
    let col: string | undefined;
    let ord: string | undefined;
    let active: boolean | undefined;

    if (typeof pageOrParams === 'object' && pageOrParams !== null) {
      p = pageOrParams.page;
      ps = pageOrParams.pageSize;
      kw = pageOrParams.searchKeyword || pageOrParams.search;
      col = pageOrParams.sortColumn || pageOrParams.sortBy;
      ord = pageOrParams.sortOrder;
      active = pageOrParams.isActive;
    } else {
      p = pageOrParams;
      ps = pageSize;
      kw = search;
      col = sortBy;
      ord = sortOrder;
      active = isActive;
    }

    if (p) params.append("page", p.toString());
    if (ps) params.append("pageSize", ps.toString());
    if (kw) params.append("searchKeyword", kw);
    params.append("sortColumn", col || "uId");
    params.append("sortOrder", ord || "desc");
    if (active !== undefined) params.append("IsActive", active.toString());

    await axiosInstance
      .get<ProductPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/new?${params.toString()}`
      )
      .then((response) => {
        const distributionData = get(response, "data.Product", []);
        const paginationInfo = get(response, "data.pagingView", get(response, "data.paging", {}));
        dispatch(setAllProducts(distributionData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error: ErrorType | any) {
    dispatch(setProductError(serverDownErrorMessage));
    throw new Error(error?.response?.data?.details?.[0]?.description || serverDownErrorMessage);
  }
};
