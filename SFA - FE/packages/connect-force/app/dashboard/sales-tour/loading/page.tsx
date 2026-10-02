"use client";

import React, { useEffect, useState } from "react";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { dispatch, useSelector } from "@/redux/store";
import {
  deleteTourLoading,
  getAllTourLoadings,
} from "@/service/tour-service/tourLoading.service";
import {
  dataGridStyle,
  tableIconColors,
} from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { enqueueSnackbar } from "notistack";
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Loading_StatusChip } from "./components/tourStatusChip";
import { Alert, IconButton } from "@mui/material";
import ConfirmDeleteDialog from "@/components/popup/ConfirmDeleteDialog";
import { updateValueTourScheduleStatus } from "@/service/value-sale/valueSaleinvoice.service";
import EditIcon from "@mui/icons-material/Edit";
import { Mobile_Loading_StatusChip } from "../components/mobileLoadingStatusChip";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import { useRouter } from "next/navigation";
import { PATH_DASHBOARD } from "@/routes/paths";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";
import { setPrimaryWarehousesList } from "@/redux/slices/tour/tour-sales-unloading";

interface LoadingRepTourProps {
  params: { id: number };
  schedule: any;
  setIsNewLoadingSelected: (value: boolean) => void;
  setIsEditing: (value: boolean) => void;
  setEditLoadingId: (value: number) => void;
  setDistributorWarehouseUId: (value: number) => void;
  setTabValue: (value: string) => void;
}

const LoadingRepTour: React.FC<LoadingRepTourProps> = ({
  params,
  schedule,
  setIsNewLoadingSelected,
  setIsEditing,
  setEditLoadingId,
  setDistributorWarehouseUId,
  setTabValue,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const loading_list = useSelector(
    (state) => state.tourScheduleSlice.TourLoadings
  );
  const disabledStatuses = [4, 5, 6, 15, 16,17];
  const isDisabled = disabledStatuses.includes(schedule.statusUId);

  const fetchTourLoadings = async () => {
    setIsLoading(true);
    try {
      await getAllTourLoadings(params.id);
    } catch (error) {
      enqueueSnackbar("Error fetching tour schedules", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTourLoadings();
    dispatch(setPrimaryWarehousesList([]));
  }, []);

  const handleNewClick = () => {
    setIsNewLoadingSelected(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    try {
      const responseMsg = await deleteTourLoading(id);
      enqueueSnackbar(`${responseMsg}`, { variant: "success" });
      fetchTourLoadings();
    } catch {
      enqueueSnackbar("Error deleting loading", { variant: "error" });
    } finally {
      setOpen(false);
    }
  };

  const handleEditLoading = (id: number, distributorWarehouseUId: number) => {
    setEditLoadingId(id);
    setIsEditing(true);
    setDistributorWarehouseUId(distributorWarehouseUId);
  };

  const handleTableBtnClick = async () => {
    if (schedule.isMobile) {
      try {
        await updateValueTourScheduleStatus(schedule.uId, 9);
        enqueueSnackbar("Mobile tour initiated successfully", {
          variant: "success",
        });
        router.push(PATH_DASHBOARD.salesTour.salesTour);
      } catch (error) {
        enqueueSnackbar("Error initiating mobile tour", { variant: "error" });
      }
    } else {
      await updateValueTourScheduleStatus(schedule.uId, 3);
      setTabValue("3");
    }
  };

  const baseColumns: any[] = [
    {
      field: "loadingId",
      headerName: "Loading ID",
      minWidth: 170,
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "distributorWarehouseName",
      headerName: "Warehouse",
      minWidth: 200,
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "vehicleWarehouseName",
      headerName: "Vehicle Number",
      minWidth: 200,
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "total",
      headerName: "Total Loading Qty",
      align: "right",
      headerAlign: "right",
      minWidth: 120,
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 200,
      flex: 1,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => <Loading_StatusChip status={params.value} />,
    },
    {
      field: "mobileStatusUId",
      headerName: "Mobile Status",
      minWidth: 200,
      flex: 1,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
        <Mobile_Loading_StatusChip status={params.row.status == 0 ? 1 : params.value} />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      align: "center",
      headerAlign: "center",
      minWidth: 50,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const { status, distributorWarehouseUId, mobileStatusUId } = params.row;

        if (schedule.statusUId >= 4 || status !== 0) {
          return (
            <>
              <IconButton
                size="small"
                onClick={() =>
                  handleEditLoading(params.row.uId, distributorWarehouseUId)
                }
              >
                <VisibilityIcon
                  fontSize="small"
                  sx={{ color: tableIconColors.visibilityIcon }}
                />
              </IconButton>

              {((mobileStatusUId === 0 && status === 0) || mobileStatusUId === 12) && (
                <IconButton
                  size="small"
                  onClick={() =>
                    handleEditLoading(params.row.uId, distributorWarehouseUId)
                  }
                >
                  <EditIcon
                    fontSize="small"
                    sx={{ color: tableIconColors.editIconColor }}
                  />
                </IconButton>
              )}
            </>
          );
        }

        return (
          <div>
            {status === 0 && (
              <IconButton
                size="small"
                onClick={() =>
                  handleEditLoading(params.row.uId, distributorWarehouseUId)
                }
                disabled={schedule.statusUId >= 4}
              >
                <EditIcon
                  fontSize="small"
                  sx={{ color: tableIconColors.editIconColor }}
                />
              </IconButton>
            )}
            {status === 0 && (
              <IconButton
                size="small"
                onClick={() => handleDelete(params.row.uId)}
              >
                <DeleteIcon sx={{ color: tableIconColors.deleteIcon }} />
              </IconButton>
            )}
          </div>
        );
      },
    },
  ];

  // Conditionally filter out the column
  const columns = schedule.isMobile
    ? baseColumns
    : baseColumns.filter((col) => col.field !== "mobileStatusUId");

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(loading_list, columns);

  return (
    <>
      {schedule?.statusUId === 1 ? (
        <Alert severity="info">
          Please start the tour schedule to proceed with loading
        </Alert>
      ) : (
        <>
          <DataGrid
            sx={{ ...dataGridStyle }}
            getRowId={(row) => row.uId}
            rows={searchedRows}
            columns={getColumnsWithTooltip(columns)}
            density="compact"
            hideFooter
            disableRowSelectionOnClick
            disableColumnMenu
            loading={isLoading}
            slots={{
              noRowsOverlay: CustomNoRowsOverlay,
              toolbar: () => (
                <QuickSearchToolbar
                  handleNewClick={handleNewClick}
                  isNewButtonDisabled={isDisabled}
                  isDisabled={isDisabled}
                  isTableBtnDisabled={loading_list.length === 0 }
                  {...(schedule.statusUId < 9 ? { handleTableBtnClick } : {})}
                  tableBtnText={
                    schedule.statusUId == 8 ? "Initiate Mobile Tour" : "Next"
                  }
                  nextBtnIcon={<PlayCircleOutlineRoundedIcon />}
                  newBtnText={"Add new loading"}
                  columns={columns.filter(
                    (col) =>
                      col.field !== "mobileStatusUId" &&
                      col.field !== "action" &&
                      col.field !== "status"
                  )}
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
            disableColumnFilter
          />
        </>
      )}
      <ConfirmDeleteDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteId !== null && handleDeleteClick(deleteId)}
      />
    </>
  );
};

export default LoadingRepTour;
