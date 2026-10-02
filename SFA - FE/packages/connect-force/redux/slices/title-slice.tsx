import { createSlice } from "@reduxjs/toolkit";

export type TitleState = {
    isLoading: boolean;
    error: string | null;
    paginationDetails: any;
    titles: any[];
    title: any;
    newPage: number;
    newRowsPerPage: number;
};

const initialState: TitleState = {
    isLoading: true,
    error: null,
    paginationDetails: null,
    titles: [],
    title: null,
    newPage: 0,
    newRowsPerPage: 100,
};

export const titleSlice = createSlice({
    name: "Title",
    initialState,
    reducers: {
        startLoading(state) {
            state.isLoading = true;
        },
        setAllTitles(state, action) {
            state.isLoading = false;
            if (action.payload.update) {
                const index = state.titles.findIndex(d => d.uId === action.payload.data.uId);
        
                if (index !== -1) {
                    state.titles[index] = action.payload.data;
                }
            } else {
                state.titles = action.payload;
            }
        },
        setTitle(state, action) {
            state.title = action.payload;
        },
        setPaginationDetails(state, action) {
            state.paginationDetails = action.payload;
        },
        setPage(state, action) {
            state.newPage = action.payload;
        },
        setRowsPerPage(state, action) {
            state.newRowsPerPage = action.payload;
        },
        setTitleError(state, action) {
            state.error = action.payload;
        },
    },
});

export const {
    startLoading,
    setAllTitles,
    setTitle,
    setPaginationDetails,
    setPage,
    setTitleError,
    setRowsPerPage,
} = titleSlice.actions;
export default titleSlice.reducer;