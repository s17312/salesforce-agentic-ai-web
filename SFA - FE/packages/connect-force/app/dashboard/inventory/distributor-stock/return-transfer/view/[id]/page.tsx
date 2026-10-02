"use client";

import FormProvider, { RHFTextField } from "@/components/hook-form";
import PopupResponse from "@/components/popup/popup-response";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getDistributorStockReturnTransferById } from "@/service/inventory/distributor-stock-return-transfer.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  dataGridStockStyleMappers,
  dataGridStockViewStyleMappers,
} from "@/styles/tableStyles/tableStyle";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { Business as BusinessIcon } from "@mui/icons-material";
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
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  SimpleStatusChip,
  Status,
} from "../../../adjustment-view/components/statusChip";
import dayjs from "dayjs";
import "../../components/StockReturnTransfer.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { tooltipSlotProps } from "@/styles/tooltip/tooltipSlotProps";
import TotalTableRows from "./components/total-table";
import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";

const DistributorStockReturnTransferView = ({
  params,
}: {
  params: { id: number };
}) => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [serverDownError, setServerDownError] = useState(false);
  const [rows, setRows] = useState([] as any[]);
  const [expand1, setExpand1] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const DS_ReturnTransfer = useSelector(
    (state) => state.distributorStockReturnTransferSlice.DS_ReturnTransfer
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);

  const distributorStockReturnHeader = DS_ReturnTransfer?.stockReturnHeader;
  const distributorStockReturnDetail = DS_ReturnTransfer?.stockReturnDetail;

  const methods = useForm<any>({});

  const totalStockUpdatePlus = rows.reduce((acc, row) => {
    const value = parseFloat(row.returnQuantity);
    return value > 0 ? acc + value : acc;
  }, 0);

  const totalVolumePlus = parseFloat(
    rows
      .reduce((acc, row) => {
        const value = parseFloat(row.volume);
        return value > 0 ? acc + value : acc;
      }, 0.0)
      .toFixed(2)
  );

  const totalValuePlus = parseFloat(
    rows
      .reduce((acc, row) => {
        return row.value > 0 ? acc + parseFloat(row.value) : acc;
      }, 0.0)
      .toFixed(2)
  );

  const summaryRow = {
    id: "",
    productID: "Total",
    productName: "",
    mrp: "",
    availableStock: "",
    rate: "",
    returnQuantity: totalStockUpdatePlus,
    volume: totalVolumePlus,
    uom: "",
    value: totalValuePlus,
    action: "",
  };

  const rowsWithSummary = [...rows, summaryRow];

  useEffect(() => {
    if (Array.isArray(distributorStockReturnDetail)) {
      const mappedProducts = distributorStockReturnDetail.map(
        (detail, index) => ({
          id: index + 1,
          uId: detail.productID,
          productID: detail.productID,
          stockReturnDetailId: detail.stockReturnDetailId,
          productName: detail.productName,
          availableStock: detail.stockAvailable,
          mrp: detail.mrp,
          returnQuantity: detail.returnQuantity,
          volume: detail.volume,
          value: detail.value,
        })
      );

      setRows(mappedProducts);
    }
  }, [
    distributorStockReturnHeader,
    DS_ReturnTransfer,
    distributorStockReturnDetail,
  ]);

  const { control } = methods;

  const fetchGetStockReturnTransferById = async () => {
    try {
      await getDistributorStockReturnTransferById(params.id);
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    }
  };

  useEffect(() => {
    fetchGetStockReturnTransferById();
  }, []);

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  const columns: GridColDef[] = [
    {
      field: "productID",
      headerName: "Product ID",
      width: 80,
      sortable: false,
      flex: 1,
    },
    {
      field: "productName",
      headerName: "Product Name",
      width: 120,
      flex: 1,
      sortable: false,
    },
    {
      field: "mrp",
      headerName: "MRP",
      width: 110,
      headerAlign: "right",
      align: "right",
      renderCell: (params: any) => {
        if (params.value === "") {
          return <span></span>;
        }
        const formattedValue = params.value.toFixed(2);
        return (
          <Tooltip arrow title={formattedValue} slotProps={tooltipSlotProps}>
            <span>{formattedValue}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "availableStock",
      headerName: "Available Stock",
      width: 150,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "returnQuantity",
      headerName: "Transfer Stock",
      width: 150,
      headerAlign: "right",
      align: "right",
      editable: true,
      type: "number",
      renderCell: (params: any) => {
        if (params.value === "") {
          return <span></span>;
        }
        const formattedValue = params.value;
        return (
          <Tooltip arrow title={formattedValue} slotProps={tooltipSlotProps}>
            <span>{formattedValue}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "value",
      headerName: "Value",
      width: 120,
      headerAlign: "right",
      align: "right",
      renderCell: (params: any) => {
        if (params.value === "") {
          return <span></span>;
        }
        const formattedValue = formatCurrency(params.value);
        return (
          <Tooltip arrow title={formattedValue} slotProps={tooltipSlotProps}>
            <span>{formattedValue}</span>
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
        if (params.value === "") {
          return <span></span>;
        }
        const formattedValue = formatVolume3Decimals(params.value);
        return (
          <Tooltip arrow title={formattedValue} slotProps={tooltipSlotProps}>
            <span>{formattedValue}</span>
          </Tooltip>
        );
      },
    },
  ];

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Distributor Stock Return Transfer View"
        pageNavigation={[
          {
            pageName: "Distributor Stock Return Transfer",
            path: PATH_DASHBOARD.distributorStock.stockReturnTransfer.list,
          },
          { pageName: "View" },
        ]}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<BusinessIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        {DS_ReturnTransfer && DS_ReturnTransfer.stockReturnDetail ? (
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
                  Distributor Stock Return Transfer Information
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <SimpleStatusChip
                    status={distributorStockReturnHeader?.statusName as Status}
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
                    <Grid item xs={4}>
                      <RHFTextField
                        name="stockReturnDate"
                        label="Date"
                        defaultValue={dayjs(
                          distributorStockReturnHeader?.stockReturnDate
                        ).format("YYYY-MM-DD")}
                        focused
                        disabled
                      />{" "}
                    </Grid>
                    <Grid item xs={4}>
                      <RHFTextField
                        name="distributorUId"
                        label="Distributor"
                        defaultValue={
                          distributorStockReturnHeader?.distributorName
                        }
                        focused
                        disabled
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <RHFTextField
                        name="wareHouseUId"
                        label="Warehouse"
                        defaultValue={
                          distributorStockReturnHeader?.wareHouseName
                        }
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
                  <Box sx={{ flex: 1, overflow: "hidden" }}>
                    <DataGrid
                      sx={{
                        ...dataGridStockViewStyleMappers,
                      }}
                      rows={rowsWithSummary}
                      columns={getColumnsWithTooltip(columns)}
                      density="compact"
                      getRowClassName={(params) =>
                        params.row.productID === "Total" ? "total-row" : ""
                      }
                      hideFooter
                      disableRowSelectionOnClick
                      disableColumnMenu
                    />
                  </Box>
                </Box>
                <Grid container justifyContent={"space-between"} sx={{ mt: 3 }}>
                  <Grid item xs={5} alignItems={"left"}></Grid>
                  <Grid item xs={5} alignItems={"right"}>
                    <Box sx={{ width: "100%", borderRadius: 1 }}>
                      <TotalTableRows
                        distributorStockReturnDetail={
                          distributorStockReturnDetail as any
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>
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
      {popupResponse && serverDownError && (
        <PopupResponse
          type={"error"}
          message={"Internal server error"}
          redirectBack={redirectBack}
        />
      )}
    </FsBox>
  );
};

export default DistributorStockReturnTransferView;
