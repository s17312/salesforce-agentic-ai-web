"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Typography, useTheme } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useSelector } from "@/redux/store";
import { getTourLoadingById } from "@/service/tour-service/tourLoading.service";
import { Box, Button, CircularProgress } from "@mui/material";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { enqueueSnackbar } from "notistack";
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';

interface LoadingViewProps {
    setIsViewing: (value: boolean) => void;
    viewLoadingId: number;
    schedule: any;
    distributorWarehouseUId: number;
}

const TourLoadingView: React.FC<LoadingViewProps> = ({
    setIsViewing,
    viewLoadingId,
    schedule,
    distributorWarehouseUId,
}) => {
    const theme = useTheme();
    const [rows, setRows] = useState([] as any[]);
    const [loading, setLoading] = useState(false);

    const TourLoadingByIdDetail = useSelector(
        (state) => state.tourScheduleSlice.TourLoadingById
    );

    useEffect(() => {
        fetchLoadingById();
    }, [viewLoadingId]);

    useEffect(() => {
        setLoadDetails();
    }, [TourLoadingByIdDetail]);

    const fetchLoadingById = async () => {
        setLoading(true);
        try {
            await getTourLoadingById(viewLoadingId);
        } catch (error) {
            enqueueSnackbar("Error fetching loading details", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const setLoadDetails = () => {
        if (
            TourLoadingByIdDetail &&
            Array.isArray(TourLoadingByIdDetail.loadingDetails)
        ) {
            const formattedRows = TourLoadingByIdDetail.loadingDetails.map(
                (detail: any, index: number) => ({
                    id: index + 1,
                    productId: detail.productID,
                    product: detail.productName,
                    productCategory: detail.categoryName,
                    productGroup: detail.productGroupName,
                    mrp: detail.mrp,
                    quantity: detail.availableQuantity,
                    loadingQty: detail.loadingQuantity,
                })
            );
            setRows(formattedRows);
        }
    };

    const handleBack = () => {
        setIsViewing(false);
    };

    const columns: GridColDef[] = [
        { field: "productId", headerName: "ID", minWidth: 120, flex: 1 },
        { field: "product", headerName: "Product", minWidth: 300, flex: 1 },
        {
            field: "productCategory",
            headerName: "Product Category",
            minWidth: 200,
            flex: 1,
        },
        {
            field: "productGroup",
            headerName: "Product Group",
            minWidth: 150,
            flex: 1,
        },
        {
            field: "mrp",
            headerName: "MRP",
            align: "right",
            headerAlign: "right",
            minWidth: 100,
            flex: 1,
        },
        {
            field: "quantity",
            headerName: "Available Qty",
            align: "right",
            headerAlign: "right",
            minWidth: 100,
            flex: 1,
        },
        {
            field: "loadingQty",
            headerName: "Loading Qty",
            align: "right",
            headerAlign: "right",
            minWidth: 100,
            flex: 1,
        },
    ];

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{ mb: 2, color: theme.palette.primary.main }}
                >
                    Loading ID:{" "}
                    {TourLoadingByIdDetail?.loadingHeader?.loadingId}
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleBack}
                    sx={{ marginRight: "10px" }}
                    startIcon={<ArrowBackIosRoundedIcon />}
                >
                    Back
                </Button>
            </Box>

            {loading ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "400px",
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <DataGrid
                    sx={{ height: "55vh" }}
                    rows={rows}
                    columns={columns}
                    density="compact"
                    disableRowSelectionOnClick
                    disableColumnMenu
                />
            )}
        </>
    );
};

export default TourLoadingView;
