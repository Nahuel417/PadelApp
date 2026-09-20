import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface ReservationsStatusChartProps {
    series: number[]; // [Confirmadas, Pendientes, Canceladas]
}

const ReservationsStatusChart: React.FC<ReservationsStatusChartProps> = ({ series }) => {
    // Validar que haya datos para mostrar, si todo es 0, chart se ve mal
    const hasData = series.some((val) => val > 0);
    const displaySeries = hasData ? series : [0, 0, 0];

    const options: ApexOptions = {
        chart: { type: 'donut', fontFamily: 'Poppins, sans-serif' },
        labels: ['Confirmadas', 'Pendientes', 'Canceladas'],
        colors: ['#238744', '#0ea5e9', '#b91c1c'],
        plotOptions: {
            pie: {
                donut: {
                    size: '75%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            showAlways: true,
                            label: 'Total',
                            fontSize: '14px',
                            fontFamily: 'Poppins, sans-serif',
                            color: '#666',
                            formatter: function (w) {
                                return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toString();
                            },
                        },
                        value: {
                            show: true,
                            fontSize: '24px',
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 700,
                            color: '#092747',
                            offsetY: 5,
                        },
                    },
                },
            },
        },
        dataLabels: { enabled: false },
        legend: { position: 'bottom' },
        tooltip: { theme: 'light' },
    };

    return (
        <div className="chart-card">
            <h3 className="chart-title">Estado de Reservas</h3>
            <Chart options={options} series={displaySeries} type="donut" height={350} />
        </div>
    );
};

export default ReservationsStatusChart;
