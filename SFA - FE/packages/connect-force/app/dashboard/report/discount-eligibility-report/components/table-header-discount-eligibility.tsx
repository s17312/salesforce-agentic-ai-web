import { formatCurrency } from "@/utils/formatCurrency";

export const DiscountEligibilityReportTableHeadings = [
  {
    field: "invoiceDate",
    headerName: "Invoice Date",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 100,
    minWidth: 100,
    sortable: false,
    valueGetter: (params: any) => {
      const date = params.row.invoiceDate;

      // If the scheduleDate is a special label like "Sub Total" or "Grand Total", return it as is
      if (date === "Sub Total" || date === "Grand Total") {
        return date;
      }

      // Otherwise, handle it as a date
      return date ? new Date(date).toLocaleDateString() : "-";
    },
  },
  {
    field: "invoiceNumber",
    headerName: "Invoice Num:",
    disableColumnMenu: true,
    maxWidth: 200,
    minWidth: 200,
    flex: 1,
    sortable: false,
  },
  {
    field: "tourType",
    headerName: "Tour Type",
    disableColumnMenu: true,
    maxWidth: 100,
    minWidth: 100,
    flex: 1,
    sortable: false,
  },
  {
    field: "outletID",
    headerName: "Outlet ID",
    disableColumnMenu: true,
    maxWidth: 100,
    minWidth: 100,
    flex: 1,
    sortable: false,
  },
  {
    field: "outletName",
    headerName: "Outlet Name",
    disableColumnMenu: true,
    maxWidth: 200,
    minWidth: 200,
    flex: 1,
    sortable: false,
  },
  {
    field: "invoiceAmount",
    headerName: "Invoice Amt",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const invoiceAmount = params.row.invoiceAmount;
      return invoiceAmount ? formatCurrency(Number(invoiceAmount)) : "-";
    },
  },
  {
    field: "discountType",
    headerName: "Discount Type",
    disableColumnMenu: true,
    maxWidth: 150,
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    field: "discountId",
    headerName: "Discount ID",
    disableColumnMenu: true,
    maxWidth: 100,
    minWidth: 100,
    flex: 1,
    sortable: false,
  },
  {
    field: "discountName",
    headerName: "Discount Name",
    disableColumnMenu: true,
    maxWidth: 200,
    minWidth: 200,
    flex: 1,
    sortable: false,
  },
  {
    field: "discountProductQty",
    headerName: "Discount Product Qty",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const discountProductQty = params.row.discountProductQty;
      return discountProductQty ? Number(discountProductQty) : "-";
    },
  },
  {
    field: "discountValue",
    headerName: "Discount Value Amt",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const discountValue = params.row.discountValue;
      return discountValue ? formatCurrency(Number(discountValue)) : "-";
    },
  },
  {
    field: "salesValue",
    headerName: "Sales Value",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const salesValue = params.row.salesValue;
      return salesValue ? formatCurrency(Number(salesValue)) : "-";
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 150],
};
