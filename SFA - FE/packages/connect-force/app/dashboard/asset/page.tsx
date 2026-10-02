"use client";

import { PATH_DASHBOARD } from "@/routes/paths";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import { Box } from "@mui/system";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { dispatch, useSelector } from "@/redux/store";
import {
  AssetTableHeadings,
  tableOptions,
} from "./components/table-component-asset";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { getAllAssetDetails } from "@/service/asset.service";
import PopupResponse from "@/components/popup/popup-response";

const AssetPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const assetList = useSelector((state) => state.assetSlice.assetDetails);
  const page = useSelector((state) => state.assetSlice.newPage);
  const rowCount = useSelector((state) => state.assetSlice.newRowsPerPage);
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [serverDownError, setServerDownError] = useState(false);
  const isLoading = useSelector((state) => state.assetSlice.isLoading);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllAssetDetails(
          page,
          rowCount,
          undefined,
          "uId",
          "desc",
          true,
          false
        );
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
      }
    };
    fetchData();
  }, [page, rowCount]);

  const onAddAssetBtnClick = () => {
    router.push(PATH_DASHBOARD.asset.add);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Asset List"
        pageNavigation={[
          {
            pageName: "Asset",
            path: PATH_DASHBOARD.asset.list,
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddAssetBtnClick}
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
              columns={AssetTableHeadings}
              data={assetList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              isLoading={isLoading}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.asset.add);
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

export default AssetPage;
