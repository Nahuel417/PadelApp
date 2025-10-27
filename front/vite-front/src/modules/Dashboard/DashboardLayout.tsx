import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleMenuClick = (item: string) => {
        setActiveMenuItem(item);
        // TODO: Implement navigation logic
    };

    // Define grid columns based on collapse state
    // Collapsed width: 64px (w-16)
    // Expanded width: 256px (w-64)
    const gridCols = isCollapsed ? 'grid-cols-[64px_1fr]' : 'grid-cols-[256px_1fr]';

    return (
        <div className={`grid min-h-screen w-full ${gridCols} bg-[#d3d3d3]`}>
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} activeItem={activeMenuItem} onItemClick={handleMenuClick} />

            <div className="flex flex-col">
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:h-[60px] lg:px-6">
                    {/* Mobile menu button - placeholder for future mobile sidebar */}
                    <button onClick={() => setIsCollapsed(!isCollapsed)} className="md:hidden p-2 rounded-md hover:bg-gray-100">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <h1 className="text-xl font-semibold text-[#092747]">Panel de Administración</h1>

                    {/* Placeholder for user menu/settings */}
                    <div className="ml-auto">{/* Future User Menu or Notifications */}</div>
                </header>

                {/* Main content area */}
                <main className="flex-1 p-4 lg:p-8 bg-[#d3d3d3] overflow-auto">{children}</main>

                {/* Footer */}
                <footer className="border-t border-gray-200 bg-white">
                    <div className="px-4 py-3 lg:px-6">
                        <p className="text-sm text-[#092747] text-center">© 2025 PadelApp - Sistema de Gestión de Reservas</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;
