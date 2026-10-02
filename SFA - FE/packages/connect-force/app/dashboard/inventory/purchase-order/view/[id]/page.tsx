"use client";

import FormProvider, { RHFTextField } from "@/components/hook-form";
import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getTempPurchaseOrder } from "@/service/inventory/purchaseOrder.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
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
  Typography,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { PO_StatusChip } from "../components/statusChip";
import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";
import POCreateReportTable from "./components/poCreateReportTable";
import { usePOCreateReportGenerate } from "./report/reportService";
import POCreateReportDialog from "./components/poCreateReportDialog";

const POCreationview = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const po_PurchaseOrder = useSelector(
    (state) => state.purchaseOrderSlice.PO_PurchaseOrder
  );
  const [isLoading, setIsLoading] = useState(false);
  const [expand1, setExpand1] = useState(true);

  const methods = useForm<any>({});
  const {
    formState: { errors },
  } = methods;
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const fetchGetPO = async () => {
    try {
      setIsLoading(true);
      await getTempPurchaseOrder(params.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGetPO();
  }, []);

  const purchaseOrderHeader = po_PurchaseOrder.poHeader;
  const purchaseOrderDetails = po_PurchaseOrder.poDetail;

  const purchaseOrderDetailsWithId = (() => {
    const details =
      po_PurchaseOrder.poDetail?.map((item: any) => ({
        id: `ID${item.productUId}${item.mrp}${item.rate}`,
        productID: item.productID,
        productName: item.productName,
        mrp: item.mrp,
        rate: item.rate,
        requestQuantity: item.requestQuantity,
        volume: item.volume,
        value: item.value,
      })) || [];

    // Calculate totals
    const totals = details.reduce(
      (acc: any, item: any) => {
        acc.requestQuantity += item.requestQuantity || 0;
        acc.volume += item.volume || 0;
        acc.value += item.value || 0;
        return acc;
      },
      { requestQuantity: 0, volume: 0, value: 0 }
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
        volume: totals.volume,
        value: totals.value,
      });
    }

    return details;
  })();

  // Calculate totals
  const totalStockUpdate = purchaseOrderDetails?.reduce(
    (acc: any, row: any) => acc + parseFloat(row.requestQuantity),
    0
  );
  const totalVolume = purchaseOrderDetails?.reduce(
    (acc: any, row: any) => acc + parseFloat(row.volume),
    0
  );
  const formattedVolume = Number(totalVolume?.toFixed(3));
  const totalValue = purchaseOrderDetails?.reduce(
    (acc: any, row: any) => acc + row.value,
    0
  );

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const { poCreateReportInfo, fileName, open, setOpen, handleClose } =
    usePOCreateReportGenerate(
      purchaseOrderHeader?.poNo,
      purchaseOrderHeader?.companyName,
      purchaseOrderHeader?.distributorName,
      purchaseOrderHeader?.poDate,
      purchaseOrderHeader?.deliveryDate,
      purchaseOrderHeader?.priceListTypeName,
      purchaseOrderHeader?.name,
      purchaseOrderHeader?.deliveryMethodName
    );

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Purchase Order View"
        pageNavigation={[
          {
            pageName: "Purchase Orders",
            path: PATH_DASHBOARD.purchaseOrder.creation.view,
          },
          { pageName: "View" },
        ]}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        icon={<ReceiptIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        {po_PurchaseOrder && po_PurchaseOrder.poDetail ? (
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
                  <PO_StatusChip status={purchaseOrderHeader.statusId} />
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
                        defaultValue={purchaseOrderHeader.poNo}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="companyName"
                        label="Company"
                        disabled
                        defaultValue={purchaseOrderHeader.companyName}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="distributorName"
                        label="Distributor"
                        disabled
                        defaultValue={purchaseOrderHeader.distributorName}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="poDate"
                        label="PO Date"
                        disabled
                        defaultValue={dayjs(purchaseOrderHeader.poDate).format(
                          "DD/MM/YYYY"
                        )}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="deliveryDate"
                        label="Delivery Date"
                        disabled
                        defaultValue={dayjs(
                          purchaseOrderHeader.deliveryDate
                        ).format("DD/MM/YYYY")}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="priceListTypeName"
                        label="Price List"
                        disabled
                        defaultValue={purchaseOrderHeader.priceListTypeName}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="name"
                        label="Payment Term"
                        disabled
                        defaultValue={purchaseOrderHeader.name}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <RHFTextField
                        name="deliveryMethodName"
                        label="Delivery Method"
                        disabled
                        defaultValue={purchaseOrderHeader.deliveryMethodName}
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
                  <POCreateReportTable
                    rowsWithTotal={purchaseOrderDetailsWithId}
                    isLoading={isLoading}
                    fileName={fileName}
                    setOpen={setOpen}
                    poCreateReportInfo={poCreateReportInfo}
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

                  <Grid
                    container
                    alignContent={"center"}
                    justifyContent={"space-between"}
                  >
                    <Grid item xs={5} sx={{ mr: 2 }}>
                      <RHFTextField
                        name="remark"
                        label="PO Creation Remark"
                        disabled
                        defaultValue={purchaseOrderHeader.remark}
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
      <POCreateReportDialog
        open={open}
        handleClose={handleClose}
        rowsWithTotal={purchaseOrderDetailsWithId}
        poCreateReportInfo={poCreateReportInfo}
        fileName={fileName}
        reportName="PO Create Report"
      />
    </FsBox>
  );
};

export default POCreationview;
