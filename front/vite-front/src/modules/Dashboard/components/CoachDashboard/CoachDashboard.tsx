import React from 'react';
import DashboardLayout from '../../DashboardLayout';

const CoachDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="w-full">
        <div className="mb-8">
          <h3 className="text-[#092747] font-bold text-3xl mb-2">Panel de Entrenador</h3>
          <hr className="border-[#238744] w-16 h-1 bg-[#238744] rounded" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Estadísticas del entrenador */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#092747] text-sm font-medium">Clases Programadas</p>
                <p className="text-2xl font-bold text-[#092747]">12</p>
              </div>
              <div className="w-12 h-12 bg-[#238744]/10 rounded-full flex items-center justify-center">
                <span className="text-[#238744] text-xl">📅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#092747] text-sm font-medium">Alumnos Activos</p>
                <p className="text-2xl font-bold text-[#092747]">28</p>
              </div>
              <div className="w-12 h-12 bg-[#238744]/10 rounded-full flex items-center justify-center">
                <span className="text-[#238744] text-xl">👥</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-[#092747] font-semibold text-lg mb-4">Panel de Control de Entrenador</h4>
          <p className="text-[#092747] leading-relaxed">
            Gestiona tus clases programadas, horarios de disponibilidad y la información de tus alumnos.
            Mantén actualizada tu agenda y comunica cualquier cambio a tus estudiantes.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoachDashboard;
