import { LayoutState } from "@/types/componentTypes/layout-types";
import { createSlice } from "@reduxjs/toolkit";
import { tree } from "next/dist/build/templates/app-page";

const initialState: LayoutState = {
  layoutName: "",
  popupForm: false,
  popupView: false,
  popupDialog: false,
  registerForm: false,
  popupResponse: false,
  PopupWithTextField: false,
  popupDialogType: "",
};

export const layoutSlice = createSlice({
  name: "Layout",
  initialState,
  reducers: {
    setLayoutName(state, action) {
      state.layoutName = action.payload;
    },
    setPopupForm(state, action) {
      state.popupForm = action.payload;
    },
    setPopupView(state, action) {
      state.popupView = action.payload;
    },
    setPopupDialog(state, action) {
      state.popupDialog = action.payload;
    },
    setRegisterForm(state, action) {
      state.registerForm = action.payload;
    },
    setPopupResponse(state, action) {
      state.popupResponse = action.payload;
    },
    setPopupWithTextField(state, action) {
      state.popupDialog = action.payload;
    },
    setPopupDialogType(state, action) {
      state.popupDialogType = action.payload;
    },
  },
});

export const {
  setLayoutName,
  setPopupForm,
  setPopupView,
  setPopupDialog,
  setRegisterForm,
  setPopupResponse,
  setPopupDialogType,
  setPopupWithTextField,
} = layoutSlice.actions;
export default layoutSlice.reducer;
