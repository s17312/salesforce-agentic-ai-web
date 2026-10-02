"use client";

import React, { useRef, useState } from "react";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { Box, Tab, useTheme } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import PeopleIcon from "@mui/icons-material/People";
import { enqueueSnackbar } from "notistack";
import { format } from "date-fns";
import { PATH_DASHBOARD } from "@/routes/paths";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { createTourSchedule } from "@/service/direct-sale/tourSchedule.service";
import ScheduleDirectSaleTourAdd from "./addSchedule";

const DirectSaleTourTabs = () => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("1");
  const [pageTitle, setPageTitle] = useState("Rep Route");
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const titles = {
    "1": "Schedule",
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setPageTitle(titles[newValue as keyof typeof titles]);
  };

  const createTourScheduleReq = async (payload: any) => {
    try {
      const response = await createTourSchedule(payload);
      enqueueSnackbar(response, { variant: "success" });
      router.push(PATH_DASHBOARD.directSaleTour.directSaleTour);
    } catch {
      enqueueSnackbar("Error creating tour schedule", { variant: "error" });
    }
  };

  const handleScheduleStart = (data: any) => {
    const payload = {
      scheduleDate: format(data.scheduleDate, "yyyy-MM-dd"),
      distributorUId: data.distributorUId,
      representativeUId: data.representativeUId,
      routeUIds: data.routeUIds,
      outletUId: data.outletUId,
      statusUId: 1,
      invoiceTypeUId: 4,
    };
    createTourScheduleReq(payload);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Direct Sale"
        pageNavigation={[
          {
            pageName: "Direct Sale",
            path: PATH_DASHBOARD.directSaleTour.directSaleTour,
          },
          { pageName: "Add" },
        ]}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<PeopleIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChange} aria-label="Product Mapper Tabs">
                <Tab label="Schedule" value="1" />
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
              <ScheduleDirectSaleTourAdd handleScheduleStart={handleScheduleStart} />
            </TabPanel>
          </TabContext>
        </Box>
      </Container>
    </FsBox>
  );
};

export default DirectSaleTourTabs;
