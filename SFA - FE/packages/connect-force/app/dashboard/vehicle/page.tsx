"use client";

import PopupResponse from "@/components/popup/popup-response";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllVehicleDetails } from "@/service/vehicle.service";
import {
  Container,
  TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  tableOptions,
  VehicleTableHeadings,
} from "./components/table-component-vehicle";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const VehiclePage = () => {
  const vehicleList = useSelector((state) => state.vehicleSlice.vehicleDetails);
  const page = useSelector((state) => state.vehicleSlice.newPage);
  const rowCount = useSelector((state) => state.vehicleSlice.newRowsPerPage);
  const popupResponse = useSelector((state) => state.layout.popupResponse);
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
        await getAllVehicleDetails(page, rowCount, undefined, "uId", "desc");
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
      }
    };
    fetchData();
  }, [page, rowCount]);

  const onAddVehicleBtnClick = () => {
    router.push(PATH_DASHBOARD.vehicle.add);
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
        pageTitle="Vehicle List"
        pageNavigation={[
          {
            pageName: "Vehicle",
            path: PATH_DASHBOARD.vehicle.list,
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddVehicleBtnClick}
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
              columns={VehicleTableHeadings}
              data={vehicleList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.vehicle.add);
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

export default VehiclePage;
