"use client";

import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  DistributorMapperTableHeadings,
  tableOptions,
} from "./components/table-component-distributorMapper";
import PopupResponse from "@/components/popup/popup-response";
import { getDistributorMapping } from "@/service/distributor.service";
import { DataGrid } from "@mui/x-data-grid";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const DistributorMapper = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [serverDownError, setServerDownError] = useState(false);
  const distributorMappingList = useSelector(
    (state) => state.distributor.distributorMapping
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [loading, setLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(distributorMappingList, DistributorMapperTableHeadings);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };
  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        await getDistributorMapping();
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Distributor Mapping"
        pageNavigation={[
          { pageName: "Distributor Mapping" },
          { pageName: "List" },
        ]}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <TableContainer>
          <DataGrid
            sx={{ ...dataGridStyle }}
            getRowId={(row) => row.uId}
            rows={searchedRows}
            loading={loading}
            columns={getColumnsWithTooltip(DistributorMapperTableHeadings)}
            rowCount={searchedRows.length}
            pageSizeOptions={tableOptions.rowsPerPageOptions}
            disableRowSelectionOnClick
            density="compact"
            slots={{
              noRowsOverlay: CustomNoRowsOverlay,
              toolbar: () => (
                <QuickSearchToolbar
                  columns={DistributorMapperTableHeadings.filter(
                    (col) =>
                      col.field !== "hasProducts" &&
                      col.field !== "hasOutlets" &&
                      col.field !== "hasRoutes" &&
                      col.field !== "hasRepresentatives" &&
                      col.field !== "hasCompanies" &&
                      col.field !== "actions"
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

      {popupResponse && serverDownError && (
        <PopupResponse
          type={"error"}
          message={"Internal server error"}
          redirectBack={redirectBack}
        />
      )}
    </FsBox>
  );
};
export default DistributorMapper;
