"use client";

import FormProvider, { RHFTextField } from "@/components/hook-form";
import { resetWSTDetail } from "@/redux/slices/warehouse-stock-transfer-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getWarehouseStockTransferById } from "@/service/warehouseStockTransfer.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStockViewStyleMappers } from "@/styles/tableStyles/tableStyle";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Business as BusinessIcon } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { SimpleStatusChip, Status } from "../../components/view/statusChip";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { tooltipSlotProps } from "@/styles/tooltip/tooltipSlotProps";
import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";

const WSTViewById = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const wst_detail = useSelector(
    (state) => state.warehouseStockTransferSlice.WST_Detail
  );
  const [expand1, setExpand1] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };
  const fetchWSTDetailById = async () => {
    try {
      setIsLoading(true);
      await getWarehouseStockTransferById(params.id);
    } catch (error) {
      console.error("Error while fetching WST detail by id", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWSTDetailById();

    return () => {
      dispatch(resetWSTDetail());
    };
  }, [params.id, dispatch]);

  const methods = useForm<any>({});

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const columns: GridColDef[] = [
    { field: "productID", headerName: "Product ID", width: 150 },
    { field: "productName", headerName: "Product Name", width: 150, flex: 1 },
    {
      field: "stockAvailable",
      headerName: "Available Stock",
      width: 150,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "mrp",
      headerName: "MRP",
      width: 110,
      headerAlign: "right",
      align: "right",
      renderCell: (params: any) => {
        const formattedValue = params.value.toFixed(2);
        return (
          <Tooltip title={formattedValue} arrow slotProps={tooltipSlotProps}>
            <span>{formattedValue}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "transferQuantity",
      headerName: "Stock Update",
      width: 150,
      headerAlign: "right",
      align: "right",
      renderCell: (params: any) => {
        const { transferQuantity } = params.row;
        let displayupdateQuantity = transferQuantity;
        let color = "";

        if (parseFloat(transferQuantity) < 0) {
          color = "red";
        } else {
          color = "green";
        }

        displayupdateQuantity = `${transferQuantity}`;
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
      width: 150,
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

        displayVolume = `${formatVolume3Decimals(volume)}`;
        return (
          <Tooltip title={displayVolume} arrow slotProps={tooltipSlotProps}>
            <span style={{ color }}>{displayVolume}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "value",
      headerName: "Value",
      width: 150,
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

        displayValue = `${formatCurrency(value)}`;
        return (
          <Tooltip title={displayValue} arrow slotProps={tooltipSlotProps}>
            <span style={{ color }}>{displayValue}</span>
          </Tooltip>
        );
      },
    },
  ];

  const wstDetailHeader = wst_detail?.warehouseStockTransferHeader;
  const wstDetail = wst_detail?.warehouseStockTransferDetails;

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Distributor Warehouse Stock Transfer View"
        pageNavigation={[
          {
            pageName: "Distributor Warehouse Stock Transfer",
            path: PATH_DASHBOARD.distributorStock
              .distributorWarehouseStockTransfer.list,
          },
          { pageName: "View" },
        ]}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path: any) => handleBreadcrumbNavigation(path)}
        icon={<BusinessIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        {wst_detail && wst_detail.warehouseStockTransferDetails ? (
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
                  Distributor Warehouse Stock Transfer Information
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <SimpleStatusChip
                    status={wstDetailHeader?.status as Status}
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
                        name="stockTransferDate"
                        label="Stock Transfer Date"
                        defaultValue={dayjs(
                          wstDetailHeader?.stockTransferDate ?? ""
                        ).format("YYYY-MM-DD")}
                        focused
                        disabled
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="stockTransferId"
                        label="Stock Transfer ID"
                        defaultValue={wstDetailHeader?.stockTransferId ?? ""}
                        focused
                        disabled
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    mt={2}
                  >
                    <Grid item xs={3}>
                      <RHFTextField
                        name="distributorName"
                        label="Distributor"
                        defaultValue={wstDetailHeader?.distributorName ?? ""}
                        focused
                        disabled
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="fromWarehouseName"
                        label="From Warehouse"
                        defaultValue={wstDetailHeader?.fromWarehouseName ?? ""}
                        focused
                        disabled
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="recivingWarehouseName"
                        label="Receiving Warehouse"
                        defaultValue={
                          wstDetailHeader?.recivingWarehouseName ?? ""
                        }
                        focused
                        disabled
                      />
                    </Grid>
                  </Grid>
                </Box>
              </AccordionDetails>
            </Accordion>

            <Card sx={{ backgroundColor: "#fff" }}>
              <CardContent>
                <Box sx={{ width: "100%" }}>
                  <DataGrid
                    sx={{
                      ...dataGridStockViewStyleMappers,
                      height: !expand1 ? "50vh" : "28vh",
                    }}
                    getRowId={(row) => `${row.productUId}-${row.mrp}`}
                    rows={wstDetail || []}
                    columns={getColumnsWithTooltip(columns)}
                    loading={isLoading}
                    density="compact"
                    hideFooter
                    disableRowSelectionOnClick
                  />
                  <Grid
                    container
                    justifyContent={"flex-end"}
                    alignItems={"center"}
                    sx={{ mt: 5 }}
                  >
                    <Grid item xs={2.5}>
                      <Box sx={{ width: "100%", borderRadius: 1 }}>
                        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                          <Table size="small">
                            <TableHead>
                              <TableCell align="center">
                                <Typography fontSize={13} color="textSecondary">
                                  <strong>Total Volume</strong>
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography fontSize={13} color="textSecondary">
                                  <strong>Total Value</strong>
                                </Typography>
                              </TableCell>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell align="center">
                                  <Chip
                                    label={`+${formatVolume3Decimals(wstDetailHeader?.totalVolume)}`}
                                    size="small"
                                    variant="soft"
                                    color="success"
                                    sx={{ borderRadius: 1 }}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <Chip
                                    label={`+${formatCurrency(wstDetailHeader?.totalValue)}`}
                                    size="small"
                                    variant="soft"
                                    color="success"
                                    sx={{ borderRadius: 1 }}
                                  />
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
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

export default WSTViewById;
