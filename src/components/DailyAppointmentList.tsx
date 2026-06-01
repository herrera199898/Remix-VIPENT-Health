import React, { useState } from 'react';
import { Appointment, ProfessionalRole } from '../types';
import { 
  Search, ChevronDown, Filter, Calendar, FilePlus, ArrowLeft,
  CheckCircle, Clock, AlertTriangle, Eye, Edit2, 
  MapPin, X, ArrowUpRight, History
} from 'lucide-react';
import { BulletListSvgIcon } from './PatientList';

interface DailyAppointmentListProps {
  appointments: Appointment[];
  date: string;
  onBack: () => void;
  onManageAppointment?: (appId: string) => void;
  onUpdateStatus?: (appId: string, status: string) => void;
  onViewPatient?: (rut: string) => void;
}

export default function DailyAppointmentList({ 
  appointments, 
  date, 
  onBack, 
  onManageAppointment,
  onUpdateStatus,
  onViewPatient
}: DailyAppointmentListProps) {
  // Filters local states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProfessional, setFilterProfessional] = useState('ALL'); // ALL, MEDICO, ENFERMERA, NUTRICIONISTA
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterEstablishment, setFilterEstablishment] = useState('ALL');
  
  // Floating actions menu tracking
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Format the date (e.g., 2026-05-13 -> 13 de mayo de 2026)
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;
  };

  const getRoleColors = (role: ProfessionalRole) => {
    switch (role) {
      case 'MEDICO':
        return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'NUTRICIONISTA':
        return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'ENFERMERA':
        return 'text-amber-600 bg-amber-50 border-amber-100';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const truncatePatientName = (name: string) => {
    if (name.length > 25) return name.substring(0, 23) + '...';
    return name;
  };

  const getStatusBadge = (status: string) => {
    const norm = status.trim().toUpperCase();
    switch (norm) {
      case 'PENDIENTE':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'PROGRAMADA':
        return 'bg-[#eff6ff] text-blue-750 text-blue-700 border border-blue-100';
      case 'CONFIRMADA':
        return 'bg-sky-50 text-sky-800 border border-sky-100';
      case 'REALIZADA':
        return 'bg-[#ecfdf5] text-emerald-800 border border-[#a7f3d0]';
      case 'CANCELADA':
        return 'bg-[#fef2f2] text-rose-700 border border-rose-150';
      case 'REPROGRAMADA':
        return 'bg-[#faf5ff] text-purple-700 border border-purple-150';
      case 'INASISTENCIA':
        return 'bg-rose-50 text-rose-800 border border-rose-250';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  // Indicators calculation
  const totalCount = appointments.length;
  const confirmedCount = appointments.filter(a => a.status === 'Confirmada').length;
  const pendingCount = appointments.filter(a => a.status === 'Pendiente').length;
  const noShowCount = appointments.filter(a => a.status === 'Inasistencia').length;

  // Filter application
  const filteredAppointments = appointments.filter(app => {
    // 1. Search term - matches Name or RUT
    const cleanSearch = searchTerm.toLowerCase().trim();
    const matchesSearch = cleanSearch === '' || 
      app.patientName.toLowerCase().includes(cleanSearch) || 
      app.rut.replace(/\D/g, '').includes(cleanSearch.replace(/\D/g, '')) || 
      app.rut.toLowerCase().includes(cleanSearch);

    // 2. Professional
    const matchesProfessional = filterProfessional === 'ALL' || app.role === filterProfessional;

    // 3. Status
    const matchesStatus = filterStatus === 'ALL' || app.status.toUpperCase() === filterStatus.toUpperCase();

    // 4. Establishment
    const matchesEstablishment = filterEstablishment === 'ALL' || app.establishment === filterEstablishment;

    return matchesSearch && matchesProfessional && matchesStatus && matchesEstablishment;
  });

  const handleAction = (appId: string, actionName: string, payload?: any) => {
    setActiveMenuId(null);
    if (actionName === 'status' && onUpdateStatus && payload) {
      onUpdateStatus(appId, payload);
    } else if (actionName === 'manage' && onManageAppointment) {
      onManageAppointment(appId);
    } else if (actionName === 'view_patient' && onViewPatient && payload) {
      onViewPatient(payload);
    }
  };

  return (
    <div id="vipent-appointments-list-view" className="flex-1 flex flex-col min-h-0 bg-gray-50/30">
      
      {/* Header */}
      <div className="p-6 md:p-8 bg-white border-b border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Calendar className="text-brand-blue" size={24} />
            <span>Citas Médicas</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestión de agenda y seguimiento de citaciones PSCV
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#e0f2fe] border border-blue-100 rounded-full text-[11px] font-black text-blue-750 uppercase tracking-wider">
          <Calendar size={13} className="text-blue-600" />
          <span className="text-blue-750 font-bold">{formatDate(date)}</span>
        </div>
      </div>

      <div className="p-4 md:p-8 flex-1 flex flex-col min-h-0">
        
        {/* Top Agenda Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Citas del Día</span>
              <span className="text-xl font-bold text-slate-800">{totalCount}</span>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Calendar size={15} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block">Confirmadas</span>
              <span className="text-xl font-bold text-emerald-800">{confirmedCount}</span>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
              <CheckCircle size={15} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">Pendientes</span>
              <span className="text-xl font-bold text-amber-800">{pendingCount}</span>
            </div>
            <div className="p-2 bg-amber-50 text-amber-500 rounded-lg">
              <Clock size={15} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">Inasistencias</span>
              <span className="text-xl font-bold text-rose-800">{noShowCount}</span>
            </div>
            <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
              <AlertTriangle size={15} />
            </div>
          </div>
        </div>

        {/* CONTAINER PRINCIPAL DE LA TABLA Y FILTROS */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-xs flex flex-col flex-1 min-h-0 overflow-hidden">
          
          {/* Filters Panel */}
          <div className="p-4 border-b border-gray-205 bg-gray-50/55 flex flex-col md:flex-row gap-3">
            
            {/* Text Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar paciente por nombre o RUT..."
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-350 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-blue/30 focus:border-brand-blue placeholder:text-gray-400 text-slate-705"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Specialty Filter */}
            <div className="relative min-w-[150px]">
              <select
                value={filterProfessional}
                onChange={(e) => setFilterProfessional(e.target.value)}
                className="w-full bg-white border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 cursor-pointer appearance-none focus:outline-none focus:ring-1 focus:ring-brand-blue"
              >
                <option value="ALL">TODOS LOS PROFESIONALES</option>
                <option value="MEDICO">MÉDICO</option>
                <option value="ENFERMERA">ENFERMERA</option>
                <option value="NUTRICIONISTA">NUTRICIONISTA</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative min-w-[150px]">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-white border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 cursor-pointer appearance-none focus:outline-none focus:ring-1 focus:ring-brand-blue"
              >
                <option value="ALL">TODOS LOS ESTADOS</option>
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="PROGRAMADA">PROGRAMADA</option>
                <option value="CONFIRMADA">CONFIRMADA</option>
                <option value="REALIZADA">REALIZADA</option>
                <option value="CANCELADA">CANCELADA</option>
                <option value="REPROGRAMADA">REPROGRAMADA</option>
                <option value="INASISTENCIA">INASISTENCIA</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Establishment Filter */}
            <div className="relative min-w-[140px]">
              <select
                value={filterEstablishment}
                onChange={(e) => setFilterEstablishment(e.target.value)}
                className="w-full bg-white border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 cursor-pointer appearance-none focus:outline-none focus:ring-1 focus:ring-brand-blue"
              >
                <option value="ALL">TODAS LAS SEDES</option>
                <option value="Hualañé">HUALAÑÉ</option>
                <option value="Curepto">CUREPTO</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
            </div>

          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse table-fixed">
              <thead className="bg-[#f8fafc] sticky top-0 z-10 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-6 w-[100px] text-xs font-bold text-slate-500 uppercase tracking-wider">Hora</th>
                  <th className="py-3 px-4 w-[240px] text-xs font-bold text-slate-500 uppercase tracking-wider">Paciente</th>
                  <th className="py-3 px-4 w-[160px] text-xs font-bold text-slate-500 uppercase tracking-wider">Atención PSCV</th>
                  <th className="py-3 px-4 w-[120px] text-xs font-bold text-slate-500 uppercase tracking-wider">Sede</th>
                  <th className="py-3 px-4 w-[180px] text-xs font-bold text-slate-500 uppercase tracking-wider">Profesional</th>
                  <th className="py-3 px-4 w-[130px] text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="py-3 px-6 w-[100px] text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-xs font-semibold text-slate-400 bg-slate-50/20">
                  No hay citas registradas que coincidan con los filtros aplicados.
                </td>
              </tr>
            ) : (
              filteredAppointments.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/30 transition-colors">
                  
                  {/* Hora */}
                  <td className="py-4.5 px-6 font-mono font-bold text-xs text-slate-700">
                    {app.time.replace(' AM', '').replace(' PM', '')}
                  </td>
                  
                  {/* Paciente Info */}
                  <td className="py-4.5 px-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800 leading-tight">
                        {truncatePatientName(app.patientName)}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 mt-0.5 font-mono">
                        {app.rut}
                      </span>
                    </div>
                  </td>
                  
                  {/* Tipo de atención */}
                  <td className="py-4.5 px-4">
                    <span className="px-2.5 py-1 bg-sky-50 text-[10px] font-bold text-[#0284c7] border border-sky-100 rounded-lg">
                      {app.attentionType || 'Control General'}
                    </span>
                  </td>
                  
                  {/* Establecimiento */}
                  <td className="py-4.5 px-4">
                    <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-500">
                      <MapPin size={12} className="text-slate-400" />
                      {app.establishment || 'Hualañé'}
                    </div>
                  </td>
                  
                  {/* Profesional */}
                  <td className="py-4.5 px-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">
                        {app.professionalName}
                      </span>
                      <span className="text-[8.5px] font-extrabold text-slate-400 mt-0.5 tracking-wider uppercase">
                        {app.role === 'MEDICO' ? 'Médico Cirujano' : app.role === 'ENFERMERA' ? 'Enfermera Universitaria' : 'Nutricionista'}
                      </span>
                    </div>
                  </td>
                  
                  {/* Estado Badge */}
                  <td className="py-4.5 px-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[9.5px] font-black uppercase tracking-wide ${getStatusBadge(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  
                  {/* Actions Dropdown Controller */}
                  <td className="py-4.5 px-6 relative text-center">
                    <div className="relative inline-block text-left">
                      <button 
                        onClick={() => setActiveMenuId(activeMenuId === app.id ? null : app.id)}
                        className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors focus:outline-none"
                      >
                        <BulletListSvgIcon size={16} />
                      </button>

                      {activeMenuId === app.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-30" 
                            onClick={() => setActiveMenuId(null)} 
                          />
                          <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1.5 z-40 text-left animate-in fade-in slide-in-from-top-1 duration-100">
                            
                            <div className="px-3 py-1 text-[8.5px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">
                              Acciones Cita
                            </div>
                            
                            <button 
                              onClick={() => handleAction(app.id, 'manage')}
                              className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-50/50 hover:text-blue-600 transition-colors flex items-center gap-2"
                            >
                              <Edit2 size={13} />
                              Ver / Editar Cita
                            </button>

                            <button 
                              onClick={() => handleAction(app.id, 'status', 'Confirmada')}
                              className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2"
                            >
                              <CheckCircle size={13} className="text-emerald-500" />
                              Marcar Confirmada
                            </button>

                            <button 
                              onClick={() => handleAction(app.id, 'status', 'Realizada')}
                              className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center gap-2"
                            >
                              <CheckCircle size={13} className="text-[#047857]" />
                              Marcar Realizada
                            </button>

                            <button 
                              onClick={() => handleAction(app.id, 'status', 'Inasistencia')}
                              className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-700 transition-colors flex items-center gap-2"
                            >
                              <AlertTriangle size={13} className="text-rose-500" />
                              Marcar Inasistencia
                            </button>

                            <button 
                              onClick={() => handleAction(app.id, 'status', 'Cancelada')}
                              className="w-full px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-800 transition-colors flex items-center gap-2"
                            >
                              <X size={13} className="text-slate-400" />
                              Cancelar Cita
                            </button>

                            {onViewPatient && app.rut && (
                              <div className="border-t border-slate-100 mt-1.5 pt-1">
                                <button 
                                  onClick={() => handleAction(app.id, 'view_patient', app.rut)}
                                  className="w-full px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-2"
                                >
                                  <ArrowUpRight size={13} />
                                  Ver Ficha PSCV
                                </button>
                              </div>
                            )}

                          </div>
                        </>
                      )}
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div> {/* closes CONTAINER PRINCIPAL */}
      </div> {/* closes padding container */}

      {/* Footer / Back Button */}
      <div className="p-4 px-6 border-t border-gray-100 flex justify-end shrink-0 bg-slate-55 bg-slate-50">
        <button 
          onClick={onBack}
          className="px-5 py-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 border border-slate-200 shadow-sm text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2"
        >
          <ArrowLeft size={14} className="text-slate-400" />
          Volver al Calendario
        </button>
      </div>

    </div>
  );
}
