import React from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, ArrowRight, Clock } from 'lucide-react';

interface CalendarQuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  appointmentCount: number;
  onManageClick: () => void;
}

export default function CalendarQuickViewModal({ 
  isOpen, 
  onClose, 
  date, 
  appointmentCount, 
  onManageClick 
}: CalendarQuickViewModalProps) {
  if (!isOpen) return null;

  const formatDate = (date: Date) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return {
      dayName: days[date.getDay()],
      dayNumber: date.getDate(),
      monthName: months[date.getMonth()],
      year: date.getFullYear()
    };
  };

  const info = formatDate(date);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col transform transition-all animate-in fade-in zoom-in duration-200">
        <div className="p-4 flex justify-between items-center border-b border-gray-50 shrink-0">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Resumen de Agenda</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-brand-blue mb-4 shadow-inner">
            <Calendar size={32} />
          </div>
          
          <p className="text-[10px] font-black text-brand-blue uppercase tracking-[0.2em] mb-1">{info.dayName}</p>
          <h2 className="text-3xl font-black text-gray-900 leading-none mb-1">{info.dayNumber}</h2>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-tight">{info.monthName} {info.year}</p>

          <div className="mt-8 w-full bg-slate-50 rounded-xl p-4 flex items-center justify-between border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm text-brand-blue">
                <Clock size={16} />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1">Citas Programadas</p>
                <p className="text-sm font-bold text-gray-900 leading-none">{appointmentCount} {appointmentCount === 1 ? 'Cita' : 'Citas'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 shrink-0">
          <button 
            onClick={onManageClick}
            className="w-full py-3.5 bg-brand-blue text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-blue-900 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group"
          >
            Gestionar Citas del Día
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
