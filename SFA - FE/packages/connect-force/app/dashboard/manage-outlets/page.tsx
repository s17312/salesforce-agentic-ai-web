"use client";

import PopupResponse from "@/components/popup/popup-response";
import PopupView from "@/components/popup/popup-view";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllOutletsList } from "@/service/outlet.service";
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
  OutletTableHeadings,
  tableOptions,
} from "./components/table-component-outlet";

const OutletPage = () => {
  const outletList = useSelector((state) => state.outlet.outlets);
  const page = useSelector((state) => state.outlet.newPage);
  const rowCount = useSelector((state) => state.outlet.newRowsPerPage);
  const isLoading = useSelector((state) => state.outlet.isLoading);
  const outlet = useSelector((state) => state.outlet.outlet);
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
        await getAllOutletsList(undefined, undefined, undefined, "uId", "desc");
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
    router.push(PATH_DASHBOARD.outlet.add);
  };

  const handleUploadBtnClick = () => {
    router.push(PATH_DASHBOARD.outlet.addBulk);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Outlet List"
        pageNavigation={[
          {
            pageName: "Outlet",
            path: PATH_DASHBOARD.outlet.list,
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
              columns={OutletTableHeadings}
              data={outletList}
              isLoading={isLoading}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.outlet.add);
              }}
              handleTableBtnClick={handleUploadBtnClick}
              isTableBtnDisabled={false}
              tableBtnText={"Upload"}
              tableBtnIcon={<VisibilityIcon />}
            />
          </Box>
        </TableContainer>
      </Container>
      <PopupView
        data={outlet}
        headerName={"Name"}
        headerContent={outlet?.name}
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

export default OutletPage;
