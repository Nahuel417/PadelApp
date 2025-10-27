import React from 'react';
import DashboardLayout from './DashboardLayout';

const MainDashboard: React.FC = () => {
    return (
        <DashboardLayout>
            <div className="w-full">
                <div className="mb-8">
                    <h3 className="text-[#092747] font-bold text-3xl mb-2">Panel Principal</h3>
                    <hr className="border-[#238744] w-16 h-1 bg-[#238744] rounded" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                    {/* Estadísticas Cards */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#092747] text-sm font-medium">Reservas Activas</p>
                                <p className="text-2xl font-bold text-[#092747]">24</p>
                            </div>
                            <div className="w-12 h-12 bg-[#238744]/10 rounded-full flex items-center justify-center">
                                <span className="text-[#238744] text-xl">📅</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#092747] text-sm font-medium">Usuarios Totales</p>
                                <p className="text-2xl font-bold text-[#092747]">156</p>
                            </div>
                            <div className="w-12 h-12 bg-[#238744]/10 rounded-full flex items-center justify-center">
                                <span className="text-[#238744] text-xl">👥</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#092747] text-sm font-medium">Canchas Disponibles</p>
                                <p className="text-2xl font-bold text-[#092747]">8</p>
                            </div>
                            <div className="w-12 h-12 bg-[#238744]/10 rounded-full flex items-center justify-center">
                                <span className="text-[#238744] text-xl">🏓</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h4 className="text-[#092747] font-semibold text-lg mb-4">Bienvenido al Panel de Administración</h4>
                    <p className="text-[#092747] leading-relaxed">
                        Desde aquí puedes gestionar todas las reservas, usuarios y canchas de la plataforma. Utiliza el menú lateral para navegar entre las diferentes secciones.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MainDashboard;
