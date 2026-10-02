import { setTourSchedule_Distributors, setTourSchedule_Outlets, setTourSchedule_Rep, setTourSchedule_Routes, setTourScheduleById, setTourSchedulesAll } from "@/redux/slices/direct-sale/tour-schedule-slice";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

// GET Distributors
export const getTourDistributors = async () => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}outlettransfer/getDistributorAll?IsActive=true`
    );
    dispatch(
      setTourSchedule_Distributors(get(response, "data.OutletTransfer", []))
    );
  } catch (error) {
    throw new Error();
  }
};

// GET Sales Rep
export const getTourSalesRep = async (distributorUId: any) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}outlettransfer/getRepresentativeAllByDistributor?DistributorUId=${distributorUId}&IsActive=true`
    );
    dispatch(setTourSchedule_Rep(get(response, "data.OutletTransfer", [])));
  } catch (error) {
    throw new Error();
  }
};

// GET Routes
export const getTourRoutes = async (repID: any) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}representativeroute?RepresentativeUId=${repID}&IsChecked=true&IsActive=true`
    );
    dispatch(setTourSchedule_Routes(get(response, "data.Route", [])));
  } catch (error) {
    throw new Error();
  }
};

// GET Outlets
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
        dispatch(setTourSchedule_Outlets(outletsByDistriRepRouteIdData));
    } catch (error) {
        throw new Error();
    }
};

// GET All tour schedules type 01
export const getAllTourSchedules = async () => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}tourscheduledirect?InvoiceTypeUId=4&sortColumn=uId&sortOrder=desc`
    );
    dispatch(setTourSchedulesAll(get(response, "data.TourSchedules", [])));
  } catch (error) {
    throw new Error();
  }
};

// GET Tour Schedule by ID
export const getTourScheduleById = async (id: any) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}tourscheduledirect/${id}`
    );
    dispatch(setTourScheduleById(get(response, "data.result", [])));
  } catch (error) {
    throw new Error();
  }
};

// Create Tour Schedule
export const createTourSchedule = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}tourscheduledirect/create`,
      data
    );

    return response.data.message;
  } catch (error) {
    throw new Error();
  }
};

// PUT Tour Schedule
export const updateTourSchedule = async (id: any, data: any) => {
  try {
    // tourschedule/update/1
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}tourscheduledirect/update/${id}`,
      data
    );

    return response.data.message;
  } catch (error) {
    throw new Error();
  }
};

//DELETE Draft Tour Schedule
export const deleteTourSchedule = async (id: any) => {
  try {
    const response = await axiosInstance.delete(
      `${NEXT_PUBLIC_API_URL}tourschedule/delete/${id}`
    );
    return response.data.result.message;
  } catch (error) {
    throw new Error();
  }
};

// PATCH /api/tourschedule/update/tourstatus/{id}
export const updateTourScheduleStatusComplete = async (scheduleID: number) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}tourschedule/update/tourstatus/${scheduleID}`,
      { statusUId: 6 }
    );
    return response.data.message;
  } catch (error) {
    throw new Error();
  }
};

// PATCH /api/tourschedule/update/tourstatus/{id}
export const updateTourjourneyStatus = async (
  scheduleID: number,
  statusUId: number
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}tourschedule/update/tourstatus/${scheduleID}`,
      { statusUId: statusUId }
    );
    return response.data.message;
  } catch (error) {
    throw new Error();
  }
};
