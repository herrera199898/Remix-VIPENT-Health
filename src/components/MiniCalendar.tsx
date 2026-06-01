import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Appointment } from '../types';

interface MiniCalendarProps {
  onDateClick: (date: Date) => void;
  appointments: Appointment[];
  selectedDate?: Date | null;
}

export default function MiniCalendar({ onDateClick, appointments, selectedDate }: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date()); 

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const getDayAppointmentsCount = (d: number) => {
    const checkDate = new Date(year, month, d).toISOString().split('T')[0];
    return appointments.filter(app => app.date === checkDate).length;
  };

  const days = [];
  const numDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  // Add empty slots for the first week
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square w-full max-w-[32px] mx-auto" />);
  }

  for (let d = 1; d <= numDays; d++) {
    const dateObj = new Date(year, month, d);
    const isToday = new Date().toDateString() === dateObj.toDateString();

    days.push(
      <button
        key={d}
        onClick={() => onDateClick(dateObj)}
        className={`aspect-square w-full max-w-[32px] mx-auto flex items-center justify-center rounded-full transition-all text-xs font-bold
          ${isToday ? 'bg-brand-blue text-white shadow-sm' : 'hover:bg-blue-50 text-gray-700'}
        `}
      >
        {d}
      </button>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-2">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-blue">
          {monthNames[month]} {year}
        </h4>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
            <ChevronLeft size={14} />
          </button>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 w-full text-center">
        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
          <div key={`${d}-${i}`} className="text-[8px] font-black text-gray-300 uppercase py-1">
            {d}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
}
