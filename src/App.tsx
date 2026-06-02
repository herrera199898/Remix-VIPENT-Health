/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarDays } from 'lucide-react';
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
import UserManagementV2 from './components/UserManagementV2';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import PatientDetails from './components/PatientDetails';
import PatientEdit from './components/PatientEdit';
import AppointmentModal from './components/AppointmentModal';
import Login from './components/Login';
import PatientAppointmentManagementModal from './components/PatientAppointmentManagementModal';
import { APPOINTMENTS_MOCK, Patient, Appointment, parseDisplayTimeToInput, formatInputTimeToDisplay, PATIENTS_MOCK, User } from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('is_authenticated') === 'true';
  });
  const [view, setView] = useState<'DASHBOARD' | 'MES' | 'SEMANA' | 'DÍA' | 'LISTADO' | 'REPORTE_REM' | 'USER_PROFILE' | 'AUDIT_LOG' | 'PACIENTES' | 'PACIENTE_DETALLE' | 'PACIENTE_EDICION' | 'USUARIOS' | 'USUARIOS_V2'>('DASHBOARD');
  const [usersV2, setUsersV2] = useState<User[]>(() => {
    const saved = localStorage.getItem('vipent_users_mock');
    let mockUsers: any[] = [];
    if (saved) {
      try {
        mockUsers = JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing vipent_users_mock in V2", e);
      }
    }
    
    if (!mockUsers || mockUsers.length === 0) {
      mockUsers = [
        {
          id: 'u-1',
          fullName: 'Sofía Alarcón Peña',
          email: 'salarcon@vipent.cl',
          rut: '14.892.428-K',
          role: 'Administrador',
          specialty: 'Director de Informática',
          establishment: 'Ambos',
          status: 'Activo',
          lastAccess: 'Hoy, 15:42',
          phone: '+56987654321',
          notes: 'Administradora general del ecosistema VIPENT.'
        },
        {
          id: 'u-2',
          fullName: 'Roberto Gómez Pardo',
          email: 'rgomez@hualane.cl',
          rut: '12.345.678-9',
          role: 'Clínico',
          specialty: 'Médico Coordinador PSCV',
          establishment: 'Hualañé',
          status: 'Activo',
          lastAccess: 'Ayer, 09:12',
          phone: '+56912345678',
          notes: 'Coordina piloto de APS en establecimiento Hualañé.'
        },
        {
          id: 'u-3',
          fullName: 'Patricia Rojas Silva',
          email: 'projas@curepto.cl',
          rut: '15.678.910-K',
          role: 'Clínico',
          specialty: 'Enfermera Coordinadora',
          establishment: 'Curepto',
          status: 'Activo',
          lastAccess: '24 May 2026',
          phone: '+56923456789',
          notes: 'Coordinadora de salud cardiovascular Curepto.'
        },
        {
          id: 'u-4',
          fullName: 'Carlos Mendoza Aliste',
          email: 'cmendoza@hualane.cl',
          rut: '16.543.210-2',
          role: 'Clínico',
          specialty: 'Médico Cirujano',
          establishment: 'Hualañé',
          status: 'Activo',
          lastAccess: 'Hoy, 11:20',
          phone: '+56934567890',
          notes: 'Médico clínico del Programa Salud Cardiovascular.'
        },
        {
          id: 'u-5',
          fullName: 'Camila Silva Torres',
          email: 'csilva@curepto.cl',
          rut: '17.890.123-4',
          role: 'Clínico',
          specialty: 'Enfermera',
          establishment: 'Curepto',
          status: 'Activo',
          lastAccess: 'Hoy, 08:05',
          phone: '+56945678901',
          notes: 'Profesional de enfermería, atención domiciliaria y box.'
        },
        {
          id: 'u-6',
          fullName: 'María José Flores',
          email: 'mjflores@hualane.cl',
          rut: '18.234.567-8',
          role: 'Clínico',
          specialty: 'Nutricionista',
          establishment: 'Hualañé',
          status: 'Pendiente',
          lastAccess: 'Sin acceso registrado',
          phone: '+56956789012',
          notes: 'Nutricionista del Programa Salud Cardiovascular.'
        },
        {
          id: 'u-7',
          fullName: 'Juan Carlos Plaza',
          email: 'jplaza@hualane.cl',
          rut: '13.412.569-4',
          role: 'Clínico',
          specialty: 'Administrador de SOME',
          establishment: 'Hualañé',
          status: 'Inactivo',
          lastAccess: '12 Abr 2026',
          phone: '+56967890123',
          notes: 'Asignación de cupos y agendas de morbilidad PSCV.'
        },
        {
          id: 'u-8',
          fullName: 'Gloria Mandiola Fuentes',
          email: 'gmandiola@minsal.cl',
          rut: '10.987.654-3',
          role: 'Clínico',
          specialty: 'Auditor Externo',
          establishment: 'Ambos',
          status: 'Bloqueado',
          lastAccess: '10 May 2026',
          phone: '+56978901234',
          notes: 'Auditoría externa y validación de cobertura REM.'
        }
      ];
      localStorage.setItem('vipent_users_mock', JSON.stringify(mockUsers));
    }

    return mockUsers.map((mu: any) => {
      let name = mu.fullName;
      if (name === 'Usuario Administrador') {
        name = 'Sofía Alarcón Peña';
      }
      name = name.replace(/^(Dr\.|Enf\.|Nut\.)\s+/i, '');

      let role: 'Medico' | 'Enfermera' | 'Admin' = 'Medico';
      const valSpecialty = (mu.specialty || '').toLowerCase();
      const valRole = (mu.role || '').toLowerCase();
      
      if (valRole === 'administrador') {
        role = 'Admin';
      } else if (valSpecialty.includes('enfermera') || valSpecialty.includes('nutricionista') || mu.email.includes('csilva') || mu.email.includes('projas')) {
        role = 'Enfermera';
      } else {
        role = 'Medico';
      }

      let status: 'Active' | 'Inactive' = 'Active';
      if (mu.status === 'Inactivo' || mu.status === 'Bloqueado') {
        status = 'Inactive';
      }

      return {
        id: mu.id,
        name,
        email: mu.email,
        role,
        status
      };
    });
  });

  const handleAddUserV2 = (newUser: Omit<User, 'id'>) => {
    const userWithId: User = {
      ...newUser,
      id: `u-${Date.now()}`
    };
    
    setUsersV2(prev => {
      const updatedList = [...prev, userWithId];
      
      const saved = localStorage.getItem('vipent_users_mock');
      let mockList: any[] = [];
      if (saved) {
        try { mockList = JSON.parse(saved); } catch (e) {}
      }
      
      const newMockItem = {
        id: userWithId.id,
        fullName: userWithId.name,
        email: userWithId.email,
        rut: `${Math.floor(Math.random() * 10 + 10)}.${Math.floor(Math.random() * 900 + 100)}.${Math.floor(Math.random() * 900 + 100)}-${Math.random() > 0.5 ? 'K' : Math.floor(Math.random() * 9)}`,
        role: userWithId.role === 'Admin' ? 'Administrador' : 'Clínico',
        specialty: userWithId.role === 'Medico' ? 'Médico Cirujano' : userWithId.role === 'Enfermera' ? 'Enfermera' : 'Administrador',
        establishment: 'Ambos',
        status: userWithId.status === 'Active' ? 'Activo' : 'Inactivo',
        lastAccess: 'Hoy, ' + new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
        phone: '+56900055500',
        notes: 'Creado desde Usuarios versión 2.'
      };
      
      localStorage.setItem('vipent_users_mock', JSON.stringify([...mockList, newMockItem]));
      return updatedList;
    });
  };

  const handleEditUserV2 = (id: string, updated: Omit<User, 'id'>) => {
    setUsersV2(prev => {
      const updatedList = prev.map(u => u.id === id ? { ...u, ...updated } : u);
      
      const saved = localStorage.getItem('vipent_users_mock');
      if (saved) {
        try {
          let mockList = JSON.parse(saved);
          if (Array.isArray(mockList)) {
            mockList = mockList.map(mu => {
              if (mu.id === id) {
                return {
                  ...mu,
                  fullName: updated.name,
                  email: updated.email,
                  role: updated.role === 'Admin' ? 'Administrador' : 'Clínico',
                  status: updated.status === 'Active' ? 'Activo' : 'Inactivo',
                };
              }
              return mu;
            });
            localStorage.setItem('vipent_users_mock', JSON.stringify(mockList));
          }
        } catch (e) {}
      }
      
      return updatedList;
    });
  };

  const handleDeleteUserV2 = (id: string) => {
    setUsersV2(prev => {
      const updatedList = prev.filter(u => u.id !== id);
      
      const saved = localStorage.getItem('vipent_users_mock');
      if (saved) {
        try {
          let mockList = JSON.parse(saved);
          if (Array.isArray(mockList)) {
            mockList = mockList.filter(mu => mu.id !== id);
            localStorage.setItem('vipent_users_mock', JSON.stringify(mockList));
          }
        } catch (e) {}
      }
      
      return updatedList;
    });
  };
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
                  className="flex-1 flex flex-col min-h-0 space-y-6"
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
              {view === 'USUARIOS_V2' && (
                <motion.div key="USUARIOS_V2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col min-h-0">
                  <UserManagementV2 
                    users={usersV2} 
                    onAddUser={handleAddUserV2} 
                    onEditUser={handleEditUserV2} 
                    onDeleteUser={handleDeleteUserV2} 
                  />
                </motion.div>
              )}
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
            {!['DASHBOARD', 'MES', 'SEMANA', 'DÍA', 'LISTADO', 'REPORTE_REM', 'USER_PROFILE', 'AUDIT_LOG', 'PACIENTES', 'PACIENTE_DETALLE', 'PACIENTE_EDICION', 'USUARIOS', 'USUARIOS_V2'].includes(view) && (
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

