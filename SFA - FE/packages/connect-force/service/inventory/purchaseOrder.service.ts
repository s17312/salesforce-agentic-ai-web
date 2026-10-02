import {
  resetPO,
  resetPO_Approve,
  setPO_Approval_PriceLists,
  setPO_Approval_Products,
  setPO_Approve,
  setPO_Companies,
  setPO_DeliveryMehods,
  setPO_Distributors,
  setPO_PaymentTerms,
  setPO_PriceLists,
  setPO_Products,
  setPO_PurchaseOrder,
  setPO_PurchaseOrderApprove,
  setPO_PurchaseOrders,
  setPO_Warehouses,
  startLoading,
} from "@/redux/slices/inventory/purchase-order-slice";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "companyStockAdjustment";

// ==============================
// ========== GET ==========
// ==============================

// GET /api/company
export const getAllActiveCompanies_PO = async () => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}company?IsActive=true`
    );
    dispatch(setPO_Companies(get(response, "data.Company", [])));
    return get(response, "data.result", []);
  } catch (error) {
    throw new Error();
  }
};

// GET /api/distributorStockAdjustment/getPriceList/{distributorId}
export const getPriceLists_PO = async (distributorId: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}distributorStockAdjustment/getPriceList/${distributorId}`
    );
    dispatch(setPO_PriceLists(get(response, "data", [])));
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};

// get /api/paymentterm?IsActive=true
export const getPaymentTerms_PO = async () => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}paymentterm?IsActive=true`
    );
    dispatch(setPO_PaymentTerms(get(response, "data.PaymentTerm", [])));
    return get(response, "data.PaymentTerm", []);
  } catch (error) {
    throw new Error();
  }
};

// get /api/companydistributor/distributorDetails/company?CompanyId=4043&IsChecked=true
export const getDistributorDetails_PO = async (companyId: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}companydistributor/distributorDetails/company?CompanyId=${companyId}&IsChecked=true&IsActive=true`
    );
    dispatch(setPO_Distributors(get(response, "data.result.items", [])));
    return get(response, "data.result.items", []);
  } catch (error) {
    throw new Error();
  }
};

// get /api/deliverymethod?IsActive=true
export const getDeliveryMethods_PO = async () => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}deliverymethod?IsActive=true`
    );
    dispatch(setPO_DeliveryMehods(get(response, "data.deliverymethod", [])));
    return get(response, "data.DeliveryMethod", []);
  } catch (error) {
    throw new Error();
  }
};

// GET /api/distributorStockAdjustment/getProduct/{distributorId}/warehouse/{warehouseId}/pricelisttype/{pricelisttypeId}
export const getProductByPriceList_PO = async (
  distributorId: number,
  priceListTypeId: number
) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}distributorStockAdjustment/getProduct/${distributorId}/warehouse/0/pricelisttype/${priceListTypeId}`
    );
    dispatch(setPO_Products(get(response, "data", [])));
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};

// GET /api/distributorStockAdjustment/getProduct/{distributorId}/warehouse/{warehouseId}/pricelisttype/{pricelisttypeId}
export const getProductByPriceListWithWarehouse_PO = async (
  distributorId: number,
  warehouseId: number,
  priceListTypeId: number
) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}distributorStockAdjustment/getProduct/${distributorId}/warehouse/${warehouseId}/pricelisttype/${priceListTypeId}`
    );
    dispatch(setPO_Products(get(response, "data", [])));
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};

// GET /api/purchaseOrderCreation/temp/{id}
export const getTempPurchaseOrder = async (id: number) => {
  dispatch(startLoading());
  try {
    dispatch(resetPO());
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}purchaseOrderCreation/temp/${id}`
    );
    dispatch(setPO_PurchaseOrder(get(response, "data.result", [])));
    return get(response, "data.result", []);
  } catch (error) {
    throw new Error();
  }
};

// ==============================
// ========== CREATE ==========
// ==============================

