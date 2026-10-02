
import { PATH_DASHBOARD } from "@/routes/paths";
import { enqueueSnackbar } from "notistack";
import SwitchCell from "@/components/switch-cell/switchCell";
import { statusSortComparator } from "@/utils/sortUtils";
import { IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { tableIconColors } from "@/styles/tableStyles/tableStyle";
import dayjs from "dayjs";
import { dispatch } from "@/redux/store";
import { setPriceList } from "@/redux/slices/price-list-slice";
import { setPopupView } from "@/redux/slices/layout-slice";
import Link from "next/link";
import { updatePriceListStatus } from "@/service/priceList.service";
import { formatRate } from "@/utils/formatCurrency";

export const PriceListTableHeadings = [
  // {
  //   field: "uId",
  //   headerName: "UID",
  //   disableColumnMenu: true,
  //   flex: 1,
  //   minWidth: 60,
  //   // maxWidth: 70,
  // },
  {
    field: "priceListType.priceListTypeId",
    headerName: "Price List Type",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 120,
    valueGetter: (params: any) => params.row.priceListType.priceListTypeId || "-",
  },
  {
    field: "priceListType.priceListTypeName",
    headerName: "PL Type Name",
    disableColumnMenu: true,
    flex: 1,
    valueGetter: (params: any) => params.row.priceListType.priceListTypeName || "-",
  },
  {
    field: "startDate",
    headerName: "Start Date",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 50,
    maxWidth: 100,
    valueGetter: (params: any) => {
      const date = params.row.startDate;
      return date ? dayjs(date).format('MM/DD/YYYY') : "-";
    },
  },
  {
    field: "endDate",
    headerName: "End Date",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 50,
    maxWidth: 100,
    valueGetter: (params: any) => {
      const date = params.row.endDate;
      return date ? dayjs(date).format('MM/DD/YYYY') : "-";
    },
  },
  {
    field: "priceType.name",
    headerName: "Price Type",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 100,
    valueGetter: (params: any) => params.row.priceType.name || "-",
  },
    {
    field: "product.productID",
    headerName: "PID",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 100,
    valueGetter: (params: any) => params.row.product.productID || "-",
  },
  {
    field: "product.productName",
    headerName: "Product",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 300,
    valueGetter: (params: any) => params.row.product.productName || "-",
  },
  {
    field: "mrp",
    headerName: "MRP",
    disableColumnMenu: true,
    flex: 1,
    maxWidth: 120,
    headerAlign: "right",
    align: "right",
  },
  {
    field: "rate",
    headerName: "Rate",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 120,
    headerAlign: "right",
    align: "right",
     valueGetter: (params: any) => formatRate(params.row.rate) || "-",
  },
  {
    field: "batchNumber",
    headerName: "Batch No",
    disableColumnMenu: true,
    flex: 1,
    minWidth: 120,
    headerAlign: "right",
    align: "right",
  },
  {
    field: "active",
    headerName: "Status",
    flex: 1,
    disableColumnMenu: true,
    minWidth: 70,
    headerAlign: "center",
    align: "center",
    sortComparator: statusSortComparator('active'),
    renderCell: (params: any) => {
      return (
        <SwitchCell
          row={params.row}
          updateServiceReq={updatePriceListStatus}
          enqueueSnackbar={enqueueSnackbar}
          featureName="Price List"
        />
      );
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    flex: 1,
    minWidth: 130,
    headerAlign: "center",
    align: "center",
    renderCell: (params: any) => {
      const onClickView = () => {
        dispatch(setPriceList(params.row));
        dispatch(setPopupView(true));
      };

      const onClickEdit = () => {
        dispatch(setPriceList(params.row));
      };

      return (
        <>
          <Tooltip title={"View"}>
            <IconButton onClick={onClickView}>
              <VisibilityIcon
                fontSize="small"
                sx={{ color: tableIconColors.visibilityIcon }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title={"Update"}>
            <Link href={`${PATH_DASHBOARD.priceList.list}/${params.row.uId}`}>
              <IconButton onClick={onClickEdit}>
                <EditIcon
                  fontSize="small"
                  sx={{ color: tableIconColors.editIconColor }}
                />
              </IconButton>
            </Link>
          </Tooltip>
        </>
      );
    },
  },
];

export const tableOptions = {
  rowsPerPageOptions: [5, 10, 15, 100],

};
