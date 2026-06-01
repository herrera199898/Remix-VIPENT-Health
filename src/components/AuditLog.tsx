import { useState, useEffect } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  ChevronDown, 
  CheckCircle2, 
  XCircle, 
  LogIn, 
  Edit3, 
  PlusCircle, 
  Eye, 
  LogOut, 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  Ban, 
  Download, 
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- ENUMS & INTERFACES ---

type ModuleType = 'LOGIN' | 'PACIENTES' | 'CITAS' | 'REM_P4' | 'USUARIOS' | 'PERFIL' | 'SISTEMA';

type ActionType = 'LOGIN' | 'LOGOUT' | 'LECTURA' | 'CREACION' | 'MODIFICACION' | 'EXPORTACION' | 'VALIDACION' | 'BLOQUEO' | 'ERROR_ACCESO';

type ResultType = 'EXITO' | 'FALLO' | 'ADVERTENCIA' | 'BLOQUEADO';

type SeverityType = 'Baja' | 'Media' | 'Alta' | 'Crítica';

interface AuditEntry {
  id: string;
  timestamp: string;
  userName: string;
  userEmail: string;
  userRole: string;
  establishment: 'Hualañé' | 'Curepto' | 'Ambos';
  module: ModuleType;
  action: ActionType;
  resourceType: 'Sesión' | 'Paciente' | 'Cita' | 'Reporte REM-P4' | 'Usuario' | 'Configuración' | 'Sistema';
  resourceLabel: string;
  result: ResultType;
  severity: SeverityType;
  originIp: string;
  device: string;
  description: string;
  technicalDetail?: string;
}

// --- REALISTIC VIPENT HEALTH AUDIT DATA ---

