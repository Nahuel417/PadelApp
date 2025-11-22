import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface RevenueChartProps {
    categories: string[];
    data: number[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ categories, data }) => {
    const options: ApexOptions = {
        chart: {
            type: 'area',
            toolbar: { show: false },
            fontFamily: 'Poppins, sans-serif',
        },
        colors: ['#238744'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.2,
                stops: [0, 90, 100],
            },
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
            categories: categories.length > 0 ? categories : ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'], // Fallback if empty
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                formatter: (value) => `$${value}`,
            },
        },
        grid: {
            borderColor: '#f1f1f1',
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: (val) => `$${val}`,
            },
        },
    };

    const series = [
        {
            name: 'Ingresos',
            data: data.length > 0 ? data : [0, 0, 0, 0, 0, 0], // Fallback
        },
    ];

    return (
        <div className="chart-card">
            <h3 className="chart-title">Ingresos Mensuales (Año Actual)</h3>
            <Chart options={options} series={series} type="area" height={350} />
        </div>
    );
};

export default RevenueChart;
