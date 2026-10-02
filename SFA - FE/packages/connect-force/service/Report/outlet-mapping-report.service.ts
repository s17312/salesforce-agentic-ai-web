import {
  setActiveOutlets,
  setActiveRoutes,
  setDistributorView,
  setOutletMappingDetails,
  setRepBydistri,
} from "@/redux/slices/report/outlet-mapping-report-slice";
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

export const getAllActiveRouteByRepID = async (
  distributorId: number,
  representativeId: number
) => {
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

export const getAllActiveOutletsByRoute = async (routeId: number) => {
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

export const getAllOutletMappingReportDetails = async ({
  distributorUIds = [],
  representativeUIds = [],
  routeUIds = [],
  outletUIds = [],
  offset = 1,
  count = 999999,
}: {
  distributorUIds?: number[];
  representativeUIds?: number[];
  routeUIds?: number[];
  outletUIds?: number[];
  offset?: number;
  count?: number;
}) => {
  try {
    const queryParams = new URLSearchParams({
      Offset: offset.toString(),
      Count: count.toString(),
    });

    distributorUIds = distributorUIds.flat();
    representativeUIds = representativeUIds.flat();
    routeUIds = routeUIds.flat();
    outletUIds = outletUIds.flat();

    const url =
      `${NEXT_PUBLIC_API_URL}${baseUrl}/routeWiseOutletListReport?${queryParams.toString()}` +
      `${
        distributorUIds.length
          ? `&distributorUIds=${distributorUIds.join("&distributorUIds=")}`
          : ""
      }` +
      `${
        representativeUIds.length
          ? `&representativeUIds=${representativeUIds.join(
              "&representativeUIds="
            )}`
          : ""
      }` +
      `${
        routeUIds.length ? `&routeUIds=${routeUIds.join("&routeUIds=")}` : ""
      }` +
      `${
        outletUIds.length
          ? `&outletUIds=${outletUIds.join("&outletUIds=")}`
          : ""
      }`;
    const response = await axiosInstance.get(url);

    const routeWiseOutletReportDetails = get(
      response,
      "data.RouteWiseOutletListReport",
      []
    );
    dispatch(setOutletMappingDetails(routeWiseOutletReportDetails));
    return routeWiseOutletReportDetails;
  } catch (error) {
    dispatch(setOutletMappingDetails([]));
    throw new Error();
  }
};

export const getAllActiveRouteBySalesRepID = async (
  representativeIds: number[] = []
) => {
  try {
    representativeIds = representativeIds.flat();

    const url =
      `${NEXT_PUBLIC_API_URL}reportget/getRoutesAllByRepresentatives?` +
      `${
        representativeIds.length
          ? `&representativeUIds=${representativeIds.join(
              "&representativeUIds="
            )}`
          : ""
      }&IsActive=true`;

    const response = await axiosInstance.get<any>(url);

    const activeRoutes = get(response, "data.RoutesByRepresentatives", []);
    dispatch(setActiveRoutes(activeRoutes));
    return activeRoutes;
  } catch (error) {
    dispatch(setActiveRoutes([]));
    console.error("Error fetching routes:", error);
    throw new Error();
  }
};

export const getAllActiveOutletsByRoutes = async (routeUIds: number[] = []) => {
  try {
    routeUIds = routeUIds.flat();

    const url =
      `${NEXT_PUBLIC_API_URL}reportget/getOutletsAllByRoutes?` +
      `${
        routeUIds.length ? `&routeUIds=${routeUIds.join("&routeUIds=")}` : ""
      }&IsActive=true`;

    const response = await axiosInstance.get<any>(url);

    const activeOutlets = get(response, "data.OutletsByRoutes", []);
    dispatch(setActiveOutlets(activeOutlets));
    return activeOutlets;
  } catch (error) {
    dispatch(setActiveOutlets([]));
    console.error("Error fetching routes:", error);
    throw new Error();
  }
};
