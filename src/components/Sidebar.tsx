import { LayoutDashboard, CalendarDays, FileText, Users, ChartLine, HeartPulse, Settings, User, ShieldCheck, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: any) => void;
  onLogout?: () => void;
}

export default function Sidebar({ currentView, onNavigate, onLogout }: SidebarProps) {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'DASHBOARD' },
    { icon: UserGroup, label: 'Pacientes', id: 'PACIENTES' },
    { icon: CalendarDays, label: 'Citas', id: 'MES' },
    { icon: FileText, label: 'Reporte REM', id: 'REPORTE_REM' },
    { icon: Users, label: 'Usuarios', id: 'USUARIOS' },
    { icon: ShieldCheck, label: 'Trazabilidad y auditoría', id: 'AUDIT_LOG' },
  ];

  return (
    <aside className="w-[260px] bg-white flex flex-col h-full border-r border-gray-200 z-10 shrink-0">
      <div className="h-16 flex items-center justify-between px-6 mt-2">
        <div className="flex items-center gap-2">
          <HeartPulse className="text-brand-red w-6 h-6" />
          <span className="font-bold text-gray-900 tracking-wider text-lg uppercase">VIPENT</span>
        </div>
        <button 
          onClick={() => onNavigate('USER_PROFILE')}
          className={`transition-colors p-2 rounded-md ${currentView === 'USER_PROFILE' ? 'text-brand-red bg-red-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
        >
          <Settings size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = currentView === item.id || 
                          (item.id === 'MES' && ['MES', 'SEMANA', 'DÍA', 'LISTADO'].includes(currentView)) ||
                          (item.id === 'PACIENTES' && ['PACIENTES', 'PACIENTE_DETALLE', 'PACIENTE_EDICION'].includes(currentView));
          return (
            <motion.button
              key={item.label}
              onClick={() => onNavigate(item.id)}
              whileHover={{ x: 4 }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-all ${
                isActive
                  ? 'bg-sidebar-active-bg text-sidebar-active-text border border-blue-200 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-sidebar-active-text' : 'text-gray-400'} />
              {item.label}
            </motion.button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 mt-auto flex flex-col gap-1">
        <button 
          onClick={() => onNavigate('USER_PROFILE')}
          className={`p-2 rounded-lg transition-colors text-left w-full ${currentView === 'USER_PROFILE' ? 'bg-blue-50/50' : 'bg-gray-50/50 hover:bg-gray-100/50'}`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${currentView === 'USER_PROFILE' ? 'bg-brand-blue/10' : 'bg-gray-200'}`}>
              <User className={currentView === 'USER_PROFILE' ? 'text-brand-blue' : 'text-gray-500'} size={20} />
            </div>
            <div className="overflow-hidden">
              <p className={`text-xs font-semibold truncate ${currentView === 'USER_PROFILE' ? 'text-brand-blue' : 'text-gray-900'}`}>Usuario Usuario</p>
              <p className="text-[10px] text-gray-500 truncate uppercase tracking-tight">Clínica Central</p>
            </div>
          </div>
        </button>
        
        {onLogout && (
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors mt-2"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        )}
      </div>
    </aside>
  );
}

// Custom UserGroup icon since lucide-react name is different
function UserGroup(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
