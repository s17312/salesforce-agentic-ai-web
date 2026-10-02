import React, { useEffect, useMemo, useState } from "react";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { useSelector } from "@/redux/store";
import { createSalesInvoice, getSalesInvoiceByID, getSaleUnits, submitSale, updateSalesInvoice } from "@/service/tour-service/sale.service";
import { dataGridStockStyleMappers } from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { mapListToOptions } from "@/utils/sortUtils";
import { Alert, Box } from "@mui/material";
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import { enqueueSnackbar } from "notistack";
import "../../../../../../styles/tableStyles/editableTableStyles.css";
import { useRouter, useSearchParams } from "next/navigation";
import ChecklistIcon from '@mui/icons-material/Checklist';
import { PATH_DASHBOARD } from "@/routes/paths";
import SaleSubmitPopup from "@/components/popup/SaleSubmitPopup";
import TotalSalesTable from "../../components/totalSalesTable";

interface SaleTableProps {
  isSearchClicked: boolean;
  priceListTypeId?: number;
  manualInvoiceNumber?: string;
  setTabValue: (value: string) => void;
  fetchProducts: () => void;
}

const SaleTable: React.FC<SaleTableProps> = ({
  isSearchClicked,
  priceListTypeId,
  manualInvoiceNumber,
  setTabValue,
  fetchProducts
}) => {
  const router = useRouter();
  const [rows, setRows] = useState([] as any[]);
  const [filteredRows, setFilteredRows] = useState([] as any[]);
  const [isTableBtnDisabled, setIsTableBtnDisabled] = useState(false);
  const [open, setOpen] = useState(false);

  const productsList = useSelector((state) => state.tourSalesInvoiceSlice.SalesInvoiceProducts);
  const salesUnitsList = useSelector((state) => state.tourSalesInvoiceSlice.SalesUnits);
  const existingSalesInvoice = useSelector((state) => state.tourSalesInvoiceSlice.SalesInvoiceByID);
  const schedule = useSelector((state) => state.tourScheduleSlice.TourScheduleById);

  const saleInvoiceHeader = existingSalesInvoice?.saleInvoiceHeader;
  const saleInvoiceDetail = existingSalesInvoice?.saleInvoiceDetail;

  const searchParams = useSearchParams();
  const scheduleId = searchParams.get('scheduleId');
  const saleViewUId = searchParams.get('saleViewUId');
  const outletID = searchParams.get('outletID');
  const invoiceIDOrLostCallID = searchParams.get('invoiceIDOrLostCallID');
  const distributorID = searchParams.get('distributorID');
  const representativeID = searchParams.get('representativeID');
  const routeID = searchParams.get('routeID');
  const vehicleUId = searchParams.get('vehicleUId');
  const saleStatus = Number(searchParams.get('saleStatus'));

  const saleInvoiceStatus = saleInvoiceHeader?.saleInvoiceStatus;

  useEffect(() => {
    fetchSalesUnits();
    fetchExistingSalesInvoice();
  }, []);

  useEffect(() => {
    if (saleInvoiceDetail !== undefined) {
      fetchProducts();
    }
  }, [saleInvoiceDetail]);


  useEffect(() => {
    if (saleInvoiceDetail?.length > 0) {
      if (productsList.length > 0) {
        const mappedProducts = productsList.map((product: any) => {
          const saleDetail = saleInvoiceDetail.find(
            (detail: any) => detail.productUId === product.productUId
          );

          return {
            id: product.uId,
            productUId: product.productUId,
            productId: product.productId,
            productName: product.productName,
            mrp: product.mrp,
            rate: product.rate,
            quantity: product.quantity,
            salesUnit: saleDetail ? saleDetail.saleUnit : "-- Select a unit --",
            sale: saleDetail ? saleDetail.sale : 0,
            units: saleDetail ? saleDetail.saleQuantity : 0,
            saleValue: saleDetail ? saleDetail.saleValue : 0,
          };
        });
        setRows(mappedProducts);
      }

    } else if (Array.isArray(productsList)) {
      const mappedProducts = productsList.map((product) => ({
        id: product.uId,
        productUId: product.productUId,
        productId: product.productId,
        productName: product.productName,
        mrp: product.mrp,
        rate: product.rate,
        quantity: product.quantity,
        salesUnit: "-- Select a unit --",
        sale: 0,
        units: 0,
        saleValue: 0,
      }));
      setRows(mappedProducts);
    }

  }, [productsList]);

  useEffect(() => {
    const filteredRows = rows.filter(row => row.sale !== 0);
    setFilteredRows(filteredRows);
  }, [rows]);

  useEffect(() => {
    if (saleInvoiceDetail?.length > 0) {
      const mappedProducts = saleInvoiceDetail.map((product: any) => ({
        id: product.productUId,
        productUId: product.productUId,
        productId: product.productId,
        productName: product.productName,
        mrp: product.mrp,
        rate: product.rate,
        quantity: product.availableQuantity,
        salesUnit: product.saleUnit,
        sale: product.sale,
        units: product.saleQuantity,
        saleValue: product.saleValue,
      }));
      setRows(mappedProducts);
    }
  }, [saleInvoiceDetail]);

  const fetchSalesUnits = async () => {
    try {
      await getSaleUnits();
    } catch (error) {
      enqueueSnackbar("Error fetching sales units", { variant: "error" });
    }
  };

  const fetchExistingSalesInvoice = async () => {
    try {
      await getSalesInvoiceByID(invoiceIDOrLostCallID);
    } catch (error) {
      enqueueSnackbar("Error fetching existing sales invoice", { variant: "error" });
    }
  };

  const handleRowUpdate = (newRow: GridRowModel) => {
    const salesUnitCount = salesUnitsList.find((unit: any) => unit.uId === newRow.salesUnit)?.totQty || 1;

    if (newRow.sale * salesUnitCount > newRow.quantity) {
      enqueueSnackbar("Sale quantity cannot be more than available quantity", { variant: "error" });
      return Promise.reject(new Error("Sale quantity cannot be more than available quantity"));
    } else {
      const updatedRow = {
        ...newRow,
        salesUnit: newRow.salesUnit,
        sale: Number(newRow.sale),
        units: Number(newRow.sale) * salesUnitCount,
        saleValue: Number(newRow.sale) * salesUnitCount * newRow.rate,
      }

      setRows((prevRows) =>
        // @ts-ignore
        prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
      );

      setIsTableBtnDisabled(false);
      return updatedRow;
    }
  };

  const totalSalesValue = useMemo(() => {
    return filteredRows.reduce((acc, row) => acc + row.saleValue, 0);
  }, [filteredRows]);

  const handleSaveClick = async () => {
    const payload = {
      saleInvoiceHeader: {
        tourScheduleUId: scheduleId,
        invoiceId: invoiceIDOrLostCallID,
        invoiceDate: new Date().toISOString(),
        distributorUId: distributorID,
        representativeUId: representativeID,
        routeUId: routeID,
        outletUId: outletID,
        invoiceTypeUId: 0,
        priceListTypeUId: priceListTypeId,
        manualInvoiceNumber: manualInvoiceNumber,
        saleInvoiceStatus: 1,
        invoiceAmount: totalSalesValue,
        discountAmount: 0,
        returnAmount: 0,
        paidAmount: 0,
        balanceAmount: totalSalesValue,
        isPaidCompleted: false,
        saleViewUId: saleViewUId,
        saleInvoiceTypeUId: 2,
      },
      saleInvoiceDetails: filteredRows.map(row => ({
        productUId: row.productUId,
        productName: row.productName,
        mrp: row.mrp,
        rate: row.rate,
        availableQuantity: row.quantity,
        sale: row.sale,
        saleUnit: row.salesUnit,
        saleQuantity: row.units,
        saleValue: row.saleValue
      }))
    }

    try {
      const response = await createSalesInvoice(payload);
      enqueueSnackbar(`${response.message} | ${response.result.invoiceId}`, { variant: "success" });
      await getSalesInvoiceByID(response.result.invoiceId);
      router.push(`${PATH_DASHBOARD.salesTour.salesTour}/${scheduleId}`)
      setIsTableBtnDisabled(true);
    } catch (error) {
      enqueueSnackbar("Error creating sales invoice", { variant: "error" });
    }
  };

  const handleUpdateClick = async () => {
    const payload = {
      saleInvoiceHeader: {
        tourScheduleUId: scheduleId,
        invoiceId: invoiceIDOrLostCallID,
        invoiceDate: new Date().toISOString(),
        distributorUId: distributorID,
        representativeUId: representativeID,
        routeUId: routeID,
        outletUId: outletID,
        invoiceTypeUId: 0,
        priceListTypeUId: priceListTypeId,
        manualInvoiceNumber: manualInvoiceNumber,
        saleInvoiceStatus: 1,
        invoiceAmount: totalSalesValue,
        discountAmount: 0,
        returnAmount: 0,
        paidAmount: 0,
        balanceAmount: totalSalesValue,
        isPaidCompleted: false,
        saleViewUId: 0,
        saleInvoiceTypeUId: 2,
      },
      saleInvoiceDetails: filteredRows.map(row => ({
        productUId: row.productUId,
        productName: row.productName,
        mrp: row.mrp,
        rate: row.rate,
        availableQuantity: row.quantity,
        sale: row.sale,
        saleUnit: row.salesUnit,
        saleQuantity: row.units,
        saleValue: row.saleValue
      }))
    };

    try {
      const response = await updateSalesInvoice(saleInvoiceHeader.uId, payload);
      enqueueSnackbar(`${response.message} | ${response.result.invoiceId}`, { variant: "success" });
      setIsTableBtnDisabled(true);
      fetchExistingSalesInvoice();
    } catch (error) {
      enqueueSnackbar("Error updating sales invoice", { variant: "error" });
    };
  };

  const handleSubmitConfirmation = () => {
    setOpen(true);
  };

  const handleSubmitClick = async () => {
    try {
      const response = await submitSale(vehicleUId, saleViewUId);
      enqueueSnackbar(`${response.message}`, { variant: "success" });
      router.push(`${PATH_DASHBOARD.salesTour.salesTour}/${scheduleId}`);
    } catch (error) {
      enqueueSnackbar("Error updating sales invoice", { variant: "error" });
    };
  };

  const salesUnitsOptions = useMemo(() => mapListToOptions(salesUnitsList, "unitName", "uId"), [salesUnitsList, mapListToOptions]);
  const tableBtnText = saleInvoiceDetail && saleInvoiceDetail.length > 0 ? "Update" : "Save";

  const totalSalesValueTable = useMemo(() => {
    return filteredRows.reduce((acc, row) => acc + row.saleValue, 0);
  }, [filteredRows]);

  const totalUnits = useMemo(() => {
    return filteredRows.reduce((acc, row) => acc + row.units, 0);
  }, [filteredRows]);

  const totalSale = useMemo(() => {
    return filteredRows.reduce((acc, row) => acc + row.sale, 0);
  }, [filteredRows]);

  const columns: GridColDef[] = [
    { field: "productId", headerName: "Product ID", minWidth: 150, flex: 1, disableColumnMenu: true },
    { field: "productName", headerName: "Product Name", minWidth: 200, flex: 1, disableColumnMenu: true },
    { field: "mrp", headerName: "MRP", minWidth: 100, flex: 1, disableColumnMenu: true, align: 'right', headerAlign: 'right' },
    { field: "rate", headerName: "Rate", minWidth: 100, flex: 1, disableColumnMenu: true, align: 'right', headerAlign: 'right' },
    { field: "quantity", headerName: "Available Quantity", minWidth: 150, flex: 1, disableColumnMenu: true, align: 'right', headerAlign: 'right' },
    {
      field: "salesUnit",
      headerName: "Sales Unit",
      minWidth: 180,
      flex: 1,
      disableColumnMenu: true,
      editable: saleStatus == 2 ? false : true,
      type: 'singleSelect',
      valueOptions: salesUnitsOptions.map(option => ({
        label: option.label,
        value: option.value
      })),
      renderCell: (params) => {
        const option = salesUnitsOptions.find(option => option.value === params.value);
        return option ? option.label : params.value;
      },
      cellClassName: 'editable-cell'
    },
    {
      field: "sale",
      headerName: "Sale",
      minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
      type: 'number',
      editable: saleStatus == 2 ? false : true,
      align: 'right',
      headerAlign: 'right',
      cellClassName: 'editable-cell'
    },
    { field: "units", headerName: "Total Units", minWidth: 120, flex: 1, disableColumnMenu: true, align: 'right', headerAlign: 'right' },
    { field: "saleValue", headerName: "Sale Value", minWidth: 120, flex: 1, disableColumnMenu: true, align: 'right', headerAlign: 'right' },
  ];

  return (
    <>
      {saleInvoiceDetail?.length > 0 ? (
        <>
          <DataGrid
            sx={{ ...dataGridStockStyleMappers }}
            rows={rows}
            autoHeight
            columns={getColumnsWithTooltip(columns)}
            slots={{
              noRowsOverlay: CustomNoRowsOverlay,
              toolbar: () => (
                <QuickSearchToolbar
                  newBtnText="Submit"
                  handleNewClick={handleSubmitConfirmation}
                  isNewButtonDisabled={saleStatus == 2}
                  newBtnIcon={<ChecklistIcon />}
                  handleTableBtnClick={saleInvoiceDetail && saleInvoiceDetail.length > 0 ? handleUpdateClick : handleSaveClick}
                  tableBtnText={tableBtnText}
                  isDisabled={filteredRows.length === 0}
                  isTableBtnDisabled={filteredRows.length === 0 || isTableBtnDisabled || saleStatus == 2}
                />
              ),
            }}
            processRowUpdate={handleRowUpdate}
            density="compact"
            hideFooter
            disableRowSelectionOnClick
            disableColumnMenu
          />
          <Box sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
            <Box sx={{ borderRadius: 1 }}>
              <TotalSalesTable totalSale={totalSale} totalUnits={totalUnits} totalSalesValueTable={totalSalesValueTable} />
            </Box>
          </Box>
        </>
      ) : isSearchClicked ? (
        <>
          <DataGrid
            sx={{ ...dataGridStockStyleMappers }}
            rows={rows}
            columns={getColumnsWithTooltip(columns)}
            autoHeight
            slots={{
              noRowsOverlay: CustomNoRowsOverlay,
              toolbar: () => (
                <QuickSearchToolbar
                  tableBtnText={tableBtnText}
                  handleTableBtnClick={handleSaveClick}
                  isDisabled={filteredRows.length === 0}
                  isTableBtnDisabled={filteredRows.length === 0 || isTableBtnDisabled}
                />
              ),
            }}
            processRowUpdate={handleRowUpdate}
            density="compact"
            hideFooter
            disableRowSelectionOnClick
            disableColumnMenu
          />
          <Box sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
            <Box sx={{ borderRadius: 1 }}>
              <TotalSalesTable totalSale={totalSale} totalUnits={totalUnits} totalSalesValueTable={totalSalesValueTable} />
            </Box>
          </Box>
        </>
      ) : (
        <Alert severity="info">
          Please click the search button to display the products.
        </Alert>
      )}
      <SaleSubmitPopup
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleSubmitClick}
      />
    </>
  );
};

export default SaleTable;