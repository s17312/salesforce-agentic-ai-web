export type QuantitativeChartProps = {
    variant?: "area" | "bar";
    series: {
        data: number[];
    }[];
    xaxis: string[];
    height?: number;
    width?: number;
    layout?: string;
    colors?: string[];
    legend?: boolean;
};
