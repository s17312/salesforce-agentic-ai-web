import { RHFAutocompleteField } from "@/components/hook-form";
import RHFAutocompleteMultipleField from "@/components/hook-form/RHSAutocompleteMultipleField";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { useMemo } from "react";
import { Control, useWatch } from "react-hook-form";

interface AssetStockFormProps {
  assetTypeOptions: Array<{ label: string; value: string }>;
  assetModelOptions: Array<{ label: string; value: string }>;
  assetBrandOptions: Array<{ label: string; value: string }>;
  allocationTypeOptions: Array<{ label: string; value: string }>;
  distributorsOptions: Array<{ label: string; value: string }>;
  outletsOptions: Array<{ label: string; value: string }>;
  repairCentersOptions: Array<{ label: string; value: string }>;
  disposalCentersOptions: Array<{ label: string; value: string }>;
  handleReset: () => void;
  handleSearch: () => void;
  control: Control;
}

const AssetStockViewForm: React.FC<AssetStockFormProps> = ({
  assetTypeOptions,
  assetModelOptions,
  assetBrandOptions,
  allocationTypeOptions,
  distributorsOptions,
  outletsOptions,
  repairCentersOptions,
  disposalCentersOptions,
  handleReset,
  handleSearch,
  control,
}) => {
  const theme = useTheme();

  const assignStatusOptions = useMemo(
    () => [
      { label: "Company", value: 0 },
      { label: "Allocated", value: 1 },
      { label: "Transferred", value: 2 },
    ],
    []
  );
  const assignStatus = useWatch({ control, name: "assignStatus" });
  const allocationTypeUIds =
    useWatch({ control, name: "allocationTypeIds" }) || [];

  return (
    <Card sx={{ backgroundColor: "#fff", mb: 2 }}>
      <CardContent>
        <Box sx={{ width: "100%" }}>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "bold",
              color: theme.palette.primary.main,
            }}
          >
            Asset Stock Information
          </Typography>
          <Divider sx={{ borderColor: "#e8eaef", mt: 0.5, mb: 2 }} />
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={3}>
              <RHFAutocompleteMultipleField
                name="assetTypeIds"
                placeholder="Asset Type"
                // @ts-ignore
                options={assetTypeOptions}
                control={control}
              />
            </Grid>
            <Grid item xs={3}>
              <RHFAutocompleteMultipleField
                name="assetBrandIds"
                placeholder="Asset Brand"
                // @ts-ignore
                options={assetBrandOptions}
                control={control}
              />
            </Grid>
            <Grid item xs={3}>
              <RHFAutocompleteMultipleField
                name="assetModelIds"
                placeholder="Asset Model"
                // @ts-ignore
                options={assetModelOptions}
                control={control}
              />
            </Grid>
            <Grid item xs={3}>
              <RHFAutocompleteField
                name="assignStatus "
                placeholder="Assign Status"
                options={assignStatusOptions}
                control={control}
                inputProps={{
                  form: {
                    autocomplete: "off",
                  },
                }}
              />
            </Grid>
            {assignStatus === 1 || assignStatus === 2 ? (
              <Grid item xs={3}>
                <RHFAutocompleteMultipleField
                  name="allocationTypeIds"
                  placeholder="Allocation Type"
                  // @ts-ignore
                  options={allocationTypeOptions}
                  control={control}
                />
              </Grid>
            ) : null}
            {allocationTypeUIds.includes(2) && (
              <Grid item xs={3}>
                <RHFAutocompleteMultipleField
                  name="distributorIds"
                  placeholder="Distributor"
                  // @ts-ignore
                  options={distributorsOptions}
                  control={control}
                />
              </Grid>
            )}
            {allocationTypeUIds.includes(3) && (
              <Grid item xs={3}>
                <RHFAutocompleteMultipleField
                  name="outletIds"
                  placeholder="Outlet"
                  // @ts-ignore
                  options={outletsOptions}
                  control={control}
                />
              </Grid>
            )}
            {allocationTypeUIds.includes(4) && (
              <Grid item xs={3}>
                <RHFAutocompleteMultipleField
                  name="repairCenterIds"
                  placeholder="Repair Center"
                  // @ts-ignore
                  options={repairCentersOptions}
                  control={control}
                />
              </Grid>
            )}
            {allocationTypeUIds.includes(5) && (
              <Grid item xs={3}>
                <RHFAutocompleteMultipleField
                  name="disposalCenterIds"
                  placeholder="Disposal Center"
                  // @ts-ignore
                  options={disposalCentersOptions}
                  control={control}
                />
              </Grid>
            )}
          </Grid>
          <Divider sx={{ borderColor: "#e8eaef", mt: 1, mb: 1 }} />
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
          >
            <Button
              variant="outlined"
              onClick={handleReset}
              startIcon={<RestartAltIcon />}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{ ml: 1 }}
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AssetStockViewForm;
