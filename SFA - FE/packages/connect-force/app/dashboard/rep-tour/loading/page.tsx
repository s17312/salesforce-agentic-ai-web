"use client";

import React, { useEffect, useState } from "react";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { useSelector } from "@/redux/store";
import {
  deleteTourLoading,
  getAllTourLoadings,
  updateTourScheduleStatus,
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
import { Alert, Box, CircularProgress, IconButton } from "@mui/material";
import ConfirmDeleteDialog from "@/components/popup/ConfirmDeleteDialog";
import EditIcon from "@mui/icons-material/Edit";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

interface LoadingRepTourProps {
  params: { id: number };
  schedule: any;
  setIsNewLoadingSelected: (value: boolean) => void;
  setIsEditing: (value: boolean) => void;
  setIsViewing: (value: boolean) => void;
  setEditLoadingId: (value: number) => void;
  setViewLoadingId: (value: number) => void;
  setDistributorWarehouseUId: (value: number) => void;
  setTabValue: (value: string) => void;
  isFullScreen: boolean;
  fetchTourScheduleID: ()=> void;
}

const LoadingRepTour: React.FC<LoadingRepTourProps> = ({
  params,
  schedule,
  setIsNewLoadingSelected,
  setIsEditing,
  setIsViewing,
  setEditLoadingId,
  setViewLoadingId,
  setDistributorWarehouseUId,
  setTabValue,
  isFullScreen,
  fetchTourScheduleID,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const loading_list = useSelector(
    (state) => state.tourScheduleSlice.TourLoadings
  );

  const fetchTourLoadings = async () => {
    try {
      setIsLoading(true);
      await getAllTourLoadings(params.id);
    } catch (error) {
      enqueueSnackbar("Error fetching tour schedules", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTourLoadings();
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

  const handleViewLoading = (id: number, distributorWarehouseUId: number) => {
    setViewLoadingId(id);
    setIsViewing(true);
    setDistributorWarehouseUId(distributorWarehouseUId);
  };

  const handleNextClick = async () => {
    await updateTourScheduleStatus(schedule.uId);
    setTabValue("3");
    fetchTourScheduleID();
  };

  const columns: any[] = [
    {
      field: "loadingId",
      headerName: "Loading ID",
      minWidth: 200,
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
      minWidth: 250,
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
      field: "action",
      headerName: "Action",
      align: "left",
      headerAlign: "left",
      minWidth: 50,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const { status, distributorWarehouseUId } = params.row;

        return (
          <div>
            {/* View Loading */}
            {status !== 0 && (
              <IconButton
                size="small"
                onClick={() =>
                  handleViewLoading(params.row.uId, distributorWarehouseUId)
                }
              >
                <VisibilityIcon
                  fontSize="small"
                  sx={{ color: tableIconColors.visibilityIcon }}
                />
              </IconButton>
            )}
            {/* Edit Loading */}
            {status === 0 && (
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
            {/* Delete Loading */}
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
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "200px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              sx={{ height: "63vh" }}
              getRowId={(row) => row.uId}
              rows={searchedRows}
              columns={getColumnsWithTooltip(columns)}
              density="compact"
              disableRowSelectionOnClick
              disableColumnMenu
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                toolbar: () => (
                  <QuickSearchToolbar
                    handleNewClick={handleNewClick}
                    handleNextClick={handleNextClick}
                    newBtnText={"Add new loading"}
                    isNewButtonDisabled={schedule.statusUId >= 4 }
                    isDisabled={
                      !(Array.isArray(loading_list) &&
                      loading_list.length > 0 &&
                      loading_list.some(item => item.status === 1))
                    }
                    columns={columns.filter(
                      (col) => col.field !== "status" && col.field !== "action"
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
          )}
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
