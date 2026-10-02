"use client";

import PopupResponse from "@/components/popup/popup-response";
import { setPopupResponse } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { PATH_DASHBOARD } from "@/routes/paths";
import { getAllPriceTypeDetails } from "@/service/priceType.service";
import {
    Container,
    TableContainer,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { dataGridStyle } from "@/styles/tableStyles/tableStyle";
import { BreadcrumbNavigation, DataTable } from "@icp/react-fusion";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    PriceTypeTableHeadings,
    tableOptions,
} from "./components/table-component-price-type";

const PriceTypePage = () => {
  const priceTypeList = useSelector(
    (state) => state.priceTypeSlice.priceTypeDetails
  );
  const page = useSelector((state) => state.priceTypeSlice.newPage);
  const rowCount = useSelector((state) => state.priceTypeSlice.newRowsPerPage);
  const popupResponse = useSelector((state) => state.layout.popupResponse);
  const [serverDownError, setServerDownError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllPriceTypeDetails(page, rowCount, undefined, "uId", "desc");
      } catch (error) {
        dispatch(setPopupResponse(true));
        setServerDownError(true);
      }
    };
    fetchData();
  }, [page, rowCount]);

  const onAddPriceTypeBtnClick = () => {
    router.push(PATH_DASHBOARD.priceListType.add);
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
    <>
      <BreadcrumbNavigation
        pageTitle="Price Type List"
        pageNavigation={[
          {
            pageName: "Price Type",
            path: PATH_DASHBOARD.priceListType.list,
          },
          { pageName: "List" },
        ]}
        onAddClick={onAddPriceTypeBtnClick}
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
              columns={PriceTypeTableHeadings}
              data={priceTypeList}
              rowsPerPageOptions={tableOptions.rowsPerPageOptions}
              //@ts-ignore
              filterByColumn={true}
              handleAdd={() => {
                router.push(PATH_DASHBOARD.priceListType.add);
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
    </>
  );
};

export default PriceTypePage;
