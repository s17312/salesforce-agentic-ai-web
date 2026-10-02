"use client";

import { CustomNoRowsOverlay } from "@/components/data-grid/noRowOverlay";
import QuickSearchToolbar from "@/components/data-grid/search-filter";
import PopupResponse from "@/components/popup/popup-response";
import PopupView from "@/components/popup/popup-view";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { setPriceList } from "@/redux/slices/price-list-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllPriceLists } from "@/service/priceList.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import { useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { PriceListTableHeadings } from "./components/table-component-priceList";
import { useColumnFilter } from "@/components/hook-form/ColumnFilter";

const PriceListViewAll = () => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const priceLists = useSelector((state) => state.priceListsSlice.priceLists);
  const priceList = useSelector((state) => state.priceListsSlice.priceList);
  const popupView = useSelector((state) => state.layout.popupView);
  const [loading, setLoading] = useState(false);
  const [serverDownError, setServerDownError] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const {
    searchedRows,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
  } = useColumnFilter(priceLists, PriceListTableHeadings);

  const fetchData = async () => {
    setLoading(true);
    try {
      await getAllPriceLists(
        undefined,
        undefined,
        undefined,
        "uId",
        "desc",
        undefined
      );
    } catch (error) {
      dispatch(setPopupResponse(true));
      setServerDownError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!popupView) {
      dispatch(setPriceList(null));
    }
  }, [popupView]);

  const handleBreadcrumbNavigation = useCallback(
    (path: string | undefined) => {
      if (path) {
        router.push(path);
      }
    },
    [router]
  );

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const handleUploadBtnClick = () => {
    router.push(PATH_DASHBOARD.priceList.add);
  };

  function capitalizeFirstLetter(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function capitalizeAllWords(string: any) {
    if (!string) return "";
    return string.split(" ").map(capitalizeFirstLetter).join(" ");
  }

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Price List"
        pageNavigation={[{ pageName: "Price List" }, { pageName: "List" }]}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<ListAltRoundedIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        <TableContainer>
          <DataGrid
            sx={{ ...dataGridStyle }}
            getRowId={(row: any) => row.uId}
            rows={searchedRows}
            loading={loading}
            columns={getColumnsWithTooltip(PriceListTableHeadings)}
            disableRowSelectionOnClick
            density="compact"
            slots={{
              noRowsOverlay: CustomNoRowsOverlay,
              toolbar: () => (
                <QuickSearchToolbar
                  handleUploadClick={handleUploadBtnClick}
                  columns={PriceListTableHeadings.filter(
                    (col) => col.field !== "active" && col.field !== "actions"
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
      <PopupView
        data={priceList}
        headerName={"Price List"}
        headerContent={`${capitalizeAllWords(priceList?.batchNumber)} - ${
          priceList?.uId
        }`}
        additionalKeysToExclude={[
          "priceListType.priceTypeUId",
          "priceListType.companyUId",
          "priceListType.priceListTypeDescription",
          "priceType.description",
          "priceType.companyUId",
          "company.legalEntryTypeUId",
          "company.registeredAddress",
          "company.phoneNo",
          "company.email",
          "company.taxID",
          "company.companySize",
          "company.industry",
          "company.siCcode",
          "company.comments",
          "company.addressLine1",
          "company.addressLine2",
          "company.vatNo",
          "company.phoneNoCountryCode",
          "product.description",
          "product.productGroupUId",
          "product.productCategoryUId",
          "product.isReturnable",
          "product.minOrderLevel",
          "product.maxOrderLevel",
          "product.barcodeID",
          "product.imgData",
        ]}
      />
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

export default PriceListViewAll;
