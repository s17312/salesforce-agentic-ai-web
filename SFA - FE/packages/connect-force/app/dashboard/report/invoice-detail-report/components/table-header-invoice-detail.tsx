import { formatCurrency } from "@/utils/formatCurrency";

export const InvoiceDetailReportTableHeadings = [
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
    field: "scheduleDate",
    headerName: "Schedule Date",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 100,
    minWidth: 100,
    sortable: false,
    valueGetter: (params: any) => {
      const date = params.row.scheduleDate;

      // If the scheduleDate is a special label like "Sub Total" or "Grand Total", return it as is
      if (date === "Sub Total" || date === "Grand Total") {
        return date;
      }

      // Otherwise, handle it as a date
      return date ? new Date(date).toLocaleDateString() : "-";
    },
  }, 
  {
    field: "outletID",
    headerName: "Outlet ID",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 100,
    minWidth: 100,
    sortable: false,
  },
  {
    field: "outletName",
    headerName: "Outlet Name",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 200,
    minWidth: 200,
    sortable: false,
  },
  {
    field: "manualInvoiceNumber",
    headerName: "Invoice Number",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 200,
    minWidth: 200,
    sortable: false,
  },
  {
    field: "PaymentDate",
    headerName: "Payment Date",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 100,
    minWidth: 100,
    sortable: false,
    valueGetter: (params: any) => {
      const date = params.row.paymentDate;
      return date ? new Date(date).toLocaleDateString() : "-";
    },
  },
  {
    field: "paymentIds",
    headerName: "Payment IDs",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 200,
    minWidth: 200,
    sortable: false,
  },
  {
    field: "invoiceAmount",
    headerName: "Sale Amount",
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
    headerName: "Discount Amount",
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
    headerName: "Return Amount",
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
    headerName: "Invoice Amount",
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
  {
    field: "cashAmount",
    headerName: "Cash Amount",
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
    headerName: "Cheque Amount",
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
    field: "creditAmount",
    headerName: "Credit Amount",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const creditAmount = params.row.creditAmount;
      return creditAmount ? formatCurrency(Number(creditAmount)) : "-";
    },
  },
  {
    field: "chequeNumber",
    headerName: "Cheque Number",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 100,
    minWidth: 100,
    sortable: false,
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 150],
};
