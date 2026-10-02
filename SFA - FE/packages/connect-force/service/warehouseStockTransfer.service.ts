import { serverDownErrorMessage } from "@/data/common-errors";
import { setWarehouseStockTransferError, setWarehouseStockTransferMessage, setWST_Detail, setWST_Details, setWST_Distributors, setWST_FromWarehouses, setWST_PriceList, setWST_Products, setWST_RecivingWarehouses } from "@/redux/slices/warehouse-stock-transfer-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "distributorWarehouseStockTransfer";

export const createWarehouseStockTransfer = async (data: any) => {
    try {
        const response = await axiosInstance.post(
            `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
            data
        );
        dispatch(setWarehouseStockTransferMessage(get(response, "data", []).message));
        return get(response, "data", []);
    } catch (error: ErrorType | any) {
        dispatch(setWarehouseStockTransferError(error.response.data?.description[0]?.message || serverDownErrorMessage));
        throw new Error(error.response.data.details[0].message);
    }
};

// ==============================
// ========== VIEW ALL ==========
// ==============================

// api/distributorWarehouseStockTransfer
export const getAllWarehouseStockTransfer = async () => {
    try {
        const response = await axiosInstance.get(
            `${NEXT_PUBLIC_API_URL}${baseUrl}?sortColumn=stockTransferId&sortOrder=desc`
        );
        dispatch(
            setWST_Details(get(response, "data.DistributorWarehouseStockTransfer", []))
        );
        return get(response, "data.DistributorWarehouseStockTransfer", []);
    } catch (error) {
        throw new Error();
    }
};

// api/distributorWarehouseStockTransfer/{id}
export const getWarehouseStockTransferById = async (id: number) => {
    try {
        const response = await axiosInstance.get(
            `${NEXT_PUBLIC_API_URL}${baseUrl}/${id}`
        );
        dispatch(
            setWST_Detail(get(response, "data.result", []))
        )
        return get(response, "data.result", []);
    } catch (error) {
        throw new Error();
    }
};

export const updateWarehouseStockTransfer = async (
    uId: number | undefined,
    data: any
) => {
    try {
        const response = await axiosInstance.put(
            `${NEXT_PUBLIC_API_URL}${baseUrl}update/${uId}`,
            data
        );
        dispatch(setWarehouseStockTransferMessage(get(response, "data", []).message));
        return get(response, "data", []);
    } catch (error: ErrorType | any) {
        dispatch(setWarehouseStockTransferError(error.response.data?.details[0]?.description || serverDownErrorMessage));
        throw new Error(error.response.data.details[0].description);
    }
}

// GET getWarehousesByDistributorUId
export const getWarehousesByDistributorUId = async (DistributorId: number) => {
    try {
        const response = await axiosInstance.get(
            `${NEXT_PUBLIC_API_URL}currentStock/getWarehousesByDistributorUId?DistributorUId=${DistributorId}&IsActive=true`
        );
        dispatch(setWST_FromWarehouses(get(response, "data.Warehouses", [])));
        dispatch(setWST_RecivingWarehouses(get(response, "data.Warehouses", [])));
        return get(response, "data", []);
    } catch (error) {
        throw new Error();
    }
};

// GET getyDistributors
export const getAllActiveDistributors = async () => {
    try {
        const response = await axiosInstance.get<any>(
            `${NEXT_PUBLIC_API_URL}outlettransfer/getDistributorAll?IsActive=true`
        );
        const distributorData = get(response, "data.OutletTransfer", []);
        dispatch(setWST_Distributors(distributorData));
        return distributorData;
    } catch (error) {
        console.error("Error fetching distributors:", error);
        throw new Error();
    }
};

// GET /getPriceList/{distributorId}
export const getPriceListsByDistributorId = async (distributorId: number) => {
    try {
        const response = await axiosInstance.get(
            `${NEXT_PUBLIC_API_URL}distributorStockAdjustment/getPriceList/${distributorId}`
        );
        dispatch(setWST_PriceList(get(response, "data", [])));
        return get(response, "data", []);
    } catch (error) {
        throw new Error();
    }
};

// GET /getProduct
export const getProductByDistributorWarehouseUId = async (
    distributorId: number,
    warehouseId: number
) => {
    try {
        const response = await axiosInstance.get(
            `${NEXT_PUBLIC_API_URL}currentStock/getProduct/${distributorId}/warehouse/${warehouseId}`
        );
        dispatch(setWST_Products(get(response, "data", [])));
        return get(response, "data", []);
    } catch (error) {
        throw new Error;
    }
};