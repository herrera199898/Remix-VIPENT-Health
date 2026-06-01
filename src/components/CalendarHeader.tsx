import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, Search, X } from 'lucide-react';
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
    <div className="bg-white px-6 py-4 flex items-center justify-between border border-gray-200 border-b-0 rounded-t-lg shadow-sm overflow-visible z-20 relative">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-6">
          <div className="relative">
            <button 
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="bg-brand-blue hover:bg-blue-900 text-white px-8 py-2.5 rounded-md font-bold text-sm shadow-md tracking-wide uppercase min-w-[120px] text-center flex items-center justify-center gap-2 transition-colors"
            >
              <CalendarIcon size={16} className="opacity-80" />
              {currentMonthName}
            </button>
            
            <AnimatePresence>
              {isDatePickerOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-0 z-50 min-w-[280px]"
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
                        // isSelected is whether it's the exact day currently viewed/selected
                        let isSelected = false;
                        if (view === 'MES') {
                          // Month view uses selectedDateObj logically
                          if (selectedDateObj) {
                            isSelected = selectedDateObj.getFullYear() === miniYear && 
                                         selectedDateObj.getMonth() === miniMonth && 
                                         selectedDateObj.getDate() === d;
                          }
                        } else {
                           // Day/Week views use currentDate logically
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
          <div className="flex items-center gap-3">
            <span className="text-gray-700 font-bold text-base tracking-tight">{currentYear}</span>
            <div className="flex gap-1.5 ml-2">
              <button 
                onClick={onPrev}
                className="bg-brand-blue hover:bg-slate-700 text-white w-9 h-9 rounded-md flex items-center justify-center transition-all active:scale-95 shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={onNext}
                className="bg-brand-blue hover:bg-slate-700 text-white w-9 h-9 rounded-md flex items-center justify-center transition-all active:scale-95 shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={() => setView('MES')}
            className={`px-8 py-2.5 text-xs font-black rounded-md shadow-sm border transition-all ${
              view === 'MES'
                ? 'bg-brand-blue-light text-white border-brand-blue-light'
                : 'bg-brand-blue text-white border-brand-blue hover:bg-slate-700'
            }`}
          >
            MES
          </button>
          <button
            onClick={() => setView('SEMANA')}
            className={`px-8 py-2.5 text-xs font-black rounded-md shadow-sm border transition-all ${
              view === 'SEMANA'
                ? 'bg-brand-blue-light text-white border-brand-blue-light'
                : 'bg-brand-blue text-white border-brand-blue hover:bg-slate-700'
            }`}
          >
            SEMANA
          </button>
          <button
            onClick={() => setView('DÍA')}
            className={`px-8 py-2.5 text-xs font-black rounded-md shadow-sm border transition-all ${
              view === 'DÍA'
                ? 'bg-brand-blue-light text-white border-brand-blue-light'
                : 'bg-brand-blue text-white border-brand-blue hover:bg-slate-700'
            }`}
          >
            DÍA
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-sm ml-8 h-full flex justify-end">
        <AnimatePresence mode="wait">
          {selectedDateStr && selectedDateObj ? (
            <motion.div
              key="selected"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-gray-50 border border-gray-100 rounded-xl p-4 w-full shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 capitalize">
                    {daysOfWeek[selectedDateObj.getDay()]}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    {selectedDateObj.getDate()} de {months[selectedDateObj.getMonth()]}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-md border border-gray-100 shadow-sm">
                  <Users size={14} className="text-emerald-500" />
                  <span className="text-xs font-bold text-gray-700">
                    {appointmentsCount} citas
                  </span>
                </div>
              </div>
              <button
                onClick={() => setView('LISTADO')}
                className="w-full py-2 bg-brand-blue hover:bg-blue-900 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
              >
                Gestionar Citas Médicas
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gray-50/50 border border-dashed border-gray-200 rounded-xl p-4 w-full h-full flex items-center justify-center text-gray-400"
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <CalendarIcon size={16} />
                <span>Seleccione un día</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
