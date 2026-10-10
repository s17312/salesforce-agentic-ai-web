import { alpha } from "@mui/material/styles";

const GREY = {
  0: "#FFFFFF",
  100: "#F9FAFB",
  200: "#F4F6F8",
  300: "#DFE3E8",
  400: "#C4CDD5",
  500: "#919EAB",
  600: "#637381",
  700: "#454F5B",
  800: "#212B36",
  900: "#161C24",
};

const dataGridStyle = {
  padding: "0px",
  boxShadow: "none",
  background: "unset",
  width: "100%",
  flex: 1,
  minHeight: "450px",
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "var(--primary-lighter, #e0f2fe) !important",
    borderRadius: "10px 10px 0 0",
    borderBottom: "none",
    minHeight: "48px !important",
    maxHeight: "48px !important",
  },
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "var(--primary-lighter, #e0f2fe) !important",
    color: "var(--text-primary, #0f172a) !important",
    fontWeight: 800,
    fontSize: "0.9rem",
    "&:focus, &:focus-within": { outline: "none" },
    "&:not(:last-child)": {
      borderRight: "1.5px solid rgba(0, 0, 0, 0.08)",
    },
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: 800,
    color: "var(--text-primary, #0f172a) !important",
  },
  "& .MuiDataGrid-cell": {
    borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
    color: "var(--text-primary, #0f172a)",
    fontSize: "0.875rem",
    "&:focus, &:focus-within": { outline: "none" },
  },
  "& .MuiDataGrid-overlay": {
    minHeight: "320px !important",
    display: "flex !important",
    alignItems: "center !important",
    justifyContent: "center !important",
    backgroundColor: "transparent !important",
  },
  "& .MuiDataGrid-virtualScroller": {
    minHeight: "320px",
  },
  "& .MuiDataGrid-virtualScrollerContent": {
    minHeight: "320px",
  },
};

const focusDataGridStyle = {
  "&.MuiDataGrid-root .MuiDataGrid-cell:focus": {
    background: alpha(GREY[500], 0.24),
  },
  "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus": {
    background: alpha(GREY[500], 0.24),
  },
  "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
    background: alpha(GREY[500], 0.24),
  },
};

const dataGridStyleMappers = {
  padding: "0px",
  boxShadow: "none",
  background: "unset",
  // Default height for extra small devices and below
  height: "32vh",
  "@media (min-width: 576px)": {
    height: "42vh", // Small devices (tablets, 576px and up)
  },
  "@media (min-width: 768px)": {
    height: "55vh", // Medium devices (desktops, 768px and up)
  },
  "@media (min-width: 992px)": {
    height: "65vh", // Large devices (large desktops, 992px and up)
  },
  "@media (min-width: 1200px)": {
    height: "57vh", // Extra large devices (very large desktops, 1200px and up)
  },
  "@media (min-width: 1600px)": {
    height: "65vh", // Extra extra large devices (1600px and up)
  },
};

const dataGridStockStyleMappers = {
  padding: "0px",
  boxShadow: "none",
  background: "unset",
  // Default height for extra small devices and below
  height: "32vh",
  "@media (min-width: 576px)": {
    height: "35vh", // Small devices (tablets, 576px and up)
  },
  "@media (min-width: 768px)": {
    height: "40vh", // Medium devices (desktops, 768px and up)
  },
  "@media (min-width: 992px)": {
    height: "45vh", // Large devices (large desktops, 992px and up)
  },
  "@media (min-width: 1200px)": {
    height: "50vh", // Extra large devices (very large desktops, 1200px and up)
  },
  "@media (min-width: 1600px)": {
    height: "55.5vh", // Extra extra large devices (1600px and up)
  },
};

const dataGridStockViewStyleMappers = {
  padding: "0px",
  boxShadow: "none",
  background: "unset",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "4px", // Scrollbar width
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#c3b8e6", // Scrollbar track background color
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#c3b8e6", // Thumb color
    borderRadius: "4px", // Rounded scrollbar thumb
  },

  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#555", // Thumb color on hover
  },
  height: "35vh",
  "@media (min-width: 555px)": {
    height: "28vh", // Small devices (tablets, 576px and up)
  },
  "@media (min-width: 560px)": {
    height: "32vh", // Small devices (tablets, 576px and up)
  },
  "@media (min-width: 562px)": {
    height: "35vh", // Small devices (tablets, 576px and up)
  },
  "@media (min-width: 565px)": {
    height: "37vh", // Small devices (tablets, 576px and up)
  },
  "@media (min-width: 570px)": {
    height: "38vh", // Small devices (tablets, 576px and up)
  },
  "@media (min-width: 576px)": {
    height: "40vh", // Small devices (tablets, 576px and up)
  },
  "@media (min-width: 578px)": {
    height: "41vh", // Small devices (tablets, 576px and up)
  },
  "@media (min-width: 768px)": {
    height: "42vh", // Medium devices (desktops, 768px and up)
  },
  "@media (min-width: 992px)": {
    height: "43vh", // Large devices (large desktops, 992px and up)
  },
  "@media (min-width: 1200px)": {
    height: "45vh", // Extra large devices (very large desktops, 1200px and up)
  },
  "@media (min-width: 1300px)": {
    height: "47vh", // Extra extra large devices (1600px and up)
  },
  "@media (min-width: 1350px)": {
    height: "48vh", // Extra extra large devices (1600px and up)
  },
  "@media (min-width: 1400px)": {
    height: "50vh", // Extra extra large devices (1600px and up)
  },
  "@media (min-width: 1450px)": {
    height: "51vh", // Extra extra large devices (1600px and up)
  },
  "@media (min-width: 1500px)": {
    height: "68vh", // Extra extra large devices (1600px and up)
  },
  "@media (min-width: 1600px)": {
    height: "70vh", // Extra extra large devices (1600px and up)
  },
  "@media (min-width: 1800px)": {
    height: "65vh", // Extra extra large devices (1600px and up)
  },
  "@media (min-width: 1850px)": {
    height: "68vh", // Extra extra large devices (1600px and up)
  },
  "@media (min-width: 1900px)": {
    height: "70vh", // Extra extra large devices (1600px and up)
  },
  "@media (min-width: 1950px)": {
    height: "72vh", // Extra extra large devices (1600px and up)
  },
};

