import { formatCurrency } from "@/utils/formatCurrency";

export const ChequeCollectionReportTableHeadings = [
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
    field: "tourID",
    headerName: "Tour Schedule ID",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 200,
    minWidth: 150,
    sortable: false,
  },
  {
    field: "tourType",
    headerName: "Tour Type",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 100,
    minWidth: 100,
    sortable: false,
  },
  // {
  //   field: "distributorID",
  //   headerName: "Distri ID",
  //   disableColumnMenu: true,
  //   flex: 1,
  //   maxWidth: 100,
  //   minWidth: 100,
  //   sortable: false,
  // },
  // {
  //   field: "distributorName",
  //   headerName: "Distri: Name",
  //   disableColumnMenu: true,
  //   maxWidth: 200,
  //   minWidth: 150,
  //   flex: 1,
  //   sortable: false,
  // },
  {
    field: "representativeName",
    headerName: "Rep",
    disableColumnMenu: true,
    maxWidth: 200,
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    field: "routeName",
    headerName: "Route",
    disableColumnMenu: true,
    maxWidth: 200,
    minWidth: 150,
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
    field: "invoiceNumber",
    headerName: "Invoice Num:",
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
    field: "chequeDate",
    headerName: "Cheque Date",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 100,
    minWidth: 100,
    sortable: false,
    valueGetter: (params: any) => {
      const date = params.row.chequeDate;
      return date ? new Date(date).toLocaleDateString() : "-";
    },
  },
  {
    field: "chequeNumber",
    headerName: "Cheque Number",
    disableColumnMenu: true,
    maxWidth: 150,
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  // {
  //   field: "bankChequeAmount",
  //   headerName: "Bank Cheque Amount",
  //   headerAlign: "right",
  //   align: "right",
  //   disableColumnMenu: true,
  //   flex: 1,
  //   maxWidth: 150,
  //   minWidth: 150,
  //   sortable: false,
  //   valueGetter: (params: any) => {
  //     const bankChequeAmount = params.row.bankChequeAmount;
  //     return bankChequeAmount ? Number(bankChequeAmount) : "-";
  //   },
  // },
  {
    field: "paidAmount",
    headerName: "Paid Amount",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const paidAmount = params.row.paidAmount;
      return paidAmount ? formatCurrency(Number(paidAmount)) : "-";
    },
  },
  {
    field: "status",
    headerName: "Status",
    disableColumnMenu: true,
    maxWidth: 100,
    minWidth: 100,
    flex: 1,
    sortable: false,
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 150],
};
