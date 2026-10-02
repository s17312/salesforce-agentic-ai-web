// components
import { useChart } from '../useChart';
import Chart from 'react-apexcharts';
import React from "react";
export const QuantitativeChart = (props) => {
    const chartOptions = useChart({
        stroke: { show: false },
        plotOptions: {
            bar: { horizontal: props.layout == "horizontal" ? true : false, barHeight: '30%' },
        },
        xaxis: {
            categories: props.xaxis,
        },
        legend: {
            show: props.legend
        }
    });
    return React.createElement(Chart, { type: props.variant, series: props.series, options: chartOptions, height: props.height, width: props.width });
};
