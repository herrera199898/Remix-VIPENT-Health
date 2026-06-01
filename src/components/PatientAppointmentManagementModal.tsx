import React, { useState, useEffect } from 'react';
import { 
  Plus, Stethoscope, ChevronDown, Clock, MapPin, 
  HelpCircle, Eye, FileText, CheckCircle, Info, Calendar
} from 'lucide-react';

interface PatientAppointmentManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientRut?: string;
  initialSpecialty: 'medico' | 'enfermera' | 'nutricionista';
  initialDate: string;
  initialTime: string;
  initialStatus: string;
  initialAttentionType?: string;
  initialEstablishment?: 'Hualañé' | 'Curepto';
  initialObservation?: string;
  initialInstruction?: string;
  isNewConsultationMode?: boolean;
  onSave: (data: { 
    date: string; 
    time: string; 
    status: string; 
    specialty: 'medico' | 'enfermera' | 'nutricionista';
    attentionType?: string;
    establishment?: 'Hualañé' | 'Curepto';
    observation?: string;
    instruction?: string;
  }) => void;
}

export default function PatientAppointmentManagementModal({
  isOpen,
  onClose,
  patientName,
  patientRut = '',
  initialSpecialty,
  initialDate,
  initialTime,
  initialStatus,
  initialAttentionType = 'Control PSCV',
  initialEstablishment = 'Hualañé',
  initialObservation = '',
  initialInstruction = '',
  isNewConsultationMode = false,
  onSave,
}: PatientAppointmentManagementModalProps) {
  const [specialty, setSpecialty] = useState<'medico' | 'enfermera' | 'nutricionista'>(initialSpecialty);
  const [formDate, setFormDate] = useState(initialDate);
  const [formTime, setFormTime] = useState(initialTime);
  const [formStatus, setFormStatus] = useState(initialStatus);
  const [attentionType, setAttentionType] = useState(initialAttentionType);
  const [establishment, setEstablishment] = useState<'Hualañé' | 'Curepto'>(initialEstablishment);
  const [observation, setObservation] = useState(initialObservation);
  const [instruction, setInstruction] = useState(initialInstruction);
  const [showAdditional, setShowAdditional] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSpecialty(initialSpecialty);
      setFormDate(initialDate);
      setFormTime(initialTime);
      setFormStatus(initialStatus);
      setAttentionType(initialAttentionType);
      setEstablishment(initialEstablishment);
      setObservation(initialObservation);
      setInstruction(initialInstruction);
    }
  }, [isOpen, initialSpecialty, initialDate, initialTime, initialStatus, initialAttentionType, initialEstablishment, initialObservation, initialInstruction]);

  if (!isOpen) return null;

  const getPatientInitials = (nameStr: string) => {
    if (!nameStr || nameStr === '-') return "PT";
    const parts = nameStr.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameStr.slice(0, 2).toUpperCase();
  };

  const handleSave = () => {
    onSave({
      date: formDate,
      time: formTime,
      status: formStatus || "Programada",
      specialty,
      attentionType,
      establishment,
      observation,
      instruction,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="shared-schedule-control-modal-overlay">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-150 relative min-h-[420px]">
        
        {/* Left Column (Detalles del Paciente Sidebar) */}
        <div className="w-full md:w-[240px] bg-slate-50 border-r border-slate-200/50 p-6 flex flex-col justify-between shrink-0 text-left">
          <div className="space-y-6">
            <h3 className="text-[#0059E4] font-bold text-xs uppercase tracking-wider">
              Detalles del Paciente
            </h3>
            
            {/* Paciente */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                Paciente
              </span>
              <div className="flex items-center gap-2.5">
                <div className="bg-brand-blue text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none shadow-3xs">
                  {getPatientInitials(patientName)}
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-800 font-bold text-xs leading-tight">
                    {patientName === '-' ? 'Paciente Pendiente' : patientName}
                  </span>
                  {patientRut && (
                    <span className="text-[9.5px] font-mono text-slate-400 mt-0.5">
                      {patientRut}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Sede / Establecimiento */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                Establecimiento (Sede)
              </span>
              <div className="relative">
                <select
                  value={establishment}
                  onChange={(e) => setEstablishment(e.target.value as 'Hualañé' | 'Curepto')}
                  className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-[#0059E4] focus:ring-1 focus:ring-[#0059E4] rounded-lg py-2 pl-8 pr-6 text-xs font-semibold text-slate-800 outline-none transition-all cursor-pointer appearance-none"
                >
                  <option value="Hualañé">Sede Hualañé</option>
                  <option value="Curepto">Sede Curepto</option>
                </select>
                <MapPin size={13} className="absolute left-2.5 top-[10px] text-[#0059E4] pointer-events-none" />
                <ChevronDown size={11} className="absolute right-2.5 top-[11px] text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Atencion PSCV Tipo */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                Tipo Atención PSCV
              </span>
              <div className="relative">
                <select
                  value={attentionType}
                  onChange={(e) => setAttentionType(e.target.value)}
                  className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-[#0059E4] focus:ring-1 focus:ring-[#0059E4] rounded-lg py-2 pl-8 pr-6 text-xs font-semibold text-slate-800 outline-none transition-all cursor-pointer appearance-none select-none"
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
                <Info size={11.5} className="absolute left-2.5 top-[11.5px] text-[#0059E4] pointer-events-none" />
                <ChevronDown size={11} className="absolute right-2.5 top-[11px] text-slate-400 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Bottom Alert/Annotation */}
          <div className="pt-4 border-t border-slate-200 mt-6 md:mt-0 text-[10px] font-semibold text-slate-400">
            <p>CESFAM Coordinadora Digital</p>
          </div>
        </div>

        {/* Right Column (Form to Schedule) */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative bg-white text-left">
          
          {/* Close Button ('X') */}
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
            title="Cerrar"
          >
            <Plus size={16} className="rotate-45" />
          </button>

          <div className="space-y-5">
            <h4 className="text-[#111827] font-black text-sm uppercase tracking-wider text-slate-800 leading-none">
              {isNewConsultationMode ? "Programar Nueva Consulta PSCV" : "Gestión Operativa Agenda"}
            </h4>

            <div className="space-y-4">
              
              {/* Grid with Date & Time inputs side-by-side */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Fecha input */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold text-[9.5px] uppercase tracking-wider block">
                    Fecha
                  </label>
                  <input 
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-[#0059E4] focus:ring-1 focus:ring-[#0059E4] rounded-lg py-2 px-3 text-xs font-semibold text-slate-800 outline-none transition-all"
                  />
                </div>

                {/* Hora input */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold text-[9.5px] uppercase tracking-wider block">
                    Hora
                  </label>
                  <input 
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-[#0059E4] focus:ring-1 focus:ring-[#0059E4] rounded-lg py-2 px-3 text-xs font-semibold text-slate-800 outline-none transition-all"
                  />
                </div>

              </div>

              {/* Especialidad/Profesional */}
              <div className="space-y-1">
                <label className="text-slate-400 font-bold text-[9.5px] uppercase tracking-wider block">
                  Profesional Encargado
                </label>
                <div className="relative">
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value as 'medico' | 'enfermera' | 'nutricionista')}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-[#0059E4] focus:ring-1 focus:ring-[#0059E4] rounded-lg py-2 pl-8 pr-6 text-xs font-bold text-slate-850 outline-none transition-all cursor-pointer appearance-none shadow-3xs"
                  >
                    <option value="medico">Dr. Carlos Mendoza (Médico)</option>
                    <option value="enfermera">Enf. Camila Silva (Enfermera)</option>
                    <option value="nutricionista">Nut. María José (Nutricionista)</option>
                  </select>
                  <Stethoscope size={13} className="absolute left-2.5 top-[10px] text-[#0059E4] pointer-events-none" />
                  <ChevronDown size={11} className="absolute right-2.5 top-[11px] text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Estado de la Cita */}
              <div className="space-y-1">
                <label className="text-slate-400 font-bold text-[9.5px] uppercase tracking-wider block">
                  Estado de la Cita
                </label>
                <div className="relative">
                  <select 
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-[#0059E4] focus:ring-1 focus:ring-[#0059E4] rounded-lg py-2 pl-8 pr-6 text-xs font-bold text-slate-800 outline-none transition-all cursor-pointer appearance-none shadow-3xs"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Programada">Programada</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="Realizada">Realizada</option>
                    <option value="Cancelada">Cancelada</option>
                    <option value="Reprogramada">Reprogramada</option>
                    <option value="Inasistencia">Inasistencia</option>
                  </select>
                  <CheckCircle size={13} className="absolute left-2.5 top-[10.5px] text-[#0059E4] pointer-events-none" />
                  <ChevronDown size={11} className="absolute right-2.5 top-[11.5px] text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Observación Breve */}
              <div className="space-y-1">
                <label className="text-slate-400 font-bold text-[9.5px] uppercase tracking-wider block">
                  Observación Breve
                </label>
                <input 
                  type="text"
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  placeholder="Ej: Paciente requiere confirmar asistencia..."
                  className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-[#0059E4] focus:ring-1 focus:ring-[#0059E4] rounded-lg py-2 px-3 text-xs font-semibold text-slate-800 outline-none transition-all"
                />
              </div>

              {/* Collapsible Instruction section */}
              <div className="border border-slate-100 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowAdditional(!showAdditional)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer border-none"
                >
                  <span className="flex items-center gap-1.5">
                    <HelpCircle size={13} className="text-slate-400" />
                    Instrucción para el Paciente
                  </span>
                  <ChevronDown size={13} className={`text-slate-400 transition-transform ${showAdditional ? 'rotate-180' : ''}`} />
                </button>
                {showAdditional && (
                  <div className="p-3.5 bg-white border-t border-slate-50">
                    <textarea
                      value={instruction}
                      onChange={(e) => setInstruction(e.target.value)}
                      placeholder="Ej: Traer carnet y exámenes vigentes."
                      rows={2}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-[#0059E4] focus:ring-1 focus:ring-[#0059E4] rounded-lg text-xs font-semibold text-slate-700 outline-none focus:outline-none transition-all"
                    />
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2 hover:bg-slate-50 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg font-bold text-xs uppercase tracking-wider select-none transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-[#0059E4] hover:bg-[#0048B3] text-white rounded-lg font-bold text-xs uppercase tracking-wider select-none transition-all cursor-pointer shadow-xs"
            >
              Guardar Cambios
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
