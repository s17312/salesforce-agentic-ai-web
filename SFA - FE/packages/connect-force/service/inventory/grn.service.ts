import {
  resetGRN,
  setGRN,
  setGRNs,
  startLoading,
} from "@/redux/slices/inventory/purchase-order-slice";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "GRN";

// ==============================
// ========== GET ==========
// ==============================

// GET /api/company
export const getAllGRNs = async () => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?sortColumn=uId&sortOrder=desc`
    );
    dispatch(setGRNs(get(response, "data.GRN", [])));
    return get(response, "data.result", []);
  } catch (error) {
    throw new Error();
  }
};

// GET /api/GRN/{id}
export const getGRN = async (id: number) => {
  dispatch(startLoading());
  try {
    dispatch(resetGRN());
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/${id}`
    );
    dispatch(setGRN(get(response, "data.result", {})));
    return get(response, "data.result", {});
  } catch (error) {
    throw new Error();
  }
};

// PUT /api/GRNupdate/{id}
export const updateGRN = async (id: number, data: any) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}GRNupdate/${id}`,
      data
    );
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};
