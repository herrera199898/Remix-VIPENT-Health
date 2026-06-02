import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, Search, X, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CalendarHeaderProps {
  view: 'MES' | 'SEMANA' | 'DÍA';
  setView: (view: 'MES' | 'SEMANA' | 'DÍA' | 'LISTADO') => void;
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onDateChange?: (date: Date) => void;
  selectedDateStr?: string | null;
  appointmentsCount?: number;
}

export default function CalendarHeader({ 
  view, 
  setView, 
  currentDate, 
  onPrev, 
  onNext,
  onDateChange,
  selectedDateStr,
  appointmentsCount = 0
}: CalendarHeaderProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [miniCalendarDate, setMiniCalendarDate] = useState(currentDate);

  useEffect(() => {
    if (isDatePickerOpen) {
      setMiniCalendarDate(currentDate);
    }
  }, [isDatePickerOpen, currentDate]);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const currentMonthName = months[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  // Helper for formatted date
  const selectedDateObj = selectedDateStr ? new Date(`${selectedDateStr}T12:00:00`) : null;
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleDateSelect = (year: number, month: number, day: number) => {
    if (onDateChange) {
      const newDate = new Date(year, month, day, 12, 0, 0);
      onDateChange(newDate);
      // We do NOT close the mini calendar anymore when selecting a day, it stays open.
    }
  };

  const miniYear = miniCalendarDate.getFullYear();
  const miniMonth = miniCalendarDate.getMonth();
  const daysInMonth = getDaysInMonth(miniYear, miniMonth);
  const firstDay = getFirstDayOfMonth(miniYear, miniMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="p-6 md:p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col xl:flex-row xl:items-center gap-6 shrink-0 font-sans z-20 relative">
      
      {/* 1. Left side: Title */}
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <CalendarDays className="text-brand-blue" size={24} />
          <span>Gestión de citas médicas</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Control, agenda y asignación de citas para pacientes cardiovasculares
        </p>
      </div>

      {/* 2. Middle: Selected Day Info & Manage Button */}
      <div className="flex-1 flex justify-center min-w-0">
          <AnimatePresence mode="wait">
            {selectedDateStr && selectedDateObj ? (
              <motion.div
                key="selected"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-2.5 shadow-sm flex items-center gap-4 md:gap-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <h3 className="text-sm font-bold text-gray-900 capitalize leading-tight">
                      {daysOfWeek[selectedDateObj.getDay()]}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium leading-tight">
                      {selectedDateObj.getDate()} de {months[selectedDateObj.getMonth()]}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-gray-200 hidden md:block"></div>
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-gray-100 shadow-sm">
                    <Users size={16} className="text-emerald-500 hidden md:block" />
                    <span className="text-sm font-bold text-gray-700 whitespace-nowrap">
                      {appointmentsCount} citas
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setView('LISTADO')}
                  className="px-4 py-2 bg-brand-blue hover:bg-blue-900 text-white text-sm font-bold rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  Gestionar Citas
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-50/50 border border-dashed border-gray-200 rounded-xl px-6 py-4 flex flex-col items-center justify-center text-gray-400 min-w-[280px]"
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CalendarIcon size={16} />
                  <span>Seleccione un día para gestionar citas</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
      </div>

      {/* 3. Right side: Calendar controls & View Toggles */}
      <div className="flex-shrink-0 flex flex-col items-end gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="bg-brand-blue hover:bg-blue-900 text-white px-5 py-2.5 rounded-md font-bold text-sm shadow-sm tracking-wide uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <CalendarIcon size={16} className="opacity-80" />
              <span className="min-w-[100px] text-left">{currentMonthName} {currentYear}</span>
            </button>
            
            <AnimatePresence>
              {isDatePickerOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-0 z-50 min-w-[280px]"
                >
                  <div className="bg-brand-blue/5 border-b border-brand-blue/10 p-3 flex items-center justify-between rounded-t-xl">
                    <span className="text-xs font-bold text-gray-700 flex items-center gap-2">
                       <Search size={14} className="text-brand-blue" />
                       Mini Calendario
                    </span>
                    <button
                      onClick={() => setIsDatePickerOpen(false)}
                      className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <button 
                        onClick={() => setMiniCalendarDate(new Date(miniYear, miniMonth - 1, 1))}
                        className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <div className="text-sm font-bold text-gray-800">
                        {months[miniMonth]} {miniYear}
                      </div>
                      <button 
                        onClick={() => setMiniCalendarDate(new Date(miniYear, miniMonth + 1, 1))}
                        className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                      {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(d => (
                        <div key={d} className="text-[10px] font-bold text-gray-400 uppercase">{d}</div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {blanks.map(b => <div key={`blank-${b}`} />)}
                      {days.map(d => {
                        let isSelected = false;
                        if (view === 'MES') {
                          if (selectedDateObj) {
                            isSelected = selectedDateObj.getFullYear() === miniYear && 
                                         selectedDateObj.getMonth() === miniMonth && 
                                         selectedDateObj.getDate() === d;
                          }
                        } else {
                           isSelected = currentDate.getFullYear() === miniYear && 
                                        currentDate.getMonth() === miniMonth && 
                                        currentDate.getDate() === d;
                        }
                        
                        const isToday = new Date().getFullYear() === miniYear && 
                                        new Date().getMonth() === miniMonth && 
                                        new Date().getDate() === d;
                                        
                        return (
                          <button
                            key={d}
                            onClick={() => handleDateSelect(miniYear, miniMonth, d)}
                            className={`w-8 h-8 flex items-center justify-center rounded-full text-xs transition-colors mx-auto ${
                              isSelected ? 'bg-brand-blue text-white font-bold shadow-sm' :
                              isToday ? 'bg-blue-50 text-brand-blue font-bold border border-blue-100' :
                              'hover:bg-gray-100 text-gray-700 font-medium'
                            }`}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-1">
            <button 
              onClick={onPrev}
              className="bg-brand-blue hover:bg-blue-900 text-white w-9 h-9 rounded-md flex items-center justify-center transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={onNext}
              className="bg-brand-blue hover:bg-blue-900 text-white w-9 h-9 rounded-md flex items-center justify-center transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        
        <div className="flex gap-2">
          {['MES', 'SEMANA', 'DÍA'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v as any)}
              className={`px-6 py-1.5 text-xs font-black rounded-md shadow-sm border transition-colors cursor-pointer ${
                view === v
                  ? 'bg-blue-50 text-brand-blue border-blue-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      
    </div>
  );
}
