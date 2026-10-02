export const LoadingUnloadingSummaryReportTableHeadings = [
  {
    field: "tourDate",
    headerName: "Tour Date",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 100,
    minWidth: 100,
    sortable: false,
    valueGetter: (params: any) => {
      const date = params.row.tourDate;

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
  {
    field: "productID",
    headerName: "Product ID",
    disableColumnMenu: true,
    maxWidth: 100,
    minWidth: 100,
    flex: 1,
    sortable: false,
  },
  {
    field: "productName",
    headerName: "Product Name",
    disableColumnMenu: true,
    maxWidth: 200,
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    field: "productGroupName",
    headerName: "Product Group",
    disableColumnMenu: true,
    maxWidth: 200,
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    field: "categoryName",
    headerName: "Product Category",
    disableColumnMenu: true,
    maxWidth: 200,
    minWidth: 150,
    flex: 1,
    sortable: false,
  },
  {
    field: "mrp",
    headerName: "MRP",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 150,
    sortable: false,
    valueGetter: (params: any) => {
      const mrp = params.row.mrp;
      return mrp ? Number(mrp).toFixed(2) : "-";
    },
  },
  {
    field: "rate",
    headerName: "Rate",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 150,
    sortable: false,
    valueGetter: (params: any) => {
      const rate = params.row.rate;
      return rate ? Number(rate).toFixed(2) : "-";
    },
  },
  {
    field: "loadingQuantity",
    headerName: "Loading Quantity",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 150,
    sortable: false,
    valueGetter: (params: any) => {
      const loadingQuantity = params.row.loadingQuantity;
      return loadingQuantity ? Number(loadingQuantity).toFixed(2) : "-";
    },
  },
  {
    field: "loadingValue",
    headerName: "Loading Value",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 150,
    sortable: false,
    valueGetter: (params: any) => {
      const loadingValue = params.row.loadingValue;
      return loadingValue ? Number(loadingValue).toFixed(2) : "-";
    },
  },
  {
    field: "saleQuantity",
    headerName: "Sale Quantity",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 150,
    sortable: false,
    valueGetter: (params: any) => {
      const saleQuantity = params.row.saleQuantity;
      return saleQuantity ? Number(saleQuantity).toFixed(2) : "-";
    },
  },
  {
    field: "discountQuantity",
    headerName: "Discount Quantity",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 150,
    sortable: false,
    valueGetter: (params: any) => {
      const discountQuantity = params.row.discountQuantity;
      return discountQuantity ? Number(discountQuantity).toFixed(2) : "-";
    },
  },
  {
    field: "sellableQuantity",
    headerName: "Sellable Quantity",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 150,
    sortable: false,
    valueGetter: (params: any) => {
      const sellableQuantity = params.row.sellableQuantity;
      return sellableQuantity ? Number(sellableQuantity).toFixed(2) : "-";
    },
  },
  {
    field: "nonSellableQuantity",
    headerName: "Non Sellable Quantity",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 150,
    sortable: false,
    valueGetter: (params: any) => {
      const nonSellableQuantity = params.row.nonSellableQuantity;
      return nonSellableQuantity ? Number(nonSellableQuantity).toFixed(2) : "-";
    },
  },
  {
    field: "totalGoodQuantity",
    headerName: "Total Good Quantity",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 150,
    sortable: false,
    valueGetter: (params: any) => {
      const totalGoodQuantity = params.row.totalGoodQuantity;
      return totalGoodQuantity ? Number(totalGoodQuantity).toFixed(2) : "-";
    },
  },
  {
    field: "totalGoodValue",
    headerName: "Total Good Value",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 150,
    sortable: false,
    valueGetter: (params: any) => {
      const totalGoodValue = params.row.totalGoodValue;
      return totalGoodValue ? Number(totalGoodValue).toFixed(2) : "-";
    },
  },
  {
    field: "totalNonSellableQuantity",
    headerName: "Total Non Sellable Quantity",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 150,
    sortable: false,
    valueGetter: (params: any) => {
      const totalNonSellableQuantity = params.row.totalNonSellableQuantity;
      return totalNonSellableQuantity
        ? Number(totalNonSellableQuantity).toFixed(2)
        : "-";
    },
  },
  {
    field: "totalNonSellableValue",
    headerName: "Total Non Sellable Value",
    headerAlign: "right",
    align: "right",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 150,
    minWidth: 150,
    sortable: false,
    valueGetter: (params: any) => {
      const totalNonSellableValue = params.row.totalNonSellableValue;
      return totalNonSellableValue
        ? Number(totalNonSellableValue).toFixed(2)
        : "-";
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 150],
};
