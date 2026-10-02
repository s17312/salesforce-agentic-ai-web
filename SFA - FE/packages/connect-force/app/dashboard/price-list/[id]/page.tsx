'use client';

import React, { useCallback, useEffect, useRef, useState } from "react";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, useTheme } from "@mui/material";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';
import { PATH_DASHBOARD } from "@/routes/paths";
import { getPriceListById } from "@/service/priceList.service";
import { dispatch, useSelector } from "@/redux/store";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import PriceListEditForm from "../components/priceListEditPage";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { enqueueSnackbar } from "notistack";

const UpdatePriceList = ({ params }: { params: { id: number } }) => {

    const router = useRouter();
    const theme = useTheme();
    const ref = useRef<HTMLDivElement>(null);
    const priceList = useSelector((state) => state.priceListsSlice.priceList);
    const isLoading = useSelector((state) => state.priceListsSlice.isLoading);
    const [isFullScreen, setIsFullScreen] = useState(false);
    
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            await getPriceListById(params.id);
        } catch (error) {
            enqueueSnackbar(`Something went wrong`, { variant: "error" });
        }
    };

    const handleBreadcrumbNavigation = useCallback((path: string | undefined) => {
        if (path) {
            router.push(path);
        }
    }, [router]);

    const handleFullScreenClick = () => {
        toggleFullScreen();
        setIsFullScreen((prev) => !prev);
    };

    return (
        <FsBox ref={ref} isFullScreen={isFullScreen}>
            <BreadcrumbNavigation
                pageTitle="Price List Update"
                pageNavigation={[
                    { pageName: "Price List", path: PATH_DASHBOARD.priceList.list },
                    { pageName: "Update" },
                ]}
                onLinkClick={(path: any) => { handleBreadcrumbNavigation(path) }}
                onFullScreenClick={handleFullScreenClick}
                icon={<ListAltRoundedIcon sx={{ color: theme.palette.primary.main }} />}
            />
            {isLoading ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "170px",
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <Container>
                    <PriceListEditForm currentPriceList={priceList} />
                </Container>
            )}
        </FsBox>
    );
};

export default UpdatePriceList;