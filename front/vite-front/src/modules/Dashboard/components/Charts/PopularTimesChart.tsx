import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface PopularTimesChartProps {
    categories: string[];
    data: number[];
}

const PopularTimesChart: React.FC<PopularTimesChartProps> = ({ categories, data }) => {
    const hasData = data.some((val) => val > 0);

    const options: ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
            fontFamily: 'Poppins, sans-serif',
        },
        colors: ['#1d3d5f'],
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: '60%',
                dataLabels: {
                    position: 'top',
                },
            },
        },
        dataLabels: {
            enabled: false,
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ['#304758'],
            },
        },
        xaxis: {
            categories: hasData ? categories : ['18hs', '19hs', '20hs', '21hs'], // Fallback simple
            position: 'bottom',
            axisBorder: { show: false },
            axisTicks: { show: false },
            tooltip: { enabled: false },
        },
        yaxis: {
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { show: false },
        },
        grid: {
            show: false,
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: (val) => `${val} reservas`,
            },
        },
    };

    const series = [
        {
            name: 'Reservas',
            data: hasData ? data : [0, 0, 0, 0], // Fallback
        },
    ];

    return (
        <div className="chart-card">
            <h3 className="chart-title">Horarios Más Concurridos</h3>
            <Chart options={options} series={series} type="bar" height={350} />
        </div>
    );
};

export default PopularTimesChart;
