"use client";

import React, { useEffect, useRef, useState } from "react";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Business as BusinessIcon } from "@mui/icons-material";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getStockAdjustmentById } from "@/service/inventory/company-stock-adjustment.service";
import { useSelector } from "@/redux/store";
import FormProvider, { RHFTextField } from "@/components/hook-form";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { dataGridStockViewStyleMappers } from "@/styles/tableStyles/tableStyle";
import { SimpleStatusChip, Status } from "../components/statusChip";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { tooltipSlotProps } from "@/styles/tooltip/tooltipSlotProps";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import TotalTableRows from "../components/total-table";
import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";

const CSAdjustStockViewById = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const cs_adjustment = useSelector(
    (state) => state.companyStockAdjustmentSlice.CS_Adjustment
  );
  const [isLoading, setIsLoading] = useState(false);
  const [expand1, setExpand1] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const fetchStockAdjustmentById = async () => {
    try {
      setIsLoading(true);
      await getStockAdjustmentById(params.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    fetchStockAdjustmentById();
  }, []);

  const methods = useForm<any>({});

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const columns: GridColDef[] = [
    { field: "productID", headerName: "Product ID", width: 100 },
    { field: "productName", headerName: "Product Name", width: 120, flex: 1 },
    {
      field: "stockAvailable",
      headerName: "Available Stock",
      width: 90,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "mrp",
      headerName: "MRP",
      width: 100,
      headerAlign: "right",
      align: "right",
      renderCell: (params: any) => {
        const formattedValue = params.value.toFixed(2); // Format value to 2 decimal places
        return (
          <Tooltip title={formattedValue} arrow slotProps={tooltipSlotProps}>
            <span>{formattedValue}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "updateQuantity",
      headerName: "Stock Update",
      width: 100,
      headerAlign: "right",
      align: "right",
      renderCell: (params: any) => {
        const { updateQuantity } = params.row;
        let displayupdateQuantity = updateQuantity;
        let color = "";

        if (parseFloat(updateQuantity) < 0) {
          color = "red";
        } else {
          color = "green";
        }

        displayupdateQuantity = `${updateQuantity}`;

        return (
          <Tooltip
            title={displayupdateQuantity}
            arrow
            slotProps={tooltipSlotProps}
          >
            <span style={{ color }}>{displayupdateQuantity}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "volume",
      headerName: "Volume",
      width: 130,
      headerAlign: "right",
      align: "right",
      renderCell: (params: any) => {
        const { volume } = params.row;
        let displayVolume = volume;
        let color = "";

        if (parseFloat(volume) < 0) {
          color = "red";
        } else {
          color = "green";
        }

        displayVolume = `${formatVolume3Decimals(Number(volume))}`;

        return (
          <Tooltip title={displayVolume} arrow slotProps={tooltipSlotProps}>
            <span style={{ color }}>{displayVolume}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "baseUnitName",
      headerName: "UOM",
      maxWidth: 80,
      flex: 1,
      sortable: false,
    },
    {
      field: "value",
      headerName: "Value",
      width: 130,
      headerAlign: "right",
      align: "right",
      renderCell: (params: any) => {
        const { value } = params.row;
        let displayValue = value;
        let color = "";

        if (parseFloat(value) < 0) {
          color = "red";
        } else {
          color = "green";
        }

        displayValue = `${formatCurrency(Number(value))}`;

        return (
          <Tooltip title={displayValue} arrow slotProps={tooltipSlotProps}>
            <span style={{ color }}>{displayValue}</span>
          </Tooltip>
        );
      },
    },
  ];

  const stockAdjustmentHeader = cs_adjustment.stockAdjustmentHeader;
  const stockAdjustmentDetail = cs_adjustment.stockAdjustmentDetail;

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Company Stock Adjustment"
        pageNavigation={[
          {
            pageName: "Company Stock",
            path: PATH_DASHBOARD.companyStock.adjustmentView,
          },
          { pageName: "View" },
        ]}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        icon={<BusinessIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        {cs_adjustment && cs_adjustment.stockAdjustmentDetail ? (
          <FormProvider methods={methods}>
            <Accordion
              expanded={expand1}
              onChange={() => setExpand1(!expand1)}
              sx={{
                mb: 2,
                borderRadius: "9px",
                backgroundColor: "white",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  borderTopLeftRadius: "9px",
                  borderTopRightRadius: "9px",
                  borderBottomLeftRadius: expand1 ? "0px" : "9px",
                  borderBottomRightRadius: expand1 ? "0px" : "9px",
                  backgroundColor: "white",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: theme.palette.primary.main,
                    ml: 1,
                    flexGrow: 1,
                  }}
                >
                  Company Stock Adjustment Information
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <SimpleStatusChip
                    status={stockAdjustmentHeader.statusName as Status}
                  />
                </Box>
              </AccordionSummary>

              <AccordionDetails
                sx={{
                  backgroundColor: "white",
                  borderTopLeftRadius: expand1 ? "0px" : "9px",
                  borderTopRightRadius: expand1 ? "0px" : "9px",
                  borderBottomLeftRadius: "9px",
                  borderBottomRightRadius: "9px",
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Divider sx={{ borderColor: "#e8eaef", mt: 0.5, mb: 2 }} />
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid item xs={3}>
                      <RHFTextField
                        name="stockAdjustmentDate"
                        label="Date"
                        defaultValue={dayjs(
                          stockAdjustmentHeader?.stockAdjustmentDate
                        ).format("YYYY-MM-DD")}
                        focused
                        disabled
                      />{" "}
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="companyUId"
                        label="Company"
                        defaultValue={stockAdjustmentHeader.companyName}
                        focused
                        disabled
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="wareHouseUId"
                        label="Warehouse"
                        defaultValue={stockAdjustmentHeader.wareHouseName}
                        focused
                        disabled
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="priceListUId"
                        label="Price List"
                        defaultValue={stockAdjustmentHeader.priceListTypeName}
                        focused
                        disabled
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="batchID"
                        label="Batch ID"
                        defaultValue={stockAdjustmentHeader.batchID}
                        focused
                        disabled
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="refID"
                        label="Ref ID"
                        defaultValue={stockAdjustmentHeader.refID}
                        focused
                        disabled
                      />
                    </Grid>
                  </Grid>
                </Box>
              </AccordionDetails>
            </Accordion>

            <Card
              sx={{
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "column",
                minHeight: !expand1 ? "80vh" : "65vh",
              }}
            >
              <CardContent
                sx={{ display: "flex", flexDirection: "column", flex: 1 }}
              >
                <Box sx={{ width: "100%" }}>
                  {/* DataGrid with Flex Height */}
                  <Box sx={{ flex: 1, overflow: "hidden" }}>
                    <DataGrid
                      sx={{
                        ...dataGridStockViewStyleMappers,
                      }}
                      autoHeight
                      getRowId={(row) => row.stockAdjustmentDetailId}
                      rows={stockAdjustmentDetail}
                      columns={getColumnsWithTooltip(columns)}
                      loading={isLoading}
                      density="compact"
                      hideFooter
                      disableRowSelectionOnClick
                    />
                  </Box>

                  {/* Additional Components Below DataGrid */}
                  <Grid
                    container
                    justifyContent={"space-between"}
                    sx={{ mt: 2 }}
                  >
                    <Grid item xs={5} alignItems={"left"}>
                      <RHFTextField
                        name="createdRemark"
                        label="Remark"
                        defaultValue={stockAdjustmentHeader.createdRemark}
                        focused
                        disabled
                        multiline
                        minRows={3}
                      />
                    </Grid>
                    <Grid item xs={5} alignItems={"right"}>
                      <Box sx={{ width: "100%", borderRadius: 1 }}>
                        <TotalTableRows
                          stockAdjustmentDetail={stockAdjustmentDetail}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </FormProvider>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "70vh",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Container>
    </FsBox>
  );
};

export default CSAdjustStockViewById;
