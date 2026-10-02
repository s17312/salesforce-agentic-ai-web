"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Cancel as CancelIcon,
  HelpOutline as HelpOutlineIcon,
} from "@mui/icons-material";
import { BreadcrumbNavigation } from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { validateColumns } from "./components/validateColumns";
import { FileUploadBox } from "./components/fileUploadBox";
import { DownloadExample } from "./components/downloadExample";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import * as XLSX from "xlsx";
import { createBulkPriceList } from "@/service/priceList.service";
import { enqueueSnackbar } from "notistack";
import { PATH_DASHBOARD } from "@/routes/paths";
import { LoadingButton } from "@mui/lab";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { getColumnsWithTooltip } from "@/utils/dataGridUtils";
import { format } from "date-fns";

const expectedColumns = [
  "PriceListTypeId",
  "PriceListTypeName",
  "StartDate",
  "EndDate",
  "PriceTypeName",
  "CompanyId",
  "ProductId",
  "Rate",
  "MRP",
  "BatchNumber",
  "Active",
];

const PriceList: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";
  const ref = useRef<HTMLDivElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isFileValidate, setIsFileValidate] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileInputKey, setFileInputKey] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleValidate = useCallback(async (selectedFile: File) => {
    const { isValid, missingColumns } = await validateColumns(
      selectedFile,
      expectedColumns
    );
    if (isValid) {
      setIsFileValidate(true);
      setValidationErrors([]);
      const data = await readExcelFile(selectedFile);
      setExcelData(data);
    } else {
      setValidationErrors(missingColumns);
      setIsFileValidate(false);
    }
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
        handleValidate(selectedFile);
      }
    },
    [handleValidate]
  );

  const handleClear = useCallback(() => {
    setFile(null);
    setIsFileValidate(false);
    setValidationErrors([]);
    setExcelData([]);
    setFileInputKey((prevKey) => prevKey + 1);
  }, []);

  const handleUpload = useCallback(async () => {
    if (file) {
      setLoading(true);
      try {
        const response = await createBulkPriceList(file);
        enqueueSnackbar("Price list uploaded successfully", {
          variant: "success",
        });
      } catch (error) {
        const err = error as Error;
        console.error("Upload failed:", error);
      } finally {
        setLoading(false);
      }
      handleClear();
    } else {
      alert("No file selected");
    }
  }, [file, handleClear]);

  const handleBreadcrumbNavigation = useCallback(
    (path: string | undefined) => {
      if (path) {
        router.push(path);
      }
    },
    [router]
  );

  const readExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array", cellDates: true });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        });
        const headers: string[] = jsonData[0] as string[];
        const rows = jsonData.slice(1).map((row: any[], index: number) => {
          const rowData: any = { id: index + 1 }; // Add an id field for DataGrid
          headers.forEach((header: string, colIndex: number) => {
            let cellValue = row[colIndex];
            if (cellValue instanceof Date) {
              cellValue = format(cellValue, dateFormat);
            } else if (typeof cellValue === "number" && cellValue > 40000) {
              const excelEpoch = new Date(1900, 0, 1);
              const jsDate = new Date(
                excelEpoch.getTime() + (cellValue - 1) * 86400000
              );
              cellValue = format(jsDate, dateFormat);
            }
            rowData[header] = cellValue;
          });
          return rowData;
        });
        resolve(rows);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const columns: GridColDef[] = expectedColumns.map((col) => ({
    field: col,
    headerName: col,
    flex: 1,
  }));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleFullScreenClick = () => {
      toggleFullScreen();
      setIsFullScreen((prev) => !prev);
  };

  return (
    <FsBox ref={ref} isFullScreen={isFullScreen}>
      <BreadcrumbNavigation
        pageTitle="Price List Upload"
        pageNavigation={[
          {
            pageName: "Price List",
            path: PATH_DASHBOARD.priceList.list,
          },
          { pageName: "Upload" },
        ]}
        onLinkClick={(path: any) => {
          handleBreadcrumbNavigation(path);
        }}
        onFullScreenClick={handleFullScreenClick}
        icon={<PlaylistAddIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        <Box
          sx={{
            margin: "auto",
            padding: 4,
            border: "1px solid #ffffff",
            borderRadius: 2,
            backgroundColor: "rgb(255, 255, 255)",
            position: "relative",
          }}
        >
          <Typography
            variant="h6"
            color={theme.palette.primary.main}
            sx={{ mb: 2, textAlign: "Left" }}
          >
            Upload file
          </Typography>
          <FileUploadBox
            key={fileInputKey}
            file={file}
            handleFileChange={handleFileChange}
          />
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 1 }}
          >
            <Grid item xs={6}>
              <Typography variant="body2" color="#757575">
                Supported formats: .csv .txt
              </Typography>
            </Grid>
          </Grid>
          <DownloadExample />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <IconButton
              color="secondary"
              sx={{ color: "#757575" }}
              onClick={handleClickOpen}
            >
              <HelpOutlineIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>How upload a price list?</DialogTitle>
              <DialogContent>
                <Typography variant="body1" gutterBottom>
                  1. You can download a sample table to see the required format.
                </Typography>
                <Typography variant="body1" gutterBottom>
                  2. Select the file you want to upload.
                </Typography>
                <Typography variant="body1" gutterBottom>
                  3. Ensure the file format is .xls, .xlsx, or .csv.
                </Typography>
                <Typography variant="body1" gutterBottom>
                  4. Click the &quot;Upload&quot; button to start the upload
                  process.
                </Typography>
                <Typography variant="body1" gutterBottom>
                  5. If the upload is successful, you will see a success
                  message.
                </Typography>
                <Typography variant="body1" gutterBottom>
                  6. If there are any errors, you will see an error message with
                  details.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
            <Box>
              <Button
                variant="outlined"
                onClick={handleClear}
                endIcon={<CancelIcon />}
                sx={{ marginRight: 1 }}
                disabled={!file}
              >
                Clear
              </Button>
              <LoadingButton
                onClick={handleUpload}
                color="primary"
                variant="contained"
                endIcon={<CloudUploadIcon />}
                disabled={!file || validationErrors.length > 0}
                loading={loading}
                sx={{ padding: "4px 16px" }}
              >
                Upload
              </LoadingButton>
            </Box>
          </Box>
          {validationErrors.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" color="error">
                Validation failed. Missing columns:
              </Typography>
              <ul>
                {validationErrors.map((error, index) => (
                  <li key={index}>
                    <Typography variant="body2" color="error">
                      {error}
                    </Typography>
                  </li>
                ))}
              </ul>
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                Please fix the missing fields and reupload.
              </Typography>
            </Box>
          )}
          {isFileValidate && excelData.length > 0 && (
            <Box sx={{ mt: 2, height: 400 }}>
              <Typography
                variant="h6"
                color={theme.palette.primary.main}
                sx={{ mb: 2, textAlign: "Left" }}
              >
                Excel Data
              </Typography>
              <DataGrid
                columns={getColumnsWithTooltip(columns)}
                rows={excelData}
              />
            </Box>
          )}
        </Box>
      </Container>
    </FsBox>
  );
};

export default PriceList;
