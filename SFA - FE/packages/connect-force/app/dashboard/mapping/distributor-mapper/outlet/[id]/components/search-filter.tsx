import { Box, Button, Stack } from "@mui/material";
import { GridToolbarQuickFilter } from "@mui/x-data-grid";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

interface SearchBarFilterProps {
  handleNextClick?: () => void;
  handleBackClick?: () => void;
  handleSaveClick?: () => void;
}

export default function QuickSearchToolbar({
  handleNextClick,
  handleBackClick,
  handleSaveClick,
}: SearchBarFilterProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      paddingBottom="10px"
    >
      <GridToolbarQuickFilter
        size="small"
        id="search-filter"
        placeholder="Search..."
        variant="outlined"
        fullWidth
        sx={{
          width: "20%",
          "@media (max-width: 768px)": {
            width: "100%",
          },
        }}
      />
      <Box flexGrow={1} />
      {handleNextClick && (
        <Button
          variant="contained"
          endIcon={<ArrowForwardIosRoundedIcon />}
          onClick={handleNextClick}
        >
          Next
        </Button>
      )}
      {handleBackClick && (
        <Button
          variant="contained"
          startIcon={<ArrowBackIosNewRoundedIcon />}
          onClick={handleBackClick}
        >
          Back
        </Button>
      )}
      {handleSaveClick && (
        <Button
          variant="contained"
          startIcon={<SaveRoundedIcon />}
          onClick={handleSaveClick}
        >
          Save
        </Button>
      )}
    </Stack>
  );
}
