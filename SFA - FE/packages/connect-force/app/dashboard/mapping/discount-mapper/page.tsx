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
import { tableOptions } from "../company-mapper/components/table-component-companyMapper";
import { DataGrid } from "@mui/x-data-grid";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import { DiscountMapperTableHeadings } from "./components/table-component-discountMapper";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { handleBreadcrumbNavigation } from "@/utils/breadcrumbNavigation";
import QuickSearchToolbarIcons from "./components/search-filter-icons";
import { getDiscountViewAllMapping } from "@/service/Discount/discount.service";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const DiscountMapper = () => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const discountList = useSelector(
    (state) => state.discountSlice.discountMappingList
  );
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(discountList, DiscountMapperTableHeadings);

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
      await getDiscountViewAllMapping();
    } catch (error) {
      dispatch(setPopupResponse(true));
    } finally {
      setLoading(false);
    }
  };

  const handleDistributorClick = () => {
    const selectedRowsString = JSON.stringify(selectedRows);
    router.push(
      `${
        PATH_DASHBOARD.discountMapper.distributor
      }?selectedRows=${encodeURIComponent(selectedRowsString)}`
    );
  };

  const handleSalesRepClick = () => {
    const selectedRowsString = JSON.stringify(selectedRows);
    router.push(
      `${
        PATH_DASHBOARD.discountMapper.representative
      }?selectedRows=${encodeURIComponent(selectedRowsString)}`
    );
  };

  const handleOutletClick = () => {
    const selectedRowsString = JSON.stringify(selectedRows);
    router.push(
      `${
        PATH_DASHBOARD.discountMapper.outlet
      }?selectedRows=${encodeURIComponent(selectedRowsString)}`
    );
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Discount Mapping"
        pageNavigation={[
          { pageName: "Discount Mapping" },
          { pageName: "List" },
        ]}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path: any) => handleBreadcrumbNavigation(path, router)}
      />
      <Container>
        <TableContainer>
          <DataGrid
            sx={{ ...dataGridStyle }}
            columns={getColumnsWithTooltip(DiscountMapperTableHeadings)}
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
                  handleDistributorClick={handleDistributorClick}
                  handleOutletClick={handleOutletClick}
                  handleSalesRepClick={handleSalesRepClick}
                  isDisabled={isDisabled}
                  columns={DiscountMapperTableHeadings.filter(
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
export default DiscountMapper;
