"use client";

import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getTourScheduleById, updateTourSchedule } from "@/service/direct-sale/tourSchedule.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Box, Tab, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import PeopleIcon from "@mui/icons-material/People";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { disabledTourTabViewStyles } from "@/styles/tabViewStyles/tourTabViewStyles";
import ScheduleDirectSaleTour from "../schedule/schedule";
import SaleRepTour from "../sale/page";

const DirectSaleTourTabsBackup = ({ params }: { params: { id: number } }) => {
    const router = useRouter();
    const theme = useTheme();
    const ref = useRef<HTMLDivElement>(null);
    const [value, setValue] = useState("1");
    const [pageTitle, setPageTitle] = useState("Rep Route");
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [distributorWarehouseUId, setDistributorWarehouseUId] =
        useState<any>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const schedule = useSelector((state) => state.tourScheduleDirectSlice.TourScheduleById);

    let isSaleTabDisabled = schedule.statusUId == 1 || schedule.statusUId == 2;

    const titles = {
        "1": "Schedule",
        "3": "Sale"
    };

    useEffect(() => {
        switch (schedule.statusUId) {
            case 1:
                setValue("1");
                break;
            case 3:
                setValue("3");
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
            setValue("3");
            enqueueSnackbar("Schedule activated successfully", {
                variant: "success",
            });
            fetchTourScheduleID();
        } catch {
        }
    };

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
            outletUId: data.outletUId,
            statusUId: 3,
            invoiceTypeUId: 4,
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
                pageTitle="Direct Sale"
                pageNavigation={[
                    {
                        pageName: "Direct Sale",
                        path: PATH_DASHBOARD.directSaleTour.directSaleTour,
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
                                    <Tab label="Sale" value="3" disabled={isSaleTabDisabled} sx={disabledTourTabViewStyles} />
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
                                <ScheduleDirectSaleTour
                                    handleScheduleStart={handleScheduleStart}
                                    schedule={schedule}
                                />
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

                        </TabContext>
                    )}
                </Box>
            </Container>
        </FsBox>
    );
}

export default DirectSaleTourTabsBackup;