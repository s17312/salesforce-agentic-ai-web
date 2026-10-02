import FormProvider, { RHFAutocompleteField, RHFTextField } from "@/components/hook-form";
import { useSelector } from "@/redux/store";
import { createReturnInvoice, getAllReturnReasons, getReturnInvoiceDetails, getReturnProducts, updateReturnInvoice } from "@/service/tour-service/return.service";
import { dataGridStockStyleMappers } from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { mapListToOptions } from "@/utils/sortUtils";
import { Box, Button, Grid, IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
    DeleteOutline as DeleteOutlineIcon,
} from '@mui/icons-material';
import { useSearchParams } from "next/navigation";

interface ProductDetails {
    productUId: number,
    productCode: string,
    productName: string,
    rate: number,
    mrp: number,
    volume: number,
    quantity: number
}

interface ReturnTableProps {
    distributorID: number;
};

const ReturnTable: React.FC<ReturnTableProps> = ({ distributorID }) => {
    const [rows, setRows] = useState([] as any[]);
    const [selectedProductDetails, setSelectedProductDetails] = useState<any | null>(null);
    const [isPriceListSelected, setIsPriceListSelected] = useState(false);

    const priceListTypes = useSelector((state) => state.tourSalesInvoiceSlice.SalesInvoicePriceListType);
    const returnReasonList = useSelector((state) => state.tourSalesReturnSlice.ReturnReasons);
    const returnProductsList = useSelector((state) => state.tourSalesReturnSlice.ReturnProducts);
    const tourSaleData = useSelector((state) => state.tourSalesInvoiceSlice.TourScheduleById_invoice);
    const existingSalesInvoice = useSelector((state) => state.tourSalesInvoiceSlice.SalesInvoiceByID);
    const returnByInvoiceId = useSelector((state) => state.tourSalesReturnSlice.ReturnByInvoiceId);

    const saleInvoiceHeader = existingSalesInvoice?.saleInvoiceHeader;

    const searchParams = useSearchParams();
    const scheduleId = Number(searchParams.get('scheduleId'));
    const outletID = Number(searchParams.get('outletID'));
    const invoiceIDOrLostCallID = searchParams.get('invoiceIDOrLostCallID');
    const saleStatus = Number(searchParams.get('saleStatus'));

    const methods = useForm<any>({
        mode: "all",
    });

    const { control, setValue, getValues } = methods;

    useWatch({
        control,
        name: ['priceList', 'productUId', 'quantity'],
    });

    const productID = getValues("productUId");
    const priceListID = getValues("priceList");

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
        if (returnByInvoiceId?.saleInvoiceReturnDetails?.length > 0) {
            const returnProducts = returnByInvoiceId.saleInvoiceReturnDetails.map((item: any, index: number) => ({
                id: index + 1,
                uid: item.productUId,
                productCode: item.productId,
                product: item.productName,
                mrp: item.mrp.toFixed(2),
                rate: item.rate.toFixed(2),
                quantity: item.quantity,
                returnValue: item.returnValue.toFixed(2),
                returnReason: item.returnReasonName,
                returnReasonUId: item.returnReasonUId
            }));
            setRows(returnProducts);
        }
    }, [returnByInvoiceId]);

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
            await getReturnInvoiceDetails(invoiceIDOrLostCallID);
        } catch (error) {
            enqueueSnackbar("Failed to fetch return invoice details", { variant: "error" });
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

    const priceListTypesOptions = useMemo(() => mapListToOptions(priceListTypes, "priceListTypeName", "priceListTypeUId"), [priceListTypes, mapListToOptions]);
    const productListOptions = useMemo(() => mapListToOptions(formattedProductsList, "productName", "productUId"), [formattedProductsList, mapListToOptions]);
    const returnReasonOptions = useMemo(() => mapListToOptions(returnReasonList, "name", "uId"), [returnReasonList, mapListToOptions]);

    useEffect(() => {
        if (Array.isArray(returnProductsList)) {
            const selectedProduct = returnProductsList.find(product => product.productUId === productID);

            if (selectedProduct) {
                setSelectedProductDetails(selectedProduct);
            } else {
                setSelectedProductDetails(null);
            }
        } else {
            setSelectedProductDetails(null);
        }
    }, [productID]);

    const addReturnProduct = () => {
        const { productUId, quantity, returnReasonUId } = getValues();
        const { productCode, productName, mrp, rate } = selectedProductDetails;
        const returnValue = quantity * rate;
        const returnReason = returnReasonList.find((reason) => reason.uId === returnReasonUId)?.name;

        const newRow = {
            id: rows.length + 1,
            uid: productUId,
            productCode: productCode,
            product: productName,
            mrp: mrp.toFixed(2),
            rate: rate.toFixed(2),
            quantity: Number(quantity),
            returnValue: returnValue.toFixed(2),
            returnReason: returnReason,
            returnReasonUId: returnReasonUId,
        };

        setRows((prevRows) => [...prevRows, newRow]);
        setValue("productUId", "");
        setValue("quantity", "");
        setValue("returnReasonUId", "");

        setIsPriceListSelected(true);
    };

    const handleSaveAsDraft = async () => {
        const payload = {
            saleInvoiceReturnHeader: {
                saleInvoiceHeaderUId: existingSalesInvoice?.saleInvoiceHeader?.uId,
                tourScheduleUId: scheduleId,
                outletUId: outletID,
                returnID: "",
                vehicleUId: tourSaleData.vehicleUId,
                status: 2
            },
            saleInvoiceReturnDetails: rows.map((row) => ({
                productUId: row.uid,
                mrp: Number(row.mrp),
                rate: Number(row.rate),
                quantity: Number(row.quantity),
                returnValue: Number(row.returnValue),
                returnReasonUId: Number(row.returnReasonUId)
            })),
        };
        setIsPriceListSelected(false);
        const responsemsg = await createReturnInvoice(payload);
        enqueueSnackbar(responsemsg, { variant: "success" });
        fetchGetReturnInvoiceDetails();
    };

    const handleUpdate = async () => {
        const payload = {
            saleInvoiceReturnHeader: {
                saleInvoiceHeaderUId: existingSalesInvoice?.saleInvoiceHeader?.uId,
                tourScheduleUId: scheduleId,
                outletUId: outletID,
                returnID: `${returnByInvoiceId?.saleInvoiceReturnHeader?.returnID}`,
                vehicleUId: tourSaleData.vehicleUId,
                status: 1
            },
            saleInvoiceReturnDetails: rows.map((row) => ({
                productUId: row.uid,
                mrp: Number(row.mrp),
                rate: Number(row.rate),
                quantity: Number(row.quantity),
                returnValue: Number(row.returnValue),
                returnReasonUId: Number(row.returnReasonUId)
            })),
        };
        setIsPriceListSelected(false);
        const response = await updateReturnInvoice(returnByInvoiceId?.saleInvoiceReturnHeader?.saleInvoiceReturnHeaderUId, payload);
        enqueueSnackbar(response, { variant: "success" });
        fetchGetReturnInvoiceDetails();
    };

    const handleSubmit = async () => {
        const payload = {
            saleInvoiceReturnHeader: {
                saleInvoiceHeaderUId: existingSalesInvoice?.saleInvoiceHeader?.uId,
                tourScheduleUId: scheduleId,
                outletUId: outletID,
                returnID: `${returnByInvoiceId?.saleInvoiceReturnHeader?.returnID}`,
                vehicleUId: tourSaleData.vehicleUId,
                status: 2
            },
            saleInvoiceReturnDetails: rows.map((row) => ({
                productUId: row.uid,
                mrp: Number(row.mrp),
                rate: Number(row.rate),
                quantity: Number(row.quantity),
                returnValue: Number(row.returnValue),
                returnReasonUId: Number(row.returnReasonUId)
            })),
        };
        setIsPriceListSelected(false);
        const response = await updateReturnInvoice(returnByInvoiceId?.saleInvoiceReturnHeader?.saleInvoiceReturnHeaderUId, payload);
        enqueueSnackbar(response, { variant: "success" });
        fetchGetReturnInvoiceDetails();
    };

    const columns: GridColDef[] = [
        { field: "productCode", headerName: "Product ID", minWidth: 120, flex: 1 },
        { field: "product", headerName: "Product", minWidth: 300, flex: 1 },
        { field: "mrp", headerName: "MRP", align: "right", headerAlign: "right", minWidth: 100, flex: 1 },
        { field: "rate", headerName: "Rate", align: "right", headerAlign: "right", minWidth: 100, flex: 1 },
        { field: "quantity", headerName: "Quantity", align: "right", headerAlign: "right", minWidth: 100, flex: 1 },
        { field: "returnValue", headerName: "Return Value", align: "right", headerAlign: "right", minWidth: 200, flex: 1 },
        { field: "returnReason", headerName: "Return Reason", minWidth: 250, flex: 1 },
        {
            field: 'action',
            headerName: 'Action',
            minWidth: 200,
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            renderCell: (params: any) => {
                if (!params.row.id) {
                    return <span></span>;
                }
                return (
                    <IconButton
                        size="small"
                        sx={{ color: "red" }}
                        onClick={() => handleDeleteItem(params.row.id)}
                        disabled={returnByInvoiceId?.saleInvoiceReturnHeader?.status === 2}
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
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, mb: 4, pb: 4 }}>
                        <Grid item xs={3}>
                            <RHFAutocompleteField
                                name="priceList"
                                placeholder="Price List*"
                                options={priceListTypesOptions}
                                control={control}
                                disabled={isPriceListSelected || saleStatus == 2}
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
                                disabled={saleStatus == 2}
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
                                disabled={saleStatus == 2}
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
                                disabled={saleStatus == 2}
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
                            sx={{ ...dataGridStockStyleMappers }}
                            rows={rows}
                            columns={getColumnsWithTooltip(columns)}
                            density="compact"
                            hideFooter
                            disableRowSelectionOnClick
                            autoHeight
                            disableColumnMenu
                        />
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        {returnByInvoiceId?.saleInvoiceReturnHeader?.status === 2 ? null : (
                            <>
                                {returnByInvoiceId?.saleInvoiceReturnDetails?.length > 0 ? (
                                    <>
                                        <Button variant="outlined" color="primary" onClick={handleUpdate} sx={{ mr: 2 }} disabled={saleStatus == 2 ? true : false}>
                                            Update
                                        </Button>
                                        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={saleStatus == 2 ? true : false}>
                                            Submit
                                        </Button>
                                    </>
                                ) : (
                                    <Button variant="outlined" color="primary" onClick={handleSaveAsDraft} sx={{ mr: 2 }} disabled={saleStatus == 2 ? true : false}>
                                        Save as Draft
                                    </Button>
                                )}
                            </>
                        )}
                    </Box>

                </FormProvider>
            </Box>
        </>
    );
};

export default ReturnTable;