const dataGridViewStyleMappers = {
  padding: "0px",
  boxShadow: "none",
  background: "unset",
  height: "35vh",
  "@media (min-width: 555px)": {
    height: "28vh", // Small devices (tablets, 576px and up)
  },
  "@media (min-width: 560px)": {
    height: "32vh", // Small devices (tablets, 576px and up)
  },
  "@media (min-width: 562px)": {
    height: "35vh", // Small devices (tablets, 576px and up)
  },
  "@media (min-width: 565px)": {
    height: "37vh", // Small devices (tablets, 576px and up)
  },
  "@media (min-width: 570px)": {
    height: "38vh", // Small devices (tablets, 576px and up)
  },
  "@media (min-width: 576px)": {
    height: "40vh", // Small devices (tablets, 576px and up)
  },
  "@media (min-width: 578px)": {
    height: "41vh", // Small devices (tablets, 576px and up)
  },
  "@media (min-width: 768px)": {
    height: "42vh", // Medium devices (desktops, 768px and up)
  },
  "@media (min-width: 992px)": {
    height: "43vh", // Large devices (large desktops, 992px and up)
  },
  "@media (min-width: 1200px)": {
    height: "45vh", // Extra large devices (very large desktops, 1200px and up)
  },
  "@media (min-width: 1300px)": {
    height: "52vh", // Extra extra large devices (1600px and up)
  },
  "@media (min-width: 1350px)": {
    height: "55vh", // Extra extra large devices (1600px and up)
  },
  "@media (min-width: 1400px)": {
    height: "58vh", // Extra extra large devices (1600px and up)
  },
  "@media (min-width: 1450px)": {
    height: "60vh", // Extra extra large devices (1600px and up)
  },
  "@media (min-width: 1475px)": {
    height: "61vh", // Extra extra large devices (1600px and up)
  },
  "@media (min-width: 1500px)": {
    height: "62vh", // Extra extra large devices (1600px and up)
  },
  "@media (min-width: 1525px)": {
    height: "65vh", // Extra extra large devices (1600px and up)
  },
  "@media (min-width: 1550px)": {
    height: "67vh", // Extra extra large devices (1600px and up)
  },
  "@media (min-width: 1575px)": {
    height: "68vh", // Extra extra large devices (1600px and up)
  },
  "@media (min-width: 1600px)": {
    height: "70vh", // Extra extra large devices (1600px and up)
  },
};

// status colors
const statusColors = {
  Active: {
    backgroundColor: "#C8FACD",
    fontColor: "#00AB55",
  },
  InActive: {
    backgroundColor: "#FFE9D5",
    fontColor: "#FF5630",
  },
};

const approvalStatusColors = {
  Approved: {
    backgroundColor: "#C8FACD",
    fontColor: "#00AB55",
  },
  Pending: {
    backgroundColor: "#FFF5CC",
    fontColor: "#B76E00",
  },
  Rejected: {
    backgroundColor: "#FFE9D5",
    fontColor: "#FF5630",
  },
  Reviewed: {
    backgroundColor: "#DFE3E8",
    fontColor: "#637381",
  },
  Cancelled: {
    backgroundColor: "#F3C8CD",
    fontColor: "#DB1F1F",
  },
  ReqToCancel: {
    backgroundColor: "#FEDFD6",
    fontColor: "#FF5C00",
  },
};

// archive status colors
const archiveStatusColors = {
  Archive: {
    Enable: "#FF5C00",
    Disable: "#FAAE82",
  },
  NotArchive: {
    Enable: "#00B8D9",
    Disable: "#B6F2FD",
  },
};

// edit icon color
const tableIconColors = {
  editIconColor: "#7D56EC",
  visibilityIcon: "#00B8D9",
  archiveIcon: "#FF5C00",
  deleteIcon: "#FF5630",
  disabledIcon: "#D3D3D3",
  permissionIcon: "#DC143C",
  resetPasswordIcon: "#FF5733",
  goToIcon: "#36b37e",
};

const tabViewTable = {
  padding: 2,
  marginTop: 0,
  paddingBottom: 0,
};

const dataStyleMappers = {
  padding: "0px",
  boxShadow: "none",
  background: "unset",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "4px", // Scrollbar width
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#c3b8e6", // Scrollbar track background color
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#c3b8e6", // Thumb color
    borderRadius: "4px", // Rounded scrollbar thumb
  },

  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#555", // Thumb color on hover
  },
  height: "35vh",
};

export {
  dataGridStyle,
  focusDataGridStyle,
  dataGridStockStyleMappers,
  dataGridStockViewStyleMappers,
  statusColors,
  archiveStatusColors,
  tableIconColors,
  approvalStatusColors,
  dataGridStyleMappers,
  tabViewTable,
  dataGridViewStyleMappers,
  dataStyleMappers,
};
