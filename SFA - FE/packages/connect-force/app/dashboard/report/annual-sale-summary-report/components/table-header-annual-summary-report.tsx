import { formatCurrency } from "@/utils/formatCurrency";

export const AnnualSaleSummaryReportTableHeadings = [
  {
    field: "outletUId",
    headerName: "Outlet ID",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 200,
    minWidth: 150,
    sortable: false,
  },
  {
    field: "outletName",
    headerName: "Outlet Name",
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
    maxWidth: 200,
    minWidth: 150,
    sortable: false,
  },
  {
    field: "jan",
    headerName: "Jan",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const jan = params.row.jan;
      return jan ? formatCurrency(Number(jan)) : "-";
    },
  },
  {
    field: "feb",
    headerName: "Feb",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const feb = params.row.feb;
      return feb ? formatCurrency(Number(feb)) : "-";
    },
  },
  {
    field: "mar",
    headerName: "Mar",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const mar = params.row.mar;
      return mar ? formatCurrency(Number(mar)) : "-";
    },
  },
  {
    field: "apr",
    headerName: "Apr",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const apr = params.row.apr;
      return apr ? formatCurrency(Number(apr)) : "-";
    },
  },
  {
    field: "may",
    headerName: "May",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const may = params.row.may;
      return may ? formatCurrency(Number(may)) : "-";
    },
  },
  {
    field: "jun",
    headerName: "Jun",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const jun = params.row.jun;
      return jun ? formatCurrency(Number(jun)) : "-";
    },
  },
  {
    field: "jul",
    headerName: "Jul",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const jul = params.row.jul;
      return jul ? formatCurrency(Number(jul)) : "-";
    },
  },
  {
    field: "aug",
    headerName: "Aug",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const aug = params.row.aug;
      return aug ? formatCurrency(Number(aug)) : "-";
    },
  },
  {
    field: "sep",
    headerName: "Sep",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const sep = params.row.sep;
      return sep ? formatCurrency(Number(sep)) : "-";
    },
  },
  {
    field: "oct",
    headerName: "Oct",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const oct = params.row.oct;
      return oct ? formatCurrency(Number(oct)) : "-";
    },
  },
  {
    field: "nov",
    headerName: "Nov",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const nov = params.row.nov;
      return nov ? formatCurrency(Number(nov)) : "-";
    },
  },
  {
    field: "dec",
    headerName: "Dec",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 110,
    minWidth: 110,
    sortable: false,
    valueGetter: (params: any) => {
      const dec = params.row.dec;
      return dec ? formatCurrency(Number(dec)) : "-";
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 150],
};