const AUDIT_LOGS_DATA: AuditEntry[] = [
  {
    id: 'EVT-1001',
    timestamp: '2026-06-01 14:15:22',
    userName: 'Dr. Carlos Mendoza',
    userEmail: 'carlos.mendoza@pscv.cl',
    userRole: 'Médico PSCV',
    establishment: 'Hualañé',
    module: 'CITAS',
    action: 'MODIFICACION',
    resourceType: 'Cita',
    resourceLabel: 'Cita ID C-022',
    result: 'EXITO',
    severity: 'Baja',
    originIp: '192.168.1.102',
    device: 'PC Escritorio - Chrome v124 (Windows)',
    description: 'Modificación de la hora de la próxima cita de control de hipertensión para Paciente PSCV ID P-0041.',
    technicalDetail: 'UPDATE appointments SET time = "15:30", updated_at = NOW() WHERE id = 22'
  },
  {
    id: 'EVT-1002',
    timestamp: '2026-06-01 13:40:10',
    userName: 'Paula Espinoza',
    userEmail: 'paula.espinoza@pscv.cl',
    userRole: 'Coordinador PSCV Hualañé',
    establishment: 'Hualañé',
    module: 'REM_P4',
    action: 'VALIDACION',
    resourceType: 'Reporte REM-P4',
    resourceLabel: 'Reporte REM-P4 Mayo 2026',
    result: 'EXITO',
    severity: 'Media',
    originIp: '192.168.1.50',
    device: 'Notebook - Firefox v125 (macOS)',
    description: 'Validación del reporte consolidado REM-P4 de la sección de cardiología preventiva correspondiente a Mayo 2026.',
    technicalDetail: 'POST /api/reports/rem-p4/validate { reportId: "REP-2026-05", section: "C3" } -> Status 200 OK'
  },
  {
    id: 'EVT-1003',
    timestamp: '2026-06-01 12:10:05',
    userName: 'Jorge Alarcón',
    userEmail: 'jorge.alarcon@pscv.cl',
    userRole: 'Administrativo Agenda',
    establishment: 'Hualañé',
    module: 'CITAS',
    action: 'MODIFICACION',
    resourceType: 'Cita',
    resourceLabel: 'Cita ID C-085',
    result: 'EXITO',
    severity: 'Baja',
    originIp: '192.168.1.15',
    device: 'PC Escritorio - Edge v123 (Windows)',
    description: 'Marcación de inasistencia (No-Show) para cita agendada de control cardiovascular.',
    technicalDetail: 'UPDATE appointments SET status = "INASISTENCIA", logged_by = "jorge.alarcon" WHERE id = 85'
  },
  {
    id: 'EVT-1004',
    timestamp: '2026-06-01 11:30:15',
    userName: 'Loreto Sánchez',
    userEmail: 'loreto.sanchez@pscv.cl',
    userRole: 'Auditor / Lector',
    establishment: 'Ambos',
    module: 'PACIENTES',
    action: 'LECTURA',
    resourceType: 'Paciente',
    resourceLabel: 'Paciente PSCV ID P-0041',
    result: 'EXITO',
    severity: 'Baja',
    originIp: '200.72.148.10',
    device: 'Tablet - Safari (iOS)',
    description: 'Consulta detallada del perfil y ficha de monitoreo del Paciente PSCV ID P-0041 para auditoría de continuidad de cuidado.',
    technicalDetail: 'GET /api/patients/P-0041/history -> Response 200 OK (3.2KB)'
  },
  {
    id: 'EVT-1005',
    timestamp: '2026-06-01 10:45:00',
    userName: 'Sandro Valenzuela',
    userEmail: 'sandro.valenzuela@pscv.cl',
    userRole: 'Administrador VIPENT',
    establishment: 'Ambos',
    module: 'USUARIOS',
    action: 'BLOQUEO',
    resourceType: 'Usuario',
    resourceLabel: 'Usuario: Técnico Paramédico Gladys',
    result: 'BLOQUEADO',
    severity: 'Alta',
    originIp: '192.168.1.10',
    device: 'Notebook - Chrome v124 (Linux)',
    description: 'Bloqueo preventivo de cuenta de usuario debido a sospecha de credenciales comprometidas.',
    technicalDetail: 'PUT /api/users/gladys.medina/status { active: false, reason: "Security compromise" } -> Affected rows: 1'
  },
  {
    id: 'EVT-1006',
    timestamp: '2026-06-01 09:20:11',
    userName: 'Enf. Camila Silva',
    userEmail: 'camila.silva@pscv.cl',
    userRole: 'Enfermera PSCV',
    establishment: 'Curepto',
    module: 'PACIENTES',
    action: 'CREACION',
    resourceType: 'Paciente',
    resourceLabel: 'Paciente PSCV ID P-0098',
    result: 'EXITO',
    severity: 'Baja',
    originIp: '192.168.2.112',
    device: 'PC Escritorio - Chrome v124 (Windows)',
    description: 'Ingreso de nuevo paciente hipertenso compensado al programa cardiovascular (PSCV). ID generado parcialmente.',
    technicalDetail: 'POST /api/patients/create { first_name: "Luis", last_name: "M.", risk: "Bajo" }'
  },
  {
    id: 'EVT-1007',
    timestamp: '2026-05-31 17:05:44',
    userName: 'Claudio Rivas',
    userEmail: 'claudio.rivas@pscv.cl',
    userRole: 'Coordinador PSCV Curepto',
    establishment: 'Curepto',
    module: 'REM_P4',
    action: 'EXPORTACION',
    resourceType: 'Reporte REM-P4',
    resourceLabel: 'Reporte REM-P4 Mayo 2026',
    result: 'EXITO',
    severity: 'Media',
    originIp: '192.168.2.20',
    device: 'PC Escritorio - Firefox v125 (Windows)',
    description: 'Exportación exitosa de los datos estadísticos REM-P4 del establecimiento de Curepto para carga ministerial.',
    technicalDetail: 'GET /api/reports/rem-p4/export?format=xlsx&facility=curepto -> Binary Stream (45KB)'
  },
  {
    id: 'EVT-1008',
    timestamp: '2026-05-31 14:12:30',
    userName: 'Intento de Acceso Externo',
    userEmail: 'unknown@mail.com',
    userRole: 'Sin Rol Detectado',
    establishment: 'Ambos',
    module: 'LOGIN',
    action: 'ERROR_ACCESO',
    resourceType: 'Sesión',
    resourceLabel: 'Sesión de usuario',
    result: 'FALLO',
    severity: 'Alta',
    originIp: '185.220.101.5',
    device: 'Terminal desconocido / curl 7.81.0',
    description: 'Intento de inicio de sesión fallido. Múltiples intentos con contraseña incorrecta para la cuenta "sandro.valenzuela@pscv.cl".',
    technicalDetail: 'POST /api/auth/login -> 401 Unauthorized - IP Blacklisted candidate'
  },
  {
    id: 'EVT-1009',
    timestamp: '2026-05-31 11:30:10',
    userName: 'Dr. Carlos Mendoza',
    userEmail: 'carlos.mendoza@pscv.cl',
    userRole: 'Médico PSCV',
    establishment: 'Hualañé',
    module: 'PACIENTES',
    action: 'LECTURA',
    resourceType: 'Paciente',
    resourceLabel: 'Paciente PSCV ID P-0012',
    result: 'ADVERTENCIA',
    severity: 'Alta',
    originIp: '192.168.1.102',
    device: 'PC Escritorio - Chrome v124 (Windows)',
    description: 'Intento de acceder a examen clínico crítico de un paciente sin consentimiento del jefe de programa (advertencia de privilegios elevada).',
    technicalDetail: 'GET /api/patients/P-0012/lab-docs -> Privileges flagged but bypassed under EMERGENCY flag'
  },
  {
    id: 'EVT-1010',
    timestamp: '2026-05-31 08:00:25',
    userName: 'Jorge Alarcón',
    userEmail: 'jorge.alarcon@pscv.cl',
    userRole: 'Administrativo Agenda',
    establishment: 'Hualañé',
    module: 'LOGIN',
    action: 'LOGIN',
    resourceType: 'Sesión',
    resourceLabel: 'Sesión de usuario',
    result: 'EXITO',
    severity: 'Baja',
    originIp: '192.168.1.15',
    device: 'PC Escritorio - Edge v123 (Windows)',
    description: 'Inicio de sesión exitoso al sistema de agenda médica VIPENT.',
    technicalDetail: 'AUTH TOKEN issued token_id=t_77df23 expires_in=28800s'
  },
  {
    id: 'EVT-1011',
    timestamp: '2026-05-30 16:45:00',
    userName: 'Paula Espinoza',
    userEmail: 'paula.espinoza@pscv.cl',
    userRole: 'Coordinador PSCV Hualañé',
    establishment: 'Hualañé',
    module: 'SISTEMA',
    action: 'MODIFICACION',
    resourceType: 'Configuración',
    resourceLabel: 'Configuración de rol',
    result: 'EXITO',
    severity: 'Media',
    originIp: '192.168.1.50',
    device: 'Notebook - Firefox v125 (macOS)',
    description: 'Modificación de los umbrales de alerta de inactividad de control cardiovascular en Hualañé.',
    technicalDetail: 'POST /api/settings/thresholds { min_days: 180, alert_grace_period: 30 }'
  },
  {
    id: 'EVT-1012',
    timestamp: '2026-05-30 12:30:11',
    userName: 'Enf. Camila Silva',
    userEmail: 'camila.silva@pscv.cl',
    userRole: 'Enfermera PSCV',
    establishment: 'Curepto',
    module: 'LOGIN',
    action: 'LOGOUT',
    resourceType: 'Sesión',
    resourceLabel: 'Sesión de usuario',
    result: 'EXITO',
    severity: 'Baja',
    originIp: '192.168.2.112',
    device: 'PC Escritorio - Chrome v124 (Windows)',
    description: 'Cierre de sesión manual voluntario.',
    technicalDetail: 'DELETE /api/auth/sessions/current'
  }
];

