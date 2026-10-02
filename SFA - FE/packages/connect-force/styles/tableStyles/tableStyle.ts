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
  // Default height for extra small devices and below
  height: "35vh",
  "@media (min-width: 555px)": {
    height: "38vh", // Small devices (tablets, 576px and up)
  },
  "@media (min-width: 560px)": {
    height: "36vh", // Small devices (tablets, 576px and up)
  },
  "@media (min-width: 562px)": {
    height: "37vh", // Small devices (tablets, 576px and up)
  },
  "@media (min-width: 565px)": {
    height: "38vh", // Small devices (tablets, 576px and up)
  },
  "@media (min-width: 570px)": {
    height: "39vh", // Small devices (tablets, 576px and up)
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
    height: "55vh", // Extra large devices (very large desktops, 1200px and up)
  },
  "@media (min-width: 1300px)": {
    height: "60vh", // Extra extra large devices (1300px and up)
  },
  "@media (min-width: 1350px)": {
    height: "65vh", // Extra extra large devices (1350px and up)
  },
  "@media (min-width: 1400px)": {
    height: "70vh", // Extra extra large devices (1400px and up)
  },
  "@media (min-width: 1450px)": {
    height: "72vh", // Extra extra large devices (1450px and up)
  },
  "@media (min-width: 1475px)": {
    height: "75vh", // Extra extra large devices (1450px and up)
  },
  "@media (min-width: 1500px)": {
    height: "76vh", // Extra extra large devices (1500px and up)
  },
  "@media (min-width: 1525px)": {
    height: "77vh", // Extra extra large devices (1500px and up)
  },
  "@media (min-width: 1550px)": {
    height: "78vh", // Extra extra large devices (1500px and up)
  },
  "@media (min-width: 1575px)": {
    height: "79vh", // Extra extra large devices (1500px and up)
  },
  "@media (min-width: 1600px)": {
    height: "80vh", // Extra extra large devices (1600px and up)
  },
  "@media (min-width: 1650px)": {
    height: "81vh", // Extra extra large devices (1650px and up)
  },
  "@media (min-width: 1670px)": {
    height: "82vh", // Extra extra large devices (1670px and up)
  },
  "@media (min-width: 1700px)": {
    height: "83vh", // Extra extra large devices (1700px and up)
  },
  "@media (min-width: 1800px)": {
    height: "84vh", // Extra extra large devices (1800px and up)
  },
  "@media (min-width: 1900px)": {
    height: "85vh", // Extra extra large devices (1900px and up)
  },
  "@media (min-width: 2000px)": {
    height: "86vh", // Extra extra large devices (2000px and up)
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
