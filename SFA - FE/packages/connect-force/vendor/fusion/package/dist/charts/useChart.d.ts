import { ApexOptions } from 'apexcharts';
export declare function useChart(options?: ApexOptions): {
    colors: (string | undefined)[];
    chart: {
        toolbar: {
            show: boolean;
        };
        zoom: {
            enabled: boolean;
        };
        foreColor: string;
        fontFamily: any;
    };
    states: {
        hover: {
            filter: {
                type: string;
                value: number;
            };
        };
        active: {
            filter: {
                type: string;
                value: number;
            };
        };
    };
    fill: {
        opacity: number;
        gradient: {
            type: string;
            shadeIntensity: number;
            opacityFrom: number;
            opacityTo: number;
            stops: number[];
        };
    };
    dataLabels: {
        enabled: boolean;
    };
    stroke: {
        width: number;
        curve: string;
        lineCap: string;
    };
    grid: {
        strokeDashArray: number;
        borderColor: string;
    };
    xaxis: {
        axisBorder: {
            show: boolean;
        };
        axisTicks: {
            show: boolean;
        };
    };
    markers: {
        size: number;
        strokeColors: string;
    };
    tooltip: {
        x: {
            show: boolean;
        };
    };
    legend: {
        show: boolean;
        fontSize: string;
        position: string;
        horizontalAlign: string;
        markers: {
            radius: number;
        };
        fontWeight: number;
        itemMargin: {
            horizontal: number;
        };
        labels: {
            colors: string;
        };
    };
    plotOptions: {
        bar: {
            borderRadius: number;
            columnWidth: string;
        };
        pie: {
            donut: {
                labels: {
                    show: boolean;
                    value: {
                        offsetY: number;
                        color: string;
                        fontSize: string;
                        fontWeight: unknown;
                        lineHeight: unknown;
                    };
                    total: {
                        show: boolean;
                        label: string;
                        color: string;
                        fontSize: string;
                        fontWeight: unknown;
                        lineHeight: unknown;
                    };
                };
            };
        };
        radialBar: {
            track: {
                strokeWidth: string;
                background: any;
            };
            dataLabels: {
                value: {
                    offsetY: number;
                    color: string;
                    fontSize: string;
                    fontWeight: unknown;
                    lineHeight: unknown;
                };
                total: {
                    show: boolean;
                    label: string;
                    color: string;
                    fontSize: string;
                    fontWeight: unknown;
                    lineHeight: unknown;
                };
            };
        };
        radar: {
            polygons: {
                fill: {
                    colors: string[];
                };
                strokeColors: string;
                connectorColors: string;
            };
        };
        polarArea: {
            rings: {
                strokeColor: string;
            };
            spokes: {
                connectorColors: string;
            };
        };
    };
} & ApexOptions;
