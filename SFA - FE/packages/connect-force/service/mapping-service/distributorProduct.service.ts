import { setDistributorMessage } from "@/redux/slices/distributor-slice";
import {
  setDistributorByProductsIsTrue,
  setDistributorProductMsg,
  setDistributorProducts,
  setDistributorProductsIsTrue,
} from "@/redux/slices/mappers/distributor-product-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import { ProductsByDistributorIdPagedResults } from "@/types/mapping-types/distributor-product-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "distributorproduct";

// Distributor -> Product Mapping

export const getAllProductsByDistributorId = async (uid: number) => {
  try {
    await axiosInstance
      .get<ProductsByDistributorIdPagedResults>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/product/${uid}`
      )
      .then((response) => {
        const productData = get(response, "data.result", []);
        dispatch(setDistributorProducts(productData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllProductsByDistributorIdIsChecked = async (uid: number) => {
  try {
    await axiosInstance
      .get<ProductsByDistributorIdPagedResults>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/distributor/${uid}`
      )
      .then((response) => {
        const productData = get(response, "data.result", []);
        dispatch(setDistributorProductsIsTrue(productData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

export const distributorProductBulkUpdate = async (uid: number, data: any) => {
  try {
    await axiosInstance
      .put(`${NEXT_PUBLIC_API_URL}${baseUrl}/bulkupdate/${uid}`, data)
      .then((response) => {
        const responceMsg = get(response, "data.message", []);
        dispatch(setDistributorProductMsg(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

// Product -> Distributor assign Mapping
export const createProductDistributorMapping = async (data: any) => {
  try {
    await axiosInstance
      .post(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/createbulk/productdistributor`,
        data
      )
      .then((response) => {
        const responceMsg = get(response, "data.message", []);
        dispatch(setDistributorMessage(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

// Product -> Distributor unassign Mapping
export const unassignProductDistributorMapping = async (data: any) => {
  try {
    await axiosInstance
      .put(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/productdistributorbulkupdate`,
        data
      )
      .then((responce) => {
        const responceMsg = get(responce, "data.message", []);
        dispatch(setDistributorMessage(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllDistributorsByProductIdIsTrue = async (uid: number) => {
  try {
    await axiosInstance
      .get<any>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/getAllDistributorByProductId?ProductUId=${uid}&IsChecked=true`
      )
      .then((response) => {
        const distributorData = get(response, "data.Distributors", []);
        dispatch(setDistributorByProductsIsTrue(distributorData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};
