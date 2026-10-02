import { formatCurrency } from "@/utils/formatCurrency";

export const DistributorSalesReportTableHeadings = [
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
    field: "distributorID",
    headerName: "Distributor ID",
    disableColumnMenu: true,
    maxWidth: 100,
    minWidth: 100,
    flex: 1,
    sortable: false,
  },
  {
    field: "distributorName",
    headerName: "Distributor Name",
    disableColumnMenu: true,
    maxWidth: 200,
    minWidth: 200,
    flex: 1,
    sortable: false,
  },
  {
    field: "representativeID",
    headerName: "Representative ID",
    disableColumnMenu: true,
    maxWidth: 100,
    minWidth: 100,
    flex: 1,
    sortable: false,
  },
  {
    field: "representativeName",
    headerName: "Representative Name",
    disableColumnMenu: true,
    maxWidth: 200,
    minWidth: 200,
    flex: 1,
    sortable: false,
  },
  {
    field: "invoiceNumber",
    headerName: "Invoice Number",
    disableColumnMenu: true,
    maxWidth: 200,
    minWidth: 200,
    flex: 1,
    sortable: false,
  },
  {
    field: "invoiceAmount",
    headerName: "Sale Amt",
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
    field: "discountAmount",
    headerName: "Discount Amt",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const discountAmount = params.row.discountAmount;
      return discountAmount ? formatCurrency(Number(discountAmount)) : "-";
    },
  },
  {
    field: "returnAmount",
    headerName: "Return Amt",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const returnAmount = params.row.returnAmount;
      return returnAmount ? formatCurrency(Number(returnAmount)) : "-";
    },
  },
  {
    field: "totalAmount",
    headerName: "Total Amt",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const totalAmount = params.row.totalAmount;
      return totalAmount ? formatCurrency(Number(totalAmount)) : "-";
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 150],
};
