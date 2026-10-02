"use client";

import { RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/FormProvider";
import { outletCategorySchema } from "@/utils/schemas/outletCategorySchema";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { SaveIcon } from "@/components/icons/saveIcon";
import {
  createOutletCategory,
  updateOutletCategory,
} from "@/service/outletCategory.service";
import { PATH_DASHBOARD } from "@/routes/paths";
import { OutletCategory } from "connect-force-api-client";
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";

type props = {
  curruntOutletCategory?: OutletCategory | undefined;
  isEdit?: boolean;
};

export type FormValuesProps = {
  outletCategoryId?: string | null;
  outletCategoryName?: string | null;
  description?: string | null;
};

const OutletCategoryAddEditPage = ({
  curruntOutletCategory,
  isEdit = false,
}: props) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      outletCategoryId: curruntOutletCategory?.outletCategoryId || "",
      outletCategoryName: curruntOutletCategory?.outletCategoryName || "",
      description: curruntOutletCategory?.description || "",
    }),
    [curruntOutletCategory]
  );

  const methods = useForm<FormValuesProps>({
    //@ts-ignore
    resolver: yupResolver(outletCategorySchema),
    defaultValues,
    mode: "all",
  });

  const { handleSubmit, reset, formState, setValue } = methods;

  const handleCreateOutletCategory = async (data: FormValuesProps) => {
    await createOutletCategory(data);
    enqueueSnackbar("Outlet Category successfully registered", {
      variant: "success",
    });
    reset(defaultValues);
    router.push(PATH_DASHBOARD.outletCategory.list);
  };

  const handleUpdateOutletCategory = async (data: FormValuesProps) => {
    await updateOutletCategory(curruntOutletCategory?.uId, data);
    enqueueSnackbar("Outlet Category successfully updated", {
      variant: "success",
    });
    router.push(PATH_DASHBOARD.outletCategory.list);
  };

  const handleCancel = () => {
    router.push(PATH_DASHBOARD.outletCategory.list);
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={
        !isEdit
          ? handleSubmit(handleCreateOutletCategory)
          : handleSubmit(handleUpdateOutletCategory)
      }
    >
      <Grid item xs={12} sx={{ mb: 3, position: "relative" }}>
        <Accordion
          expanded={true}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
          <AccordionSummary
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={cursorDefault}
          >
            <Typography variant="body1" sx={{ ml: 3, fontWeight: 500 }}>
              Outlet Category Details
            </Typography>
          </AccordionSummary>
          <Box
            sx={{ mx: 12, mb: 3 }}
            rowGap={2}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            }}
          >
            <RHFTextField name="outletCategoryId" label="Code*" />
            <RHFTextField name="outletCategoryName" label="Name*" />
            <RHFTextField name="description" label="Description" />
          </Box>
        </Accordion>

        <Box
          sx={{
            width: "100%",
            bgcolor: "#E5E0F5",
            height: "10vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "2px solid #FFFFFF",
            borderRadius: "15px",
            mt: "15px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <LoadingButton
              type="submit"
              variant="contained"
              loading={formState.isSubmitting}
              startIcon={<SaveIcon />}
              disabled={!formState.isDirty}
              sx={{
                color: "#FFFFFF",
                height: "44px",
                px: 4,
                borderRadius: "15px",
                mr: 3,
                border: "2px solid #9fa4d4",
                background: "#070E4D",
                "&:hover": {
                  background: "#2D3675",
                },
              }}
            >
              {isEdit ? "Update" : "Save"}
            </LoadingButton>
            {!isEdit ? (
              <Button
                type="reset"
                variant="outlined"
                onClick={() => reset(defaultValues)}
                sx={{
                  height: "44px",
                  px: 4,
                  borderRadius: "15px",
                  background: "#f7f4fe",
                  border: "2px solid #fbf9ff",
                  "&:hover": {
                    background: "#DED8F2",
                    border: "2px solid #f4f1fc",
                  },
                }}
              >
                Clear
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{
                  height: "44px",
                  px: 4,
                  borderRadius: "15px",
                  background: "#f7f4fe",
                  border: "2px solid #fbf9ff",
                  "&:hover": {
                    background: "#DED8F2",
                    border: "2px solid #f4f1fc",
                  },
                }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </Grid>
    </FormProvider>
  );
};

export default OutletCategoryAddEditPage;
