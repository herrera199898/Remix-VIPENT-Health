import { LayoutDashboard, CalendarDays, FileText, Users, ChartLine, HeartPulse, Settings, User, ShieldCheck, LogOut, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { User as UserType } from '../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: any) => void;
  onLogout?: () => void;
  currentUser?: UserType | null;
}

export default function Sidebar({ currentView, onNavigate, onLogout, currentUser }: SidebarProps) {
  let navItems = [];

  if (currentUser?.role === 'Investigador') {
    navItems = [
      { icon: LayoutDashboard, label: 'Dashboard Investigador', id: 'RESEARCH_DASHBOARD' },
      { icon: FileText, label: 'Datos anonimizados', id: 'ANONYMIZED_DATA' },
      { icon: Search, label: 'Exportaciones anonimizadas', id: 'ANONYMIZED_DATA' },
    ];
  } else {
    navItems = [
      { icon: LayoutDashboard, label: 'Dashboard', id: 'DASHBOARD' },
      { icon: CustomUserHeart, label: 'Pacientes', id: 'PACIENTES' },
      { icon: CalendarDays, label: 'Citas', id: 'MES' },
      { icon: FileText, label: 'Reporte REM', id: 'REPORTE_REM' },
      { icon: Users, label: 'Usuarios', id: 'USUARIOS_V2' },
      { icon: ShieldCheck, label: 'Trazabilidad y auditoría', id: 'AUDIT_LOG' },
    ];
  }

  return (
    <aside className="w-[260px] bg-white flex flex-col h-full border-r border-gray-200 z-10 shrink-0">
      <div className="h-16 flex items-center justify-between px-6 mt-2">
        <div className="flex items-center gap-2">
          <HeartPulse className="text-brand-red w-6 h-6" />
          <span className="font-bold text-gray-900 tracking-wider text-lg uppercase">VIPENT</span>
        </div>
        <button 
          onClick={() => onNavigate('USER_PROFILE')}
          className={`transition-colors p-2 rounded-md ${currentView === 'USER_PROFILE' ? 'text-brand-red bg-red-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50 cursor-pointer'}`}
        >
          <Settings size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item, idx) => {
          const isActive = currentView === item.id || 
                          (item.id === 'MES' && ['MES', 'SEMANA', 'DÍA', 'LISTADO'].includes(currentView)) ||
                          (item.id === 'PACIENTES' && ['PACIENTES', 'PACIENTE_DETALLE', 'PACIENTE_EDICION'].includes(currentView));
          return (
            <motion.button
              key={item.label + idx}
              onClick={() => onNavigate(item.id)}
              whileHover={{ x: 4 }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
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
          className={`p-2 rounded-lg transition-colors text-left w-full cursor-pointer ${currentView === 'USER_PROFILE' ? 'bg-blue-50/50' : 'bg-gray-50/50 hover:bg-gray-100/50'}`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${currentView === 'USER_PROFILE' ? 'bg-brand-blue/10' : 'bg-gray-200'}`}>
              <User className={currentView === 'USER_PROFILE' ? 'text-brand-blue' : 'text-gray-500'} size={20} />
            </div>
            <div className="overflow-hidden">
              <p className={`text-xs font-semibold truncate ${currentView === 'USER_PROFILE' ? 'text-brand-blue' : 'text-gray-900'}`}>
                {currentUser?.name || 'Usuario Usuario'}
              </p>
              <p className="text-[10px] text-gray-500 truncate tracking-tight flex items-center gap-1">
                <span className="font-bold">{currentUser?.role || ''}</span>
                {currentUser?.establishment && <span>• {currentUser.establishment}</span>}
              </p>
            </div>
          </div>
        </button>
        
        {onLogout && (
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors mt-2 cursor-pointer"
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

// Custom User with Cardio Heart SVG icon requested by the user
function CustomUserHeart(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={props.strokeWidth || "2"}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10.5 21H4C4 17.4735 6.60771 14.5561 10 14.0709M16.4976 16.2119C15.7978 15.4328 14.6309 15.2232 13.7541 15.9367C12.8774 16.6501 12.7539 17.843 13.4425 18.6868C13.8312 19.1632 14.7548 19.9983 15.4854 20.6353C15.8319 20.9374 16.0051 21.0885 16.2147 21.1503C16.3934 21.203 16.6018 21.203 16.7805 21.1503C16.9901 21.0885 17.1633 20.9374 17.5098 20.6353C18.2404 19.9983 19.164 19.1632 19.5527 18.6868C20.2413 17.843 20.1329 16.6426 19.2411 15.9367C18.3492 15.2307 17.1974 15.4328 16.4976 16.2119ZM15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" />
    </svg>
  );
}
