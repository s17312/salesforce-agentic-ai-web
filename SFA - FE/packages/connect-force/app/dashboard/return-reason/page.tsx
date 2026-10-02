"use client";

import PopupResponse from "@/components/popup/popup-response";
import { PATH_DASHBOARD } from "@/routes/paths";
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
import React, { useEffect, useRef, useState } from "react";
import { ReturnReasonTableHeadings, tableOptions } from "./components/table-component-returnReason";
import { dispatch, useSelector } from "@/redux/store";
import { getAllReturnReasonDetails } from "@/service/returnReason.service";
import { setPopupResponse } from "@/redux/slices/layout-slice";

const ReturnReasonPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [serverDownError, setServerDownError] = useState(false);
  const returnReasonList = useSelector((state) => state.returnReasonSlice.returnReasonDetails);
  const isLoading = useSelector((state) => state.returnReasonSlice.isLoading);
  const page = useSelector((state) => state.returnReasonSlice.newPage);
  const rowCount = useSelector((state) => state.returnReasonSlice.newRowsPerPage);
  const [isFullScreen, setIsFullScreen] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllReturnReasonDetails(page, rowCount, undefined, "uId", "desc");
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
      }
    };
    fetchData();
  }, [page, rowCount]);

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
  };

  const onAddReturnReasonBtnClick = () => {
    router.push(PATH_DASHBOARD.returnReason.add);
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Return Reason List"
        pageNavigation={[
          {
            pageName: "Return Reason",
            path: PATH_DASHBOARD.returnReason.list,
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddReturnReasonBtnClick}
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
                columns={ReturnReasonTableHeadings}
                data={returnReasonList}
                rowsPerPageOptions={tableOptions.rowsPerPageOptions}
                isLoading={isLoading}
                //@ts-ignore
                filterByColumn={true}
                handleAdd={() => {
                  router.push(PATH_DASHBOARD.returnReason.add);
                }}
            />
          </Box>
        </TableContainer>
      </Container>
      {PopupResponse && serverDownError && (
        <PopupResponse
          type={"error"}
          message={"Internal server error"}
          redirectBack={redirectBack}
        />
      )}
    </FsBox>
  );
};

export default ReturnReasonPage;
