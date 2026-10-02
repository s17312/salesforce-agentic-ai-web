"use client";

import React, { useEffect, useRef, useState } from "react";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { IconButton, Tooltip, useTheme } from "@mui/material";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import PeopleIcon from "@mui/icons-material/People";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  dataGridStockViewStyleMappers,
  tableIconColors,
} from "@/styles/tableStyles/tableStyle";
import {
  deleteTourSchedule,
  getAllTourSchedules,
} from "@/service/tour-service/tourSchedule.service";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "@/redux/store";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { PATH_DASHBOARD } from "@/routes/paths";
import { Tour_StatusChip } from "./components/tourStatusChip";
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import Link from "next/link";
import ConfirmDeleteDialog from "@/components/popup/ConfirmDeleteDialog";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const RepTour = () => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const schedules_list = useSelector(
    (state) => state.tourScheduleSlice.TourSchedulesAll
  );
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    fetchTourSchedulesAll();
  }, []);

  const fetchTourSchedulesAll = async () => {
    try {
      setIsLoading(true);
      await getAllTourSchedules();
    } catch (error) {
      enqueueSnackbar("Error fetching tour schedules", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewClick = () => {
    router.push(PATH_DASHBOARD.repTour.add);
  };

  const handleDeleteClick = (id: number) => {
    setOpen(true);
    setDeleteId(id);
  };

  const deleteHandler = async (id: number) => {
    try {
      const response = await deleteTourSchedule(id);
      enqueueSnackbar(response, { variant: "success" });
      fetchTourSchedulesAll();
      setOpen(false);
      setDeleteId(0);
    } catch (error) {
      enqueueSnackbar("Error deleting tour schedule", { variant: "error" });
    }
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const columns: any[] = [
    {
      field: "scheduleDate",
      headerName: "Schedule Date",
      flex: 1,
      sortable: false,
      valueGetter: (params: any) =>
        String(params.row.scheduleDate).split("T")[0] || "",
    },
    {
      field: "tourID",
      headerName: "Schedule ID",
      flex: 1,
      sortable: false,
      renderCell: (params: any) => (
        <Link href={`${PATH_DASHBOARD.repTour.repTour}/${params.row.uId}`}>
          {params.value}
        </Link>
      ),
    },
    {
      field: "representative.name",
      headerName: "Sales Rep",
      flex: 1,
      sortable: false,
      valueGetter: (params: any) => params.row.representative?.name || "",
    },
    {
      field: "route",
      headerName: "Route",
      flex: 1,
      sortable: false,
      renderCell: (params: any) => (
        <Tooltip
          title={
            <div>
              {params.row.route.map((route: any, index: any) => (
                <div key={index}>{route.routeName}</div>
              ))}
            </div>
          }
          arrow
        >
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            {params.row.route.map((route: any, index: any) => (
              <span key={index}>
                {route.routeName}
                {index < params.row.route.length - 1 && ", "}
              </span>
            ))}
          </div>
        </Tooltip>
      ),
      cellClassName: "auto-height",
    },
    {
      field: "statusUId",
      headerName: "Status",
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => <Tour_StatusChip status={params.value} />,
    },
    {
      field: "vehicle",
      headerName: "Vehicle",
      flex: 1,
      sortable: false,
      valueGetter: (params: any) => params.row.vehicle?.plateNumber || "",
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        const { statusUId } = params.row;
        return (
          <>
            <Link href={`${PATH_DASHBOARD.repTour.repTour}/${params.row.uId}`}>
              <IconButton size="small">
                <VisibilityIcon
                  fontSize="small"
                  sx={{ color: tableIconColors.visibilityIcon }}
                />
              </IconButton>
            </Link>
            {statusUId == 1 && (
              <IconButton
                size="small"
                onClick={() => handleDeleteClick(params.row.uId)}
              >
                <DeleteIcon
                  fontSize="small"
                  sx={{ color: tableIconColors.deleteIcon }}
                />
              </IconButton>
            )}
          </>
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
  } = useColumnFilter(schedules_list, columns);

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Sales Tour"
        pageNavigation={[
          {
            pageName: "Sales Tour",
          },
          { pageName: "View" },
        ]}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<PeopleIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        {/* Rep tour Table */}
        <DataGrid
          sx={{
            ...dataGridStockViewStyleMappers,
          }}
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
                newBtnText={"Add new schedule"}
                columns={columns.filter(
                  (col) =>
                    col.field !== "statusUId" &&
                    col.field !== "action" &&
                    col.field !== "vehicle"
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
        />
      </Container>
      <ConfirmDeleteDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteHandler(deleteId)}
      />
    </FsBox>
  );
};

export default RepTour;
