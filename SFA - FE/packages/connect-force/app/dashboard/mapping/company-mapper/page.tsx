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
  CompanyMapperTableHeadings,
  tableOptions,
} from "./components/table-component-companyMapper";
import PopupResponse from "@/components/popup/popup-response";
import { DataGrid } from "@mui/x-data-grid";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "../company-mapper/components/search-filter";
import { getCompanyMapping } from "@/service/company.service";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";
import GoogleIcon from "@/components/icons/GoogleIcon";

const CompanyMapper = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [serverDownError, setServerDownError] = useState(false);
  const companyMappingList = useSelector(
    (state) => state.companySlice.companyMappingList
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [loading, setLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

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

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(companyMappingList, CompanyMapperTableHeadings);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        await getCompanyMapping();
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
        pageTitle="Company Mapping"
        pageNavigation={[{ pageName: "Company Mapping" }, { pageName: "List" }]}
        icon={<GoogleIcon name="business" size={24} />}
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
            columns={getColumnsWithTooltip(CompanyMapperTableHeadings)}
            rowCount={searchedRows.length}
            pageSizeOptions={tableOptions.rowsPerPageOptions}
            disableRowSelectionOnClick
            density="compact"
            slots={{
              noRowsOverlay: CustomNoRowsOverlay,
              toolbar: () => (
                <QuickSearchToolbar
                  columns={CompanyMapperTableHeadings.filter(
                    (col) =>
                      col.field !== "hasProducts" &&
                      col.field !== "hasDistributor" &&
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
export default CompanyMapper;
