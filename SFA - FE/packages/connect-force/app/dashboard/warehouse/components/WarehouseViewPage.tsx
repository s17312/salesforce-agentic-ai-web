import StatusChip from "@/components/color-chip/Chip";
import { RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/FormProvider";
import {
  cursorTextDefault,
  scrollBarDefault,
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { RegisterWarehouse, WarehouseProps } from "@/types/warehouse";
import {
  Accordion,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { format, isValid } from "date-fns";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

export default function WarehouseView({ currentWarehouse }: WarehouseProps) {
  const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";

  const defaultValues = useMemo(() => {
    let warehouseAssignment = null;

    if (currentWarehouse?.warehouseCategory?.category === "Company") {
      warehouseAssignment = currentWarehouse?.company?.companyName || "";
    } else if (
      currentWarehouse?.warehouseCategory?.category === "Distributor"
    ) {
      warehouseAssignment =
        currentWarehouse?.distributor?.distributorName || "";
    } else if (currentWarehouse?.warehouseCategory?.category === "Vehicle") {
      warehouseAssignment = currentWarehouse?.vehicle?.plateNumber || "";
    }

    return {
      warehouseID: currentWarehouse?.warehouseID || null,
      name: currentWarehouse?.name || null,
      description: currentWarehouse?.description || null,
      warehouseTypeName:
        currentWarehouse?.warehouseType?.warehouseTypeName || "",
      warehouseCategoryName:
        currentWarehouse?.warehouseCategory?.category || "",
      assignmentName: warehouseAssignment || null,
      createdBy: currentWarehouse?.createdBy || "ADMIN",
      creationDate: currentWarehouse?.creationDate || "",
      modifiedBy: currentWarehouse?.modifiedBy || "ADMIN",
      modifiedDate: currentWarehouse?.modifiedDate || "",
    };
  }, [currentWarehouse]);

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWarehouse]);

  const methods = useForm<RegisterWarehouse>({
    defaultValues,
  });

  const { reset } = methods;

  return (
    <FormProvider methods={methods}>
      <Grid
        item
        xs={12}
        sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}
      >
        <StatusChip status={currentWarehouse?.active} />
      </Grid>
      <Grid item xs={12} sx={{ mt: 2, mb: 5 }}>
        <Accordion
          expanded={true}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
          <AccordionSummary
            aria-controls="Warehouse"
            id="panel1a-header"
            sx={{
              flexDirection: "row-reverse",
              alignItems: "center",
              "&:hover": {
                cursor: "default !important",
              },
            }}
          >
            <Typography
              variant="body1"
              gutterBottom
              sx={{ ml: 5, mb: 2, fontWeight: 500 }}
            >
              Warehouse View
            </Typography>
          </AccordionSummary>
          <Box
            sx={{ mx: 12, mb: 3 }}
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            }}
          >
            <RHFTextField
              name="warehouseID"
              label="Code"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.warehouseID ? { shrink: true } : { shrink: false }
              }
            />
            <RHFTextField
              name="name"
              label="Name"
              inputProps={{ readOnly: true }}
              focused
              sx={cursorTextDefault}
              InputLabelProps={
                defaultValues.name ? { shrink: true } : { shrink: false }
              }
            />
            <RHFTextField
              name="description"
              label="Description"
              multiline
              maxRows={3}
              placeholder="Description"
              focused={true}
              inputProps={{ readOnly: true }}
              InputLabelProps={
                defaultValues.description ? { shrink: true } : { shrink: false }
              }
              sx={{
                ...scrollBarDefault,
              }}
            />
            <RHFTextField
              name="warehouseTypeName"
              label="Warehouse Type"
              focused
              sx={cursorTextDefault}
              inputProps={{ readOnly: true }}
              InputLabelProps={
                defaultValues.warehouseTypeName
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="warehouseCategoryName"
              label="Warehouse Category"
              focused
              sx={cursorTextDefault}
              inputProps={{ readOnly: true }}
              InputLabelProps={
                defaultValues.warehouseCategoryName
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
            <RHFTextField
              name="assignmentName"
              label="Warehouse Assignment"
              focused
              sx={cursorTextDefault}
              inputProps={{ readOnly: true }}
              InputLabelProps={
                defaultValues.assignmentName
                  ? { shrink: true }
                  : { shrink: false }
              }
            />
          </Box>
        </Accordion>
      </Grid>
      <Grid item xs={12} sx={{ mb: 3 }}>
        <Box
          sx={{ mx: 12, mb: 3 }}
          rowGap={2}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(4, 1fr)",
          }}
        >
          <RHFTextField
            name="createdBy"
            label="Created By"
            inputProps={{ readOnly: true }}
            focused
            sx={cursorTextDefault}
            InputLabelProps={
              defaultValues.createdBy ? { shrink: true } : { shrink: false }
            }
          />
          <RHFTextField
            name="creationDate"
            label="Created Date"
            inputProps={{ readOnly: true }}
            focused
            sx={cursorTextDefault}
            value={
              defaultValues.creationDate &&
              isValid(new Date(defaultValues.creationDate))
                ? format(new Date(defaultValues.creationDate), dateFormat)
                : ""
            }
            InputLabelProps={
              defaultValues.creationDate ? { shrink: true } : { shrink: false }
            }
          />
          <RHFTextField
            name="modifiedBy"
            label="Modified By"
            inputProps={{ readOnly: true }}
            focused
            sx={cursorTextDefault}
            InputLabelProps={
              defaultValues.modifiedBy ? { shrink: true } : { shrink: false }
            }
          />
          <RHFTextField
            name="modifiedDate"
            label="Modified Date"
            inputProps={{ readOnly: true }}
            focused
            sx={cursorTextDefault}
            value={
              defaultValues.modifiedDate &&
              isValid(new Date(defaultValues.modifiedDate))
                ? format(new Date(defaultValues.modifiedDate), dateFormat)
                : ""
            }
            InputLabelProps={
              defaultValues.modifiedDate ? { shrink: true } : { shrink: false }
            }
          />
        </Box>
      </Grid>
    </FormProvider>
  );
}
