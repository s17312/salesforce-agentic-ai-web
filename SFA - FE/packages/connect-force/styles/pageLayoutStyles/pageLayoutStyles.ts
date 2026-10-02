import styled from "styled-components";

export const Container = styled.div`
  padding: 24px;
`;

export const TableContainer = styled.div`
  height: 300px;
  margin-left: 0px;
  margin-right: 0px;
  @media (max-width: 37.5rem) {
    width: calc(100vw - 2.5rem);
  }
  @media (min-width: 37.5rem) and (max-width: 48rem) {
    width: calc(100vw - 5rem);
  }
`;

export const TopBarContainer = styled.div`
  width: calc(100vw - 22rem);

  @media (max-width: 37.5rem) {
    width: calc(100vw - 2.5rem);
  }

  @media (min-width: 37.5rem) and (max-width: 48rem) {
    width: calc(100vw - 5rem);
  }
`;

export const cursorDefault = {
  "&:hover": {
    cursor: "default !important",
  },
};

export const cursorPointerDefault = {
  "& input": {
    cursor: "default",
  },
};

export const cursorTextDefault = {
  "& input": {
    cursor: "text",
  },
};

export const scrollBarDefault = {
  "& .MuiInputBase-inputMultiline": {
    cursor: "text",
    "&::-webkit-scrollbar": {
      width: "8px",
      backgroundColor: "#f1f1f1",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#888",
      borderRadius: "10px",
      "&:hover": {
        backgroundColor: "#555",
      },
    },
  },
};

export const SubHeading = styled.span`
  font-size: 18px;
  color: #454f5b;
  font-weight: bold;
  font-family: "Public Sans";
`;
