import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import './UsersMetricsSection.css';
import { DashboardUser } from '../../types/types';
import { ROLE_LABELS } from '../../constants/constants';

export interface UsersMetricsSectionProps {
    users: DashboardUser[];
    isLoading: boolean;
}

const CHART_FONT_FAMILY = 'Poppins, sans-serif';

const UsersMetricsSection: React.FC<UsersMetricsSectionProps> = ({ users, isLoading }) => {
    const totalUsers = users.length;
    const activeUsers = users.filter((user) => user.status === 'active').length;
    const inactiveUsers = users.filter((user) => user.status === 'inactive').length;
    const pendingUsers = users.filter((user) => user.status === 'pending').length;
    const coaches = users.filter((user) => user.role === 'coach').length;
    const admins = users.filter((user) => user.role === 'admin').length;
    const superadmins = users.filter((user) => user.role === 'superadmin').length;
    const normalUsers = totalUsers - coaches - admins - superadmins;

    // Datos para gráfico de barras - Usuarios por mes
    const monthlyData = useMemo(() => {
        const now = new Date();
        const months = [];
        const counts = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = date.toLocaleDateString('es-AR', { month: 'short' });
            months.push(monthName);

            const count = users.filter((user) => {
                if (!user.createdAt) return false;
                const created = new Date(user.createdAt);
                return created.getFullYear() === date.getFullYear() && created.getMonth() === date.getMonth();
            }).length;
            counts.push(count);
        }

        return { months, counts };
    }, [users]);

    // Configuración del gráfico de barras
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
                columnWidth: '60%',
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
            theme: 'dark',
        },
    };

    const barChartSeries = [
        {
            name: 'Usuarios registrados',
            data: monthlyData.counts,
        },
    ];

    // Configuración del gráfico de dona
    const donutChartOptions = {
        chart: {
            type: 'donut' as const,
            height: 200,
            background: 'transparent',
            fontFamily: CHART_FONT_FAMILY,
        },
        labels: ['Activos', 'Inactivos', 'Pendientes'],
        colors: ['#238744', '#b91c1c', '#d48806'],
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
            theme: 'dark',
        },
    };

    const donutChartSeries = [activeUsers, inactiveUsers, pendingUsers];

    // Configuración del gráfico de barras horizontales para roles
    const rolesChartOptions = {
        chart: {
            type: 'bar' as const,
            height: 200,
            toolbar: { show: false },
            background: 'transparent',
            fontFamily: CHART_FONT_FAMILY,
            fontWeight: 600,
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 6,
                barHeight: '60%',
                distributed: true,
            },
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '11px',
                fontWeight: 600,
                colors: ['#ffffff'],
                fontFamily: CHART_FONT_FAMILY,
            },
            formatter: function (val: number) {
                return val > 0 ? val.toString() : '';
            },
        },
        stroke: { show: false },
        xaxis: {
            categories: ['Usuarios', 'Coaches', 'Admins', 'Superadmins'],
            labels: {
                style: {
                    colors: '#092747',
                    fontSize: '12px',
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
                    fontSize: '11px',
                    fontFamily: CHART_FONT_FAMILY,
                },
            },
        },
        grid: {
            show: true,
            borderColor: 'rgba(9, 39, 71, 0.08)',
            strokeDashArray: 2,
            xaxis: {
                lines: {
                    show: true,
                },
            },
            yaxis: {
                lines: {
                    show: false,
                },
            },
        },
        colors: ['#238744', '#1d4ed8', '#d48806', '#b91c1c'],
        legend: {
            show: false,
        },
        tooltip: {
            style: {
                fontSize: '12px',
                fontFamily: CHART_FONT_FAMILY,
            },
            theme: 'dark',
            y: {
                formatter: function (val: number, opts: any) {
                    const categories = ['Usuarios', 'Coaches', 'Admins', 'Superadmins'];
                    return `${categories[opts.dataPointIndex]}: ${val}`;
                },
            },
        },
    };

    const rolesChartSeries = [
        {
            name: 'Cantidad',
            data: [normalUsers, coaches, admins, superadmins],
        },
    ];

    if (isLoading) {
        return (
            <section className="users-metrics">
                <div className="users-metrics__loading">
                    <div className="metric-skeleton"></div>
                    <div className="metric-skeleton"></div>
                    <div className="metric-skeleton"></div>
                </div>
            </section>
        );
    }

    return (
        <section className="users-metrics" aria-label="Métricas de usuarios">
            <div className="users-metrics__header">
                <h3 className="users-metrics__title">Estadísticas de Usuarios</h3>
                <p className="users-metrics__subtitle">Resumen visual de la actividad y distribución</p>
            </div>

            <div className="users-metrics__grid">
                {/* Tarjeta de registros mensuales */}
                <div className="metric-card">
                    <div className="metric-card__header">
                        <h4 className="metric-card__title">Registros Mensuales</h4>
                        <span className="metric-card__value">{totalUsers}</span>
                        <p className="metric-card__subtitle">Total de usuarios registrados</p>
                    </div>
                    <div className="metric-card__chart">
                        <Chart options={barChartOptions} series={barChartSeries} type="bar" height={200} />
                    </div>
                </div>

                {/* Tarjeta de estados */}
                <div className="metric-card">
                    <div className="metric-card__header">
                        <h4 className="metric-card__title">Estados de Usuario</h4>
                        <span className="metric-card__value">{Math.round((activeUsers / totalUsers) * 100) || 0}%</span>
                        <p className="metric-card__subtitle">Tasa de usuarios activos</p>
                    </div>
                    <div className="metric-card__chart">
                        <Chart options={donutChartOptions} series={donutChartSeries} type="donut" height={200} />
                    </div>
                </div>

                {/* Tarjeta de roles */}
                <div className="metric-card">
                    <div className="metric-card__header">
                        <h4 className="metric-card__title">Distribución de Roles</h4>
                        <span className="metric-card__value">{coaches + admins}</span>
                        <p className="metric-card__subtitle">Staff total (coaches + admins)</p>
                    </div>
                    <div className="metric-card__chart">
                        <Chart options={rolesChartOptions} series={rolesChartSeries} type="bar" height={200} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UsersMetricsSection;
