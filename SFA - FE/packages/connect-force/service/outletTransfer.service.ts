import { setDistributors } from "@/redux/slices/outlet-transfer-slice";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "outlettransfer";

export const getAllActiveDistributors = async () => {
  try {
    const response = await axiosInstance.get<any>(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/getDistributorAll?IsActive=true`
    );
    const distributorData = get(response, "data.OutletTransfer", []);
    dispatch(setDistributors(distributorData));
    return distributorData;
  } catch (error) {
    console.error("Error fetching distributors:", error);
    throw new Error();
  }
};

export const getAllActiveRepByDistriID = async (uid: number) => {
  try {
    const response = await axiosInstance.get<any>(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/getRepresentativeAllByDistributor?DistributorUId=${uid}&IsActive=true`
    );
    const outletRepByDistri = get(response, "data.OutletTransfer", []);
    return outletRepByDistri;
  } catch (error) {
    console.error("Error fetching representative:", error);
    throw new Error();
  }
};

// export const getAllActiveRoutesByRepID = async (uid: number) => {
//   try {
//     const response = await axiosInstance.get<any>(
//       `${NEXT_PUBLIC_API_URL}${baseUrl}/getRouteAllByRepresentative?RepUId=${uid}&IsActive=true`
//     );
//     const routesByRepIdData = get(response, "data.OutletTransfer", []);
//     return routesByRepIdData;
//   } catch (error) {
//     console.error("Error fetching routes:", error);
//     throw new Error();
//   }
// };

// GET Routes
export const getAllActiveRoutesByRepID = async (repID: any) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}representativeroute?RepresentativeUId=${repID}&IsChecked=true&IsActive=true`
    );
    const routesByRepIdData = get(response, "data.Route", []);
    return routesByRepIdData;
    // dispatch(setTourSchedule_Routes(get(response, "data.Route", [])));
  } catch (error) {
    throw new Error();
  }
};

export const getAllActiveOutletsByDistributorRepRoute = async (
  distriUid: number,
  repUid: number,
  routeUid: number
) => {
  try {
    const response = await axiosInstance.get<any>(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/getOutletAllByDistributorRepRoute?DistributorUId=${distriUid}&RepUId=${repUid}&RouteUId=${routeUid}&IsActive=true`
    );
    const outletsByDistriRepRouteIdData = get(
      response,
      "data.OutletTransfer",
      []
    );
    return outletsByDistriRepRouteIdData;
  } catch (error) {
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

      // dispatch(setOutlets(itemsData));
      return itemsData;
  } catch (error) {
      // dispatch(setOutlets([]));
      console.error("Error fetching outlets:", error);
      throw new Error();
  }
};

// outlettransferbulkupdate - PUT
export const updateOutletTransferBulk = async (data: any) => {
  try {
    const response = await axiosInstance.put<any>(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/outlettransferbulkupdate`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error updating outlet transfer bulk:", error);
    throw new Error();
  }
};
