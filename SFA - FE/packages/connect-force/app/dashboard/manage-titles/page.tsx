"use client";

import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { DataTable, BreadcrumbNavigation } from "@icp/react-fusion";
import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import {
  TitleTableHeadings,
  tableOptions,
} from "./components/table-component-title";
import PopupView from "@/components/popup/popup-view";
import PopupResponse from "@/components/popup/popup-response";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllTitles } from "@/service/titles.service";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const TitlePage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const titleList = useSelector((state) => state.titleSlice.titles);
  const page = useSelector((state) => state.titleSlice.newPage);
  const rowCount = useSelector((state) => state.titleSlice.newRowsPerPage);
  const isLoading = useSelector((state) => state.titleSlice.isLoading);
  const title = useSelector((state) => state.titleSlice.title);
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [serverDownError, setServerDownError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllTitles();
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
      }
    };
    fetchData();
  }, [page, rowCount]);

  function capitalizeFirstLetter(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function capitalizeAllWords(string: any) {
    if (!string) return "";
    return string.split(" ").map(capitalizeFirstLetter).join(" ");
  }

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  const onAddTitleBtnClick = () => {
    router.push(PATH_DASHBOARD.title.add);
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

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Title List"
        pageNavigation={[
          {
            pageName: "Title",
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddTitleBtnClick}
        onFullScreenClick={handleFullScreenClick}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
      />
      <Container>
        <TableContainer>
          <Box>
            <DataTable
              getRowId={(row) => row.uId}
              sx={{ ...dataGridStyle }}
              contentHeight={400}
              isLoading={isLoading}
              // @ts-ignore
              columns={TitleTableHeadings}
              data={titleList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.title.add);
              }}
            />
          </Box>
        </TableContainer>
      </Container>
      <PopupView
        data={title}
        headerName={"Description"}
        headerContent={capitalizeAllWords(title?.description)}
        additionalKeysToExclude={["description", "shiftId"]}
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

export default TitlePage;
