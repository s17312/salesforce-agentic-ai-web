"use client";

import PopupResponse from "@/components/popup/popup-response";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllUnloadingReasonDetails } from "@/service/unloadingReason.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import { Box, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { tableOptions, UnloadingReasonTableHeadings } from "./components/table-component-unloadingReason";
import InventoryIcon from "@mui/icons-material/Inventory";

const UnloadingReasonPage = () => {
  const unloadingReasonList = useSelector(
    (state) => state.unloadingReasonSlice.unloadingReasonDetails
  );
  const page = useSelector((state) => state.unloadingReasonSlice.newPage);
  const rowCount = useSelector((state) => state.unloadingReasonSlice.newRowsPerPage);
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const isLoading = useSelector((state) => state.unloadingReasonSlice.isLoading);
  const [serverDownError, setServerDownError] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllUnloadingReasonDetails(page, rowCount, undefined, "uId", "desc");
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
      }
    };
    fetchData();
  }, [page, rowCount]);

  const onAddUnloadingReasonBtnClick = () => {
    router.push(PATH_DASHBOARD.unloadingReason.add);
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
        pageTitle="Unloading Reason List"
        pageNavigation={[
          {
            pageName: "Unloading Reason",
            path: PATH_DASHBOARD.unloadingReason.list,
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddUnloadingReasonBtnClick}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<InventoryIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        <TableContainer>
          <Box>
            <DataTable
              getRowId={(row) => row.uId}
              sx={{ ...dataGridStyle }}
              contentHeight={400}
              // @ts-ignore
              columns={UnloadingReasonTableHeadings}
              data={unloadingReasonList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              isLoading={isLoading}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.unloadingReason.add);
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

export default UnloadingReasonPage;
