import { setDistributorWarehouses, setSalesInvoiceByID, setSalesInvoicePriceListType, setSalesInvoiceProducts, setSalesUnits, setTourScheduleById_invoice } from "@/redux/slices/direct-sale/tour-sales-invoice";
import { setDistributorUId, setOutlets, setTourSales } from "@/redux/slices/direct-sale/tour-sales-slice";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

// GET All SalesView
export const getAllTourLoadings = async (scheduleID: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}salesview?TourScheduleUId=${scheduleID}`
    );
    dispatch(setTourSales(get(response, "data.SalesView", [])));
    dispatch(setDistributorUId(get(response, "data.SalesView[0].tourSchedule.distributorUId", null)));
  } catch (error) {
    throw new Error();
  }
};

// GET Tour Schedule by ID
export const getTourScheduleById_sale = async (id: any) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}tourscheduleDirect/${id}`
    );
    dispatch(setTourScheduleById_invoice(get(response, "data.result", [])));
  } catch (error) {
    throw new Error();
  }
};

// GET /api/pricelisttype
// pricelisttype/outlet/pricelisttype/5065
export const getPriceListTypesByOutlet = async (outletID: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}pricelisttype/outlet/pricelisttype/${outletID}`
    );
    dispatch(setSalesInvoicePriceListType(get(response, "data.result", [])));
  } catch (error) {
    throw new Error();
  }
};

// GET getWarehousesByDistributorUId
export const getWarehousesByDistributorUId = async (DistributorId: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}currentStock/getWarehousesByDistributorUId?DistributorUId=${DistributorId}&WarehouseTypeUId=1&IsActive=true`
    );
    dispatch(setDistributorWarehouses(get(response, "data.Warehouses", [])));
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};

// POST /api/saleinvoice/load/{id}
export const createSalesInvoices = async (id: any) => {
  try {
    const createSalesInvoices = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}saleinvoice/load/${id}`
    );
  } catch (error) {
    throw new Error();
  }
};

// GET /api/saleinvoice/products
export const getSaleInvoiceProducts = async (
  PriceListTypeUId: number,
  WarehouseUId: number,
  OutletUId: number
) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}saleinvoicedirect/products?PriceListTypeUId=${PriceListTypeUId}&WarehouseUId=${WarehouseUId}&OutletUId=${OutletUId}`
    );

    dispatch(setSalesInvoiceProducts(get(response, "data.result", [])));

    return response.data.result;
  } catch (error) {
    throw new Error();
  }
};

// GET Sale units
export const getSaleUnits = async () => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}salesunittype?IsBaseUnit=false&IsActive=true`
    );
    dispatch(setSalesUnits(get(response, "data.SalesUnitType", [])));
  } catch (error) {
    throw new Error();
  }
};

// GET /api/saleinvoice/invoiceId
export const getSalesInvoiceByID = async (invoiceId: any) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}saleinvoicedirect/invoiceId?InvoiceId=${invoiceId}`
    );
    dispatch(setSalesInvoiceByID(get(response, "data.result", [])));
  } catch (error) {
    throw new Error();
  }
};

// POST /api/saleinvoice/create
export const createSalesInvoice = async (payload: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}saleinvoicedirect/create`,
      payload
    );
    return response.data;
  } catch (error) {
    throw new Error();
  }
};

// PUT /api/saleinvoice/update/{id}
export const updateSalesInvoice = async (id: any, payload: any) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}saleinvoicedirect/update/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw new Error();
  }
};

// POST /api/currentStock/SaleSubmit
export const submitSale = async (salesViewUId: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}saleinvoicedirect/salesubmit?SalesViewUId=${salesViewUId}`
    );

    return response.data.result;
  } catch (error) {
    throw new Error();
  }
};

// POST /api/saleinvoice/submit/{id}
export const getAllActiveOutletsByRoute = async (
  routeId: number
) => {
  try {
      const response = await axiosInstance.get<any>(
          `${NEXT_PUBLIC_API_URL}routeoutlet/route?RouteUId=${routeId}&IsChecked=true&IsActive=true`
      );
      const itemsData = get(response, "data.result.items", []);

      dispatch(setOutlets(itemsData));
      return itemsData;
  } catch (error) {
      dispatch(setOutlets([]));
      console.error("Error fetching outlets:", error);
      throw new Error();
  }
};

// POST api/salesview/createsaleview
export const createNewSalesView = async (payload: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}salesview/createsaleview`,
      payload
    );
    return response.data.message;
  } catch (error) {
    throw new Error();
  }
};

// /api/salesview/addsamesaleview/{saleInvoiceViewUId }
export const addSameProductSaleInvoiceView = async (
  saleInvoiceViewUId: number
) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}salesview/addsamesaleview/${saleInvoiceViewUId}`
    );

    return response.data.message;
  } catch (error) {
    throw new Error();
  }
};