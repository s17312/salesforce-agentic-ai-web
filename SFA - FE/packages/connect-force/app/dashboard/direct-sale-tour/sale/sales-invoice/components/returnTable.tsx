import FormProvider, {
  RHFAutocompleteField,
  RHFTextField,
} from "@/components/hook-form";
import { useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { createReturnInvoice, getAllReturnReasons, getReturnInvoiceDetails, getReturnInvoiceDetailsByReturnId, getReturnProducts, updateReturnInvoice } from "@/service/direct-sale/return.service";
import { dataGridStockStyleMappers } from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { formatCurrency, parseCurruncyToNumber } from "@/utils/formatCurrency";
import { mapListToOptions } from "@/utils/sortUtils";
import { DeleteOutline as DeleteOutlineIcon } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter, useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

interface ReturnTableProps {
  distributorID: number;
  invoiceIDOrLostCallID?: string | null;
  isReturnOnly?: boolean;
  invoiceDate?: Date | undefined;
}

interface IReturnItem {
  id: number,
  uid: number,
  productCode: String,
  product: String,
  mrp: String,
  rate: String,
  quantity: number,
  returnValue: String,
  returnReason: String,
  returnReasonUId: number
}

const ReturnTable: React.FC<ReturnTableProps> = ({
  distributorID,
  invoiceIDOrLostCallID,
  isReturnOnly = false,
  invoiceDate,
}) => {
  const router = useRouter();
  const [rows, setRows] = useState([] as any[]);
  const [selectedProductDetails, setSelectedProductDetails] = useState<
    any | null
  >(null);
  const [isPriceListSelected, setIsPriceListSelected] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const priceListTypes = useSelector(
    (state) => state.tourDirectSalesInvoiceSlice.SalesInvoicePriceListType
  );
  const returnReasonList = useSelector(
    (state) => state.tourDirectSalesReturnSlice.ReturnReasons
  );
  const returnProductsList = useSelector(
    (state) => state.tourDirectSalesReturnSlice.ReturnProducts
  );
  const tourSaleData = useSelector(
    (state) => state.tourDirectSalesInvoiceSlice.TourScheduleById_invoice
  );
  const existingSalesInvoice = useSelector(
    (state) => state.tourDirectSalesInvoiceSlice.SalesInvoiceByID
  );
  const returnByInvoiceId = useSelector(
    (state) => state.tourDirectSalesReturnSlice.ReturnByInvoiceId
  );

  const searchParams = useSearchParams();
  const scheduleId = Number(searchParams.get("scheduleId"));
  const outletID = Number(searchParams.get("outletID"));
  const saleStatus = Number(searchParams.get("saleStatus"));
  const saleViewUId = Number(searchParams.get("saleViewUId"));

  const methods = useForm<any>({
    mode: "all",
  });

  const { control, setValue, getValues } = methods;

  useWatch({
    control,
    name: ["priceList", "productUId", "quantity"],
  });

  const productID = getValues("productUId");
  const priceListID = getValues("priceList");

  // Function to get productUId  from
  const getProductUId = (productUIdString: string): number => {
    return Number(productUIdString?.split("-")[0]);
  };

  // Function to get mrp from productUId
  const getProductMRP = (productUIdString: string): number => {
    return Number(productUIdString?.split("-")[1]);
  };

  useEffect(() => {
    fetchReturnReasons();
    fetchGetReturnInvoiceDetails();
  }, []);

  useEffect(() => {
    if (priceListID) {
      fetchGetReturnProducts();
    }
  }, [priceListID]);

  useEffect(() => {
    if (Array.isArray(returnProductsList)) {
      const selectedProduct = returnProductsList.find(
        (product) =>
          product.productUId === getProductUId(productID) &&
          product.mrp === getProductMRP(productID)
      );

      setSelectedProductDetails(selectedProduct);
    } else {
      setSelectedProductDetails(null);
    }
  }, [productID]);

  useEffect(() => {
    if (returnByInvoiceId?.saleInvoiceReturnDetails?.length > 0) {
      const returnProducts = returnByInvoiceId.saleInvoiceReturnDetails.map(
        (item: any, index: number) => ({
          id: index + 1,
          uid: item.productUId,
          productCode: item.productId,
          product: item.productName,
          mrp: item.mrp.toFixed(2),
          rate: formatCurrency(item.rate),
          quantity: item.quantity,
          returnValue: formatCurrency(item.returnValue),
          returnReason: item.returnReasonName,
          returnReasonUId: item.returnReasonUId,
        })
      );
      setRows(returnProducts);
    }
    if (returnByInvoiceId.saleInvoiceReturnHeader?.status === 2) {
      setIsSubmitted(true);
    }
  }, [returnByInvoiceId]);

  // Calculate totals for Quantity and Return Value
  const totalQuantity = rows.reduce((acc, row) => acc + Number(row.quantity), 0);
  const totalReturnValue = rows.reduce(
    (acc, row) => acc + parseCurruncyToNumber(row.returnValue), 0
  );

  // Add a total row at the end
  const rowsWithTotal = [
    ...rows,
    {
      id: 'total-row',
      productCode: '',
      product: 'Total',
      mrp: '',
      rate: '',
      quantity: totalQuantity,
      returnValue: formatCurrency(totalReturnValue),
      returnReason: '',
      returnReasonUId: '',
      isTotal: true,
    },
  ];

  const fetchReturnReasons = async () => {
    try {
      await getAllReturnReasons();
    } catch (error) {
      enqueueSnackbar("Failed to fetch return reasons", { variant: "error" });
    }
  };

  const fetchGetReturnProducts = async () => {
    try {
      await getReturnProducts(priceListID, distributorID);
    } catch (error) {
      enqueueSnackbar("Failed to fetch return products", { variant: "error" });
    }
  };

  const fetchGetReturnInvoiceDetails = async () => {
    try {
      if (isReturnOnly) {
        await getReturnInvoiceDetailsByReturnId(
          invoiceIDOrLostCallID
            ? invoiceIDOrLostCallID
            : localStorage.getItem("invoiceID")
        );
      } else {
        await getReturnInvoiceDetails(
          invoiceIDOrLostCallID
            ? invoiceIDOrLostCallID
            : localStorage.getItem("invoiceID")
        );
      }
    } catch (error) {
      enqueueSnackbar("Failed to fetch return invoice details", {
        variant: "error",
      });
    }
  };

  const handleDeleteItem = (rowID: number) => {
    const updatedRows = rows.filter((row) => row.id !== rowID);
    setRows(updatedRows);
  };

  const formattedProductsList = returnProductsList?.map((item) => ({
    ...item,
    productName: `${item.productCode}-${item.productName}##${item.mrp.toFixed(
      2
    )}`,
  }));

  const priceListTypesOptions = useMemo(
    () =>
      mapListToOptions(priceListTypes, "priceListTypeName", "priceListTypeUId"),
    [priceListTypes, mapListToOptions]
  );
  const productListOptions = useMemo(() => {
    return formattedProductsList.map((product, index) => ({
      label: product.productName,
      value: `${product.productUId}-${product.mrp}`,
    }));
  }, [formattedProductsList]);
  const returnReasonOptions = useMemo(
    () => mapListToOptions(returnReasonList, "name", "uId"),
    [returnReasonList, mapListToOptions]
  );

  const addReturnProduct = () => {
    const { productUId, quantity, returnReasonUId } = getValues();
    const { productCode, productName, mrp, rate } = selectedProductDetails;
    const returnReason = returnReasonList.find(
      (reason) => reason.uId === returnReasonUId
    )?.name;

    const newQuantity = Number(quantity);
    const newReturnValue = newQuantity * rate;

    setRows((prevRows) => {
      const existingIndex = prevRows.findIndex(
        (row) =>
          row.uid === getProductUId(productUId) &&
          row.mrp === mrp.toFixed(2) &&
          row.returnReasonUId === returnReasonUId
      );

      if (existingIndex !== -1) {
        // Update existing row
        const updatedRows = [...prevRows];
        const existingRow = updatedRows[existingIndex];

        const updatedQuantity = existingRow.quantity + newQuantity;
        const updatedReturnValue = updatedQuantity * rate;

        updatedRows[existingIndex] = {
          ...existingRow,
          quantity: updatedQuantity,
          returnValue: formatCurrency(updatedReturnValue),
        };

        return updatedRows;
      } else {
        // Add new row
        const newRow = {
          id: prevRows.length + 1,
          uid: getProductUId(productUId),
          productCode: productCode,
          product: productName,
          mrp: mrp.toFixed(2),
          rate: formatCurrency(rate),
          quantity: newQuantity,
          returnValue: formatCurrency(newReturnValue),
          returnReason: returnReason,
          returnReasonUId: returnReasonUId,
        };

        return [...prevRows, newRow];
      }
    });
    setValue("productUId", "");
    setValue("quantity", "");
    setValue("returnReasonUId", "");

    setIsPriceListSelected(true);
  };

  let totalReturnAmount = rows.reduce(
    (acc, row) => acc + parseCurruncyToNumber(row.returnValue),
    0
  );

  const handleSaveAsDraft = async () => {
    setIsSubmitting(true);
    const payload = {
      saleInvoiceReturnHeader: {
        saleInvoiceHeaderUId: isReturnOnly
          ? 0
          : existingSalesInvoice?.saleInvoiceHeader?.uId,
        tourScheduleUId: scheduleId,
        outletUId: outletID,
        returnID: "",
        status: 1,
        returnDate:
          invoiceDate == undefined
            ? new Date().toISOString().split("T")[0]
            : invoiceDate.toISOString().split("T")[0],
        returnType: isReturnOnly ? 2 : 1,
        returnValue: totalReturnAmount,
        saleViewUId: saleViewUId,
      },
      saleInvoiceReturnDetails: rows.map((row) => ({
        productUId: row.uid,
        mrp: Number(row.mrp),
        rate: parseCurruncyToNumber(row.rate),
        quantity: Number(row.quantity),
        returnValue: parseCurruncyToNumber(row.returnValue),
        returnReasonUId: Number(row.returnReasonUId),
      })),
    };

    setIsPriceListSelected(false);
    const responseMsg = await createReturnInvoice(payload);
    enqueueSnackbar(responseMsg, { variant: "success" });
    setIsSubmitting(false);
    fetchGetReturnInvoiceDetails();
    if (isReturnOnly) {
      router.push(`${PATH_DASHBOARD.directSaleTour.directSaleTour}/${scheduleId}`);
    }
  };

  const formattedDate = invoiceDate
    ? typeof invoiceDate === "string"
      ? (invoiceDate as string).split("T")[0]
      : `${invoiceDate.getFullYear()}-${(invoiceDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${invoiceDate
          .getDate()
          .toString()
          .padStart(2, "0")}`
    : "";

  const handleUpdate = async () => {
    setIsSubmitting(true);
    const payload = {
      saleInvoiceReturnHeader: {
        saleInvoiceHeaderUId: isReturnOnly
          ? 0
          : existingSalesInvoice?.saleInvoiceHeader?.uId,
        tourScheduleUId: scheduleId,
        outletUId: outletID,
        returnID: `${returnByInvoiceId?.saleInvoiceReturnHeader?.returnID}`,
        status: 1,
        returnDate:
          invoiceDate == undefined
            ? new Date().toISOString().split("T")[0]
            : formattedDate,
        returnType: isReturnOnly ? 2 : 1,
        returnValue: totalReturnAmount,
        saleViewUId: saleViewUId,
      },
      saleInvoiceReturnDetails: rows.map((row) => ({
        productUId: row.uid,
        mrp: Number(row.mrp),
        rate: parseCurruncyToNumber(row.rate),
        quantity: Number(row.quantity),
        returnValue: parseCurruncyToNumber(row.returnValue),
        returnReasonUId: Number(row.returnReasonUId),
      })),
    };
    setIsPriceListSelected(false);
    const response = await updateReturnInvoice(
      returnByInvoiceId?.saleInvoiceReturnHeader?.saleInvoiceReturnHeaderUId,
      payload
    );
    enqueueSnackbar(response, { variant: "success" });
    setIsSubmitting(false);
    fetchGetReturnInvoiceDetails();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const payload = {
      saleInvoiceReturnHeader: {
        saleInvoiceHeaderUId: isReturnOnly
          ? 0
          : existingSalesInvoice?.saleInvoiceHeader?.uId,
        tourScheduleUId: scheduleId,
        outletUId: outletID,
        returnID: `${returnByInvoiceId?.saleInvoiceReturnHeader?.returnID}`,
        status: 2,
        returnDate:
          invoiceDate == undefined
            ? new Date().toISOString().split("T")[0]
            : formattedDate,
        returnType: isReturnOnly ? 2 : 1,
        returnValue: totalReturnAmount,
        saleViewUId: saleViewUId,
      },
      saleInvoiceReturnDetails: rows.map((row) => ({
        productUId: row.uid,
        mrp: Number(row.mrp),
        rate: parseCurruncyToNumber(row.rate),
        quantity: Number(row.quantity),
        returnValue: parseCurruncyToNumber(row.returnValue),
        returnReasonUId: Number(row.returnReasonUId),
      })),
    };
    setIsPriceListSelected(false);

    const response = await updateReturnInvoice(
      returnByInvoiceId?.saleInvoiceReturnHeader?.saleInvoiceReturnHeaderUId,
      payload
    );
    enqueueSnackbar(response, { variant: "success" });
    setIsSubmitting(false);
    fetchGetReturnInvoiceDetails();
    if (isReturnOnly) {
      router.push(`${PATH_DASHBOARD.directSaleTour.directSaleTour}/${scheduleId}`);
    }
  };

  const handleOneTimeSubmit = async () => {
    setIsSubmitting(true);
    const payload = {
      saleInvoiceReturnHeader: {
        saleInvoiceHeaderUId: isReturnOnly
          ? 0
          : existingSalesInvoice?.saleInvoiceHeader?.uId,
        tourScheduleUId: scheduleId,
        outletUId: outletID,
        returnID: "",
        vehicleUId: tourSaleData.vehicleUId,
        status: 2,
        returnDate:
          invoiceDate == undefined
            ? new Date().toISOString().split("T")[0]
            : formattedDate,
        returnType: isReturnOnly ? 2 : 1,
        returnValue: totalReturnAmount,
        saleViewUId: saleViewUId,
      },
      saleInvoiceReturnDetails: rows.map((row) => ({
        productUId: row.uid,
        mrp: Number(row.mrp),
        rate: parseCurruncyToNumber(row.rate),
        quantity: Number(row.quantity),
        returnValue: parseCurruncyToNumber(row.returnValue),
        returnReasonUId: Number(row.returnReasonUId),
      })),
    };

    setIsPriceListSelected(false);
    const responseMsg = await createReturnInvoice(payload);
    enqueueSnackbar(responseMsg, { variant: "success" });
    setIsSubmitting(false);
    fetchGetReturnInvoiceDetails();
    if (isReturnOnly) {
      router.push(`${PATH_DASHBOARD.directSaleTour.directSaleTour}/${scheduleId}`);
    }
  };

  const columns: GridColDef[] = [
    { field: "productCode", headerName: "Product ID", minWidth: 120, flex: 1 },
    { field: "product", headerName: "Product", minWidth: 300, flex: 1 },
    {
      field: "mrp",
      headerName: "MRP",
      align: "right",
      headerAlign: "right",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "rate",
      headerName: "Rate",
      align: "right",
      headerAlign: "right",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      align: "right",
      headerAlign: "right",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "returnValue",
      headerName: "Return Value",
      align: "right",
      headerAlign: "right",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "returnReason",
      headerName: "Return Reason",
      minWidth: 250,
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 200,
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params: any) => {
        if (params.row.isTotal || !params.row.id) {
          return <span></span>;
        }
        return (
          <IconButton
            size="small"
            sx={{ color: "red" }}
            onClick={() => handleDeleteItem(params.row.id)}
            disabled={saleStatus === 2 || isSubmitted}
          >
            <DeleteOutlineIcon />
          </IconButton>
        );
      },
    },
  ];

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <FormProvider methods={methods}>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, mb: 4, pb: 4 }}
          >
            <Grid item xs={3}>
              <RHFAutocompleteField
                name="priceList"
                placeholder="Price List*"
                options={priceListTypesOptions}
                control={control}
                disabled={isPriceListSelected || saleStatus == 2 || isSubmitted}
                inputProps={{
                  form: {
                    autocomplete: "off",
                  },
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <RHFAutocompleteField
                name="productUId"
                placeholder="Select Product*"
                options={productListOptions}
                control={control}
                disabled={saleStatus == 2 || isSubmitted}
                inputProps={{
                  form: {
                    autocomplete: "off",
                  },
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <RHFAutocompleteField
                name="returnReasonUId"
                placeholder="Return Reason*"
                options={returnReasonOptions}
                control={control}
                disabled={saleStatus == 2 || isSubmitted}
                inputProps={{
                  form: {
                    autocomplete: "off",
                  },
                }}
              />
            </Grid>
            <Grid item xs={1}>
              <RHFTextField
                name="quantity"
                label="Quantity*"
                type="number"
                inputProps={{ min: 0 }}
                disabled={saleStatus == 2 || isSubmitted}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "+") {
                    e.preventDefault();
                  }
                }}
              />
            </Grid>
            <Grid item xs={1}>
              <Button
                variant="contained"
                color="primary"
                sx={{ width: "100%" }}
                onClick={addReturnProduct}
                disabled={!getValues("quantity")}
              >
                Add
              </Button>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <DataGrid
              sx={{
                ...dataGridStockStyleMappers,
                '& .MuiDataGrid-row.total-row': {
                  backgroundColor: '#e1d4fa66',
                  color: '#070E4D',
                  fontWeight: 'bold',
                },
              }}
              rows={rowsWithTotal}
              columns={getColumnsWithTooltip(columns)}
              density="compact"
              hideFooter
              disableRowSelectionOnClick
              autoHeight
              disableColumnMenu
              getRowClassName={(params) =>
                params.row.isTotal ? 'total-row' : ''
              }
            />
          </Box>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            {saleStatus !== 2 && (
              <>
                {returnByInvoiceId?.saleInvoiceReturnDetails?.length > 0 ? (
                  <>
                    <LoadingButton
                      variant="outlined"
                      color="primary"
                      loading={isSubmitting}
                      onClick={handleUpdate}
                      sx={{ mr: 2 }}
                      disabled={saleStatus === 2 || isSubmitted}
                    >
                      Update
                    </LoadingButton>
                    <LoadingButton
                      variant="contained"
                      color="primary"
                      loading={isSubmitting}
                      onClick={handleSubmit}
                      disabled={saleStatus === 2 || isSubmitted}
                    >
                      Submit
                    </LoadingButton>
                  </>
                ) : (
                  <>
                    <LoadingButton
                      variant="outlined"
                      color="primary"
                      loading={isSubmitting}
                      onClick={handleSaveAsDraft}
                      sx={{ mr: 2 }}
                      disabled={
                        rows.length === 0 || saleStatus === 2 || isSubmitted
                      }
                    >
                      Save as Draft
                    </LoadingButton>
                    <LoadingButton
                      variant="contained"
                      color="primary"
                      loading={isSubmitting}
                      onClick={handleOneTimeSubmit}
                      disabled={
                        rows.length === 0 || saleStatus === 2 || isSubmitted
                      }
                    >
                      Submit
                    </LoadingButton>
                  </>
                )}
              </>
            )}
          </Box>

          {/* <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            {saleStatus === 2 ? null : (
              <>
                {returnByInvoiceId?.saleInvoiceReturnDetails?.length > 0 ? (
                  <>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleUpdate}
                      sx={{ mr: 2 }}
                      disabled={saleStatus == 2 || isSubmitted ? true : false}
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      disabled={saleStatus == 2 || isSubmitted ? true : false}
                    >
                      Submit
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleSaveAsDraft}
                      sx={{ mr: 2 }}
                      disabled={
                        rows.length == 0
                          ? true
                          : false || saleStatus == 2
                          ? true
                          : false || isSubmitted
                      }
                    >
                      Save as Draft
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOneTimeSubmit}
                      disabled={
                        rows.length == 0
                          ? true
                          : false || saleStatus == 2
                          ? true
                          : false || isSubmitted
                      }
                    >
                      Submit
                    </Button>
                  </>
                )}
              </>
            )}
          </Box> */}
        </FormProvider>
      </Box>
    </>
  );
};

export default ReturnTable;
