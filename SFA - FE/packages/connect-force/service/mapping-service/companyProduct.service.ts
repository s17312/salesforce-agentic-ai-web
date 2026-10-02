import {
  setCompanyByProductsIsTrue,
  setCompanyProducts,
  setCompanyProductsIsTrue,
  setCompanyProductsMsg,
} from "@/redux/slices/mappers/company-product-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "companyproduct";

export const getAllProductsByCompanyId = async (uid: number) => {
  try {
    await axiosInstance
      .get<any>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/productDetails/company?CompanyId=${uid}&IsActive=true`
      )
      .then((response) => {
        const ProductData = get(response, "data.result.items", []);
        dispatch(setCompanyProducts(ProductData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

export const companyProductBulkUpdate = async (uid: number, data: any) => {
  try {
    await axiosInstance
      .put(`${NEXT_PUBLIC_API_URL}${baseUrl}/bulkupdate/company/${uid}`, data)
      .then((response) => {
        const responceMsg = get(response, "data.message", []);
        dispatch(setCompanyProductsMsg(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllProductsByCompanyIdIsTrue = async (uid: number) => {
  try {
    await axiosInstance
      .get<any>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/productDetails/company?CompanyId=${uid}&IsChecked=true`
      )
      .then((response) => {
        const productData = get(response, "data.result.items", []);
        dispatch(setCompanyProductsIsTrue(productData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllCompaniesByProductIdIsTrue = async (uid: number) => {
  try {
    await axiosInstance
      .get<any>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/getAllCompanyByProductId?ProductUId=${uid}&IsChecked=true`
      )
      .then((response) => {
        const companyData = get(response, "data.Companies", []);
        dispatch(setCompanyByProductsIsTrue(companyData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};
