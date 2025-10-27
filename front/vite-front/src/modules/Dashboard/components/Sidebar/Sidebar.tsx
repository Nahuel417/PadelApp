import React from 'react';

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
    activeItem: string;
    onItemClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, activeItem, onItemClick }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'reservas', label: 'Reservas', icon: '📅' },
        { id: 'usuarios', label: 'Usuarios', icon: '👥' },
        { id: 'canchas', label: 'Canchas', icon: '🏓' },
        { id: 'configuracion', label: 'Configuración', icon: '⚙️' },
        { id: 'perfil', label: 'Perfil', icon: '👤' },
    ];

    return (
        <div className={`bg-[#d3d3d3] shadow-lg min-h-screen border-r border-gray-400 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
            <div className={`p-6 border-b border-gray-200 ${isCollapsed ? 'px-3' : ''}`}>
                {!isCollapsed && <h2 className="text-[#092747] font-bold text-xl">Dashboard</h2>}
                <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden md:block mt-2 p-2 rounded-md hover:bg-gray-100 transition-colors">
                    <svg className={`h-5 w-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            <nav className={`p-4 ${isCollapsed ? 'px-2' : ''}`}>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onItemClick(item.id)}
                        className={`w-full text-left mb-1 rounded-md transition-all duration-200 flex items-center gap-3 ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'} ${
                            activeItem === item.id ? 'bg-[#238744] text-white shadow-md' : 'text-[#092747] hover:bg-[#238744]/10 hover:text-[#092747]'
                        }`}
                        title={isCollapsed ? item.label : undefined}>
                        <span className="text-lg">{item.icon}</span>
                        {!isCollapsed && <span className="font-medium">{item.label}</span>}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
