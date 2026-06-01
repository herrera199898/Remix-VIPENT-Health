import { Search, Filter, ArrowUpDown, ChevronDown, CheckCircle2, XCircle, LogIn, Edit3, PlusCircle, Eye, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

type OperationType = 'CREACION' | 'MODIFICACION' | 'LECTURA' | 'LOGIN' | 'LOGOUT' | 'ELIMINACION';

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  operationType: OperationType;
  description: string;
  status: 'EXITO' | 'FALLO';
  origin: string;
}

const AUDIT_LOGS: AuditEntry[] = [
  {
    id: '1',
    timestamp: '2026-10-26 10:30:00',
    user: 'admin@example.com',
    operationType: 'LOGIN',
    description: 'Inicio de sesión exitoso',
    status: 'EXITO',
    origin: '192.168.1.45'
  },
  {
    id: '2',
    timestamp: '2026-10-26 11:00:00',
    user: 'user1@example.com',
    operationType: 'MODIFICACION',
    description: 'Actualización de información personal',
    status: 'EXITO',
    origin: '192.168.1.12'
  },
  {
    id: '3',
    timestamp: '2026-10-26 11:15:00',
    user: 'user2@example.com',
    operationType: 'ELIMINACION',
    description: 'Eliminación de registro de paciente #12345',
    status: 'EXITO',
    origin: '10.0.0.8'
  },
  {
    id: '4',
    timestamp: '2026-10-26 11:30:00',
    user: 'admin@example.com',
    operationType: 'LOGIN',
    description: 'Intento de inicio de sesión - Contraseña incorrecta',
    status: 'FALLO',
    origin: '201.45.67.8'
  },
  {
    id: '5',
    timestamp: '2026-10-26 12:00:00',
    user: 'user3@example.com',
    operationType: 'CREACION',
    description: 'Creación de nuevo registro de cita',
    status: 'EXITO',
    origin: '192.168.1.99'
  },
  {
    id: '6',
    timestamp: '2026-10-26 14:00:00',
    user: 'user6@example.com',
    operationType: 'LOGOUT',
    description: 'Cierre de sesión manual',
    status: 'EXITO',
    origin: '192.168.1.12'
  },
  {
    id: '7',
    timestamp: '2026-10-26 14:30:00',
    user: 'admin@example.com',
    operationType: 'LECTURA',
    description: 'Consulta de reporte REM P4 mensual',
    status: 'EXITO',
    origin: '192.168.1.45'
  }
];

const getOperationStyle = (type: OperationType) => {
  switch (type) {
    case 'CREACION':
      return { 
        icon: <PlusCircle size={14} />, 
        bg: 'bg-emerald-50', 
        text: 'text-emerald-700', 
        border: 'border-emerald-200', 
        label: 'Creación' 
      };
    case 'MODIFICACION':
      return { 
        icon: <Edit3 size={14} />, 
        bg: 'bg-blue-50', 
        text: 'text-blue-700', 
        border: 'border-blue-200', 
        label: 'Modificación' 
      };
    case 'ELIMINACION':
      return { 
        icon: <XCircle size={14} />, 
        bg: 'bg-red-50', 
        text: 'text-red-700', 
        border: 'border-red-200', 
        label: 'Eliminación' 
      };
    case 'LECTURA':
    case 'LOGIN':
    case 'LOGOUT':
      return { 
        icon: type === 'LOGIN' ? <LogIn size={14} /> : type === 'LOGOUT' ? <LogOut size={14} /> : <Eye size={14} />, 
        bg: 'bg-brand-gray/30', 
        text: 'text-gray-700', 
        border: 'border-gray-200', 
        label: type === 'LOGIN' ? 'Inicio de Sesión' : type === 'LOGOUT' ? 'Cierre de Sesión' : 'Lectura' 
      };
    default:
      return { 
        icon: <PlusCircle size={14} />, 
        bg: 'bg-gray-50', 
        text: 'text-gray-600', 
        border: 'border-gray-200', 
        label: type 
      };
  }
};

export default function AuditLog() {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50/20">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900">Trazabilidad y Auditoría</h1>
        <p className="text-sm text-gray-500 mt-1">Visualice los inicios de sesión y operaciones realizadas por los usuarios.</p>
      </div>

      <div className="px-8 pb-8 flex-1 flex flex-col min-h-0">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col min-h-0">
          {/* Filters Bar */}
          <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar por usuario o descripción..." 
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue outline-none w-80 shadow-sm"
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                <Filter size={16} />
                <span>Filtros</span>
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-auto no-scrollbar">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-gray-50 border-b border-gray-100 z-10">
                <tr>
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest w-48">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-gray-700">
                      Fecha y Hora
                      <ArrowUpDown size={12} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest w-56">Usuario</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest w-48">Tipo de Operación</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Descripción</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest w-40">Origen</th>
                  <th className="text-center px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest w-28">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-mono">
                {AUDIT_LOGS.map((entry) => {
                  const style = getOperationStyle(entry.operationType);
                  return (
                    <tr key={entry.id} className="hover:bg-blue-50/10 transition-colors">
                      <td className="px-6 py-4 text-xs text-gray-600 font-sans whitespace-nowrap">
                        {entry.timestamp}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-900">
                        {entry.user}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-tight ${style.bg} ${style.text} ${style.border}`}>
                          {style.icon}
                          <span>{style.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600 font-sans">
                        {entry.description}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {entry.origin}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <div className={`flex items-center gap-1.5 font-sans font-bold text-[10px] ${entry.status === 'EXITO' ? 'text-emerald-600' : 'text-red-500'}`}>
                            {entry.status === 'EXITO' ? (
                              <CheckCircle2 size={14} />
                            ) : (
                              <ShieldAlert size={14} className="text-red-500" />
                            )}
                            <span className="uppercase">{entry.status === 'EXITO' ? 'Éxito' : 'Fallo'}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <span className="text-xs text-gray-500">Mostrando 1 a {AUDIT_LOGS.length} de {AUDIT_LOGS.length} registros</span>
            <div className="flex items-center gap-2">
              <button disabled className="p-1 px-3 border border-gray-200 rounded text-xs disabled:opacity-30 bg-white">Anterior</button>
              <button disabled className="p-1 px-3 border border-gray-200 rounded text-xs disabled:opacity-30 bg-white">Siguiente</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { ShieldAlert } from 'lucide-react';
