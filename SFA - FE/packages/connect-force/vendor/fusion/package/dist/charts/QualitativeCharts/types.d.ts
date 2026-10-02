export type QualitativeChartProps = {
    variant?: "pie" | "donut";
    series: number[];
    labels: string[];
    width: number;
    showLabel?: boolean;
    legend?: boolean;
    stroke?: boolean;
};
