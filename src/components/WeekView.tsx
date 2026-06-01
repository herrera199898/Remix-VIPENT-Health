import { Appointment, ProfessionalRole } from '../types';

interface WeekViewProps {
  appointments: Appointment[];
  currentDate: Date;
  selectedDateStr?: string | null;
  onDaySelect?: (dateStr: string) => void;
}

export default function WeekView({ appointments, currentDate, selectedDateStr, onDaySelect }: WeekViewProps) {
  const getDaysOfWeek = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Sunday
    
    const days = [];
    const names = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push({
        name: names[i],
        dayOfMonth: d.getDate(),
        dateStr: `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
      });
    }
    return days;
  };

  const daysOfWeek = getDaysOfWeek(currentDate);

  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 AM', 
    '13:00 PM', '14:00 PM', '15:00 PM', '16:00 PM', '17:00 PM', '18:00 PM'
  ];

  const getAppointmentsForDayAndTime = (dateStr: string, time: string) => {
    return appointments.filter(a => a.date === dateStr && a.time === time);
  };

  const getRoleColors = (role: ProfessionalRole) => {
    switch (role) {
      case 'MEDICO':
        return {
          bg: 'bg-blue-50',
          border: 'border-l-4 border-blue-500',
          text: 'text-blue-700',
          roleText: 'text-blue-500'
        };
      case 'NUTRICIONISTA':
        return {
          bg: 'bg-green-50',
          border: 'border-l-4 border-green-500',
          text: 'text-green-700',
          roleText: 'text-green-500'
        };
      case 'ENFERMERA':
        return {
          bg: 'bg-orange-50',
          border: 'border-l-4 border-orange-400',
          text: 'text-orange-700',
          roleText: 'text-orange-500'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-l-4 border-gray-400',
          text: 'text-gray-700',
          roleText: 'text-gray-500'
        };
    }
  };

  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-b-lg flex flex-col overflow-hidden">
      {/* Week Header */}
      <div className="grid grid-cols-[100px_1fr] bg-slate-100/80 border-b border-gray-200 shrink-0">
        <div className="border-r border-gray-200" />
        <div className="grid grid-cols-7">
          {daysOfWeek.map((day) => {
            const today = new Date();
            const isToday = 
              today.getFullYear() === new Date(day.dateStr + 'T12:00:00').getFullYear() &&
              today.getMonth() === new Date(day.dateStr + 'T12:00:00').getMonth() &&
              today.getDate() === day.dayOfMonth;
            const isSelected = selectedDateStr === day.dateStr;

            return (
              <button 
                key={day.name} 
                onClick={() => onDaySelect?.(day.dateStr)}
                className={`py-3 px-3 text-[10px] font-bold uppercase tracking-tight border-r border-gray-200 last:border-r-0 flex flex-col items-center justify-center transition-colors
                  ${isSelected ? 'bg-blue-100 border-b-2 border-b-brand-blue' : 'hover:bg-slate-200/50'}
                  ${isToday ? 'text-blue-600' : 'text-gray-400'}`}
              >
                <span className={isSelected ? 'text-brand-blue' : ''}>{day.name}</span>
                <span className={`mt-0.5 text-sm ${
                  isToday ? 'bg-brand-blue text-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm' : 
                  isSelected ? 'text-brand-blue font-black' : 'text-gray-700'
                }`}>
                  {day.dayOfMonth}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative min-h-0">
        <div className="grid grid-cols-[100px_1fr] h-full min-h-[880px]">
          {/* Time column labels */}
          <div className="flex flex-col bg-white">
            {timeSlots.map((time) => (
              <div key={time} className="h-20 border-r border-b border-gray-50 flex items-start justify-center pt-2.5">
                <span className="text-[10px] font-medium text-gray-400/80 uppercase tabular-nums">{time}</span>
              </div>
            ))}
          </div>

          {/* Day columns grid */}
          <div className="grid grid-cols-7 relative h-full">
            {/* Background grid lines */}
            {daysOfWeek.map((day, dayIdx) => (
              <div 
                key={dayIdx} 
                className={`border-r border-gray-100 h-full last:border-r-0 relative cursor-pointer hover:bg-slate-50/50 transition-colors ${selectedDateStr === day.dateStr ? 'bg-blue-50/30' : ''}`}
                onClick={() => onDaySelect?.(day.dateStr)}
              >
                {timeSlots.map((time) => (
                  <div key={time} className={`h-20 border-b border-gray-50 w-full ${selectedDateStr === day.dateStr ? 'border-blue-100/50' : ''}`} />
                ))}
              </div>
            ))}

            {/* Absolute positioned appointments */}
            <div className="absolute inset-0 grid grid-cols-7 pointer-events-none">
              {daysOfWeek.map((day, dayIdx) => (
                <div 
                  key={dayIdx} 
                  className="relative h-full pointer-events-auto cursor-pointer"
                  onClick={() => onDaySelect?.(day.dateStr)}
                >
                  {timeSlots.map((time, timeIdx) => {
                    const apps = getAppointmentsForDayAndTime(day.dateStr, time);
                    return apps.map((app) => {
                      const colors = getRoleColors(app.role);
                      return (
                          <div
                            key={app.id}
                            className={`absolute left-1.5 right-1.5 p-2 px-3 rounded-md shadow-sm transition-all hover:shadow-md cursor-pointer ${colors.bg} ${colors.border}`}
                            style={{
                              top: `${timeIdx * 80 + 4}px`,
                              height: '72px',
                              zIndex: 10
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onDaySelect?.(day.dateStr);
                            }}
                          >
                            <div className={`text-[9px] font-bold uppercase mb-0.5 tracking-tight ${colors.roleText}`}>
                              {app.role}
                            </div>
                            <div className={`text-[10px] font-black uppercase leading-tight break-words ${colors.text}`}>
                              {app.professionalName}
                            </div>
                          </div>
                      );
                    });
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