export default function AuditLog() {
  // --- STATES ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<ModuleType | 'TODOS'>('TODOS');
  const [selectedAction, setSelectedAction] = useState<ActionType | 'TODAS'>('TODAS');
  const [selectedResult, setSelectedResult] = useState<ResultType | 'TODOS'>('TODOS');
  const [selectedEstablishment, setSelectedEstablishment] = useState<'Hualañé' | 'Curepto' | 'Ambos' | 'TODOS'>('TODOS');
  const [selectedRange, setSelectedRange] = useState<'HOY' | '7_DIAS' | '30_DIAS' | 'TODOS'>('TODOS');
  
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedEvent, setSelectedEvent] = useState<AuditEntry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const itemsPerPage = 8;

  // --- FILTERS LOGIC ---
  const filteredEvents = AUDIT_LOGS_DATA.filter(entry => {
    // 1. Search term (user name, email, description, resource label)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        entry.userName.toLowerCase().includes(term) ||
        entry.userEmail.toLowerCase().includes(term) ||
        entry.description.toLowerCase().includes(term) ||
        entry.resourceLabel.toLowerCase().includes(term) ||
        entry.userRole.toLowerCase().includes(term);
      
      if (!matchesSearch) return false;
    }

    // 2. Module
    if (selectedModule !== 'TODOS' && entry.module !== selectedModule) {
      return false;
    }

    // 3. Action
    if (selectedAction !== 'TODAS' && entry.action !== selectedAction) {
      return false;
    }

    // 4. Result
    if (selectedResult !== 'TODOS' && entry.result !== selectedResult) {
      return false;
    }

    // 5. Establishment
    if (selectedEstablishment !== 'TODOS' && entry.establishment !== selectedEstablishment) {
      return false;
    }

    // 6. Range
    if (selectedRange !== 'TODOS') {
      const dateStr = entry.timestamp.split(' ')[0]; // YYYY-MM-DD
      const entryDate = new Date(dateStr + 'T00:00:00Z');
      const currentDate = new Date('2026-06-01T00:00:00Z'); // Treated as today according to our mock date

      const diffTime = currentDate.getTime() - entryDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (selectedRange === 'HOY') {
        if (dateStr !== '2026-06-01') return false;
      } else if (selectedRange === '7_DIAS') {
        if (diffDays < 0 || diffDays > 7) return false;
      } else if (selectedRange === '30_DIAS') {
        if (diffDays < 0 || diffDays > 30) return false;
      }
    }

    return true;
  });

  // --- SORTING ---
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    return sortOrder === 'desc' 
      ? b.timestamp.localeCompare(a.timestamp) 
      : a.timestamp.localeCompare(b.timestamp);
  });

  // --- PAGINATION RESET & CALCULATION ---
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedModule, selectedAction, selectedResult, selectedEstablishment, selectedRange]);

  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage) || 1;
  const paginatedEvents = sortedEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- EXPORT SIMULATION ---
  const handleExport = () => {
    const filtersUsed: string[] = [];
    if (selectedModule !== 'TODOS') filtersUsed.push(`Módulo: ${selectedModule}`);
    if (selectedAction !== 'TODAS') filtersUsed.push(`Acción: ${selectedAction}`);
    if (selectedResult !== 'TODOS') filtersUsed.push(`Resultado: ${selectedResult}`);
    if (selectedEstablishment !== 'TODOS') filtersUsed.push(`Establecimiento: ${selectedEstablishment}`);
    if (selectedRange !== 'TODOS') filtersUsed.push(`Rango: ${selectedRange}`);
    
    const filterText = filtersUsed.length > 0 
      ? ` con filtros (${filtersUsed.join(', ')})`
      : ' (sin filtros activos)';

    setToastMessage(`Exportación completada: Se han descargado ${sortedEvents.length} registros de auditoría en formato CSV${filterText}.`);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // --- BADGE STYLE GENERATORS ---

  const getModuleStyle = (mod: ModuleType) => {
    switch (mod) {
      case 'LOGIN':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'PACIENTES':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'CITAS':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'REM_P4':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'USUARIOS':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'PERFIL':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'SISTEMA':
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getActionStyle = (act: ActionType) => {
    switch (act) {
      case 'LOGIN':
      case 'LOGOUT':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'CREACION':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'MODIFICACION':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'VALIDACION':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'EXPORTACION':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'LECTURA':
        return 'bg-sky-50 text-sky-700 border-sky-100';
      case 'BLOQUEO':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'ERROR_ACCESO':
        return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  const getResultStyle = (res: ResultType) => {
    switch (res) {
      case 'EXITO':
        return { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: <CheckCircle2 size={13} className="text-emerald-500" />, label: 'Éxito' };
      case 'FALLO':
        return { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: <XCircle size={13} className="text-red-500" />, label: 'Fallo' };
      case 'ADVERTENCIA':
        return { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: <AlertTriangle size={13} className="text-amber-500" />, label: 'Advertencia' };
      case 'BLOQUEADO':
        return { text: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-300', icon: <Ban size={13} className="text-slate-500" />, label: 'Bloqueado' };
    }
  };

  const getSeverityStyle = (sev: SeverityType) => {
    switch (sev) {
      case 'Baja':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Media':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Alta':
        return 'bg-orange-50 text-orange-850 border-orange-200 animate-pulse';
      case 'Crítica':
        return 'bg-red-100 text-red-900 border-red-300 animate-pulse font-extrabold';
    }
  };

  return (
    <div id="vipent-audit-log-view" className="flex-1 flex flex-col min-h-0 bg-gray-50/30">
      
      {/* 2. ENCABEZADO */}
      <div className="p-6 md:p-8 bg-white border-b border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Trazabilidad y Auditoría
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Registro de accesos, acciones y eventos relevantes del sistema VIPENT
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 rounded-md border border-blue-100 text-xs text-secondary">
            <Info size={14} className="text-blue-500 flex-shrink-0" />
            <span>Los registros de auditoría son solo de consulta y no pueden ser modificados desde esta vista.</span>
          </div>
        </div>

        {/* 15. EXPORT BUTTON (HEADER COMPACT) */}
        <button 
          id="btn-exportar-auditoria"
          onClick={handleExport}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-all shadow-sm flex-shrink-0"
        >
          <Download size={15} />
          <span>Exportar auditoría</span>
        </button>
      </div>

      <div className="p-4 md:p-8 flex-1 flex flex-col min-h-0">
        
        {/* CONTAINER PRINCIPAL DE LA TABLA Y FILTROS */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-md flex flex-col flex-1 min-h-0">
          
          {/* 5. FILTROS COMPACTOS VISIBLES INLINE */}
          <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              
              {/* Buscador */}
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por usuario, rol..."
                  className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all shadow-sm"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Filtro Módulo */}
              <div className="flex flex-col">
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all shadow-sm"
                >
                  <option value="TODOS">Módulo: Todos</option>
                  <option value="LOGIN">Login</option>
                  <option value="PACIENTES">Pacientes</option>
                  <option value="CITAS">Citas</option>
                  <option value="REM_P4">REM-P4</option>
                  <option value="USUARIOS">Usuarios</option>
                  <option value="SISTEMA">Sistema</option>
                </select>
              </div>

              {/* Filtro Acción */}
              <div className="flex flex-col">
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all shadow-sm"
                >
                  <option value="TODAS">Acción: Todas</option>
                  <option value="LECTURA">Lectura</option>
                  <option value="CREACION">Creación</option>
                  <option value="MODIFICACION">Modificación</option>
                  <option value="EXPORTACION">Exportación</option>
                  <option value="VALIDACION">Validación</option>
                  <option value="LOGIN">Login</option>
                  <option value="LOGOUT">Logout</option>
                  <option value="ERROR_ACCESO">Error acceso</option>
                </select>
              </div>

              {/* Filtro Resultado */}
              <div className="flex flex-col">
                <select
                  value={selectedResult}
                  onChange={(e) => setSelectedResult(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all shadow-sm"
                >
                  <option value="TODOS">Resultado: Todos</option>
                  <option value="EXITO">Éxito</option>
                  <option value="FALLO">Fallo</option>
                  <option value="ADVERTENCIA">Advertencia</option>
                  <option value="BLOQUEADO">Bloqueado</option>
                </select>
              </div>

              {/* Filtro Establecimiento */}
              <div className="flex flex-col">
                <select
                  value={selectedEstablishment}
                  onChange={(e) => setSelectedEstablishment(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all shadow-sm"
                >
                  <option value="TODOS">Establecimiento: Todos</option>
                  <option value="Hualañé">Hualañé</option>
                  <option value="Curepto">Curepto</option>
                  <option value="Ambos">Ambos</option>
                </select>
              </div>

              {/* Filtro Rango de Tiempo */}
              <div className="flex flex-col">
                <select
                  value={selectedRange}
                  onChange={(e) => setSelectedRange(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all shadow-sm"
                >
                  <option value="TODOS">Rango: Todos</option>
                  <option value="HOY">Hoy</option>
                  <option value="7_DIAS">Últimos 7 días</option>
                  <option value="30_DIAS">Últimos 30 días</option>
                </select>
              </div>

            </div>
          </div>

          {/* 6. TABLA PRINCIPAL (ESCRITORIO & TABLET) */}
          <div className="flex-1 overflow-auto no-scrollbar">
            
            {/* Escritorio y Tablet: Max 7 columnas */}
            <table className="w-full border-collapse hidden sm:table">
              <thead className="sticky top-0 bg-gray-50 border-b border-gray-250 z-10">
                <tr>
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-36">
                    <button 
                      onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                      className="flex items-center gap-1 hover:text-gray-900 font-bold transition-colors outline-none cursor-pointer"
                    >
                      <span>Fecha / Hora</span>
                      <ArrowUpDown size={11} className="text-gray-400" />
                    </button>
                  </th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-52">
                    Usuario
                  </th>
                  {/* Oculto en tablet (md) para mantener la tabla equilibrada */}
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-48 hidden lg:table-cell">
                    Rol / Establecimiento
                  </th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-28">
                    Módulo
                  </th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-32">
                    Acción
                  </th>
                  {/* Oculto en tablet (md) */}
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Recurso Afectado
                  </th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-32">
                    Resultado
                  </th>
                  <th className="text-center px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-24">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedEvents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-400">
                      No se encontraron registros que coincidan con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  paginatedEvents.map((entry) => {
                    const resultStyle = getResultStyle(entry.result);
                    return (
                      <tr 
                        key={entry.id} 
                        className="hover:bg-slate-50/50 transition-all font-mono align-middle"
                      >
                        {/* 1. Fecha / hora */}
                        <td className="px-5 py-3.5 text-[11px] text-gray-500 font-sans whitespace-nowrap">
                          {entry.timestamp}
                        </td>
                        
                        {/* 2. Usuario (Nombre + email pequeño) */}
                        <td className="px-5 py-3.5 font-sans">
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-gray-900">{entry.userName}</span>
                            <span className="text-[10px] text-gray-400 font-mono tracking-tight">{entry.userEmail}</span>
                          </div>
                        </td>
                        
                        {/* 3. Rol / establecimiento (Oculto en Tablet md) */}
                        <td className="px-5 py-3.5 font-sans hidden lg:table-cell">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-700 font-medium">{entry.userRole}</span>
                            <span className="text-[10px] text-gray-400 font-semibold">{entry.establishment}</span>
                          </div>
                        </td>
                        
                        {/* 4. Módulo */}
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getModuleStyle(entry.module)}`}>
                            {entry.module}
                          </span>
                        </td>
                        
                        {/* 5. Acción */}
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getActionStyle(entry.action)}`}>
                            {entry.action.replace('_', ' ')}
                          </span>
                        </td>
                        
                        {/* 6. Recurso afectado (Oculto en Tablet md) */}
                        <td className="px-5 py-3.5 text-xs text-gray-600 font-sans truncate max-w-[200px] hidden lg:table-cell">
                          {entry.resourceLabel}
                        </td>
                        
                        {/* 7. Resultado */}
                        <td className="px-5 py-3.5">
                          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold font-sans ${resultStyle.bg} ${resultStyle.text} ${resultStyle.border}`}>
                            {resultStyle.icon}
                            <span>{resultStyle.label}</span>
                          </div>
                        </td>

                        {/* 13. Acción de detalle */}
                        <td className="px-4 py-3.5 text-center font-sans">
                          <button
                            onClick={() => setSelectedEvent(entry)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 border border-slate-200 rounded-md text-xs text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-all font-semibold font-sans cursor-pointer"
                          >
                            <Eye size={13} />
                            <span>Ver detalle</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* 17. RESPONSIVE MOVIL (Vista tarjetas compactas) */}
            <div className="block sm:hidden divide-y divide-gray-200">
              {paginatedEvents.length === 0 ? (
                <div className="px-4 py-12 text-center text-sm text-gray-400">
                  No se encontraron registros.
                </div>
              ) : (
                paginatedEvents.map((entry) => {
                  const resultStyle = getResultStyle(entry.result);
                  return (
                    <div key={entry.id} className="p-4 space-y-3 hover:bg-gray-50/30">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-gray-400">{entry.timestamp}</span>
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold ${resultStyle.bg} ${resultStyle.text} ${resultStyle.border}`}>
                          {resultStyle.icon}
                          <span>{resultStyle.label}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{entry.userName}</h4>
                        <p className="text-[10px] text-gray-400 font-mono">{entry.userEmail} • {entry.userRole}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-semibold border ${getModuleStyle(entry.module)}`}>
                          {entry.module}
                        </span>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-semibold border ${getActionStyle(entry.action)}`}>
                          {entry.action.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-gray-600 truncate max-w-[200px]">{entry.resourceLabel}</span>
                        <button
                          onClick={() => setSelectedEvent(entry)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-slate-800 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded"
                        >
                          <Eye size={12} />
                          <span>Ver detalle</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* PAGINACIÓN */}
          <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-sans">
              Mostrando <strong className="text-gray-700">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, sortedEvents.length)}</strong> de <strong className="text-gray-700">{sortedEvents.length}</strong> registros
            </span>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 px-3 border border-gray-300 rounded-md text-xs disabled:opacity-30 disabled:cursor-not-allowed bg-white hover:bg-gray-50 transition-all font-semibold cursor-pointer shadow-sm"
              >
                Anterior
              </button>
              <span className="text-xs text-gray-600 font-medium">Pág. {currentPage} de {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 px-3 border border-gray-300 rounded-md text-xs disabled:opacity-30 disabled:cursor-not-allowed bg-white hover:bg-gray-50 transition-all font-semibold cursor-pointer shadow-sm"
              >
                Siguiente
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 14. MODAL DETALLE DEL EVENTO */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" 
            />

            {/* Modal Body */}
            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
              >
                
                {/* Modal Header */}
                <div className="p-5 border-b border-gray-150 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-mono font-bold">
                      {selectedEvent.id}
                    </span>
                    <h3 className="text-base font-bold text-gray-900">
                      Detalle del evento de auditoría
                    </h3>
                  </div>
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all outline-none cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
                  
                  {/* Grid de metadata principal */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Fecha y Hora</span>
                      <p className="text-xs font-mono font-semibold text-gray-800">{selectedEvent.timestamp}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Severidad</span>
                      <div className="pt-0.5">
                        <span className={`inline-flex px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${getSeverityStyle(selectedEvent.severity)}`}>
                          {selectedEvent.severity}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Usuario Autor</span>
                      <p className="text-xs font-semibold text-gray-800">{selectedEvent.userName}</p>
                      <p className="text-[11px] font-mono text-gray-450">{selectedEvent.userEmail}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Rol / Establecimiento</span>
                      <p className="text-xs font-semibold text-gray-800">{selectedEvent.userRole}</p>
                      <p className="text-[11px] font-medium text-slate-400">Establecimiento: {selectedEvent.establishment}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Origen de Red</span>
                      <p className="text-xs font-mono text-slate-700 font-semibold">IP: {selectedEvent.originIp}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Dispositivo / Agente</span>
                      <p className="text-xs text-gray-600 truncate" title={selectedEvent.device}>{selectedEvent.device}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Dimensión (Módulo / Acción)</span>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className={`inline-flex px-2 py-0.5 rounded border text-[10px] font-bold ${getModuleStyle(selectedEvent.module)}`}>
                          {selectedEvent.module}
                        </span>
                        <span>/</span>
                        <span className={`inline-flex px-2 py-0.5 rounded border text-[10px] font-bold ${getActionStyle(selectedEvent.action)}`}>
                          {selectedEvent.action}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Recurso Afectado</span>
                      <p className="text-xs text-gray-700 font-semibold">{selectedEvent.resourceType}: <span className="font-mono">{selectedEvent.resourceLabel}</span></p>
                    </div>

                  </div>

                  {/* Descripción detallada */}
                  <div className="border-t border-gray-100 pt-3 space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Descripción del Evento</span>
                    <p className="text-xs font-medium text-gray-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {selectedEvent.description}
                    </p>
                  </div>

                  {/* Detalle Técnico */}
                  <div className="border-t border-gray-100 pt-3 space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Detalle Técnico (Query / API Request / Log)</span>
                    <pre className="mt-1 bg-slate-900 border border-slate-950 p-3.5 rounded-lg text-emerald-400 text-xs font-mono overflow-x-auto max-h-36">
                      <code>{selectedEvent.technicalDetail || 'No se registraron parámetros o queries SQL adicionales de bajo nivel.'}</code>
                    </pre>
                  </div>

                  {/* Advertencia de solo lectura */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-800 rounded-md border border-amber-100 text-[11px] font-semibold font-sans justify-center mt-3">
                    <ShieldAlert size={14} className="text-amber-500" />
                    <span>Registro de seguridad inmutable. No se permite realizar modificaciones ni eliminaciones desde esta consola.</span>
                  </div>

                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-gray-150 bg-gray-50 flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-1.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm outline-none cursor-pointer"
                  >
                    Entendido
                  </button>
                </div>

              </motion.div>
            </div>

          </div>
        )}
      </AnimatePresence>

      {/* 15. FLOATING COMPACT EXPORT TOAST */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-55 max-w-sm bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 p-4 flex items-start gap-3"
          >
            <div className="bg-emerald-500/20 text-emerald-400 p-1 rounded-lg flex-shrink-0">
              <CheckCircle2 size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-emerald-400">Exportación exitosa</h4>
              <p className="text-[11px] text-gray-300 mt-1 leading-snug">{toastMessage}</p>
            </div>
            <button 
              onClick={() => setToastMessage(null)} 
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
