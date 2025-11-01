import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import './ReservesMetricsSection.css';
import { Reserve } from '../../types/types';
import { STATUS_LABELS } from '../../constants/constants';

export interface ReservesMetricsSectionProps {
    reserves: Reserve[];
    isLoading: boolean;
}

const CHART_FONT_FAMILY = 'Poppins, sans-serif';

const ReservesMetricsSection: React.FC<ReservesMetricsSectionProps> = ({ reserves, isLoading }) => {
    const totalReserves = reserves.length;

    const monthlyData = useMemo(() => {
        const now = new Date();
        const months: string[] = [];
        const counts: number[] = [];
        const revenues: number[] = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = date.toLocaleDateString('es-AR', { month: 'short' });
            months.push(monthName);

            const monthlyReserves = reserves.filter((reserve) => {
                if (!reserve.date) return false;
                const reserveDate = new Date(reserve.date);
                return reserveDate.getFullYear() === date.getFullYear() && reserveDate.getMonth() === date.getMonth();
            });

            counts.push(monthlyReserves.length);

            const monthlyRevenue = monthlyReserves.reduce((acc, reserve) => acc + (reserve.total_amount || 0), 0);
            revenues.push(Number(monthlyRevenue.toFixed(2)));
        }

        return { months, counts, revenues };
    }, [reserves]);

    const statusData = useMemo(() => {
        const statusCounts: Record<string, number> = {
            pending: 0,
            confirmed: 0,
            completed: 0,
            cancelled: 0,
        };

        reserves.forEach((reserve) => {
            statusCounts[reserve.status] = (statusCounts[reserve.status] || 0) + 1;
        });

        return statusCounts;
    }, [reserves]);

    const completionRate = useMemo(() => {
        if (totalReserves === 0) return 0;
        const completed = statusData.completed || 0;
        return Math.round((completed / totalReserves) * 100);
    }, [statusData, totalReserves]);

    const barChartOptions = {
        chart: {
            type: 'bar' as const,
            height: 200,
            toolbar: { show: false },
            background: 'transparent',
            fontFamily: CHART_FONT_FAMILY,
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: '58%',
            },
        },
        dataLabels: { enabled: false },
        stroke: { show: false },
        xaxis: {
            categories: monthlyData.months,
            labels: {
                style: {
                    colors: '#092747',
                    fontSize: '12px',
                    fontWeight: 500,
                    fontFamily: CHART_FONT_FAMILY,
                },
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#092747',
                    fontSize: '12px',
                    fontFamily: CHART_FONT_FAMILY,
                },
            },
        },
        grid: {
            show: true,
            borderColor: 'rgba(9, 39, 71, 0.1)',
            strokeDashArray: 3,
        },
        colors: ['#238744'],
        tooltip: {
            style: {
                fontSize: '12px',
                fontFamily: CHART_FONT_FAMILY,
            },
            theme: 'dark' as const,
        },
    };

    const barChartSeries = [
        {
            name: 'Reservas',
            data: monthlyData.counts,
        },
    ];

    const donutChartOptions = {
        chart: {
            type: 'donut' as const,
            height: 200,
            background: 'transparent',
            fontFamily: CHART_FONT_FAMILY,
        },
        labels: Object.keys(statusData).map((status) => STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status),
        colors: ['#facc15', '#1d4ed8', '#238744', '#b91c1c'],
        stroke: {
            width: 0,
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '12px',
                fontWeight: 600,
                colors: ['#ffffff'],
                fontFamily: CHART_FONT_FAMILY,
            },
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '60%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#092747',
                            fontFamily: CHART_FONT_FAMILY,
                        },
                    },
                },
            },
        },
        legend: {
            position: 'bottom' as const,
            fontSize: '12px',
            fontWeight: 500,
            labels: {
                colors: '#092747',
            },
            fontFamily: CHART_FONT_FAMILY,
        },
        tooltip: {
            style: {
                fontSize: '12px',
                fontFamily: CHART_FONT_FAMILY,
            },
            theme: 'dark' as const,
        },
    };

    const donutChartSeries = Object.keys(statusData).map((status) => statusData[status]);

    const revenueChartOptions = {
        chart: {
            type: 'area' as const,
            height: 200,
            background: 'transparent',
            toolbar: { show: false },
            fontFamily: CHART_FONT_FAMILY,
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth' as const,
            width: 3,
            colors: ['#238744'],
        },
        xaxis: {
            categories: monthlyData.months,
            labels: {
                style: {
                    colors: Array(monthlyData.months.length).fill('#092747'),
                    fontSize: '12px',
                    fontFamily: CHART_FONT_FAMILY,
                },
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                formatter: (value: number) => `$${value.toFixed(0)}`,
                style: {
                    colors: ['rgba(9, 39, 71, 0.6)'],
                    fontSize: '11px',
                    fontFamily: CHART_FONT_FAMILY,
                },
            },
        },
        fill: {
            type: 'gradient' as const,
            gradient: {
                shadeIntensity: 0.5,
                opacityFrom: 0.35,
                opacityTo: 0.05,
                stops: [0, 90, 100],
                colorStops: [
                    {
                        offset: 0,
                        color: '#238744',
                        opacity: 0.35,
                    },
                    {
                        offset: 100,
                        color: '#238744',
                        opacity: 0.05,
                    },
                ],
            },
        },
        markers: {
            size: 4,
            colors: ['#ffffff'],
            strokeColors: '#238744',
            strokeWidth: 2,
            hover: {
                size: 6,
            },
        },
        grid: {
            borderColor: 'rgba(9, 39, 71, 0.1)',
            strokeDashArray: 4,
        },
        tooltip: {
            y: {
                formatter: (value: number) => `$${value.toFixed(2)}`,
            },
            style: {
                fontSize: '12px',
                fontFamily: CHART_FONT_FAMILY,
            },
            theme: 'dark' as const,
        },
    };

    const revenueChartSeries = [
        {
            name: 'Ingresos',
            data: monthlyData.revenues,
        },
    ];

    if (isLoading) {
        return (
            <section className="reserves-metrics" aria-label="Métricas de reservas">
                <div className="reserves-metrics__loading">
                    <div className="metric-skeleton"></div>
                    <div className="metric-skeleton"></div>
                    <div className="metric-skeleton"></div>
                </div>
            </section>
        );
    }

    if (totalReserves === 0) {
        return null;
    }

    return (
        <section className="reserves-metrics" aria-label="Métricas de reservas">
            <div className="reserves-metrics__header">
                <h3 className="reserves-metrics__title">Indicadores de Reservas</h3>
                <p className="reserves-metrics__subtitle">Seguimiento de actividad, estados e ingresos recientes</p>
            </div>

            <div className="reserves-metrics__grid">
                <div className="metric-card">
                    <div className="metric-card__header">
                        <h4 className="metric-card__title">Reservas recientes</h4>
                        <span className="metric-card__value">{totalReserves}</span>
                        <p className="metric-card__subtitle">Volumen en los últimos meses</p>
                    </div>
                    <div className="metric-card__chart">
                        <Chart options={barChartOptions} series={barChartSeries} type="bar" height={200} />
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-card__header">
                        <h4 className="metric-card__title">Estados de reservas</h4>
                        <span className="metric-card__value">{statusData.pending || 0}</span>
                        <p className="metric-card__subtitle">Pendientes actuales</p>
                    </div>
                    <div className="metric-card__chart">
                        <Chart options={donutChartOptions} series={donutChartSeries} type="donut" height={200} />
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-card__header">
                        <h4 className="metric-card__title">Ingresos estimados</h4>
                        <span className="metric-card__value">${monthlyData.revenues.reduce((acc, value) => acc + value, 0).toFixed(2)}</span>
                        <p className="metric-card__subtitle">Tendencia de ingresos mensuales</p>
                    </div>
                    <div className="metric-card__chart">
                        <Chart options={revenueChartOptions} series={revenueChartSeries} type="area" height={200} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReservesMetricsSection;
