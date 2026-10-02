// components
import React from 'react';
import { useChart } from '../useChart';
import Chart from 'react-apexcharts';
export const QualitativeChart = (props) => {
    const chartOptions = useChart({
        labels: props.labels,
        legend: {
            show: props.legend,
            position: 'right',
            offsetX: -20,
            offsetY: 64,
            itemMargin: {
                vertical: 8,
            },
        },
        stroke: {
            show: props.stroke,
        },
        dataLabels: {
            enabled: props.showLabel,
            dropShadow: {
                enabled: false,
            },
        },
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: false,
                    },
                },
            },
        },
    });
    return React.createElement(Chart, { type: props.variant, series: props.series, options: chartOptions, width: props.width });
};
