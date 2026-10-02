"use client";

import React, { useEffect, useRef, useState } from "react";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { Box, CircularProgress, Tab, useTheme } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import PeopleIcon from "@mui/icons-material/People";
import { getTourScheduleById, updateTourSchedule } from "@/service/tour-service/tourSchedule.service";
import { enqueueSnackbar } from "notistack";
import { format } from "date-fns";
import { PATH_DASHBOARD } from "@/routes/paths";

import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import ScheduleRepTourEdit from "./editSchedule";

const RepTourTabs = ({ params }: { params: { id: number } }) => {
    const router = useRouter();
    const theme = useTheme();
    const ref = useRef<HTMLDivElement>(null);
    const [value, setValue] = useState("1");
    const [pageTitle, setPageTitle] = useState("Rep Route");
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const titles = {
        "1": "Schedule",
    };

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

    const updateTourScheduleReq = async (payload: any) => {
        try {
            const response = await updateTourSchedule(params.id, payload);
            enqueueSnackbar(response, { variant: "success" });
            router.push(PATH_DASHBOARD.salesTour.salesTour);
        } catch {
            enqueueSnackbar("Error creating tour schedule", { variant: "error" });
        }
    };

    const handleScheduleEdit = (data: any) => {
        updateTourScheduleReq(data);
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
                pageTitle="Sales Journey"
                pageNavigation={[
                    {
                        pageName: "Sales Journey",
                        path: PATH_DASHBOARD.salesTour.salesTour,
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
                            {isLoading ? (
                                <CircularProgress color="primary" sx={{ margin: "auto" }} />
                            ) : (
                                <ScheduleRepTourEdit handleScheduleEdit={handleScheduleEdit} />
                            )}
                        </TabPanel>
                    </TabContext>
                </Box>
            </Container>
        </FsBox>
    );
};

export default RepTourTabs;
