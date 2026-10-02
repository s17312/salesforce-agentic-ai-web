"use client";

import { useEffect, useRef, useState } from "react";
import PopupResponse from "@/components/popup/popup-response";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import {
  tableOptions,
  VehicleCategoryTableHeadings,
} from "./components/table-component-vehicleCategory";
import { getAllVehicleCategoryDetails } from "@/service/vehicleCategory.service";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";

const VehicleCategoryPage = () => {
  const vehicleCategoryList = useSelector(
    (state) => state.vehicleCategorySlice.vehicleCategoryDetails
  );
  const page = useSelector((state) => state.vehicleCategorySlice.newPage);
  const rowCount = useSelector(
    (state) => state.vehicleCategorySlice.newRowsPerPage
  );
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const isLoading = useSelector(
    (state) => state.vehicleCategorySlice.isLoading
  );
  const [serverDownError, setServerDownError] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllVehicleCategoryDetails(
          page,
          rowCount,
          undefined,
          "uId",
          "desc"
        );
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
      }
    };
    fetchData();
  }, [page, rowCount]);

  const onAddVehicleCategoryBtnClick = () => {
    router.push(PATH_DASHBOARD.vehicleCategory.add);
  };

  const handleBreadcrumbNavigation = (path: string | undefined) => {
    if (path) {
      router.push(path);
    }
  };

  const redirectBack = () => {
    router.push(PATH_DASHBOARD.root);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Vehicle Category List"
        pageNavigation={[
          {
            pageName: "Vehicle Category",
            path: PATH_DASHBOARD.vehicleCategory.list,
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddVehicleCategoryBtnClick}
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
              columns={VehicleCategoryTableHeadings}
              data={vehicleCategoryList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              isLoading={isLoading}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.vehicleCategory.add);
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

export default VehicleCategoryPage;
