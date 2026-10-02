"use client";

import React, { useEffect, useRef, useState } from "react";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { Box, Button, Tab, useTheme } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import LoadingRepTour from "../loading/page";
import SaleRepTour from "../sale/page";
import UnloadingRepTour from "../unloading/page";
import TourSubmitRepTour from "../tour-submit/page";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import PeopleIcon from "@mui/icons-material/People";
import {
  getTourScheduleById,
  updateTourSchedule,
} from "@/service/tour-service/tourSchedule.service";
import { enqueueSnackbar } from "notistack";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useSelector } from "@/redux/store";
import ScheduleRepTour from "../schedule/schedule";
import TourLoadingAdd from "../loading/add/add-loading";
import TourLoadingEdit from "../loading/edit/loading-edit";
import TourLoadingView from "../loading/view/loading-view";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { disabledTourTabViewStyles } from "@/styles/tabViewStyles/tourTabViewStyles";

const RepTourTabsBackup = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("1");
  const [pageTitle, setPageTitle] = useState("Rep Route");
  const [isLoading, setIsLoading] = useState(false);
  const [isNewLoadingSelected, setIsNewLoadingSelected] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [editLoadingId, setEditLoadingId] = useState<number | null>(null);
  const [viewLoadingId, setViewLoadingId] = useState<number | null>(null);
  const [distributorWarehouseUId, setDistributorWarehouseUId] =
    useState<any>(null);

  const schedule = useSelector((state) => state.tourScheduleSlice.TourScheduleById);

  let isLoadingTabDisabled = schedule.statusUId == 1;
  let isSaleTabDisabled = schedule.statusUId == 1 || schedule.statusUId == 2;
  let isUnloadingTabDisabled = schedule.statusUId == 1 || schedule.statusUId == 2 || schedule.statusUId == 3;
  let isTourSubmitTabDisabled = schedule.statusUId == 1 || schedule.statusUId == 2 || schedule.statusUId == 3 || schedule.statusUId == 4;

  const titles = {
    "1": "Schedule",
    "2": "Loading",
    "3": "Sale",
    "4": "Unloading",
    "5": "Tour Submit",
  };

  useEffect(() => {
    switch (schedule.statusUId) {
      case 1:
        setValue("1");
        break;
      case 2:
        setValue("2");
        break;
      case 3:
        setValue("3");
        break;
      case 4:
        setValue("4");
        break;
      case 5:
        setValue("5");
        break;
      default:
        break;
    }
  }, [schedule]);

  const fetchTourScheduleID = async () => {
    try {
      setIsLoading(true);
      await getTourScheduleById(params.id);
    } catch (error) {
      enqueueSnackbar("Error fetching tour schedule", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTourScheduleID();
  }, []);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setPageTitle(titles[newValue as keyof typeof titles]);
  };

  const startTourScheduleReq = async (id: any, payload: any) => {
    try {
      await updateTourSchedule(id, payload);
      setValue("2");
      enqueueSnackbar("Tour schedule started successfully", {
        variant: "success",
      });
      fetchTourScheduleID();
    } catch {
    }
  };
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const handleScheduleStart = (data: any) => {
    const payload = {
      tourID: schedule.tourID,
      scheduleDate: data.scheduleDate,
      distributorUId: data.distributorUId,
      representativeUId: data.representativeUId,
      routeUIds: data.routeUIds,
      vehicleUId: data.vehicleUId,
      startMilage: data.startMilage,
      endMilage: 0,
      driverName: data.driverName,
      porterName: data.porterName,
      targetValue: data.targetValue,
      targetVolume: data.targetVolume,
      statusUId: 2,
      invoiceTypeUId: 1,
    };
    startTourScheduleReq(schedule.uId, payload);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Sales Tour"
        pageNavigation={[
          {
            pageName: "Sales Tour",
            path: PATH_DASHBOARD.repTour.repTour,
          },
          { pageName: "Edit" },
        ]}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<PeopleIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        <Box sx={{ width: "100%", typography: "body1" }}>
          {!isLoading && (
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="Product Mapper Tabs"
                >
                  <Tab label="Schedule" value="1" />
                  <Tab label="Loading" value="2" disabled={isLoadingTabDisabled} sx={disabledTourTabViewStyles} />
                  <Tab label="Sale" value="3" disabled={isSaleTabDisabled} sx={disabledTourTabViewStyles} />
                  <Tab label="Unloading" value="4" disabled={isUnloadingTabDisabled} sx={disabledTourTabViewStyles} />
                  <Tab label="Tour Submit" value="5" disabled={isTourSubmitTabDisabled} sx={disabledTourTabViewStyles} />
                </TabList>
              </Box>
              {/**************** Schedule *****************/}
              <TabPanel
                value="1"
                sx={{
                  padding: 2,
                  marginTop: 0,
                  paddingBottom: 0,
                }}
              >
                <ScheduleRepTour
                  handleScheduleStart={handleScheduleStart}
                  schedule={schedule}
                />
              </TabPanel>
              {/**************** Loading *****************/}
              <TabPanel
                value="2"
                sx={{
                  padding: 2,
                  marginTop: 0,
                  paddingBottom: 0,
                }}
              >
                {isNewLoadingSelected ? (
                  <TourLoadingAdd
                    setIsNewLoadingSelected={setIsNewLoadingSelected}
                    schedule={schedule}
                  />
                ) : isEditing && editLoadingId !== null ? (
                  <TourLoadingEdit
                    setIsEditing={setIsEditing}
                    editLoadingId={editLoadingId}
                    schedule={schedule}
                    distributorWarehouseUId={distributorWarehouseUId}
                    setTabValue={setValue}
                  />
                ) : isViewing && viewLoadingId !== null ? (
                  <TourLoadingView
                    setIsViewing={setIsViewing}
                    viewLoadingId={viewLoadingId}
                    schedule={schedule}
                    distributorWarehouseUId={distributorWarehouseUId}
                  />
                ) : (
                  <LoadingRepTour
                    params={params}
                    schedule={schedule}
                    setIsNewLoadingSelected={setIsNewLoadingSelected}
                    setIsEditing={setIsEditing}
                    setIsViewing={setIsViewing}
                    setEditLoadingId={setEditLoadingId}
                    setViewLoadingId={setViewLoadingId}
                    setDistributorWarehouseUId={setDistributorWarehouseUId}
                    setTabValue={setValue}
                    fetchTourScheduleID={fetchTourScheduleID}
                    isFullScreen={isFullScreen}
                  />
                )}
              </TabPanel>
              {/**************** Sale *****************/}
              <TabPanel
                value="3"
                sx={{
                  padding: 2,
                  marginTop: 0,
                  paddingBottom: 0,
                }}
              >
                <SaleRepTour schedule={schedule} />
              </TabPanel>
              {/**************** Unloading *****************/}
              <TabPanel
                value="4"
                sx={{
                  padding: 2,
                  marginTop: 0,
                  paddingBottom: 0,
                }}
              >
                <UnloadingRepTour
                  schedule={schedule}
                  setTabValue={setValue}
                  fetchTourScheduleID={fetchTourScheduleID}
                />
              </TabPanel>
              {/**************** Tour Submit *****************/}
              <TabPanel
                value="5"
                sx={{
                  padding: 2,
                  marginTop: 0,
                  paddingBottom: 0,
                }}
              >
                <TourSubmitRepTour schedule={schedule} />
              </TabPanel>
            </TabContext>
          )}
        </Box>
      </Container>
    </FsBox>
  );
};

export default RepTourTabsBackup;
