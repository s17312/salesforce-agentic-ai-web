"use client";

import FormProvider, { RHFTextField } from "@/components/hook-form";
import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getGRN } from "@/service/inventory/grn.service";
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
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { PO_StatusChip } from "../../../purchase-order/view/components/statusChip";
import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";
import { useGRNReportGenerate } from "./report/reportService";
import GRNReportTable from "./components/grnReportTable";
import GRNReportDialog from "./components/grnReportDialog";

const GrnView = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const GRNList = useSelector((state) => state.purchaseOrderSlice.GRN);
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

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    getGRN(params.id);
  }, []);

  let grnFullHeader = GRNList?.grnFullHeader;
  let grnFullDetails = GRNList?.grnFullDetails;

  const grnDetailsWithId = (() => {
    const details =
      GRNList.grnFullDetails?.map((item: any) => ({
        id: `ID${item.productUId}${item.mrp}${item.rate}`,
        productID: item.productID,
        productName: item.productName,
        mrp: item.mrp,
        rate: item.rate,
        requestQuantity: item.requestQuantity,
        approvedQuantity: item.approvedQuantity,
        acceptedQuantity: item.acceptedQuantity,
        volume: item.volume,
        value: item.value,
      })) || [];

    // Calculate totals
    const totals = details.reduce(
      (acc: any, item: any) => {
        acc.requestQuantity += item.requestQuantity || 0;
        acc.approvedQuantity += item.approvedQuantity || 0;
        acc.acceptedQuantity += item.acceptedQuantity || 0;
        acc.volume += item.volume || 0;
        acc.value += item.value || 0;
        return acc;
      },
      { requestQuantity: 0, approvedQuantity: 0, acceptedQuantity: 0, volume: 0, value: 0 }
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
        acceptedQuantity: totals.acceptedQuantity,
        volume: totals.volume,
        value: totals.value,
      });
    }

    return details;
  })();

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const { grnReportInfo, fileName, open, setOpen, handleClose } =
    useGRNReportGenerate(
      grnFullHeader?.poNo,
      grnFullHeader?.grnid,
      grnFullHeader?.companyName,
      grnFullHeader?.distributorName,
      grnFullHeader?.poDate,
      grnFullHeader?.deliveryDate,
      grnFullHeader?.name,
      grnFullHeader?.deliveryMethodName
    );

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Goods Received Note"
        pageNavigation={[
          {
            pageName: "Goods Received Note",
            path: PATH_DASHBOARD.purchaseOrder.grn.view,
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
        {GRNList && GRNList.grnFullDetails ? (
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
                  Purchase Order Information
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <PO_StatusChip status={grnFullHeader.statusId} />
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
                        defaultValue={grnFullHeader.poNo}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="grnid"
                        label="GRN ID"
                        disabled
                        defaultValue={grnFullHeader.grnid}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="companyUId"
                        label="Company"
                        disabled
                        defaultValue={grnFullHeader.companyName}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="distributorUId"
                        label="Distributor"
                        disabled
                        defaultValue={grnFullHeader.distributorName}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="poDate"
                        label="PO Date"
                        disabled
                        defaultValue={dayjs(grnFullHeader.poDate).format(
                          "DD/MM/YYYY"
                        )}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="deliveryDate"
                        label="Delivery Date"
                        disabled
                        defaultValue={dayjs(grnFullHeader.deliveryDate).format(
                          "DD/MM/YYYY"
                        )}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="paymentTermUId"
                        label="Payment Term"
                        disabled
                        defaultValue={grnFullHeader.name}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="deliveryMethodUId"
                        label="Delivery Method"
                        disabled
                        defaultValue={grnFullHeader.deliveryMethodName}
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
                  <GRNReportTable
                    rowsWithTotal={grnDetailsWithId}
                    isLoading={isLoading}
                    fileName={fileName}
                    setOpen={setOpen}
                    grnReportInfo={grnReportInfo}
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
                        label={grnFullHeader.totalQuantity}
                        sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }}
                      />
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Total Volume:{" "}
                      <Chip
                        label={formatVolume3Decimals(grnFullHeader.totalVolume)}
                        sx={{ backgroundColor: "#e0e0e0", borderRadius: 1 }}
                      />
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Total Value:{" "}
                      <Chip
                        label={formatCurrency(grnFullHeader.totalValue)}
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
                        defaultValue={grnFullHeader.remark}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ mr: 2 }}>
                      <RHFTextField
                        name="approveRemark"
                        label="PO Approval Remark"
                        disabled
                        defaultValue={grnFullHeader.approveRemark}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ mr: 2 }}>
                      <RHFTextField
                        name="grnRemark"
                        label="GRN Remark"
                        disabled
                        defaultValue={grnFullHeader.grnRemark}
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
      <GRNReportDialog
        open={open}
        handleClose={handleClose}
        rowsWithTotal={grnDetailsWithId}
        grnReportInfo={grnReportInfo}
        fileName={fileName}
        reportName="GRN Report"
      />
    </FsBox>
  );
};

export default GrnView;
