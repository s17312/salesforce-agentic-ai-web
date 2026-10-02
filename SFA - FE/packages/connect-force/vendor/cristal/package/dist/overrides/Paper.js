// ----------------------------------------------------------------------
export default function Paper(theme) {
    return {
        MuiPaper: {
            defaultProps: {
                elevation: 0,
            },
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(5px)",
                },
            },
        },
    };
}
