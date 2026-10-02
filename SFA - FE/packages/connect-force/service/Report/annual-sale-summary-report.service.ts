import { setActiveOutlets, setActiveRoutes, setAnnualSaleSummaryDetails, setDistributorView, setRepBydistri } from "@/redux/slices/report/annual-sale-summary-report";
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

export const getAllActiveRouteByRepID = async (distributorId: number, representativeId: number) => {
    try {
        const response = await axiosInstance.get<any>(
            `${NEXT_PUBLIC_API_URL}outlettransfer/getRouteAllByRepresentative?RepUId=${representativeId}&IsActive=true`
        );

        const activeRoutes = get(response, "data.OutletTransfer", []);
        dispatch(setActiveRoutes(activeRoutes));
        return activeRoutes;
    } catch (error) {
        dispatch(setActiveRoutes([]));
        console.error("Error fetching routes:", error);
        throw new Error();
    }
};

export const getAllActiveOutletsByRoute = async (
    routeId: number
) => {
    try {
        const response = await axiosInstance.get<any>(
            `${NEXT_PUBLIC_API_URL}routeoutlet/route?RouteUId=${routeId}&IsChecked=true&IsActive=true`
        );
        const itemsData = get(response, "data.result.items", []);

        dispatch(setActiveOutlets(itemsData));
        return itemsData;
    } catch (error) {
        dispatch(setActiveOutlets([]));
        console.error("Error fetching outlets:", error);
        throw new Error();
    }
};

export const getAllActiveOutletsByDistributorRepRoute = async (
    distributorId: number,
    representativeId: number,
    routeId: number
) => {
    try {
        const response = await axiosInstance.get<any>(
            `${NEXT_PUBLIC_API_URL}outlettransfer/getOutletAllByDistributorRepRoute?DistributorUId=${distributorId}&RepUId=${representativeId}&RouteUId=${routeId}&IsActive=true`
        );
        const outletsByDistriRepRouteIdData = get(
            response,
            "data.OutletTransfer",
            []
        );
        dispatch(setActiveOutlets(outletsByDistriRepRouteIdData));
        return outletsByDistriRepRouteIdData;
    } catch (error) {
        dispatch(setActiveOutlets([]));
        console.error("Error fetching routes:", error);
        throw new Error();
    }
};


export const getAllAnnualSaleSummaryReportDetails = async ({
    year = "",
    tourTypes = [],
    distributorUIds = [],
    representativeUIds = [],
    routeUIds = [],
    outletUIds = [],
    offset = 1,
    count = 999999
}: {
    year: string;
    tourTypes?: string[];
    distributorUIds?: number[];
    representativeUIds?: number[];
    routeUIds?: number[];
    outletUIds?: number[];
    offset?: number;
    count?: number;
}) => {
    try {
        const queryParams = new URLSearchParams({ Year: year.toString(), Offset: offset.toString(), Count: count.toString() });

        tourTypes = tourTypes.flat();
        distributorUIds = distributorUIds.flat();
        representativeUIds = representativeUIds.flat();
        routeUIds = routeUIds.flat();
        outletUIds = outletUIds.flat();

        const url = `${NEXT_PUBLIC_API_URL}${baseUrl}/annualsalesummaryreport?${queryParams.toString()}`
            + `${tourTypes.length ? `&tourTypes=${tourTypes.join("&tourTypes=")}` : ""}`
            + `${distributorUIds.length ? `&distributorUIds=${distributorUIds.join("&distributorUIds=")}` : ""}`
            + `${representativeUIds.length ? `&representativeUIds=${representativeUIds.join("&representativeUIds=")}` : ""}`
            + `${routeUIds.length ? `&routeUIds=${routeUIds.join("&routeUIds=")}` : ""}`
            + `${outletUIds.length ? `&outletUIds=${outletUIds.join("&outletUIds=")}` : ""}`;
        const response = await axiosInstance.get(url);

        const annualSaleSummaryDetails = get(response, "data.AnnualSaleSummaryReport", []);
        dispatch(setAnnualSaleSummaryDetails(annualSaleSummaryDetails));
        return annualSaleSummaryDetails;
    } catch (error) {
        dispatch(setAnnualSaleSummaryDetails([]));
        throw new Error();
    }
};