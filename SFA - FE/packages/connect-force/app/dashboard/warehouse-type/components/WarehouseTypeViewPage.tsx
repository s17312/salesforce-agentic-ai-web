import StatusChip from "@/components/color-chip/Chip";
import { RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/FormProvider";
import {
  cursorTextDefault,
  scrollBarDefault
} from "@/styles/pageLayoutStyles/pageLayoutStyles";
import {
  RegisterWarehouseType,
  WarehouseTypeProps,
} from "@/types/warehouse-types";
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

export default function WarehouseTypeView({
  currentWarehouseType,
}: WarehouseTypeProps) {
  const dateFormat = process.env.NEXT_PUBLIC_DATE_FORMAT || "dd/MM/yyyy";
  const defaultValues = useMemo(
    () => ({
      warehouseTypeId: currentWarehouseType?.warehouseTypeId || null,
      warehouseTypeName: currentWarehouseType?.warehouseTypeName || null,
      description: currentWarehouseType?.description || null,
      createdBy: currentWarehouseType?.createdBy || "ADMIN",
      creationDate: currentWarehouseType?.creationDate || "",
      modifiedBy: currentWarehouseType?.modifiedBy || "ADMIN",
      modifiedDate: currentWarehouseType?.modifiedDate || "",
    }),
    [currentWarehouseType]
  );

  useEffect(() => {
    reset(defaultValues);
  }, [currentWarehouseType]);

  const methods = useForm<RegisterWarehouseType>({
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
        <StatusChip status={currentWarehouseType?.active} />
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
            aria-controls="Warehouse Type"
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
              Warehouse Type View
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
              name="warehouseTypeId"
              label="Code"
              sx={cursorTextDefault}
              inputProps={{ readOnly: true }}
              focused
            />
            <RHFTextField
              name="warehouseTypeName"
              label="Name"
              sx={cursorTextDefault}
              inputProps={{ readOnly: true }}
              focused
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
          />
          <RHFTextField
            name="modifiedBy"
            label="Modified By"
            inputProps={{ readOnly: true }}
            focused
            sx={cursorTextDefault}
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
