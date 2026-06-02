import { Appointment } from '../types';

interface MonthViewProps {
  appointments: Appointment[];
  currentDate: Date;
  onDayClick: (day: number) => void;
  selectedDateStr?: string | null;
}

export default function MonthView({ appointments, currentDate, onDayClick, selectedDateStr }: MonthViewProps) {
  const daysOfWeek = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];

  const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  // Calculate dynamic month grid
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const prevMonthEmpty = Array.from({ length: firstDayOfMonth }, (_, i) => null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Fill grid to 35 or 42 cells (5 or 6 weeks)
  const totalCells = firstDayOfMonth + daysInMonth;
  const remainingCells = (totalCells > 35 ? 42 : 35) - totalCells;
  const nextMonthEmpty = Array.from({ length: remainingCells }, (_, i) => null);

  const getAppointmentsForDay = (day: number) => {
    const monthStr = (month + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    return appointments.filter(a => a.date === dateStr);
  };

  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden relative">
      {/* Days of Week Header */}
      <div className="grid grid-cols-7 bg-gray-100 border-b border-gray-200 shrink-0">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-2.5 px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-r border-gray-200 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 flex-1 bg-gray-200 gap-[1px]">
        {prevMonthEmpty.map((_, i) => (
          <div key={`prev-${i}`} className="bg-gray-100/50 p-2 flex flex-col" />
        ))}

        {days.map((day) => {
          const dayApps = getAppointmentsForDay(day);
          const today = new Date();
          const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
          
          const currentDayStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          const isSelected = selectedDateStr === currentDayStr;

          return (
            <div
              key={day}
              onClick={() => onDayClick(day)}
              className={`p-2 flex flex-col relative group transition-all min-h-[100px] border-r border-b border-gray-100 cursor-pointer ${
                isSelected ? 'bg-blue-50 ring-2 ring-blue-500 z-10 shadow-md scale-[1.01]' : dayApps.length > 0 ? 'bg-[#BFDBFE]' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-xs font-semibold ${isToday ? 'bg-brand-blue text-white w-6 h-6 rounded-full flex items-center justify-center -ml-1 -mt-1' : (isSelected ? 'text-blue-700' : 'text-gray-700')}`}>
                  {day}
                </span>
              </div>
              
              {dayApps.length > 0 && (
                <div className="mt-auto">
                  <div className="bg-white/90 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full truncate border border-blue-200 shadow-sm inline-block group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    Citas: {dayApps.length}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {nextMonthEmpty.map((_, i) => (
          <div key={`next-${i}`} className="bg-gray-100/50 p-2 flex flex-col" />
        ))}
      </div>
    </div>
  );
}