// POST /api/purchaseOrderCreation/create
export const createPurchaseOrder = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}purchaseOrderCreation/create`,
      data
    );
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};

// ==============================
// ========== VIEW ALL ==========
// ==============================

// GET /api/purchaseOrderCreation
export const getAllPurchaseOrderCreation = async () => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}purchaseOrderCreation?sortColumn=uId&sortOrder=desc`
    );
    dispatch(setPO_PurchaseOrders(get(response, "data.PurchaseOrder", [])));
    return get(response, "data.PurchaseOrder", []);
  } catch (error) {
    throw new Error();
  }
};

// ==============================
// ========== DELETE ==========
// ==============================

// DELETE /api/purchaseOrderCreationdelete/{id}
export const deletePurchaseOrder = async (id: number) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}purchaseOrderCreationdelete/${id}`,
      { statusId: 3 }
    );
    return get(response, "data.message", []);
  } catch (error) {
    throw new Error();
  }
};

// ==============================
// ========== Update ==========
// ==============================

// PUT /api/purchaseOrderCreationupdate/{id}
export const updatePurchaseOrder = async (id: number, data: any) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}purchaseOrderCreationupdate/${id}`,
      data
    );

    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};

// ==========================================
// ========== PurchaseOrderApprove ==========
// ==========================================

// GET /api/PurchaseOrderApprove
export const getAllPurchaseOrderApprove = async () => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}PurchaseOrderApprove?sortColumn=uId&sortOrder=desc`
    );
    dispatch(
      setPO_PurchaseOrderApprove(get(response, "data.PurchaseOrder", []))
    );
    return get(response, "data.PurchaseOrder", []);
  } catch (error) {
    throw new Error();
  }
};

// GET /api/PurchaseOrderApprove/created/{id}
export const getPurchaseOrderApprove = async (
  id: number,
  warehouseId: number,
  priceListTypeUId: number
) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}PurchaseOrderApprove/created/${id}/Warehouse/${warehouseId}/PriceListTypeUId/${priceListTypeUId}`
    );
    dispatch(setPO_PurchaseOrder(get(response, "data.result", [])));
    return get(response, "data.result", []);
  } catch (error) {
    throw new Error();
  }
};

// PUT /api/PurchaseOrderApproveupdate/{id}
export const updatePurchaseOrderApprove = async (id: number, data: any) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}PurchaseOrderApproveupdate/${id}`,
      data
    );
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};

export const getPriceListsApprove_PO = async (companyId: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/getPriceList/${companyId}`
    );
    dispatch(setPO_Approval_PriceLists(get(response, "data", [])));
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};

// GET /api/PurchaseOrderApprove/created/{id}
export const getApprovePurchaseOrder = async (
  id: number,
  warehouseId: number,
  priceListTypeUId: number
) => {
  dispatch(startLoading());
  try {
    dispatch(resetPO_Approve());
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}PurchaseOrderApprove/created/${id}/Warehouse/${warehouseId}/PriceListTypeUId/${priceListTypeUId}`
    );

    dispatch(setPO_Approve(get(response, "data.result", [])));
    return get(response, "data.result", []);
  } catch (error) {
    throw new Error();
  }
};

export const getProductByPriceListTypeAndCompanyIDAndWarehouseID_PO = async (
  companyId: number,
  warehouseId: number,
  priceListTypeId: number
) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/getProduct/${companyId}/warehouse/${warehouseId}/pricelisttype/${priceListTypeId}`
    );
    dispatch(setPO_Approval_Products(get(response, "data", [])));
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};

export const getPurchaseOrderApproveWarehouseByCompanyUId = async (
  companyId: number,
  warehouseTypeUId: number
) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}PurchaseOrderApproveGetWarehouseByCompany/${companyId}/WarehouseTypeUId/${warehouseTypeUId}`
    );
    dispatch(setPO_Warehouses(get(response, "data.result", [])));
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};

export const getBatchNumbers = async (
  productUId: number,
  mrp: number,
  priceListTypeUId: number,
  warehouseUId: number,
  stockRefUId: number,
  stockRoleTypeUId: number
) => {
  try {
    const responce = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}pricelist/batchNo/${productUId}/MRP/${mrp}/priceListTypeUId/${priceListTypeUId}/warehouseUId/${warehouseUId}/stockRefUId/${stockRefUId}/stockRoleTypeUId/${stockRoleTypeUId}`
    );
    return responce.data;
  } catch {}
};
