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
import { Box, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import {
  discountTableHeadings,
  tableOptions,
} from "./components/table-component-discount";
import { getDiscountAll } from "@/service/Discount/discount.service";
import DiscountIcon from "@mui/icons-material/Discount";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const DiscountPage = () => {
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const discountList = useSelector(
    (state) => state.discountSlice.discountDetails
  );
  const page = useSelector((state) => state.discountSlice.newPage);
  const rowCount = useSelector((state) => state.discountSlice.newRowsPerPage);
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const isLoading = useSelector((state) => state.discountSlice.isLoading);
  const [serverDownError, setServerDownError] = useState(false);
  const router = useRouter();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    toggleFullScreen();
    setIsFullScreen((prev) => !prev);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getDiscountAll();
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
      }
    };
    fetchData();
  }, [page, rowCount]);

  const onAddDiscountBtnClick = () => {
    router.push(PATH_DASHBOARD.discount.add);
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
        pageTitle="Discount List"
        pageNavigation={[
          {
            pageName: "Discount",
            path: PATH_DASHBOARD.discount.list,
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddDiscountBtnClick}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<DiscountIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        <TableContainer>
          <Box>
            <DataTable
              getRowId={(row) => row.uId}
              sx={{ ...dataGridStyle }}
              contentHeight={400}
              // @ts-ignore
              columns={discountTableHeadings}
              data={discountList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              isLoading={isLoading}
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.discount.add);
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

export default DiscountPage;
