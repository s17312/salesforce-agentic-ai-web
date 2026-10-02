"use client";

import React, { useRef, useState } from "react";
import {
  Button,
  CssBaseline,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Container } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs, { Dayjs } from "dayjs";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  BreadcrumbNavigation,
  DataCard,
  GaugeChart,
  LineChartComponent,
} from "@icp/react-fusion";
import { useRouter } from "next/navigation";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { toggleFullScreen } from "@/utils/fullscreenUtils";
import { FsBox } from "@/styles/fullscreen/fullscreenStyles";

const InventoryDashboard = () => {
  const router = useRouter();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const handleFromDateChange = (newValue: Dayjs | null) => {
    setFromDate(newValue);
  };
  const handleToDateChange = (newValue: Dayjs | null) => {
    setToDate(newValue);
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
      <CssBaseline />
      <BreadcrumbNavigation
        pageTitle="Inventory Dashboard"
        pageNavigation={[{ pageName: "Inventory Dashboard" }]}
        onLinkClick={handleBreadcrumbNavigation}
        onFullScreenClick={handleFullScreenClick}
        icon={<DashboardIcon sx={{ color: theme.palette.primary.main }} />}
      />
      <Container>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={false} sm={3.5} />
            <Grid item xs={12} sm={2}>
              <DesktopDatePicker
                label="From Date"
                inputFormat="MM/dd/yyyy"
                value={fromDate}
                onChange={handleFromDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    sx={{
                      "& .MuiInputBase-root": {
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                      },
                      "& .MuiInputLabel-root": { lineHeight: "13px" },
                      zIndex: 0,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <DesktopDatePicker
                label="To Date"
                inputFormat="MM/dd/yyyy"
                value={toDate}
                onChange={handleToDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    sx={{
                      "& .MuiInputBase-root": {
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                      },
                      "& .MuiInputLabel-root": { lineHeight: "13px" },
                      zIndex: 0,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={1}>
              <Button variant="contained" startIcon={<FilterAltIcon />}>
                Filter
              </Button>
            </Grid>
            <Grid item xs={false} sm={3.5} />
          </Grid>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={false} sm={2} />
            <Grid item xs={12} sm={4}>
              <Grid
                container
                rowSpacing={2}
                columnSpacing={{ xs: 1, sm: 2, md: 2 }}
              >
                <Grid item xs={6}>
                  <DataCard
                    title="Total Invoice Count"
                    value="8503"
                    titleColor="#6B7280"
                    valueColor="#09114C"
                    sx={{
                      height: "128px",
                      width: "100%",
                    }}
                    onClickFun={() => alert("Clicked")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DataCard
                    title="Total Outlet Count"
                    value="65120"
                    titleColor="#6B7280"
                    valueColor="#09114C"
                    sx={{
                      height: "128px",
                      width: "100%",
                    }}
                    onClickFun={() => alert("Clicked")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DataCard
                    title="Avg Invoice Sales (Value)"
                    value="2020"
                    titleColor="#6B7280"
                    valueColor="#09114C"
                    sx={{
                      height: "128px",
                      width: "100%",
                    }}
                    onClickFun={() => alert("Clicked")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DataCard
                    title="Total Invoice Count"
                    value="584110"
                    titleColor="#6B7280"
                    valueColor="#09114C"
                    sx={{
                      height: "128px",
                      width: "100%",
                    }}
                    onClickFun={() => alert("Clicked")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DataCard
                    title="Total Purchase Order Count"
                    value="9145"
                    titleColor="#6B7280"
                    valueColor="#09114C"
                    sx={{
                      height: "128px",
                      width: "100%",
                    }}
                    onClickFun={() => alert("Clicked")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DataCard
                    title="Total Purchase Order Volume"
                    value="6510"
                    titleColor="#6B7280"
                    valueColor="#09114C"
                    sx={{
                      height: "128px",
                      width: "100%",
                    }}
                    onClickFun={() => alert("Clicked")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DataCard
                    title="Total Purchase Order Count"
                    value="9145"
                    titleColor="#6B7280"
                    valueColor="#09114C"
                    sx={{
                      height: "128px",
                      width: "100%",
                    }}
                    onClickFun={() => alert("Clicked")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DataCard
                    title="Total Purchase Order Volume"
                    value="6510"
                    titleColor="#6B7280"
                    valueColor="#09114C"
                    sx={{
                      height: "128px",
                      width: "100%",
                    }}
                    onClickFun={() => alert("Clicked")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DataCard
                    title="Total Invoice Count"
                    value="8503"
                    titleColor="#6B7280"
                    valueColor="#09114C"
                    sx={{
                      height: "128px",
                      width: "100%",
                    }}
                    onClickFun={() => alert("Clicked")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DataCard
                    title="Total Outlet Count"
                    value="65120"
                    titleColor="#6B7280"
                    valueColor="#09114C"
                    sx={{
                      height: "128px",
                      width: "100%",
                    }}
                    onClickFun={() => alert("Clicked")}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Grid
                container
                rowSpacing={2}
                columnSpacing={{ xs: 1, sm: 2, md: 2 }}
              >
                <Grid item xs={6}>
                  <GaugeChart
                    title="Target vs Achievement"
                    titleColor="#6B7280"
                    valueColor="#876FC1"
                    gaugeSize={{
                      height: 160,
                      width: 160,
                    }}
                    onClickFun={() => alert("Clicked")}
                    value={2500}
                    percentage={52}
                    textColor="#312c7d"
                  />
                </Grid>
                <Grid item xs={6}>
                  <GaugeChart
                    title="Target vs Achievement (Monthly) - RD"
                    titleColor="#6B7280"
                    valueColor="#45B143"
                    gaugeSize={{
                      height: 160,
                      width: 160,
                    }}
                    onClickFun={() => alert("Clicked")}
                    value={2500}
                    percentage={73}
                    textColor="#312c7d"
                  />
                </Grid>
                <Grid item xs={6}>
                  <GaugeChart
                    title="Active Sales Rep (Daily)"
                    titleColor="#6B7280"
                    valueColor="#DE9151"
                    gaugeSize={{
                      height: 160,
                      width: 160,
                    }}
                    onClickFun={() => alert("Clicked")}
                    value={2500}
                    percentage={44}
                    textColor="#312c7d"
                  />
                </Grid>
                <Grid item xs={6}>
                  <GaugeChart
                    title="Target vs Achievement (Monthly) - Primary"
                    titleColor="#6B7280"
                    valueColor="#AB4990"
                    gaugeSize={{
                      height: 160,
                      width: 160,
                    }}
                    onClickFun={() => alert("Clicked")}
                    value={2500}
                    percentage={52}
                    textColor="#312c7d"
                  />
                </Grid>
                <Grid item xs={6}>
                  <GaugeChart
                    title="Outlet Productivity (Monthly)"
                    titleColor="#6B7280"
                    valueColor="#7785AC"
                    gaugeSize={{
                      height: 160,
                      width: 160,
                    }}
                    onClickFun={() => alert("Clicked")}
                    value={2500}
                    percentage={85}
                    textColor="#312c7d"
                  />
                </Grid>
                <Grid item xs={6}>
                  <GaugeChart
                    title="Asset Utilization"
                    titleColor="#6B7280"
                    valueColor="#8B1E3F"
                    gaugeSize={{
                      height: 160,
                      width: 160,
                    }}
                    onClickFun={() => alert("Clicked")}
                    value={2500}
                    percentage={73}
                    textColor="#312c7d"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={false} sm={2} />
          </Grid>

          {/* Line charts */}
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 2 }}
          >
            <Grid item xs={12} sm={8}>
              <LineChartComponent
                title="Direct Sales (Purchase Order Sales)"
                titleColor="#6B7280"
                amount="LKR 120,543.43"
                percentage={45}
                height={300}
                lineColor="110, 107, 179"
                chartData={[
                  {
                    label: "Incomes",
                    xLabels: [
                      "Prd 1",
                      "Prd 2",
                      "Prd 3",
                      "Prd 4",
                      "Prd 5",
                      "Prd 6",
                      "Prd 7",
                      "Prd 8",
                      "Prd 9",
                      "Prd 10",
                      "Prd 11",
                    ],
                    yData: [
                      400, 1398, 9800, 3908, 4800, 3800, 4300, 1600, 2500, 5000,
                      6200,
                    ],
                  },
                  {
                    label: "Expenses",
                    xLabels: ["Prd 5", "Prd 10", "Prd 15", "Prd 16", "Prd 17"],
                    yData: [1400, 1398, 800, 1008, 800],
                  },
                  {
                    label: "Savings",
                    xLabels: ["Prd 4", "Prd 9", "Prd 10", "Prd 12"],
                    yData: [2400, 1000, 4000, 908],
                  },
                  {
                    label: "Investments",
                    xLabels: [
                      "Prd 1",
                      "Prd 2",
                      "Prd 3",
                      "Prd 4",
                      "Prd 5",
                      "Prd 6",
                      "Prd 7",
                      "Prd 8",
                      "Prd 9",
                      "Prd 10",
                      "Prd 11",
                    ],
                    yData: [
                      2400, 1398, 800, 3908, 4800, 3800, 4300, 1600, 2500, 5000,
                      6200,
                    ],
                  },
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <LineChartComponent
                title="Indirect Sales"
                titleColor="#6B7280"
                amount="LKR 80,543.21"
                percentage={30}
                height={300}
                lineColor="110, 107, 179"
                chartData={[
                  {
                    label: "Incomes",
                    xLabels: [
                      "Prd 1",
                      "Prd 2",
                      "Prd 3",
                      "Prd 4",
                      "Prd 5",
                      "Prd 6",
                      "Prd 7",
                      "Prd 8",
                      "Prd 9",
                      "Prd 10",
                      "Prd 11",
                    ],
                    yData: [
                      300, 1200, 9000, 3500, 4500, 3700, 4200, 1500, 2400, 4800,
                      6000,
                    ],
                  },
                  {
                    label: "Expenses",
                    xLabels: ["Prd 5", "Prd 10", "Prd 15", "Prd 16", "Prd 17"],
                    yData: [1300, 1200, 700, 900, 700],
                  },
                  {
                    label: "Savings",
                    xLabels: ["Prd 4", "Prd 9", "Prd 10", "Prd 12"],
                    yData: [2300, 900, 3800, 800],
                  },
                  {
                    label: "Investments",
                    xLabels: [
                      "Prd 1",
                      "Prd 2",
                      "Prd 3",
                      "Prd 4",
                      "Prd 5",
                      "Prd 6",
                      "Prd 7",
                      "Prd 8",
                      "Prd 9",
                      "Prd 10",
                      "Prd 11",
                    ],
                    yData: [
                      2300, 1200, 700, 3500, 4500, 3700, 4200, 1500, 2400, 4800,
                      6000,
                    ],
                  },
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <LineChartComponent
                title="Online Sales"
                titleColor="#6B7280"
                amount="LKR 150,543.67"
                percentage={60}
                height={300}
                lineColor="110, 107, 179"
                chartData={[
                  {
                    label: "Incomes",
                    xLabels: [
                      "Prd 1",
                      "Prd 2",
                      "Prd 3",
                      "Prd 4",
                      "Prd 5",
                      "Prd 6",
                      "Prd 7",
                      "Prd 8",
                      "Prd 9",
                      "Prd 10",
                      "Prd 11",
                    ],
                    yData: [
                      500, 1500, 10000, 4000, 5000, 4000, 4500, 1700, 2600,
                      5200, 6400,
                    ],
                  },
                  {
                    label: "Expenses",
                    xLabels: ["Prd 5", "Prd 10", "Prd 15", "Prd 16", "Prd 17"],
                    yData: [1500, 1500, 900, 1100, 900],
                  },
                  {
                    label: "Savings",
                    xLabels: ["Prd 4", "Prd 9", "Prd 10", "Prd 12"],
                    yData: [2500, 1100, 4200, 1000],
                  },
                  {
                    label: "Investments",
                    xLabels: [
                      "Prd 1",
                      "Prd 2",
                      "Prd 3",
                      "Prd 4",
                      "Prd 5",
                      "Prd 6",
                      "Prd 7",
                      "Prd 8",
                      "Prd 9",
                      "Prd 10",
                      "Prd 11",
                    ],
                    yData: [
                      2500, 1500, 900, 4000, 5000, 4000, 4500, 1700, 2600, 5200,
                      6400,
                    ],
                  },
                ]}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Container>
    </FsBox>
  );
};

export default InventoryDashboard;
