"use client";

import PopupResponse from "@/components/popup/popup-response";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllAssetBrandDetails } from "@/service/assetBrand.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  AssetBrandTableHeadings,
  tableOptions,
} from "./components/table-component-assetBrand";

const AssetBrandPage = () => {
  const assetBrandList = useSelector(
    (state) => state.assetBrandSlice.assetBrandDetails
  );
  const page = useSelector((state) => state.assetBrandSlice.newPage);
  const rowCount = useSelector((state) => state.assetBrandSlice.newRowsPerPage);
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const isLoading = useSelector((state) => state.assetBrandSlice.isLoading);
  const [serverDownError, setServerDownError] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllAssetBrandDetails(page, rowCount, undefined, "uId", "desc");
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
      }
    };
    fetchData();
  }, [page, rowCount]);

  const onAddAssetBrandBtnClick = () => {
    router.push(PATH_DASHBOARD.assetBrand.add);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Asset Brand List"
        pageNavigation={[
          {
            pageName: "Asset Brand",
            path: PATH_DASHBOARD.assetBrand.list,
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddAssetBrandBtnClick}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
      />
      <Container>
        <TableContainer>
          <Box>
            <DataTable
              getRowId={(row) => row.uId}
              sx={{ ...dataGridStyle }}
              contentHeight={400}
              // @ts-ignore
              columns={AssetBrandTableHeadings}
              data={assetBrandList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              isLoading={isLoading}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.assetBrand.add);
              }}
            />
          </Box>
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

export default AssetBrandPage;
