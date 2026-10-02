import { setProductOutletsIsTrue } from "@/redux/slices/mappers/product-outlet-slice";
import { setOutletMessage } from "@/redux/slices/outlet-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "productoutlet";

// Product -> Outlet assign Mapping
export const assignProductOutletMapping = async (data: any) => {
  try {
    await axiosInstance
      .post(`${NEXT_PUBLIC_API_URL}${baseUrl}/create/bulkproductoutlet`, data)
      .then((response) => {
        const responceMsg = get(response, "data.message", []);
        dispatch(setOutletMessage(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

// Product -> Outlet unassign Mapping
export const unassignProductOutletMapping = async (data: any) => {
  try {
    await axiosInstance
      .put(`${NEXT_PUBLIC_API_URL}${baseUrl}/update/bulkproductoutlet`, data)
      .then((responce) => {
        const responceMsg = get(responce, "data.message", []);
        dispatch(setOutletMessage(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllOutletByProductIdIsTrue = async (uid: number) => {
  try {
    await axiosInstance
      .get<any>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/getAllOutletByProductId?ProductUId=${uid}&IsChecked=true`
      )
      .then((response) => {
        const outletData = get(response, "data.Outlets", []);
        dispatch(setProductOutletsIsTrue(outletData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};
