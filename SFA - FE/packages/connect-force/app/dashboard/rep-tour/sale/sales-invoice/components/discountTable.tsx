import React, { useEffect, useState } from "react";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { useSelector } from "@/redux/store";
import {
  getAppliedSalesDiscountByInvoiceId,
  getSalesDiscountByInvoiceId,
  saveSalesDiscount,
} from "@/service/tour-service/discount.service";
import { dataGridStockStyleMappers } from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import {
  DataGrid,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridColDef,
  GridRowModel,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { enqueueSnackbar } from "notistack";
import { useSearchParams } from "next/navigation";
import { setAppliedSalesDiscount } from "@/redux/slices/tour/tour-sales-discount-slice";
import { formatCurrency } from "@/utils/formatCurrency";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";
import { Box, CircularProgress } from "@mui/material";

interface SaleRepTourProps {
  existingSalesInvoice: any;
}

const DiscountTable: React.FC<SaleRepTourProps> = ({
  existingSalesInvoice,
}) => {
  const [rows, setRows] = useState([] as any[]);
  const [bkrows, setBkrows] = useState([] as any[]);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );
  const [isExistSelectedRows, setIsExistSelectedRows] = useState(false);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveSubmitting, setIsSaveSubmitting] = useState(false);

  const tourSalesDiscountList = useSelector(
    (state) => state.tourSalesDiscountSlice.InvoiceDiscountList
  );

  const appliedSalesDiscountList = useSelector(
    (state) => state.tourSalesDiscountSlice.AppliedSalesDiscountList
  );

  const searchParams = useSearchParams();
  const saleStatus = Number(searchParams.get("saleStatus"));

  useEffect(() => {
    setIsLoading(true);
    fetchGetAppliedSalesDiscountByInvoiceId();
    fetchGetSalesDiscountByInvoiceId();
    setIsLoading(false)
  }, []);

  useEffect(() => {
    const updatedRows = tourSalesDiscountList.map((discount) => {
      const appliedDiscount = () => {
        if (discount.sugProductDiscountQty) {
          return discount.sugProductDiscountQty;
        } else if (discount.sugValueDiscountProductOfferAmt) {
          return discount.sugValueDiscountProductOfferAmt;
        } else if (discount.sugInvoiceValueDiscountAmt) {
          return discount.sugInvoiceValueDiscountAmt;
        } else {
          return 0;
        }
      };
      return {
        ...discount,
        id: discount.discountUId,
        appliedDiscount: appliedDiscount(),
        rate: discount.rate,
      };
    });
    setRows(updatedRows);
  }, [tourSalesDiscountList]);

  useEffect(() => {
    if ((appliedSalesDiscountList ?? []).length > 0) {
      const updatedRows = tourSalesDiscountList.map((discount) => {
        const matchingDiscount = (appliedSalesDiscountList ?? []).find(
          (applied) => applied.discountUId === discount.discountUId
        );
        const appliedDiscount = matchingDiscount
          ? matchingDiscount.appliedProductDiscountQty ??
          matchingDiscount.appliedInvoiceValueDiscountAmt ??
          matchingDiscount.appliedValueDiscountProductOfferAmt ??
          0
          : discount.sugProductDiscountQty ??
          discount.sugValueDiscountProductOfferAmt ??
          discount.sugInvoiceValueDiscountAmt ??
          0;

        return {
          ...discount,
          id: discount.discountUId,
          appliedDiscount,
          rate: discount.rate,
        };
      });

      setRows(updatedRows);

      const existSelectedRows = appliedSalesDiscountList
        ?.filter((item: any) => item.isApply) // Only include rows where isApply is true
        .map((item: any) => item.discountUId);

      if ((existSelectedRows ?? []).length > 0) {
        setIsExistSelectedRows(true);
      }

      setSelectionModel(existSelectedRows || []);
    }
  }, [appliedSalesDiscountList, tourSalesDiscountList]);

  useEffect(() => {
    if (
      appliedSalesDiscountList == null ||
      appliedSalesDiscountList.length == undefined
    ) {
      setIsExistSelectedRows(false);
      setSelectionModel([]);
    }
  }, [appliedSalesDiscountList]);

  const fetchGetSalesDiscountByInvoiceId = async () => {
    try {
      if (!existingSalesInvoice) {
        enqueueSnackbar("Please sumbit the sales before discount", {
          variant: "error",
        });
      } else {
        await getSalesDiscountByInvoiceId(
          existingSalesInvoice.saleInvoiceHeader.uId
        );
      }
    } catch (error) { }
  };

  const fetchGetAppliedSalesDiscountByInvoiceId = async () => {
    try {
      if (existingSalesInvoice) {
        await getAppliedSalesDiscountByInvoiceId(
          existingSalesInvoice.saleInvoiceHeader.uId
        );
      }
    } catch (error) { }
  };

  const handleRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = {
      ...newRow,
      appliedDiscount: newRow.appliedDiscount,
    };

    setRows((prevRows) =>
      // @ts-ignore
      prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );
    return updatedRow;
  };

  const handleSaveBtnClick = async () => {
    setIsSaveSubmitting(true);
    const selectedRows = rows.filter((row) => selectionModel.includes(row.id));
    // mapped to discount details
    const discountDetails = selectedRows.map((row) => {
      return {
        discountUId: row.discountUId,
        rate: row.rate,
        mrp: row.mrp,
        sugProductDiscountQty:
          row.discountType === "Product Discount"
            ? row.sugProductDiscountQty
            : 0,
        appliedProductDiscountQty:
          row.discountType === "Product Discount" ? row.appliedDiscount : 0,
        sugValueDiscountProductOfferAmt:
          row.discountType === "Value Discount - Product"
            ? row.sugValueDiscountProductOfferAmt
            : 0,
        appliedValueDiscountProductOfferAmt:
          row.discountType === "Value Discount - Product"
            ? row.appliedDiscount
            : 0,
        sugInvoiceValueDiscountAmt:
          row.discountType === "Value Discount - Invoice"
            ? row.sugInvoiceValueDiscountAmt
            : 0,
        appliedInvoiceValueDiscountAmt:
          row.discountType === "Value Discount - Invoice"
            ? row.appliedDiscount
            : 0,
        isApply: true,
      };
    });

    const payload = {
      salesDiscountHeader: {
        tourScheduleUId: existingSalesInvoice.saleInvoiceHeader.tourScheduleUId,
        saleInvoiceHeaderUId: existingSalesInvoice.saleInvoiceHeader.uId,
        salesDiscountStatus: 1,
      },
      salesDiscountDetails: discountDetails,
    };

    try {
      const responceMsg = await saveSalesDiscount(payload);
      enqueueSnackbar(responceMsg, { variant: "success" });
      fetchGetSalesDiscountByInvoiceId();
      fetchGetAppliedSalesDiscountByInvoiceId();
      setSelectionModel([]);
      setAppliedSalesDiscount([]);
    } catch (error) { }
    finally {
      setIsSaveSubmitting(false);
    }
  };

  const handleUpdateBtnClick = async () => {
    setIsSaveSubmitting(true);
    // Identify selected rows
    const selectedRows = rows.filter((row) => selectionModel.includes(row.id));
    // Identify unselected rows
    const unselectedRows = rows.filter(
      (row) => !selectionModel.includes(row.id)
    );

    // Map selected rows to discount details with isApply: true
    const selectedDiscountDetails = selectedRows.map((row) => {
      return {
        discountUId: row.discountUId,
        rate: row.rate,
        mrp: row.mrp,
        sugProductDiscountQty:
          row.discountType === "Product Discount"
            ? row.sugProductDiscountQty
            : 0,
        appliedProductDiscountQty:
          row.discountType === "Product Discount" ? row.appliedDiscount : 0,
        sugValueDiscountProductOfferAmt:
          row.discountType === "Value Discount - Product"
            ? row.sugValueDiscountProductOfferAmt
            : 0,
        appliedValueDiscountProductOfferAmt:
          row.discountType === "Value Discount - Product"
            ? row.appliedDiscount
            : 0,
        sugInvoiceValueDiscountAmt:
          row.discountType === "Value Discount - Invoice"
            ? row.sugInvoiceValueDiscountAmt
            : 0,
        appliedInvoiceValueDiscountAmt:
          row.discountType === "Value Discount - Invoice"
            ? row.appliedDiscount
            : 0,
        isApply: true,
      };
    });

    // Map unselected rows to discount details with isApply: false
    const unselectedDiscountDetails = unselectedRows.map((row) => {
      return {
        discountUId: row.discountUId,
        rate: row.rate,
        mrp: row.mrp,
        sugProductDiscountQty: 0,
        appliedProductDiscountQty: 0,
        sugValueDiscountProductOfferAmt: 0,
        appliedValueDiscountProductOfferAmt: 0,
        sugInvoiceValueDiscountAmt: 0,
        appliedInvoiceValueDiscountAmt: 0,
        isApply: false,
      };
    });

    // Combine selected and unselected discount details
    const discountDetails = [
      ...selectedDiscountDetails,
      ...unselectedDiscountDetails,
    ];

    const payload = {
      salesDiscountHeader: {
        tourScheduleUId: existingSalesInvoice.saleInvoiceHeader.tourScheduleUId,
        saleInvoiceHeaderUId: existingSalesInvoice.saleInvoiceHeader.uId,
        salesDiscountStatus: 1,
      },
      salesDiscountDetails: discountDetails,
    };

    try {
      const responceMsg = await saveSalesDiscount(payload);
      enqueueSnackbar(responceMsg, { variant: "success" });
      fetchGetSalesDiscountByInvoiceId();
      fetchGetAppliedSalesDiscountByInvoiceId();
      setAppliedSalesDiscount([]);
    } catch (error) {
      enqueueSnackbar("Failed to update discounts", { variant: "error" });
    } finally {
      setIsSaveSubmitting(false);
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setShowSelectedOnly(checked);
    if (checked) {
      setBkrows(rows);
      setRows((prevRows) =>
        prevRows.filter((row) => selectionModel.includes(row.id))
      );
    } else {
      setRows(bkrows);
    }
  };

  const columns: any[] = [
    {
      field: "discountID",
      headerName: "Discount ID",
      maxWidth: 150,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "discountType",
      headerName: "Discount Type",
      minWidth: 200,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "discountName",
      headerName: "Discount Name",
      minWidth: 250,
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "vsAvailableQyt",
      headerName: "Available Qty",
      minWidth: 90,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      sortable: false,
    },
    {
      field: "sugProductDiscountQty",
      headerName: "Suggested Product Discount",
      minWidth: 90,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      sortable: false,
      valueGetter: (params: any) => {
        const { discountType, sugProductDiscountQty } = params.row;
        return discountType === "Product Discount"
          ? sugProductDiscountQty || "-"
          : "-";
      },
    },
    {
      field: "sugValueDiscountProductOfferAmt",
      headerName: "Suggested Value Discount",
      minWidth: 90,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      sortable: false,
      valueGetter: (params: any) => {
        const {
          discountType,
          sugValueDiscountProductOfferAmt,
          invoiceValueDiscountAmt,
        } = params.row;
        if (discountType === "Value Discount - Invoice") {
          return invoiceValueDiscountAmt != null
            ? formatCurrency(invoiceValueDiscountAmt)
            : "-";
        } else if (discountType === "Value Discount - Product") {
          return sugValueDiscountProductOfferAmt != null
            ? formatCurrency(sugValueDiscountProductOfferAmt)
            : "-";
        }
        return "-";
      },
    },
    {
      field: "sugInvoiceValueDiscountAmt",
      headerName: "Suggested Invoice Value Discount",
      minWidth: 90,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      sortable: false,
      valueGetter: (params: any) => {
        const { discountType, sugInvoiceValueDiscountAmt } = params.row;
        return discountType === "Value Discount - Invoice"
          ? formatCurrency(sugInvoiceValueDiscountAmt) || "-"
          : "-";
      },
    },
    {
      field: "appliedDiscount",
      headerName: "Applied Discount",
      minWidth: 120,
      flex: 1,
      disableColumnMenu: true,
      align: "right",
      headerAlign: "right",
      editable: saleStatus == 2 ? false : true,
      type: "number",
      cellClassName: "editable-cell",
      sortable: false,
    },
    { ...GRID_CHECKBOX_SELECTION_COL_DEF, width: 100 },
  ];

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(rows, columns);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "170px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <DataGrid
        sx={{ ...dataGridStockStyleMappers }}
        getRowId={(row) => row.discountUId}
        rows={searchedRows}
        columns={getColumnsWithTooltip(columns)}
        checkboxSelection
        isRowSelectable={(params) => saleStatus !== 2}
        onRowSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        rowSelectionModel={selectionModel}
        slots={{
          noRowsOverlay: CustomNoRowsOverlay,
          toolbar: () => (
            <QuickSearchToolbar
              handleTableLoadingBtnClick={
                isExistSelectedRows ? handleUpdateBtnClick : handleSaveBtnClick
              }
              isTableLoadingBtnLoading={isSaveSubmitting}
              isTableLoadingBtnDisabled={
                saleStatus == 2 ||
                (!isExistSelectedRows && selectionModel.length == 0)
              }
              tableLoadingBtnText={isExistSelectedRows ? "Update" : "Save"}
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
        density="compact"
        hideFooter
        disableRowSelectionOnClick
        disableColumnMenu
      />
    </>
  );
};

export default DiscountTable;
