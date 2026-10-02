"use client";

import FormProvider, { RHFTextField } from "@/components/hook-form";
import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getApprovePurchaseOrder } from "@/service/inventory/purchaseOrder.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStockViewStyleMappers } from "@/styles/tableStyles/tableStyle";
import { tooltipSlotProps } from "@/styles/tooltip/tooltipSlotProps";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReceiptIcon from "@mui/icons-material/Receipt";
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
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { PO_StatusChip } from "../../../purchase-order/view/components/statusChip";
import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";
import { usePOApproveReportGenerate } from "./report/reportService";
import POApproveReportTable from "./components/poApproveReportTable";
import POApproveReportDialog from "./components/poApproveReportDialog";

const PurchaseOrderApprovalViewID = ({
  params,
}: {
  params: { id: number };
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const warehouseId = searchParams.get("warehouseId") || "0";
  const priceListTypeUId = searchParams.get("priceListTypeUId") || "0";

  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const po_PurchaseOrder = useSelector(
    (state) => state.purchaseOrderSlice.PO_approve
  );
  const [isLoading, setIsLoading] = useState(false);
  const [expand1, setExpand1] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const methods = useForm<any>({});
  const {
    control,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  const fetchGetPO = async () => {
    try {
      setIsLoading(true);
      if (warehouseId) {
        await getApprovePurchaseOrder(
          params.id,
          Number(warehouseId),
          Number(priceListTypeUId)
        );
      } else {
        await getApprovePurchaseOrder(params.id, 0, 0);
      }
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
    fetchGetPO();
  }, []);

  let poHeader = po_PurchaseOrder?.poHeader;
  let poDetail = po_PurchaseOrder?.poDetail;

  const purchaseOrderDetailsWithId = (() => {
    const details =
      po_PurchaseOrder.poDetail?.map((item: any) => ({
        id: `ID${item.productUId}${item.mrp}${item.rate}`,
        productID: item.productID,
        productName: item.productName,
        mrp: item.mrp,
        rate: item.rate,
        requestQuantity: item.requestQuantity,
        approvedQuantity: item.approvedQuantity,
        volume: item.volume,
        value: item.value,
      })) || [];

    // Calculate totals
    const totals = details.reduce(
      (acc: any, item: any) => {
        acc.requestQuantity += item.requestQuantity || 0;
        acc.approvedQuantity += item.approvedQuantity || 0;
        acc.volume += item.volume || 0;
        acc.value += item.value || 0;
        return acc;
      },
      { requestQuantity: 0, approvedQuantity: 0, volume: 0, value: 0 }
    );

    // Add totals row
    if (details.length > 0) {
      details.push({
        id: "Total-row",
        productID: "Total",
        productName: "",
        mrp: "",
        rate: "",
        requestQuantity: totals.requestQuantity,
        approvedQuantity: totals.approvedQuantity,
        volume: totals.volume,
        value: totals.value,
      });
    }

    return details;
  })();

  // Calculate totals
  const totalStockUpdate = poDetail?.reduce(
    (acc: any, row: any) => acc + parseFloat(row.requestQuantity),
    0
  );
  const totalVolume = poDetail?.reduce(
    (acc: any, row: any) => acc + parseFloat(row.volume),
    0
  );
  const formattedVolume = Number(totalVolume?.toFixed(3));
  const totalValue = poDetail?.reduce(
    (acc: any, row: any) => acc + row.value,
    0
  );

  const { poApproveReportInfo, fileName, open, setOpen, handleClose } =
    usePOApproveReportGenerate(
      poHeader?.poNo,
      poHeader?.companyName,
      poHeader?.distributorName,
      poHeader?.poDate,
      poHeader?.deliveryDate,
      poHeader?.priceListTypeName,
      poHeader?.name,
      poHeader?.deliveryMethodName
    );

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Purchase Orders Approval View"
        pageNavigation={[
          {
            pageName: "Purchase Orders Approval",
            path: PATH_DASHBOARD.purchaseOrder.approve.view,
          },
          { pageName: "View" },
        ]}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<ReceiptIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        {poHeader ? (
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
                  Purchase Order Approval Information
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <PO_StatusChip status={poHeader.statusId} />
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
                        name="poNo"
                        label="PO No"
                        disabled
                        defaultValue={poHeader?.poNo}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="companyUId"
                        label="Company"
                        disabled
                        defaultValue={poHeader?.companyName}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="distributorUId"
                        label="Distributor"
                        disabled
                        defaultValue={poHeader?.distributorName}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="poDate"
                        label="PO Date"
                        disabled
                        defaultValue={dayjs(poHeader?.poDate).format(
                          "DD/MM/YYYY"
                        )}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="deliveryDate"
                        label="Delivery Date"
                        disabled
                        defaultValue={dayjs(poHeader?.deliveryDate).format(
                          "DD/MM/YYYY"
                        )}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="priceListUId"
                        label="Distributor Price List"
                        disabled
                        defaultValue={poHeader?.priceListTypeName}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="paymentTermUId"
                        label="Payment Term"
                        disabled
                        defaultValue={poHeader?.name}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="deliveryMethodUId"
                        label="Delivery Method"
                        disabled
                        defaultValue={poHeader?.deliveryMethodName}
                      />
                    </Grid>
                    <Grid item xs={3}></Grid>
                  </Grid>
                </Box>
              </AccordionDetails>
            </Accordion>

            <Card sx={{ backgroundColor: "#fff" }}>
              <CardContent>
                <Box sx={{ width: "100%" }}>
                  <POApproveReportTable
                    rowsWithTotal={purchaseOrderDetailsWithId}
                    isLoading={isLoading}
                    fileName={fileName}
                    setOpen={setOpen}
                    poApproveReportInfo={poApproveReportInfo}
                    expand={expand1}
                  />
                  <Box
                    display="flex"
                    gap={2}
                    alignItems="center"
                    justifyContent="flex-end"
                    sx={{
                      backgroundColor: "#f1f1f1",
                      padding: 1,
                      mt: 2,
                      mb: 2,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body1" color="textSecondary">
                      Total Requested Qty:{" "}
                      <Chip
                        label={totalStockUpdate}
                        sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }}
                      />
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Total Volume:{" "}
                      <Chip
                        label={formatVolume3Decimals(formattedVolume)}
                        sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }}
                      />
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Total Value:{" "}
                      <Chip
                        label={formatCurrency(totalValue)}
                        sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }}
                      />
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} sx={{ mr: 2 }}>
                      <RHFTextField
                        name="remark"
                        label="PO Creation Remark"
                        disabled
                        defaultValue={poHeader?.remark}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ mr: 2 }}>
                      <RHFTextField
                        name="approveRemark"
                        label="PO Approval Remark"
                        disabled
                        defaultValue={poHeader?.approveRemark}
                        fullWidth
                      />
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
      <POApproveReportDialog
        open={open}
        handleClose={handleClose}
        rowsWithTotal={purchaseOrderDetailsWithId}
        poApproveReportInfo={poApproveReportInfo}
        fileName={fileName}
        reportName="PO Approve Report"
      />
    </FsBox>
  );
};

export default PurchaseOrderApprovalViewID;
