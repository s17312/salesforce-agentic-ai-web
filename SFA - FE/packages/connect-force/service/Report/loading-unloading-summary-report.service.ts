import { setDistributorView, setLoadingUnloadingSummaryDetails, setPriceListView, setRepBydistri, setTourAssignedVehicles } from "@/redux/slices/report/loading-unloading-summary-report-slice";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "report";

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

// GET /getPriceList/{distributorId}
export const getPriceListsById = async (distributorId: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}distributorStockAdjustment/getPriceList/${distributorId}`
    );
    dispatch(setPriceListView(get(response, "data", [])));
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};

export const getAllActiveRepByDistriID = async (distributorId: number) => {
    try {
        const response = await axiosInstance.get<any>(
            `${NEXT_PUBLIC_API_URL}outlettransfer/getRepresentativeAllByDistributor?DistributorUId=${distributorId}&IsActive=true`
        );

        const repByDistri = get(response, "data.OutletTransfer", []);
        dispatch(setRepBydistri(repByDistri));
        return repByDistri;
    } catch (error) {
        dispatch(setRepBydistri([]));
        console.error("Error fetching representative:", error);
        throw new Error();
    }
};

// GET Vehicles
export const getTourVehicles = async (distributorID: any, representativeId: any) => {
    try {
        const response = await axiosInstance.get(
            `${NEXT_PUBLIC_API_URL}tourschedule/assignedVehicles?DistributorUId=${distributorID}&RepresentativeUId=${representativeId}`
        );
        dispatch(
            setTourAssignedVehicles(get(response, "data.AssignedVehicles", []))
        );
    } catch (error) {
        throw new Error();
    }
};

export const getAllLoadingUnloadingSummaryDetails = async ({
    fromDate = "",
    toDate = "",
    tourTypes = [],
    distributorUIds = [],
    priceListTypeUId = 0,
    representativeUIds = [],
    vehicleUIds = [],
    offset = 1,
    count = 999999
}: {
    fromDate: string;
    toDate: string;
    tourTypes?: string[];
    distributorUIds?: number[];
    priceListTypeUId?: number;
    representativeUIds?: number[];
    vehicleUIds?: number[];
    offset?: number;
    count?: number;
}) => {
    try {
        const queryParams = new URLSearchParams({ FromDate: fromDate.toString(), ToDate: toDate.toString(), Offset: offset.toString(), Count: count.toString(), priceListTypeUId: priceListTypeUId.toString() });

        tourTypes = tourTypes.flat();
        distributorUIds = distributorUIds.flat();
        representativeUIds = representativeUIds.flat();
        vehicleUIds = vehicleUIds.flat();

        const url = `${NEXT_PUBLIC_API_URL}${baseUrl}/loadingUnloadingSummaryReport?${queryParams.toString()}`
            + `${tourTypes.length ? `&tourTypes=${tourTypes.join("&tourTypes=")}` : ""}`
            + `${distributorUIds.length ? `&distributorUIds=${distributorUIds.join("&distributorUIds=")}` : ""}`
            + `${representativeUIds.length ? `&representativeUIds=${representativeUIds.join("&representativeUIds=")}` : ""}`
            + `${vehicleUIds.length ? `&vehicleUIds=${vehicleUIds.join("&vehicleUIds=")}` : ""}`;
        const response = await axiosInstance.get(url);

        const loadingUnloadingSummaryDetails = get(response, "data.LoadingUnloadingSummaryReport", []);
        dispatch(setLoadingUnloadingSummaryDetails(loadingUnloadingSummaryDetails));
        return loadingUnloadingSummaryDetails;
    } catch (error) {
        dispatch(setLoadingUnloadingSummaryDetails([]));
        throw new Error();
    }
};