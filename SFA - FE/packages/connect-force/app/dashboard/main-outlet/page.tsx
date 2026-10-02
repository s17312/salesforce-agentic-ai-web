"use client";

import PopupResponse from "@/components/popup/popup-response";
import PopupView from "@/components/popup/popup-view";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllMainOutlets } from "@/service/main-outlet.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  MainOutletTableHeadings,
  tableOptions,
} from "./components/table-component-main-outlet";

const MainOutletPage = () => {
  const mainOutletList = useSelector(
    (state) => state.mainOutletSlice.mainOutlets
  );
  const page = useSelector((state) => state.mainOutletSlice.newPage);
  const rowCount = useSelector((state) => state.mainOutletSlice.newRowsPerPage);
  const isLoading = useSelector((state) => state.mainOutletSlice.isLoading);
  const mainOutlet = useSelector((state) => state.mainOutletSlice.mainOutlet);
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [serverDownError, setServerDownError] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllMainOutlets(undefined, undefined, undefined, "uId", "desc");
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
      }
    };
    fetchData();
  }, [page, rowCount]);

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  const onAddOutletBtnClick = () => {
    router.push(PATH_DASHBOARD.mainOutlet.add);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Main Outlet List"
        pageNavigation={[
          {
            pageName: "Main Outlet",
            path: PATH_DASHBOARD.mainOutlet.list,
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddOutletBtnClick}
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
              // @ts-ignore
              columns={MainOutletTableHeadings}
              data={mainOutletList}
              isLoading={isLoading}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.mainOutlet.add);
              }}
              isTableBtnDisabled={false}
              tableBtnText={"Upload"}
              tableBtnIcon={<VisibilityIcon />}
            />
          </Box>
        </TableContainer>
      </Container>
      <PopupView
        data={mainOutlet}
        headerName={"Name"}
        headerContent={mainOutlet?.name}
        additionalKeysToExclude={["fullName", "shiftId"]}
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

export default MainOutletPage;
