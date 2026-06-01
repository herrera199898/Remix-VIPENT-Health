import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Calendar, User, Clock, Stethoscope, Save, MapPin, 
  ChevronDown, FileText, Info, HelpCircle
} from 'lucide-react';
import { PATIENTS_MOCK, Appointment, ProfessionalRole, formatInputTimeToDisplay } from '../types';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string;
  onSave?: (app: Appointment) => void;
}

export default function AppointmentModal({ isOpen, onClose, dateStr, onSave }: AppointmentModalProps) {
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [formDate, setFormDate] = useState(dateStr);
  const [formTime, setFormTime] = useState('09:00');
  const [formRole, setFormRole] = useState<ProfessionalRole>('MEDICO');
  const [attentionType, setAttentionType] = useState('Control PSCV');
  const [status, setStatus] = useState('Programada');
  const [establishment, setEstablishment] = useState<'Hualañé' | 'Curepto'>('Hualañé');
  const [observation, setObservation] = useState('');
  const [instruction, setInstruction] = useState('');
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;
  };

  const handleConfirmSave = () => {
    if (!selectedPatientId) {
      alert('Por favor, seleccione un paciente de la lista.');
      return;
    }

    const patient = PATIENTS_MOCK.find(p => p.id === selectedPatientId);
    if (!patient || !onSave) return;

    // Map professional name depending on role
    const docNames = {
      MEDICO: 'Dr. Carlos Mendoza',
      ENFERMERA: 'Enf. Camila Silva',
      NUTRICIONISTA: 'Nut. María José'
    };

    const newAppointment: Appointment = {
      id: 'custom-' + Date.now(),
      time: formatInputTimeToDisplay(formTime),
      patientName: patient.name,
      rut: patient.rut,
      role: formRole,
      professionalName: docNames[formRole],
      date: formDate,
      status: status,
      attentionType: attentionType,
      establishment: establishment,
      observation: observation,
      instruction: instruction
    };

    onSave(newAppointment);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col transform transition-all animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 bg-brand-blue text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
              <Calendar size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold leading-none">Agendar Nueva Cita PSCV</h2>
              <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-1">Planificación Sanitaria</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[75vh] text-left">
          
          {/* Selected Date Indicator */}
          <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-brand-blue shadow-3xs border border-blue-100">
                <span className="font-extrabold text-xs">{formDate.split('-')[2] || 'Cita'}</span>
              </div>
              <div>
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Fecha de Planificación</p>
                <p className="text-xs font-black text-brand-blue uppercase">{formatDate(formDate)}</p>
              </div>
            </div>
            <div className="px-2.5 py-0.5 bg-emerald-50 rounded-full text-[9px] font-bold text-emerald-600 border border-emerald-100 uppercase tracking-wider">
              Disponible
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Patient Select (Strict lookup of existings) */}
            <div className="space-y-1.5 col-span-1 md:col-span-2">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User size={13} className="text-brand-blue" />
                Seleccionar Paciente de Ficha PSCV
              </label>
              <div className="relative">
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue rounded-xl text-xs font-semibold text-slate-700 outline-none transition-all cursor-pointer appearance-none"
                >
                  <option value="">Seleccione un paciente registrado...</option>
                  {PATIENTS_MOCK.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.rut})</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Date Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={13} className="text-brand-blue" />
                Fecha
              </label>
              <input 
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue rounded-xl text-xs font-semibold text-slate-700 outline-none transition-all"
              />
            </div>

            {/* Time Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Clock size={13} className="text-brand-blue" />
                Hora de Citación
              </label>
              <input 
                type="time"
                value={formTime}
                onChange={(e) => setFormTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue rounded-xl text-xs font-semibold text-slate-700 outline-none transition-all"
              />
            </div>

            {/* Professional Role Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Stethoscope size={13} className="text-brand-blue" />
                Profesional
              </label>
              <div className="relative">
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as ProfessionalRole)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue rounded-xl text-xs font-semibold text-slate-700 outline-none transition-all cursor-pointer appearance-none"
                >
                  <option value="MEDICO">Médico (Dr. Carlos Mendoza)</option>
                  <option value="ENFERMERA">Enfermera (Enf. Camila Silva)</option>
                  <option value="NUTRICIONISTA">Nutricionista (Nut. María José)</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Tipo de atención PSCV select options */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Info size={13} className="text-brand-blue" />
                Tipo de Atención PSCV
              </label>
              <div className="relative">
                <select
                  value={attentionType}
                  onChange={(e) => setAttentionType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue rounded-xl text-xs font-semibold text-slate-700 outline-none transition-all cursor-pointer appearance-none"
                >
                  <option value="Control PSCV">Control PSCV</option>
                  <option value="Control HTA">Control HTA</option>
                  <option value="Control DM2">Control DM2</option>
                  <option value="Nutricionista">Nutricionista</option>
                  <option value="Enfermería">Enfermería</option>
                  <option value="Evaluación de pie">Evaluación de pie</option>
                  <option value="Revisión de exámenes">Revisión de exámenes</option>
                  <option value="Rescate / seguimiento">Rescate / seguimiento</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Sede / Establecimiento select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={13} className="text-brand-blue" />
                Establecimiento (Sede)
              </label>
              <div className="relative">
                <select
                  value={establishment}
                  onChange={(e) => setEstablishment(e.target.value as 'Hualañé' | 'Curepto')}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue rounded-xl text-xs font-semibold text-slate-700 outline-none transition-all cursor-pointer appearance-none"
                >
                  <option value="Hualañé">CESFAM Hualañé</option>
                  <option value="Curepto">CESFAM Curepto</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Estado de la Cita */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Clock size={13} className="text-brand-blue" />
                Estado Inicial
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue rounded-xl text-xs font-semibold text-slate-700 outline-none transition-all cursor-pointer appearance-none"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Programada">Programada</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Realizada">Realizada</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Observación Breve */}
            <div className="space-y-1.5 col-span-1 md:col-span-2">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText size={13} className="text-brand-blue" />
                Observación Breve
              </label>
              <input 
                type="text" 
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Ejemplo: Paciente requiere confirmar asistencia..." 
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue rounded-xl text-xs font-semibold text-slate-700 outline-none transition-all"
              />
            </div>

          </div>

          {/* Collapsible Additional Info (Instruction for active) */}
          <div className="border border-slate-100 rounded-xl overflow-hidden mt-2">
            <button 
              type="button"
              onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
              className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/70 border-none flex items-center justify-between text-xs font-extrabold text-slate-500 uppercase tracking-wider transition-colors"
            >
              <span className="flex items-center gap-2">
                <HelpCircle size={14} className="text-slate-400" />
                Información Adicional (Instrucción para Paciente)
              </span>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${showAdditionalInfo ? 'rotate-180' : ''}`} />
            </button>
            {showAdditionalInfo && (
              <div className="p-4 bg-white border-t border-slate-50 space-y-2">
                <label className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Instrucción para Paciente
                </label>
                <textarea
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="Ej: 'Traer carnet de control y exámenes vigentes'."
                  rows={2}
                  className="w-full p-3 bg-slate-50 border border-slate-200 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue rounded-lg text-xs font-semibold text-slate-700 focus:outline-none outline-none transition-all"
                />
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 bg-white text-slate-500 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-200 hover:bg-slate-100/70 transition-all shadow-3xs"
          >
            Cancelar
          </button>
          <button 
            onClick={handleConfirmSave}
            className="flex-[2] py-2.5 bg-[#0059E4] hover:bg-[#0048B3] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Save size={15} />
            Agendar Consulta
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
