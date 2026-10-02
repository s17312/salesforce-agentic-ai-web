"use client";

import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import QuickSearchToolbarIcons from "./components/search-filter-icons";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import {
  RepresentativeMapperTableHeadings,
  tableOptions,
} from "./components/table-component-representativeMapper";
import { getAllSalesRepresentativeDetails } from "@/service/salesRepresentative.service";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const RepresentativeMapper = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const representativeList = useSelector(
    (state) => state.salesRepresentativeSlice.salesRepresentativeDetails
  );
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(representativeList, RepresentativeMapperTableHeadings);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedRows.length > 0) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [selectedRows]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await getAllSalesRepresentativeDetails(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        true
      );
    } catch (error) {
      dispatch(setPopupResponse(true));
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = () => {
    const selectedRowsString = JSON.stringify(selectedRows);
    router.push(
      `${
        PATH_DASHBOARD.representativeMapper.product
      }?selectedRows=${encodeURIComponent(selectedRowsString)}`
    );
  };

  const handleRouteClick = () => {
    const selectedRowsString = JSON.stringify(selectedRows);
    router.push(
      `${
        PATH_DASHBOARD.representativeMapper.route
      }?selectedRows=${encodeURIComponent(selectedRowsString)}`
    );
  };

  const handleOutletClick = () => {
    const selectedRowsString = JSON.stringify(selectedRows);
    router.push(
      `${
        PATH_DASHBOARD.representativeMapper.outlet
      }?selectedRows=${encodeURIComponent(selectedRowsString)}`
    );
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Representative Mapping"
        pageNavigation={[
          { pageName: "Representative Mapping" },
          { pageName: "List" },
        ]}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path: any) => handleBreadcrumbNavigation(path, router)}
      />

      <Container>
        <TableContainer>
          <DataGrid
            sx={{ ...dataGridStyle }}
            columns={getColumnsWithTooltip(RepresentativeMapperTableHeadings)}
            rows={searchedRows}
            getRowId={(row) => row.uId}
            loading={loading}
            rowCount={searchedRows.length}
            pageSizeOptions={tableOptions.rowsPerPageOptions}
            checkboxSelection
            density="compact"
            onRowSelectionModelChange={(newSelection) => {
              setSelectedRows(newSelection);
            }}
            slots={{
              noRowsOverlay: CustomNoRowsOverlay,
              toolbar: () => (
                <QuickSearchToolbarIcons
                  handleProductClick={handleProductClick}
                  handleRouteClick={handleRouteClick}
                  handleOutletClick={handleOutletClick}
                  isDisabled={isDisabled}
                  columns={RepresentativeMapperTableHeadings.filter(
                    (col) => col.field !== "actions"
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
        </TableContainer>
      </Container>
    </FsBox>
  );
};

export default RepresentativeMapper;
