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

  const formatShortName = (name: string): string => {
    if (!name) return '';
    const cleanName = name.trim();
    const words = cleanName.split(/\s+/);
    
    let formatted = '';
    if (words.length <= 1) {
      formatted = cleanName;
    } else {
      // Checklist for Chilean format: PATERNO MATERNO NOMBRES
      // e.g., ABUD VALENZUELA CRISTIAN ALEJANDRO -> CRISTIAN ABUD
      const isUppercaseFormat = cleanName === cleanName.toUpperCase() && words.length >= 3;
      
      if (isUppercaseFormat) {
        const lastName = words[0];
        const firstName = words[2];
        if (firstName && lastName) {
          formatted = `${firstName} ${lastName}`;
        } else {
          formatted = cleanName;
        }
      } else {
        // Otherwise, standard GIVEN_NAME SURNAME (e.g., María López)
        const firstName = words[0];
        const lastName = words[1] || words[words.length - 1];
        formatted = `${firstName} ${lastName}`;
      }
    }
    
    if (!formatted) return '';
    // Convert each to first letter uppercase, rest lowercase
    return formatted
      .split(/\s+/)
      .map(word => {
        if (!word) return '';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  };

  const truncatePatientName = (name: string) => {
    const formatted = formatShortName(name);
    if (formatted.length > 25) return formatted.substring(0, 23) + '...';
    return formatted;
  };

  const getStatusBadge = (status: string) => {
    const norm = status.trim().toUpperCase();
    switch (norm) {
      case 'PENDIENTE':
      case 'REPROGRAMADA':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'PROGRAMADA':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'CONFIRMADA':
      case 'REALIZADA':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANCELADA':
      case 'INASISTENCIA':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
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
    <div id="vipent-appointments-list-view" className="flex-1 flex flex-col min-h-0 bg-transparent space-y-6">
      
      {/* Header */}
      <div className="p-6 md:p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 shrink-0 font-sans animate-fade-in">
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

      <div className="flex-1 flex flex-col min-h-0">
        
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
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
          
          {/* Filters Panel */}
          <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col md:flex-row gap-3">
            
            {/* Text Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar paciente por nombre o RUT..."
                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all shadow-2xs font-semibold text-slate-705 placeholder-slate-400"
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
                className="w-full bg-white border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 cursor-pointer appearance-none focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue transition-all shadow-sm"
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
                className="w-full bg-white border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 cursor-pointer appearance-none focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue transition-all shadow-sm"
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
                className="w-full bg-white border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 cursor-pointer appearance-none focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue transition-all shadow-sm"
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
              <thead className="sticky top-0 bg-gray-50 border-b border-gray-250 z-10 w-full">
                <tr className="font-sans">
                  <th className="px-5 py-3 w-[100px] text-[10px] font-bold text-gray-500 uppercase tracking-wider text-left">Hora</th>
                  <th className="px-5 py-3 w-[240px] text-[10px] font-bold text-gray-500 uppercase tracking-wider text-left">Paciente</th>
                  <th className="px-5 py-3 w-[160px] text-[10px] font-bold text-gray-500 uppercase tracking-wider text-left">Atención PSCV</th>
                  <th className="px-5 py-3 w-[120px] text-[10px] font-bold text-gray-500 uppercase tracking-wider text-left">Sede</th>
                  <th className="px-5 py-3 w-[180px] text-[10px] font-bold text-gray-500 uppercase tracking-wider text-left">Profesional</th>
                  <th className="px-5 py-3 w-[130px] text-[10px] font-bold text-gray-500 uppercase tracking-wider text-left">Estado</th>
                  <th className="px-5 py-3 w-[100px] text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Acciones</th>
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
                <tr key={app.id} className="hover:bg-slate-50/50 transition-all font-mono align-middle">
                  
                  {/* Hora */}
                  <td className="px-5 py-3.5 text-xs text-medium text-gray-500 font-sans whitespace-nowrap">
                    {app.time.replace(' AM', '').replace(' PM', '')}
                  </td>
                  
                  {/* Paciente Info */}
                  <td className="px-5 py-3.5 text-xs text-slate-700 font-sans">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-900 block leading-tight">
                        {truncatePatientName(app.patientName)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono tracking-tight mt-0.5">
                        RUT: {app.rut}
                      </span>
                    </div>
                  </td>
                  
                  {/* Tipo de atención */}
                  <td className="px-5 py-3.5 text-xs text-slate-700 font-sans">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-semibold leading-none bg-sky-50 text-sky-700 border-sky-200">
                      {app.attentionType || 'Control General'}
                    </span>
                  </td>
                  
                  {/* Establecimiento */}
                  <td className="px-5 py-3.5 text-xs text-slate-700 font-sans">
                    <div className="flex items-center gap-1.5 text-xs text-slate-805 font-semibold">
                      <MapPin size={13} className="text-slate-400 shrink-0" />
                      <span>{app.establishment || 'Hualañé'}</span>
                    </div>
                  </td>
                  
                  {/* Profesional */}
                  <td className="px-5 py-3.5 text-xs text-slate-700 font-sans">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-800">
                        {app.professionalName}
                      </span>
                      <span className="text-[9px] text-slate-450 font-medium">
                        {app.role === 'MEDICO' ? 'Médico Cirujano' : app.role === 'ENFERMERA' ? 'Enfermera Universitaria' : 'Nutricionista'}
                      </span>
                    </div>
                  </td>
                  
                  {/* Estado Badge */}
                  <td className="px-5 py-3.5 text-xs text-slate-700 font-sans">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-semibold leading-none ${getStatusBadge(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  
                  {/* Actions Dropdown Controller */}
                  <td className="px-5 py-3.5 text-center pr-6 relative" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center relative">
                      <button 
                        onClick={() => setActiveMenuId(activeMenuId === app.id ? null : app.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        <BulletListSvgIcon size={15} />
                      </button>

                      {activeMenuId === app.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-30 cursor-default" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(null);
                            }} 
                          />
                          <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-40 py-1 text-left text-xs text-gray-700">
                            
                            <div className="px-3.5 py-1.5 text-[8.5px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-gray-50 mb-1">
                              Acciones Cita
                            </div>
                            
                            <button 
                              onClick={() => handleAction(app.id, 'manage')}
                              className="w-full text-left px-3.5 py-2 hover:bg-gray-50 flex items-center gap-2 font-semibold"
                            >
                              <Edit2 size={13} className="text-blue-500" />
                              Ver / Editar Cita
                            </button>

                            <button 
                              onClick={() => handleAction(app.id, 'status', 'Confirmada')}
                              className="w-full text-left px-3.5 py-2 hover:bg-gray-50 flex items-center gap-2 font-semibold"
                            >
                              <CheckCircle size={13} className="text-emerald-500" />
                              Marcar Confirmada
                            </button>

                            <button 
                              onClick={() => handleAction(app.id, 'status', 'Realizada')}
                              className="w-full text-left px-3.5 py-2 hover:bg-gray-50 flex items-center gap-2 font-semibold"
                            >
                              <CheckCircle size={13} className="text-[#047857]" />
                              Marcar Realizada
                            </button>

                            <button 
                              onClick={() => handleAction(app.id, 'status', 'Inasistencia')}
                              className="w-full text-left px-3.5 py-2 hover:bg-gray-50 flex items-center gap-2 font-semibold"
                            >
                              <AlertTriangle size={13} className="text-rose-500" />
                              Marcar Inasistencia
                            </button>

                            <button 
                              onClick={() => handleAction(app.id, 'status', 'Cancelada')}
                              className="w-full text-left px-3.5 py-2 hover:bg-gray-50 flex items-center gap-2 font-semibold"
                            >
                              <X size={13} className="text-slate-400" />
                              Cancelar Cita
                            </button>

                            {onViewPatient && app.rut && (
                              <button 
                                onClick={() => handleAction(app.id, 'view_patient', app.rut)}
                                className="w-full text-left px-3.5 py-2 hover:bg-gray-50 flex items-center gap-2 font-semibold border-t border-gray-50 mt-1"
                              >
                                <ArrowUpRight size={13} className="text-brand-blue" />
                                Ver Ficha PSCV
                              </button>
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
      <div className="flex justify-end shrink-0">
        <button 
          onClick={onBack}
          className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 border border-gray-200 shadow-sm text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft size={14} className="text-slate-400" />
          Volver al Calendario
        </button>
      </div>

    </div>
  );
}
