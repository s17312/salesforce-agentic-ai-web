import { formatCurrency } from "@/utils/formatCurrency";

export const DailyCollectionReportTableHeadings = [
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
      if (date === "Sub Total" || date === "Grand Total") {
        return date;
      }
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
    field: "cashAmount",
    headerName: "Cash Amt",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const cashAmount = params.row.cashAmount;
      return cashAmount ? formatCurrency(Number(cashAmount)) : "-";
    },
  },
  {
    field: "chequeAmount",
    headerName: "Cheque Amt",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const chequeAmount = params.row.chequeAmount;
      return chequeAmount ? formatCurrency(Number(chequeAmount)) : "-";
    },
  },
  {
    field: "chequeNumbers",
    headerName: "Cheque Num:",
    disableColumnMenu: true,
    maxWidth: 150,
    minWidth: 150,
    flex: 1,
    sortable: false,
    valueGetter: (params: any) => {
      return params.row.chequeNumbers ?? "-";
    },
  },
  {
    field: "balanceAmount",
    headerName: "Balance Amt",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const balanceAmount = params.row.balanceAmount;
      return balanceAmount ? formatCurrency(Number(balanceAmount)) : "-";
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 150],
};
