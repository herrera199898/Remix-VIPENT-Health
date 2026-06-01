import { Eye, MapPin, Calendar } from 'lucide-react';
import { Appointment } from '../types';
import { motion } from 'motion/react';

interface DayViewProps {
  appointments: Appointment[];
  currentDate: Date;
  onManageAppointment?: (appId: string) => void;
}

export default function DayView({ appointments, currentDate, onManageAppointment }: DayViewProps) {
  const days = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
  const months = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
  
  const dayName = days[currentDate.getDay()];
  const monthName = months[currentDate.getMonth()];
  const dayOfMonth = currentDate.getDate();
  const year = currentDate.getFullYear();

  const formattedDate = `${year}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${dayOfMonth.toString().padStart(2, '0')}`;
  const filteredApps = appointments.filter(a => a.date === formattedDate);

  const roleColors = {
    MEDICO: 'bg-blue-50 text-blue-650 border-blue-100/80',
    NUTRICIONISTA: 'bg-emerald-50 text-emerald-750 border-emerald-100/85',
    ENFERMERA: 'bg-amber-50 text-amber-750 border-amber-100/80',
  };

  const getStatusBadge = (status: string) => {
    const norm = (status || '').trim().toUpperCase();
    switch (norm) {
      case 'PENDIENTE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'PROGRAMADA':
        return 'bg-blue-50 text-blue-750 text-blue-700 border-blue-100';
      case 'CONFIRMADA':
        return 'bg-sky-50 text-sky-850 border-sky-150';
      case 'REALIZADA':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'CANCELADA':
        return 'bg-rose-50 text-rose-700 border-rose-150';
      case 'REPROGRAMADA':
        return 'bg-purple-50 text-purple-700 border-purple-150';
      case 'INASISTENCIA':
        return 'bg-rose-50 text-rose-800 border-rose-250';
      default:
        return 'bg-slate-50 text-slate-650 border border-slate-200';
    }
  };

  const formatShortPatientName = (fullName: string) => {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      // Return e.g. "Juan G."
      return `${parts[0]} ${parts[1][0]}.`;
    }
    return fullName;
  };

  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-b-lg flex flex-col overflow-y-auto">
      
      {/* Date Header */}
      <div className="bg-slate-50/80 px-6 py-4 flex justify-between items-center border-b border-gray-100 shrink-0">
        <h2 className="text-slate-800 font-extrabold text-sm tracking-wide uppercase flex items-center gap-2">
          {dayName} {dayOfMonth} <span className="font-semibold text-slate-400">{monthName} {year}</span>
          {currentDate.toDateString() === new Date().toDateString() && (
            <span className="ml-2 bg-brand-blue text-white px-2 py-0.5 rounded text-[9.5px] font-black tracking-wider uppercase shadow-3xs">HOY</span>
          )}
        </h2>
        <span className="text-[10px] font-extrabold text-slate-500 bg-white px-3 py-1 rounded-lg shadow-3xs border border-slate-100">
          {filteredApps.length} Citas Programadas
        </span>
      </div>

      {/* Daily List */}
      <div className="p-6 space-y-4 text-left">
        {filteredApps.length === 0 ? (
          <div className="py-12 text-center text-xs font-semibold text-slate-450 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/20">
            No hay citas médicas agendadas para este día.
          </div>
        ) : (
          filteredApps.map((app, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={app.id}
              className="flex border border-slate-200 rounded-xl overflow-hidden shadow-3xs hover:shadow-2xs transition-all group bg-white"
            >
              
              {/* Hour block left */}
              <div className="w-24 bg-slate-50/65 flex flex-col items-center justify-center border-r border-slate-200/50 py-4.5">
                <span className="text-lg font-black text-slate-800 font-mono tracking-tight leading-none">
                  {app.time.split(' ')[0]}
                </span>
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">
                  {app.time.split(' ')[1] || 'AM'}
                </span>
              </div>
              
              {/* Main information right */}
              <div className="flex-1 p-4.5 flex justify-between items-center gap-4">
                <div className="space-y-2.5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-brand-blue transition-colors leading-tight">
                      {app.patientName} <span className="text-slate-450 text-[10.5px] font-medium font-mono ml-2">({app.rut})</span>
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    
                    {/* Role */}
                    <span className={`text-[8.5px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${roleColors[app.role] || 'bg-slate-50 text-slate-600'}`}>
                      {app.role === 'MEDICO' ? 'Médico' : app.role === 'ENFERMERA' ? 'Enfermera' : 'Nutricionista'}
                    </span>

                    {/* Attention Type */}
                    <span className="px-2.5 py-0.5 bg-sky-50 text-[9.5px] font-bold text-sky-700 border border-sky-100/80 rounded-md">
                      {app.attentionType || 'Control PSCV'}
                    </span>

                    {/* Establishment / Sede */}
                    <span className="text-[10px] font-semibold text-slate-450 flex items-center gap-1">
                      <MapPin size={11} className="text-slate-400" />
                      {app.establishment || 'Hualañé'}
                    </span>

                    <span className="text-slate-300">|</span>

                    {/* Practitioner Name */}
                    <span className="text-xs font-semibold text-slate-550 italic">
                      {app.professionalName}
                    </span>

                  </div>
                </div>

                <div className="flex items-center gap-3">
                  
                  {/* Status Badge */}
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wide border ${getStatusBadge(app.status)}`}>
                    {app.status}
                  </span>

                  {/* Manage Action */}
                  <button 
                    onClick={() => onManageAppointment?.(app.id)}
                    className="text-slate-400 hover:text-brand-blue hover:bg-slate-100 p-2 rounded-full transition-all cursor-pointer border-none"
                    title="Ver / Gestionar Cita"
                  >
                    <Eye size={18} />
                  </button>

                </div>
              </div>

            </motion.div>
          ))
        )}
      </div>

    </div>
  );
}
