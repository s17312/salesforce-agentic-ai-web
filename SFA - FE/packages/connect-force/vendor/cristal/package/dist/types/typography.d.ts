export declare function remToPx(value: string): number;
export declare function pxToRem(value: number): string;
export declare function responsiveFontSizes({ sm, md, lg }: {
    sm: number;
    md: number;
    lg: number;
}): {
    '@media (min-width:600px)': {
        fontSize: string;
    };
    '@media (min-width:900px)': {
        fontSize: string;
    };
    '@media (min-width:1200px)': {
        fontSize: string;
    };
};
declare const typography: {
    readonly fontFamily: "Poppins, sans-serif";
    readonly fontWeightLight: 200;
    readonly fontWeightRegular: 400;
    readonly fontWeightMedium: 600;
    readonly fontWeightBold: 700;
    readonly h1: {
        readonly '@media (min-width:600px)': {
            fontSize: string;
        };
        readonly '@media (min-width:900px)': {
            fontSize: string;
        };
        readonly '@media (min-width:1200px)': {
            fontSize: string;
        };
        readonly fontWeight: 800;
        readonly lineHeight: number;
        readonly fontSize: string;
    };
    readonly h2: {
        readonly '@media (min-width:600px)': {
            fontSize: string;
        };
        readonly '@media (min-width:900px)': {
            fontSize: string;
        };
        readonly '@media (min-width:1200px)': {
            fontSize: string;
        };
        readonly fontWeight: 800;
        readonly lineHeight: number;
        readonly fontSize: string;
    };
    readonly h3: {
        readonly '@media (min-width:600px)': {
            fontSize: string;
        };
        readonly '@media (min-width:900px)': {
            fontSize: string;
        };
        readonly '@media (min-width:1200px)': {
            fontSize: string;
        };
        readonly fontWeight: 700;
        readonly lineHeight: 1.5;
        readonly fontSize: string;
    };
    readonly h4: {
        readonly '@media (min-width:600px)': {
            fontSize: string;
        };
        readonly '@media (min-width:900px)': {
            fontSize: string;
        };
        readonly '@media (min-width:1200px)': {
            fontSize: string;
        };
        readonly fontWeight: 700;
        readonly lineHeight: 1.5;
        readonly fontSize: string;
    };
    readonly h5: {
        readonly '@media (min-width:600px)': {
            fontSize: string;
        };
        readonly '@media (min-width:900px)': {
            fontSize: string;
        };
        readonly '@media (min-width:1200px)': {
            fontSize: string;
        };
        readonly fontWeight: 700;
        readonly lineHeight: 1.5;
        readonly fontSize: string;
    };
    readonly h6: {
        readonly '@media (min-width:600px)': {
            fontSize: string;
        };
        readonly '@media (min-width:900px)': {
            fontSize: string;
        };
        readonly '@media (min-width:1200px)': {
            fontSize: string;
        };
        readonly fontWeight: 700;
        readonly lineHeight: number;
        readonly fontSize: string;
    };
    readonly subtitle1: {
        readonly fontWeight: 600;
        readonly lineHeight: 1.5;
        readonly fontSize: string;
    };
    readonly subtitle2: {
        readonly fontWeight: 600;
        readonly lineHeight: number;
        readonly fontSize: string;
    };
    readonly body1: {
        readonly lineHeight: 1.5;
        readonly fontSize: string;
    };
    readonly body2: {
        readonly lineHeight: number;
        readonly fontSize: string;
    };
    readonly caption: {
        readonly lineHeight: 1.5;
        readonly fontSize: string;
    };
    readonly overline: {
        readonly fontWeight: 700;
        readonly lineHeight: 1.5;
        readonly fontSize: string;
        readonly textTransform: "uppercase";
    };
    readonly button: {
        readonly fontWeight: 200;
        readonly lineHeight: number;
        readonly fontSize: string;
        readonly textTransform: "capitalize";
    };
};
export default typography;
