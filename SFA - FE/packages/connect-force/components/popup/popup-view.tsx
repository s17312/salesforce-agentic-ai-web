import React from "react";
import { setPopupView } from "@/redux/slices/layout-slice";
import { dispatch, useSelector } from "@/redux/store";
import { Box, Grid, Modal, Typography } from "@mui/material";
import styled from "styled-components";
import { public_sanse } from "@/app/dashboard/font";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from 'dayjs';
import { formatRate } from "@/utils/formatCurrency";

type PopupViewProps = {
  data: any;
  width?: string;
  height?: string;
  headerName?: any;
  headerContent?: any;
  additionalKeysToExclude?: string[];
};

const PopupView = ({
  data,
  width,
  height,
  headerName,
  additionalKeysToExclude,
  headerContent,
}: PopupViewProps) => {
  const isPopupViewOpen = useSelector((state) => state.layout.popupView);

  const handleClose = () => dispatch(setPopupView(false));

  if (!data) {
    return null;
  }

  const keysToExclude = [
    "isArchive",
    "totalRecordCount",
    ...(additionalKeysToExclude || []),
  ];

  const keysToAlwaysInclude = [
    "uId",
    "active",
    "creationDate",
    "modifiedBy",
    "modifiedDate",
    "createdBy",
  ];

  const keyStyles = {
    uId: { backgroundColor: "#F3EFFF", color: "#000" },
    active: { backgroundColor: "#e6ffe6", color: "#008000" },
    creationDate: { backgroundColor: "#e6ffe6", color: "#008000" },
    modifiedDate: { backgroundColor: "#e6ffe6", color: "#008000" },
    createdBy: { backgroundColor: "#f5f5f5", color: "#696969" },
    modifiedBy: { backgroundColor: "#f5f5f5", color: "#696969" },
  };

  const isDateString = (value: string) => {
      return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?$/.test(value);
  };

  const formatDate = (value: string) => {
    return dayjs(value).format('MM/DD/YYYY');
  };

  const shouldExcludeKey = (key: string) => {
    return keysToExclude.some(excludeKey => {
      const parts = excludeKey.split('.');
      const keyParts = key.split('.');
      return parts.every((part, index) => part === keyParts[index]);
    });
  };

  const renderData = (data: any, parentKey = '') => {
      const entries = Object.entries(data);
      const alwaysIncludeEntries = entries.filter(([key]) => keysToAlwaysInclude.includes(key));
      const otherEntries = entries.filter(([key]) => !keysToAlwaysInclude.includes(key));
  
      const renderEntries = (entries: [string, any][]) => {
        return entries.map(([key, value]) => {
          const fullKey = parentKey ? `${parentKey}.${key}` : key;
  
          if (shouldExcludeKey(fullKey)) {
            return null;
          }
  
          const keyStyle = keyStyles[key as keyof typeof keyStyles] || {};
  
          if (typeof value === "object" && value !== null) {
            return (
              <Grid item xs={12} key={fullKey}>
                <DataKeyTitle>{key}</DataKeyTitle>
                <Grid container spacing={2}>
                  {renderData(value, fullKey)}
                </Grid>
              </Grid>
            );
          }
  
          let displayValue = value;
          if (typeof value === "string" && isDateString(value)) {
            displayValue = formatDate(value);
          } else if (key === "active") {
            keyStyle.color = value ? "#008000" : "#FF0000";
            keyStyle.backgroundColor = value ? "#e6ffe6" : "#ffe6e6";
            displayValue = value ? "Active" : "Inactive";
          }  else if (key === "rate") {
            displayValue = value && formatRate(value);
          }
  
          return (
            <Grid item xs={12} md={6} key={fullKey}>
              <Grid container spacing={0}>
                <Grid item xs={6} md={3}>
                  <DataTitle>
                    {key === "active" ? "Status" : key
                      .split(/(?=[A-Z])/)
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </DataTitle>
                </Grid>
                <Grid item xs={0} md={0.5}></Grid>
                <Grid item xs={6} md={8.5}>
                  <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                    {displayValue === null || displayValue === "" || displayValue === undefined ? (
                      <DataValue style={keyStyle}> - </DataValue>
                    ) : (
                      <DataValue style={keyStyle}>{`${displayValue}`}</DataValue>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          );
        });
      };
  
      return (
        <>
          {renderEntries(alwaysIncludeEntries)}
          {renderEntries(otherEntries)}
        </>
      );
    };

  return (
    <CustomModal
      key={data.uId}
      disableEnforceFocus
      open={isPopupViewOpen}
      onClose={handleClose}
      className={`${public_sanse.className}`}
    >
      <>
        <CustomBox>
          <HeaderContainer>
            <ViewHeader>{headerName} </ViewHeader>
            <ViewSubHeader>{headerContent}</ViewSubHeader>
            <CloseIcon
              onClick={handleClose}
              sx={{
                height: '24px',
                width: '24px',
                position: 'absolute',
                top: 0,
                right: 0,
                color: "#454f5b",
                "&:hover": {
                  color: "#FF5630",
                  cursor: "pointer",
                },
              }}
            />
          </HeaderContainer>
          <DataContainer>
            <Grid container spacing={2}>
              {renderData(data)}
            </Grid>
          </DataContainer>
        </CustomBox>
      </>
    </CustomModal>
  );
};

export default PopupView;

const CustomModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CustomBox = styled(Box)`
  width: 70%;
  max-height: 80vh;
  padding: 2em;
  border-radius: 16px;
  background-color: white;
  outline: none;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    max-height: 70vh;
  }
  @media (max-width: 480px) {
    max-height: 60vh;
  }
  @media (max-width: 320px) {
    max-height: 50vh;
  }
`;

const DataContainer = styled(Box)`
  box-shadow: 0px 12px 14px -4px #919EAB1F;
  box-shadow: 0px 0px 4px 0px #919EAB33;
  margin-top: 2%;
  border-radius: 16px;
  padding: 2%;
  overflow-y: auto; 
  flex: 1;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
    background: #888;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const DataKeyTitle = styled(Typography)`
  font-size: 18px;
  font-weight: 700;
  line-height: 28px;
  text-align: left;
  color: #1a202c;
  margin-top: 12px;
  margin-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 4px;
`;

const DataTitle = styled(Typography)`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
  color: #4a5568;
  margin-top: 8px;
  margin-left: 16px;
  padding-left: 8px;
  border-left: 4px solid #cbd5e0;
`;

const DataValue = styled(Typography)`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
  color: #475764;
  border-radius: 6px;
  padding: 10px;
  background: #f0f8ff;
`;

const ViewHeader = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  word-wrap: break-word;
  color: #070E4D;
`;

const ViewSubHeader = styled.div`
  font-size: 24px;
  font-weight: 700;
  line-height: 36px;
  text-align: left;
  word-wrap: break-word;
  color: #070E4D;
`;

const HeaderContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
`;