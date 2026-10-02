import {
  setAssignedProduct,
  setRepresentativeProductsIsTrue,
  setRepresentativeProductsMsg,
} from "@/redux/slices/mappers/product-representative";
import { setSalesRepresentativeMessage } from "@/redux/slices/sales-representative-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import { ProdutsByRepresentativeIdPagedResults } from "@/types/mapping-types/product-representative-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "productrep";

// Product -> Representative assign Mapping
export const assignProductRepresentativeMapping = async (data: any) => {
  try {
    await axiosInstance
      .post(`${NEXT_PUBLIC_API_URL}${baseUrl}/bulkcreate`, data)
      .then((response) => {
        const responceMsg = get(response, "data.message", []);
        dispatch(setRepresentativeProductsMsg(responceMsg));
        dispatch(setSalesRepresentativeMessage(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

// Product -> Representative unassign Mapping
export const unassignProductRepresentativeMapping = async (data: any) => {
  try {
    await axiosInstance
      .put(`${NEXT_PUBLIC_API_URL}${baseUrl}/bulkupdate`, data)
      .then((responce) => {
        const responceMsg = get(responce, "data.message", []);
        dispatch(setRepresentativeProductsMsg(responceMsg));
        dispatch(setSalesRepresentativeMessage(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

// Get All product By Representative Id
export const getAllProductByRepresentativeId = async (uid: number) => {
  try {
    await axiosInstance
      .get<ProdutsByRepresentativeIdPagedResults>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/GetProductsByRepresentative?RepresentativeUId=${uid}&IsChecked=true`
      )
      .then((response) => {
        const productsData = get(response, "data.Product", []);
        dispatch(setAssignedProduct(productsData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllRepresentativeByProductIdIsTrue = async (uid: number) => {
  try {
    await axiosInstance
      .get<any>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/getAllRepresentativeByProductId?ProductUId=${uid}&IsChecked=true`
      )
      .then((response) => {
        const representativeData = get(response, "data.Representatives", []);
        dispatch(setRepresentativeProductsIsTrue(representativeData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};
