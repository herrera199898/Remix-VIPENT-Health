/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './components/Sidebar';
import CalendarHeader from './components/CalendarHeader';
import MonthView from './components/MonthView';
import DayView from './components/DayView';
import WeekView from './components/WeekView';
import DailyAppointmentList from './components/DailyAppointmentList';
import REMReport from './components/REMReport';
import UserProfile from './components/UserProfile';
import AuditLog from './components/AuditLog';
import UserManagement from './components/UserManagement';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import PatientDetails from './components/PatientDetails';
import PatientEdit from './components/PatientEdit';
import AppointmentModal from './components/AppointmentModal';
import Login from './components/Login';
import PatientAppointmentManagementModal from './components/PatientAppointmentManagementModal';
import { APPOINTMENTS_MOCK, Patient, Appointment, parseDisplayTimeToInput, formatInputTimeToDisplay, PATIENTS_MOCK } from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('is_authenticated') === 'true';
  });
  const [view, setView] = useState<'DASHBOARD' | 'MES' | 'SEMANA' | 'DÍA' | 'LISTADO' | 'REPORTE_REM' | 'USER_PROFILE' | 'AUDIT_LOG' | 'PACIENTES' | 'PACIENTE_DETALLE' | 'PACIENTE_EDICION' | 'USUARIOS'>('DASHBOARD');
  const [patientListFilters, setPatientListFilters] = useState<{
    riskFilter?: 'Todos' | 'Alto' | 'Moderado' | 'Bajo';
    filterMode?: 'Todos' | 'Activos' | 'Inactivos' | 'Activo' | 'Inactivo';
    searchTerm?: string;
    actionFilter?: string;
    patientId?: string;
    compensationFilter?: 'Todos' | 'Compensado' | 'No compensado' | 'Sin dato';
    appointmentFilter?: 'Todos' | 'Control vigente' | 'Control vencido' | 'Sin próxima cita' | 'Inasistencia reciente';
    alertFilter?: string;
    establishmentFilter?: 'Todos' | 'Hualañé' | 'Curepto';
  } | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>(APPOINTMENTS_MOCK);
  const [selectedAppForManagement, setSelectedAppForManagement] = useState<Appointment | null>(null);
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);

  const handleOpenManagementModal = (appId: string) => {
    const targetApp = appointmentsList.find(a => a.id === appId);
    if (targetApp) {
      setSelectedAppForManagement(targetApp);
      setIsManagementModalOpen(true);
    }
  };

  const handleSaveManagedAppointment = (updatedData: { 
    date: string; 
    time: string; 
    status: string; 
    specialty: 'medico' | 'enfermera' | 'nutricionista';
    attentionType?: string;
    establishment?: 'Hualañé' | 'Curepto';
    observation?: string;
    instruction?: string;
  }) => {
    if (!selectedAppForManagement) return;
    
    const roleMap: Record<'medico' | 'enfermera' | 'nutricionista', 'MEDICO' | 'ENFERMERA' | 'NUTRICIONISTA'> = {
      medico: 'MEDICO',
      enfermera: 'ENFERMERA',
      nutricionista: 'NUTRICIONISTA'
    };
    
    const professionalNameMap: Record<'medico' | 'enfermera' | 'nutricionista', string> = {
      medico: 'Dr. Carlos Mendoza',
      enfermera: 'Enf. Camila Silva',
      nutricionista: 'Nut. María José'
    };

    setAppointmentsList(prev => prev.map(app => {
      if (app.id === selectedAppForManagement.id) {
        return {
          ...app,
          date: updatedData.date,
          time: formatInputTimeToDisplay(updatedData.time),
          status: updatedData.status,
          role: roleMap[updatedData.specialty],
          professionalName: professionalNameMap[updatedData.specialty],
          attentionType: updatedData.attentionType,
          establishment: updatedData.establishment,
          observation: updatedData.observation,
          instruction: updatedData.instruction
        };
      }
      return app;
    }));

    setIsManagementModalOpen(false);
    setSelectedAppForManagement(null);
  };

  const getInitialSpecialty = (role: string): 'medico' | 'enfermera' | 'nutricionista' => {
    const r = role?.toLowerCase();
    if (r === 'enfermera') return 'enfermera';
    if (r === 'nutricionista') return 'nutricionista';
    return 'medico';
  };


  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (view === 'MES') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'SEMANA') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (view === 'DÍA') {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
    
    if (view === 'DÍA') {
      updateSelectedDateFromDate(newDate);
    }
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'MES') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'SEMANA') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (view === 'DÍA') {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);

    if (view === 'DÍA') {
      updateSelectedDateFromDate(newDate);
    }
  };

  const updateSelectedDateFromDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = date.getDate().toString().padStart(2, '0');
    setSelectedDate(`${year}-${month}-${dayStr}`);
  };

  const handleDaySelect = (day: number) => {
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${day.toString().padStart(2, '0')}`;
    setSelectedDate(dateStr);
  };

  const handleFullDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
  };

  const handleNavigateToCalendar = (date: Date) => {
    setCurrentDate(date);
    updateSelectedDateFromDate(date);
    setView('LISTADO'); 
  };

  const handleViewPatientDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setView('PACIENTE_DETALLE');
  };

  const filteredAppointments = selectedDate 
    ? appointmentsList.filter(a => a.date === selectedDate)
    : [];

  const isCalendarView = ['MES', 'SEMANA', 'DÍA'].includes(view);

  const handleViewChange = (newView: any, params?: any) => {
    const isCalendarView = ['MES', 'SEMANA', 'DÍA'].includes(newView);
    const wasCalendarView = ['MES', 'SEMANA', 'DÍA'].includes(view);
    
    setView(newView);
    if (newView === 'PACIENTES') {
      if (params) {
        setPatientListFilters(params);
      } else {
        setPatientListFilters(undefined);
      }
    }
    
    // Reset to "today" when changing between calendar formats
    if (isCalendarView && (newView !== view || !wasCalendarView)) {
      const today = new Date();
      setCurrentDate(today);
      updateSelectedDateFromDate(today);
    }
  };

  const handleCalendarHeaderDateChange = (date: Date) => {
    setCurrentDate(date);
    updateSelectedDateFromDate(date);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('is_authenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('is_authenticated');
    setView('DASHBOARD');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f4f6]">
      <Sidebar currentView={view} onNavigate={handleViewChange} onLogout={handleLogout} />
      
      <main className="flex-1 flex flex-col p-6 h-full overflow-hidden bg-calendar-bg">
        <div className="w-full h-full flex flex-col max-w-[1536px] xl:max-w-[1680px] 2xl:max-w-[1850px] mx-auto">
          <div className="flex-1 flex flex-col min-h-0 relative">
            <AnimatePresence mode="wait">
              {isCalendarView && (
                <motion.div 
                   key="CALENDAR_WORKSPACE"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  <CalendarHeader 
                    view={view as 'MES' | 'SEMANA' | 'DÍA'} 
                    setView={handleViewChange} 
                    currentDate={currentDate}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onDateChange={handleCalendarHeaderDateChange}
                    selectedDateStr={selectedDate}
                    appointmentsCount={selectedDate ? filteredAppointments.length : undefined}
                  />
                  <div className="flex-1 flex flex-col min-h-0 relative">
                    <AnimatePresence mode="wait">
                      {view === 'MES' && (
                        <motion.div 
                          key="SUB_MES"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="flex-1 flex flex-col min-h-0"
                        >
                          <MonthView appointments={appointmentsList} currentDate={currentDate} onDayClick={handleDaySelect} selectedDateStr={selectedDate} />
                        </motion.div>
                      )}
                      {view === 'DÍA' && (
                        <motion.div 
                          key="SUB_DÍA"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.02 }}
                          transition={{ duration: 0.25 }}
                          className="flex-1 flex flex-col min-h-0"
                        >
                          <DayView appointments={appointmentsList} currentDate={currentDate} onManageAppointment={handleOpenManagementModal} />
                        </motion.div>
                      )}
                      {view === 'SEMANA' && (
                        <motion.div 
                          key="SUB_SEMANA"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.3 }}
                          className="flex-1 flex flex-col min-h-0"
                        >
                          <WeekView appointments={appointmentsList} currentDate={currentDate} selectedDateStr={selectedDate} onDaySelect={handleFullDateSelect} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
              {view === 'LISTADO' && selectedDate && (
                <motion.div 
                  key="LISTADO"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  <DailyAppointmentList 
                    appointments={filteredAppointments} 
                    date={selectedDate} 
                    onBack={() => handleViewChange('MES')} 
                    onManageAppointment={handleOpenManagementModal}
                    onUpdateStatus={(appId, newStatus) => {
                      setAppointmentsList(prev => prev.map(app => 
                        app.id === appId ? { ...app, status: newStatus } : app
                      ));
                    }}
                    onViewPatient={(rut) => {
                      const cleanRut = rut.replace(/\D/g, '').toUpperCase();
                      const patientObj = PATIENTS_MOCK.find(p => p.rut.replace(/\D/g, '').toUpperCase() === cleanRut);
                      if (patientObj) {
                        setSelectedPatient(patientObj);
                        setView('PACIENTE_DETALLE');
                      } else {
                        alert("Paciente no registrado en el listado PSCV.");
                      }
                    }}
                  />
                </motion.div>
              )}
              {view === 'PACIENTES' && (
                <motion.div key="PACIENTES" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col min-h-0">
                  <PatientList onViewDetails={handleViewPatientDetails} initialFilters={patientListFilters} />
                </motion.div>
              )}
              {view === 'PACIENTE_DETALLE' && selectedPatient && (
                <motion.div key="PACIENTE_DETALLE" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col min-h-0">
                  <PatientDetails 
                    patient={selectedPatient} 
                    onEditProfile={() => setView('PACIENTE_EDICION')} 
                    onBack={() => setView('PACIENTES')}
                  />
                </motion.div>
              )}
              {view === 'PACIENTE_EDICION' && selectedPatient && (
                <motion.div key="PACIENTE_EDICION" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col min-h-0">
                  <PatientEdit patient={selectedPatient} onCancel={() => setView('PACIENTE_DETALLE')} />
                </motion.div>
              )}
              {view === 'REPORTE_REM' && (
                <motion.div key="REPORTE_REM" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col min-h-0">
                  <REMReport onNavigate={(targetView, filters) => {
                    setView(targetView as any);
                    if (filters) {
                      setPatientListFilters(filters);
                    }
                  }} />
                </motion.div>
              )}
              {view === 'USER_PROFILE' && <motion.div key="USER_PROFILE" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col min-h-0"><UserProfile /></motion.div>}
              {view === 'AUDIT_LOG' && <motion.div key="AUDIT_LOG" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col min-h-0"><AuditLog /></motion.div>}
              {view === 'USUARIOS' && <motion.div key="USUARIOS" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col min-h-0"><UserManagement /></motion.div>}
              {view === 'DASHBOARD' && (
                <motion.div 
                  key="DASHBOARD"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  <Dashboard 
                    onNavigateToCalendar={handleNavigateToCalendar} 
                    onNavigate={handleViewChange}
                    onNewAppointment={() => {
                      const todayStr = new Date().toISOString().split('T')[0];
                      setSelectedDate(todayStr);
                      setIsAppointmentModalOpen(true);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Placeholder for other views */}
            {!['DASHBOARD', 'MES', 'SEMANA', 'DÍA', 'LISTADO', 'REPORTE_REM', 'USER_PROFILE', 'AUDIT_LOG', 'PACIENTES', 'PACIENTE_DETALLE', 'PACIENTE_EDICION', 'USUARIOS'].includes(view) && (
              <div className="flex-1 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 font-medium italic shadow-sm">
                Vista de {view.toLowerCase()} en desarrollo...
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedDate && (
        <AppointmentModal 
          isOpen={isAppointmentModalOpen} 
          onClose={() => setIsAppointmentModalOpen(false)} 
          dateStr={selectedDate} 
          onSave={(newApp) => {
            setAppointmentsList(prev => [...prev, newApp]);
            setIsAppointmentModalOpen(false);
          }}
        />
      )}

      {isManagementModalOpen && selectedAppForManagement && (
        <PatientAppointmentManagementModal
          isOpen={isManagementModalOpen}
          onClose={() => {
            setIsManagementModalOpen(false);
            setSelectedAppForManagement(null);
          }}
          patientName={selectedAppForManagement.patientName}
          patientRut={selectedAppForManagement.rut}
          initialSpecialty={getInitialSpecialty(selectedAppForManagement.role)}
          initialDate={selectedAppForManagement.date}
          initialTime={parseDisplayTimeToInput(selectedAppForManagement.time)}
          initialStatus={selectedAppForManagement.status}
          initialAttentionType={selectedAppForManagement.attentionType}
          initialEstablishment={selectedAppForManagement.establishment}
          initialObservation={selectedAppForManagement.observation}
          initialInstruction={selectedAppForManagement.instruction}
          onSave={handleSaveManagedAppointment}
        />
      )}
    </div>
  );
}

