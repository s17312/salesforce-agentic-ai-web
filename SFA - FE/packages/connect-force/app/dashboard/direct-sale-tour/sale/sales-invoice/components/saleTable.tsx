import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { useSelector } from "@/redux/store";
import {
  dataGridStockStyleMappers,
  focusDataGridStyle,
} from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";

import { Alert, Box } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRowModel,
} from "@mui/x-data-grid";
import { useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useMemo, useState } from "react";
import "../../../../../../styles/tableStyles/editableTableStyles.css";
import TotalSalesTable from "../../components/totalSalesTable";
import { formatCurrency, formatRate } from "@/utils/formatCurrency";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";
import { createSalesInvoice, getSalesInvoiceByID, getSaleUnits, updateSalesInvoice } from "@/service/direct-sale/sale.service";

interface SaleTableProps {
  isSearchClicked: boolean;
  priceListTypeId?: number;
  warehouseId?: number;
  manualInvoiceNumber?: string;
  invoiceID?: string;
  setTabValue: (value: string) => void;
  fetchProducts: () => void;
  invoiceDate?: Date | undefined;
}

const SaleTable: React.FC<SaleTableProps> = ({
  isSearchClicked,
  priceListTypeId,
  warehouseId,
  manualInvoiceNumber,
  invoiceID,
  fetchProducts,
  invoiceDate,
}) => {
  const [rows, setRows] = useState([] as any[]);
  const [bkrows, setBkrows] = useState([] as any[]);
  const [filteredRows, setFilteredRows] = useState([] as any[]);
  const [isTableBtnDisabled, setIsTableBtnDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSaveSubmitting, setIsSaveSubmitting] = useState(false);
  const [isUpdateSubmitting, setIsUpdateSubmitting] = useState(false);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  const productsList = useSelector(
    (state) => state.tourDirectSalesInvoiceSlice.SalesInvoiceProducts
  );
  const salesUnitsList = useSelector(
    (state) => state.tourDirectSalesInvoiceSlice.SalesUnits
  );
  const existingSalesInvoice = useSelector(
    (state) => state.tourDirectSalesInvoiceSlice.SalesInvoiceByID
  );
  const rowData = useSelector((state) => state.tourDirectSalesSlice.TourSalesCall);

  const saleInvoiceHeader = existingSalesInvoice?.saleInvoiceHeader;
  const saleInvoiceDetail = existingSalesInvoice?.saleInvoiceDetail;

  const [invoiceIDOrLostCallID, setInvoiceIDOrLostCallID] = useState(
    existingSalesInvoice?.saleInvoiceHeader?.invoiceId || null
  );

  const searchParams = useSearchParams();
  const scheduleId = searchParams.get("scheduleId");
  const saleViewUId = searchParams.get("saleViewUId");
  const outletID = searchParams.get("outletID");
  const distributorID = searchParams.get("distributorID");
  const representativeID = searchParams.get("representativeID");
  const routeID = searchParams.get("routeID");
  const saleStatus = Number(searchParams.get("saleStatus"));

  useEffect(() => {
    // Fetch sales units and existing sales invoice on component mount
    const fetchInitialData = async () => {
      try {
        if (invoiceIDOrLostCallID == null) {
          const invoiceIDFromStorage = localStorage.getItem("invoiceID");
          setInvoiceIDOrLostCallID(
            invoiceIDFromStorage ? invoiceIDFromStorage : null
          );
        }
        setLoading(true); // Start loading
        await Promise.all([fetchSalesUnits(), fetchExistingSalesInvoice()]);
      } catch (error) {
        enqueueSnackbar("Error fetching initial data", { variant: "error" });
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (saleInvoiceDetail !== undefined) {
      fetchProducts();
    }
  }, [existingSalesInvoice]);

  useEffect(() => {
    const processRows = async () => {
      setLoading(true); // Start loading
      try {
        if (saleInvoiceDetail?.length > 0 && productsList.length > 0) {
          setInvoiceIDOrLostCallID(saleInvoiceHeader?.invoiceId);

          const mappedProducts = productsList.map((product: any) => {
            const saleDetail = saleInvoiceDetail.find(
              (detail: any) =>
                detail.productUId === product.productUId &&
                detail.mrp === product.mrp
            );

            return {
              id: product.uId,
              productUId: product.productUId,
              productId: product.productId,
              productName: product.productName,
              mrp: product.mrp,
              rate: product.rate,
              quantity: product.initialQuantity,
              salesUnit: saleDetail
                ? saleDetail.saleUnit
                : product.salesUnitTypeAssignmentDefaultUId,
              sale: saleDetail ? saleDetail.sale : 0,
              units: saleDetail ? saleDetail.saleQuantity : 0,
              saleValue: saleDetail ? saleDetail.saleValue : 0,
            };
          });

          const filteredProducts =
            rowData.saleStatus === 2
              ? mappedProducts.filter((row: any) => row.sale !== 0)
              : mappedProducts;

          setRows(filteredProducts);
        } else if (Array.isArray(productsList)) {
          const mappedProducts = productsList.map((product) => ({
            id: product.uId,
            productUId: product.productUId,
            productId: product.productId,
            productName: product.productName,
            mrp: product.mrp,
            rate: product.rate,
            quantity: product.initialQuantity,
            salesUnit: product.salesUnitTypeAssignmentDefaultUId,
            sale: 0,
            units: 0,
            saleValue: 0,
          }));
          setRows(mappedProducts);
        }
      } finally {
        setLoading(false); // Stop loading
      }
    };

    processRows();
  }, [saleInvoiceDetail, productsList, rowData.saleStatus]);

  useEffect(() => {
    // Filter rows with sale !== 0 whenever rows change
    setFilteredRows(rows.filter((row) => row.sale !== 0));
  }, [rows]);

  const fetchSalesUnits = async () => {
    try {
      await getSaleUnits();
    } catch (error) {
      enqueueSnackbar("Error fetching sales units", { variant: "error" });
    }
  };

  const fetchExistingSalesInvoice = async () => {
    try {
      const idToUse =
        invoiceID == null ? invoiceIDOrLostCallID : invoiceIDOrLostCallID;
      await getSalesInvoiceByID(idToUse);
    } catch (error) {
      enqueueSnackbar("Error fetching existing sales invoice", {
        variant: "error",
      });
    }
  };

  const handleRowUpdate = (newRow: GridRowModel) => {
    const selectedUnit = salesUnitsList.find(
      (unit: { uId: any }) => unit.uId === newRow.salesUnit
    );
    const salesUnitCount = selectedUnit?.totQty || 1;

    if (newRow.sale * salesUnitCount > newRow.quantity) {
      enqueueSnackbar("Sale quantity cannot be more than available quantity", {
        variant: "error",
      });
      return Promise.reject(
        new Error("Sale quantity cannot be more than available quantity")
      );
    } else {
      const updatedRow = {
        ...newRow,
        salesUnit: selectedUnit?.uId || newRow.salesUnit,
        sale: Number(newRow.sale),
        units: Number(newRow.sale) * salesUnitCount,
        saleValue: Number(newRow.sale) * salesUnitCount * newRow.rate,
      };

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
    setIsSaveSubmitting(true);
    const payload = {
      saleInvoiceHeader: {
        tourScheduleUId: scheduleId,
        invoiceId: invoiceIDOrLostCallID,
        invoiceDate:
          invoiceDate == undefined
            ? new Date().toISOString()
            : invoiceDate.toISOString(),
        distributorUId: distributorID,
        representativeUId: representativeID,
        routeUId: routeID,
        outletUId: outletID,
        invoiceTypeUId: 0,
        priceListTypeUId: priceListTypeId,
        warehouseUId: warehouseId,
        manualInvoiceNumber: manualInvoiceNumber,
        saleInvoiceStatus: 1,
        invoiceAmount: totalSalesValue,
        discountAmount: 0,
        returnAmount: 0,
        paidAmount: 0,
        balanceAmount: totalSalesValue,
        isPaidCompleted: false,
        saleViewUId: saleViewUId,
        saleInvoiceTypeUId: 1,
      },
      saleInvoiceDetails: filteredRows.map((row) => ({
        productUId: row.productUId,
        productName: row.productName,
        mrp: row.mrp,
        rate: row.rate,
        availableQuantity: row.quantity,
        sale: row.sale,
        saleUnit: row.salesUnit,
        saleQuantity: row.units,
        saleValue: row.saleValue,
      })),
    };

    try {
      const invalidRows = payload.saleInvoiceDetails.filter(
        (row) => row.saleUnit === "-- Select a unit --" || row.sale === 0
      );

      if (invalidRows.length > 0) {
        enqueueSnackbar("Please select a sales unit for all products", {
          variant: "error",
        });
        return;
      }

      const response = await createSalesInvoice(payload);
      fetchProducts();
      enqueueSnackbar(`${response.message} | ${response.result.invoiceId}`, {
        variant: "success",
      });
      setInvoiceIDOrLostCallID(response.result.invoiceId);
      localStorage.setItem("invoiceID", response.result.invoiceId);
      await getSalesInvoiceByID(response.result.invoiceId);
      await getSalesInvoiceByID(response.result.invoiceId);
      setIsTableBtnDisabled(true);
    } catch (error) {
      enqueueSnackbar("Error creating sales invoice", { variant: "error" });
    } finally {
      setIsSaveSubmitting(false);
    }
  };

  const handleUpdateClick = async () => {
    setIsUpdateSubmitting(true);
    const payload = {
      saleInvoiceHeader: {
        tourScheduleUId: scheduleId,
        invoiceId: invoiceIDOrLostCallID,
        invoiceDate:
          invoiceDate == undefined
            ? new Date().toISOString()
            : new Date(invoiceDate).toISOString(),
        distributorUId: distributorID,
        representativeUId: representativeID,
        routeUId: routeID,
        outletUId: outletID,
        invoiceTypeUId: 0,
        priceListTypeUId: priceListTypeId,
        warehouseUId: warehouseId,
        manualInvoiceNumber: manualInvoiceNumber,
        saleInvoiceStatus: 1,
        invoiceAmount: totalSalesValue,
        discountAmount: 0,
        returnAmount: 0,
        paidAmount: 0,
        balanceAmount: totalSalesValue,
        isPaidCompleted: false,
        saleViewUId: 0,
        saleInvoiceTypeUId: 1,
      },
      saleInvoiceDetails: filteredRows.map((row) => ({
        productUId: row.productUId,
        productName: row.productName,
        mrp: row.mrp,
        rate: row.rate,
        availableQuantity: row.quantity,
        sale: row.sale,
        saleUnit: row.salesUnit,
        saleQuantity: row.units,
        saleValue: row.saleValue,
      })),
    };

    try {
      const invalidRows = payload.saleInvoiceDetails.filter(
        (row) => row.saleUnit === "-- Select a unit --" || totalSalesValue === 0
      );
      fetchProducts();
      if (invalidRows.length > 0) {
        enqueueSnackbar("Please select a sales unit for all products", {
          variant: "error",
        });
        return;
      }
      const response = await updateSalesInvoice(saleInvoiceHeader.uId, payload);
      enqueueSnackbar(`${response.message} | ${response.result.invoiceId}`, {
        variant: "success",
      });
      setIsTableBtnDisabled(true);
      fetchExistingSalesInvoice();
    } catch (error) { }
    finally {
      setIsUpdateSubmitting(false)
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setShowSelectedOnly(checked);
    if (checked) {
      setBkrows(rows);
      setRows((prevRows) => prevRows.filter((row) => row.sale !== 0));
    } else {
      setRows(bkrows);
    }
  };

  const getSalesUnitsOptions = (productUId: number, mrp: number) => {
    if (!Array.isArray(productsList)) return [];

    const saleUnitTypes = productsList
      .filter(
        (product) => product.productUId === productUId && product.mrp === mrp
      )
      .flatMap((product) =>
        product.salesUnitType.map((unit: any) => ({
          label: unit.unitName,
          value: unit.uId,
        }))
      );
    return saleUnitTypes;
  };

  const tableBtnText =
    saleInvoiceDetail && saleInvoiceDetail.length > 0 ? "Update" : "Save";

  const totalSalesValueTable = useMemo(() => {
    return filteredRows.reduce((acc, row) => acc + row.saleValue, 0);
  }, [filteredRows]);

  const totalUnits = useMemo(() => {
    return filteredRows.reduce((acc, row) => acc + row.units, 0);
  }, [filteredRows]);

  const totalSale = useMemo(() => {
    return filteredRows.reduce((acc, row) => acc + row.sale, 0);
  }, [filteredRows]);

  const handleKeyDown: GridEventListener<"cellKeyDown"> = (params, event) => {
    if (
      event.key === "-" ||
      event.key === "+" ||
      event.key === "e" ||
      event.key === "E"
    ) {
      event.preventDefault();
    }
  };

  const columns: any[] = [
    {
      field: "productId",
      headerName: "Product ID",
      minWidth: 130,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "productName",
      headerName: "Product Name",
      minWidth: 300,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "mrp",
      headerName: "MRP",
      minWidth: 80,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      sortable: false,
    },
    {
      field: "rate",
      headerName: "Rate",
      minWidth: 80,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      sortable: false,
      renderCell: (params: any) => <>{formatRate(params.row.rate)}</>,
    },
    {
      field: "quantity",
      headerName: "Available Qty",
      minWidth: 80,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      sortable: false,
    },
    {
      field: "salesUnit",
      headerName: "Sales Unit",
      minWidth: 110,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
      editable: saleStatus == 2 ? false : true,
      type: "singleSelect",
      valueOptions: (params: any) =>
        getSalesUnitsOptions(params.row.productUId, params.row.mrp),
      renderCell: (params: any) => {
        const unit = getSalesUnitsOptions(
          params.row.productUId,
          params.row.mrp
        ).find((option) => option.value === params.value);
        return unit ? unit.label : "-- Select a unit --";
      },
      cellClassName: "editable-cell",
    },
    {
      field: "sale",
      headerName: "Sale",
      minWidth: 80,
      flex: 1,
      disableColumnMenu: true,
      type: "number",
      editable: saleStatus == 2 ? false : true,
      align: "right",
      headerAlign: "right",
      sortable: false,
      cellClassName: "editable-cell",
      preProcessEditCellProps: (params: any) => {
        const hasError =
          params.props.value < 0 || params.props.value.toString().includes("e");
        if (hasError)
          enqueueSnackbar("Sale can't be negative", {
            variant: "error",
          });
        return { ...params.props, error: hasError };
      },
    },
    {
      field: "units",
      headerName: "Total Units",
      minWidth: 80,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      sortable: false,
    },
    {
      field: "saleValue",
      headerName: "Sale Value",
      minWidth: 160,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      sortable: false,
      renderCell: (params: any) => <>{formatCurrency(params.row.saleValue)}</>,
    },
  ];

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(rows, columns);

  const filteredRowsNoQty = useMemo(() => {
    return searchedRows.filter((row) => {
      return row.quantity >= 0;
    });
  }, [searchedRows]);

  return (
    <>
      {saleInvoiceDetail?.length > 0 ? (
        <>
          <DataGrid
            sx={{ ...dataGridStockStyleMappers, ...focusDataGridStyle }}
            rows={filteredRowsNoQty}
            loading={loading}
            columns={getColumnsWithTooltip(columns)}
            getRowId={(row) => `${row.productUId}-${row.mrp}`}
            slots={{
              noRowsOverlay: CustomNoRowsOverlay,
              toolbar: () => (
                <QuickSearchToolbar
                  handleTableLoadingBtnClick={
                    saleInvoiceDetail && saleInvoiceDetail.length > 0
                      ? handleUpdateClick
                      : handleSaveClick
                  }
                  tableLoadingBtnText={tableBtnText}
                  isTableLoadingBtnLoading={isUpdateSubmitting}
                  isTableLoadingBtnDisabled={
                    filteredRows.length === 0 ||
                    isTableBtnDisabled ||
                    saleStatus == 2
                  }
                  isDisabled={filteredRows.length === 0}
                  showSwitch={true}
                  checked={showSelectedOnly}
                  onCheckedChange={handleSwitchChange}
                  columns={columns}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  menuItem={{
                    field: "searchColumn",
                    headerName: "Search By",
                  }}
                />
              ),
            }}
            processRowUpdate={handleRowUpdate}
            onCellKeyDown={handleKeyDown}
            density="compact"
            hideFooter
            disableRowSelectionOnClick
            disableColumnMenu
            experimentalFeatures={{ columnGrouping: true }}
          />
          <Box sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
            <Box sx={{ borderRadius: 1 }}>
              <TotalSalesTable
                totalSale={totalSale}
                totalUnits={totalUnits}
                totalSalesValueTable={totalSalesValueTable}
              />
            </Box>
          </Box>
        </>
      ) : isSearchClicked ? (
        <>
          <DataGrid
            sx={{ ...dataGridStockStyleMappers, ...focusDataGridStyle }}
            rows={filteredRowsNoQty}
            columns={getColumnsWithTooltip(columns)}
            getRowId={(row) => `${row.productUId}-${row.mrp}`}
            loading={loading}
            slots={{
              noRowsOverlay: CustomNoRowsOverlay,
              toolbar: () => (
                <QuickSearchToolbar
                  tableLoadingBtnText={tableBtnText}
                  handleTableLoadingBtnClick={handleSaveClick}
                  isDisabled={filteredRows.length === 0}
                  isTableLoadingBtnLoading={isSaveSubmitting}
                  isTableLoadingBtnDisabled={
                    filteredRows.length === 0 || isTableBtnDisabled
                  }
                  showSwitch={true}
                  checked={showSelectedOnly}
                  onCheckedChange={handleSwitchChange}
                  columns={columns}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  menuItem={{
                    field: "searchColumn",
                    headerName: "Search By",
                  }}
                />
              ),
            }}
            processRowUpdate={handleRowUpdate}
            onCellKeyDown={handleKeyDown}
            density="compact"
            disableRowSelectionOnClick
            disableColumnMenu
          />
          <Box sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
            <Box sx={{ borderRadius: 1 }}>
              <TotalSalesTable
                totalSale={totalSale}
                totalUnits={totalUnits}
                totalSalesValueTable={totalSalesValueTable}
              />
            </Box>
          </Box>
        </>
      ) : (
        <Alert severity="info">
          Please click the search button to display the products.
        </Alert>
      )}
    </>
  );
};

export default SaleTable;
