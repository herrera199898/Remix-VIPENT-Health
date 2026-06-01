import React, { useState, useEffect } from 'react';
import { Search, Download, ChevronLeft, ChevronRight, FileText, Heart, X, SlidersHorizontal, ChevronDown, ChevronUp, MoreVertical, Calendar, Activity, Info, AlertTriangle, CheckCircle, User, Eye } from 'lucide-react';
import { PATIENTS_MOCK, Patient } from '../types';

export const BulletListSvgIcon = ({ className = "w-5 h-5", size, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => {
  const finalSize = size || 20;
  return (
    <svg 
      viewBox="0 -3.5 29 29" 
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
      style={{ width: finalSize, height: finalSize }}
      {...props}
    >
      <g transform="translate(-571.000000, -210.000000)">
        <path d="M598,227 L582,227 C580.896,227 580,227.896 580,229 C580,230.104 580.896,231 582,231 L598,231 C599.104,231 600,230.104 600,229 C600,227.896 599.104,227 598,227 L598,227 Z M598,219 L582,219 C580.896,219 580,219.896 580,221 C580,222.104 580.896,223 582,223 L598,223 C599.104,223 600,222.104 600,221 C600,219.896 599.104,219 598,219 L598,219 Z M582,215 L598,215 C599.104,215 600,214.104 600,213 C600,211.896 599.104,211 598,211 L582,211 C580.896,211 580,211.896 580,213 C580,214.104 580.896,215 582,215 L582,215 Z M574,226 C572.343,226 571,227.343 571,229 C571,230.657 572.343,232 574,232 C575.657,232 577,230.657 577,229 C577,227.343 575.657,226 574,226 L574,226 Z M574,218 C572.343,218 571,219.343 571,221 C571,222.657 572.343,224 574,224 C575.657,224 577,222.657 577,221 C577,219.343 575.657,218 574,218 L574,218 Z M574,210 C572.343,210 571,211.343 571,213 C571,214.657 572.343,216 574,216 C575.657,216 577,214.657 577,213 C577,211.343 575.657,210 574,210 L574,210 Z" />
      </g>
    </svg>
  );
};

export function formatShortName(name: string): string {
  if (!name) return '';
  const cleanName = name.trim();
  const words = cleanName.split(/\s+/);
  
  if (words.length <= 1) {
    return cleanName.toUpperCase();
  }
  
  // Checklist for Chilean format: PATERNO MATERNO NOMBRES
  // e.g., ABUD VALENZUELA CRISTIAN ALEJANDRO -> CRISTIAN ABUD
  const isUppercaseFormat = cleanName === cleanName.toUpperCase() && words.length >= 3;
  
  if (isUppercaseFormat) {
    const lastName = words[0];
    const firstName = words[2];
    if (firstName && lastName) {
      return `${firstName} ${lastName}`.toUpperCase();
    }
  }
  
  // Otherwise, standard GIVEN_NAME SURNAME (e.g., María López) -> MARÍA LÓPEZ
  const firstName = words[0];
  const lastName = words[1] || words[words.length - 1];
  return `${firstName} ${lastName}`.toUpperCase();
}

export function getCompensationSummary(p: Patient): {
  label: string;
  tone: 'success' | 'danger' | 'neutral';
  details: string;
} {
  const cond = p.compensationByCondition;
  if (!cond) {
    if (p.compensationStatus === 'No compensado') {
      return { label: 'No compensado HTA', tone: 'danger', details: 'Hipertensión arterial fuera de metas' };
    }
    return { label: 'Compensado', tone: 'success', details: 'Parámetros controlados' };
  }

  const hta = cond.hta || 'No aplica';
  const dm2 = cond.dm2 || 'No aplica';

  const isHtaNoComp = hta === 'No compensado';
  const isDm2NoComp = dm2 === 'No compensado';

  if (isHtaNoComp && isDm2NoComp) {
    return { label: 'No compensado HTA + DPN', tone: 'danger', details: 'Hipertensión y Diabetes (DPN) fuera de metas' };
  }
  if (isHtaNoComp) {
    return { label: 'No compensado HTA', tone: 'danger', details: 'Hipertensión arterial fuera de metas' };
  }
  if (isDm2NoComp) {
    return { label: 'No compensado DPN', tone: 'danger', details: 'Diabetes (DPN) fuera de metas' };
  }

  return { label: 'Compensado', tone: 'success', details: 'Parámetros cardiovasculares controlados' };
}

interface PatientListProps {
  onViewDetails: (patient: Patient) => void;
  initialFilters?: { 
    riskFilter?: 'Todos' | 'Alto' | 'Moderado' | 'Bajo'; 
    filterMode?: 'Todos' | 'Activos' | 'Inactivos' | 'Activo' | 'Inactivo'; 
    searchTerm?: string;
    actionFilter?: string;
    patientId?: string;
    compensationFilter?: string;
    appointmentFilter?: 'Todos' | 'Control vigente' | 'Control vencido' | 'Sin próxima cita' | 'Inasistencia reciente';
    alertFilter?: string;
    establishmentFilter?: 'Todos' | 'Hualañé' | 'Curepto';
  };
}

export default function PatientList({ onViewDetails, initialFilters }: PatientListProps) {
  // Filters State
  const [searchTerm, setSearchTerm] = useState(initialFilters?.searchTerm || '');
  const [filterMode, setFilterMode] = useState<'Todos' | 'Activo' | 'Inactivo'>(() => {
    const mode = initialFilters?.filterMode;
    if (mode === 'Activos' || mode === 'Activo') return 'Activo';
    if (mode === 'Inactivos' || mode === 'Inactivo') return 'Inactivo';
    return 'Todos';
  });
  const [riskFilter, setRiskFilter] = useState<'Todos' | 'Alto' | 'Moderado' | 'Bajo'>(initialFilters?.riskFilter || 'Todos');
  const [compensationFilter, setCompensationFilter] = useState<string>(initialFilters?.compensationFilter || 'Todos');
  const [appointmentFilter, setAppointmentFilter] = useState<'Todos' | 'Control vigente' | 'Control vencido' | 'Sin próxima cita' | 'Inasistencia reciente'>(initialFilters?.appointmentFilter || 'Todos');
  const [establishmentFilter, setEstablishmentFilter] = useState<'Todos' | 'Hualañé' | 'Curepto'>(initialFilters?.establishmentFilter || 'Todos');
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<string[]>([]);
  const [pendingExamsFilter, setPendingExamsFilter] = useState<string>('Todos');
  const [hasAlertsFilter, setHasAlertsFilter] = useState<boolean>(false);
  const [priorityFilter, setPriorityFilter] = useState<'Todos' | 'Normal' | 'Requiere revisión' | 'Requiere rescate' | 'Sin próxima cita' | 'Examen pendiente'>('Todos');

  // Layout UI State
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [drawerPatient, setDrawerPatient] = useState<Patient | null>(null);
  const [highlightedPatientId, setHighlightedPatientId] = useState<string | null>(null);
  const [activeDropdownPatientId, setActiveDropdownPatientId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Hook to capture navigation from Dashboard
  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.searchTerm) setSearchTerm(initialFilters.searchTerm);
      if (initialFilters.riskFilter) setRiskFilter(initialFilters.riskFilter);
      if (initialFilters.filterMode) {
        const mode = initialFilters.filterMode;
        if (mode === 'Activos' || mode === 'Activo') setFilterMode('Activo');
        else if (mode === 'Inactivos' || mode === 'Inactivo') setFilterMode('Inactivo');
        else setFilterMode('Todos');
      }
      if (initialFilters.establishmentFilter) setEstablishmentFilter(initialFilters.establishmentFilter);
      if (initialFilters.compensationFilter) setCompensationFilter(initialFilters.compensationFilter);
      if (initialFilters.appointmentFilter) setAppointmentFilter(initialFilters.appointmentFilter);
      
      if (initialFilters.actionFilter) {
        if (initialFilters.actionFilter === 'SIN_PROXIMA_CITA') {
          setAppointmentFilter('Sin próxima cita');
        } else if (initialFilters.actionFilter === 'CON_ALERTAS') {
          setHasAlertsFilter(true);
        } else if (initialFilters.actionFilter === 'RESCATE_INASISTENCIA') {
          setAppointmentFilter('Inasistencia reciente');
        }
      }
      if (initialFilters.alertFilter) setHasAlertsFilter(true);
      if (initialFilters.patientId) {
        setHighlightedPatientId(initialFilters.patientId);
        // Find and pre-open Patient in clinical Summary Drawer
        const match = PATIENTS_MOCK.find(p => p.id === initialFilters.patientId);
        if (match) {
          setDrawerPatient(match);
        }
      }
    }
  }, [initialFilters]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterMode, riskFilter, compensationFilter, appointmentFilter, establishmentFilter, selectedDiagnoses, pendingExamsFilter, hasAlertsFilter, priorityFilter]);

  // Close active dropdowns when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDropdownPatientId(null);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  // Normalizer helper of compensationStatus
  const getCompStatus = (p: Patient) => {
    return p.compensationStatus || 'Sin dato';
  };

  // State calculations
  const getEstadoPscv = (p: Patient) => {
    if (p.status === 'Inactivo') return 'Inactivo';
    return 'Activo';
  };

  const getPriorityInfo = (p: Patient) => {
    if (p.alerts?.some(a => a.toLowerCase().includes('abandono') || a.toLowerCase().includes('inasistencia') || a.toLowerCase().includes('rescate'))) {
      return { label: 'Requiere rescate', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    }
    if (p.nextAppointmentDate === 'Sin cita') {
      return { label: 'Sin próxima cita', color: 'bg-amber-50 text-amber-800 border-amber-200' };
    }
    if (p.alerts?.some(a => a.toLowerCase().includes('vencido'))) {
      return { label: 'Requiere revisión', color: 'bg-orange-50 text-orange-700 border-orange-200' };
    }
    if (p.pendingExams && p.pendingExams.length > 0) {
      return { label: 'Examen pendiente', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    }
    return { label: 'Normal', color: 'bg-slate-50 text-slate-600 border-slate-200' };
  };

  const calculateAge = (birthDateStr?: string) => {
    if (!birthDateStr) return 'N/E';
    try {
      const parts = birthDateStr.split('/');
      if (parts.length === 3) {
        const year = parseInt(parts[2], 10);
        return `${2026 - year} años`; // Calculated against context year 2026
      }
    } catch (e) {}
    return 'N/E';
  };

  const getClinicalMeasurements = (p: Patient) => {
    const cond = p.compensationByCondition;
    const htaStatus = cond?.hta || 'No aplica';
    const dm2Status = cond?.dm2 || 'No aplica';

    let pa = 'No aplica';
    if (htaStatus === 'Compensado') {
      pa = '124/80 mmHg (Reciente)';
    } else if (htaStatus === 'No compensado') {
      if (p.id === '1') pa = '158/98 mmHg (12/05/2026)';
      else if (p.id === '2') pa = '148/92 mmHg (20/01/2026)';
      else if (p.id === '5') pa = '146/94 mmHg (21/05/2026)';
      else if (p.id === '11') pa = '152/94 mmHg (22/03/2026)';
      else pa = '148/92 mmHg (Reciente)';
    }

    let hba1c = 'No aplica';
    if (dm2Status === 'Compensado') {
      if (p.id === '3') hba1c = '6.4% (24/04/2026)';
      else if (p.id === '11') hba1c = '6.8% (22/03/2026)';
      else hba1c = '6.6% (Reciente)';
    } else if (dm2Status === 'No compensado') {
      if (p.id === '1') hba1c = '8.7% (12/05/2026)';
      else if (p.id === '10') hba1c = '8.2% (08/04/2026)';
      else hba1c = '8.4% (Reciente)';
    }

    let imc = '24.2 (Normal)';
    if (p.diagnoses?.includes('Obesidad')) {
      if (p.id === '1') imc = '31.2 (Obesidad Grado I)';
      else if (p.id === '5') imc = '30.5 (Obesidad)';
      else if (p.id === '12') imc = '31.8 (Obesidad Grado I)';
      else imc = '30.8 (Obesidad)';
    } else if (p.diagnoses?.includes('Sobrepeso') || p.id === '3') {
      imc = '28.1 (Sobrepeso)';
    } else if (p.id === '10' || p.id === '11') {
      imc = '27.4 (Sobrepeso)';
    }

    let tabaco = 'Nunca ha fumado';
    if (p.id === '1') tabaco = 'Activo (10 cig/día)';
    else if (p.id === '10') tabaco = 'Ex-fumador';

    let ldl = '96 mg/dL (Reciente)';
    if (p.id === '1') ldl = '142 mg/dL (12/05/2026)';
    else if (p.id === '2') ldl = '112 mg/dL (20/01/2026)';
    else if (p.id === '3') ldl = '88 mg/dL (24/04/2026)';
    else if (p.id === '10') ldl = '118 mg/dL (08/04/2026)';
    else if (p.id === '11') ldl = '105 mg/dL (22/03/2026)';
    else if (p.id === '12') ldl = '134 mg/dL (12/04/2026)';
    else if (p.id === '13') ldl = '145 mg/dL (15/04/2026)';

    let renal = '88 ml/min/1.73m² (Reciente)';
    if (p.id === '1') renal = '68 ml/min/1.73m² (12/05/2026)';
    else if (p.id === '2') renal = '94 ml/min/1.73m² (20/01/2026)';
    else if (p.id === '3') renal = '82 ml/min/1.73m² (24/04/2026)';
    else if (p.id === '10') renal = '54 ml/min/1.73m² (08/04/2026)';
    else if (p.id === '11') renal = '78 ml/min/1.73m² (22/03/2026)';
    else if (p.id === '12') renal = '84 ml/min/1.73m² (12/04/2026)';
    else if (p.id === '13') renal = '91 ml/min/1.73m² (15/04/2026)';

    return { pa, hba1c, imc, tabaco, ldl, renal };
  };

  const getDaysSummary = (p: Patient) => {
    if (p.nextAppointmentDate === 'Sin cita') {
      return { status: 'overdue', label: 'Sin cita agendada', text: 'Requiere llamada de agendamiento' };
    }
    
    try {
      const parts = p.nextAppointmentDate ? p.nextAppointmentDate.split('-') : [];
      if (parts.length === 3) {
        const nextDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        const now = new Date(2026, 4, 30); // Timeline base context May 2026
        
        const diffTime = nextDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0) {
          return { status: 'expired', label: `Control Vencido (-${Math.abs(diffDays)}d)`, text: `Venció el ${p.nextAppointmentDate}` };
        } else {
          return { status: 'valid', label: `Agendado (${diffDays}d restantes)`, text: `Programado para el ${p.nextAppointmentDate}` };
        }
      }
    } catch (e) {}
    
    return { status: 'none', label: 'Sin cita registrada', text: p.nextAppointmentDate || 'No registra agenda' };
  };

  // Main filter logic
  const filteredPatients = PATIENTS_MOCK.filter(p => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term || 
                          p.name.toLowerCase().includes(term) || 
                          p.rut.toLowerCase().includes(term) ||
                          p.id.toLowerCase().includes(term);

    // Status mapping
    const pscvState = getEstadoPscv(p);
    let matchesStatus = true;
    if (filterMode === 'Activo') {
      matchesStatus = pscvState === 'Activo';
    } else if (filterMode === 'Inactivo') {
      matchesStatus = pscvState === 'Inactivo';
    }

    const matchesRisk = riskFilter === 'Todos' || p.risk === riskFilter;
    
    const compSummary = getCompensationSummary(p);
    let matchesComp = true;
    if (compensationFilter !== 'Todos') {
      if (compensationFilter === 'Compensado') {
        matchesComp = compSummary.label === 'Compensado';
      } else if (compensationFilter === 'No compensado') {
        matchesComp = compSummary.tone === 'danger';
      } else if (compensationFilter === 'No compensado HTA') {
        matchesComp = compSummary.label === 'No compensado HTA' || compSummary.label === 'No compensado HTA + DPN';
      } else if (compensationFilter === 'No compensado DPN') {
        matchesComp = compSummary.label === 'No compensado DPN' || compSummary.label === 'No compensado HTA + DPN';
      } else if (compensationFilter === 'No compensado HTA + DPN') {
        matchesComp = compSummary.label === 'No compensado HTA + DPN';
      } else {
        matchesComp = compSummary.label === compensationFilter;
      }
    }

    const matchesEstablishment = establishmentFilter === 'Todos' || p.establishment === establishmentFilter;

    const matchesDiag = selectedDiagnoses.length === 0 || 
                        selectedDiagnoses.every(d => p.diagnoses?.includes(d));

    let matchesAppt = true;
    if (appointmentFilter === 'Sin próxima cita') matchesAppt = p.nextAppointmentDate === 'Sin cita';
    else if (appointmentFilter === 'Control vencido') matchesAppt = p.alerts?.some(a => a.toLowerCase().includes('vencido')) || false;
    else if (appointmentFilter === 'Inasistencia reciente') matchesAppt = p.alerts?.some(a => a.toLowerCase().includes('inasistencia')) || false;
    else if (appointmentFilter === 'Control vigente') matchesAppt = p.nextAppointmentDate !== 'Sin cita' && !p.alerts?.some(a => a.toLowerCase().includes('vencido'));

    const matchesAlerts = !hasAlertsFilter || (p.alerts && p.alerts.length > 0);

    let matchesPendingExams = true;
    if (pendingExamsFilter !== 'Todos') {
      const examMap: Record<string, string> = {
        'HbA1c pendiente': 'HbA1c',
        'Evaluación de pie pendiente': 'Examen de pie',
        'Perfil lipídico pendiente': 'Perfil lipídico',
        'VFG pendiente': 'VFG',
        'RAC pendiente': 'RAC'
      };
      if (pendingExamsFilter === 'Fondo de ojo vencido') {
        matchesPendingExams = p.alerts?.some(a => a.toLowerCase().includes('fondo de ojo')) || false;
      } else {
        const targetExam = examMap[pendingExamsFilter];
        matchesPendingExams = p.pendingExams?.includes(targetExam) || false;
      }
    }

    // Priority Filter Match
    const priorityLabel = getPriorityInfo(p).label;
    const matchesPriorityFilter = priorityFilter === 'Todos' || priorityLabel === priorityFilter;

    return matchesSearch && matchesStatus && matchesRisk && matchesComp && matchesEstablishment && matchesDiag && matchesAppt && matchesAlerts && matchesPendingExams && matchesPriorityFilter;
  });

  // Pagination bounds
  const totalPatients = filteredPatients.length;
  const totalPages = Math.ceil(totalPatients / pageSize) || 1;
  const paginatedPatients = filteredPatients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleApplyQuickFilter = (type: string) => {
    // Reset filters
    setRiskFilter('Todos');
    setFilterMode('Todos');
    setCompensationFilter('Todos');
    setAppointmentFilter('Todos');
    setHasAlertsFilter(false);
    setSelectedDiagnoses([]);
    setPendingExamsFilter('Todos');
    setEstablishmentFilter('Todos');

    if (type === 'Alto') setRiskFilter('Alto');
    else if (type === 'NoCompensado') setCompensationFilter('No compensado');
    else if (type === 'Inactivos') setFilterMode('Inactivo');
    else if (type === 'SinCita') setAppointmentFilter('Sin próxima cita');
    else if (type === 'Alertas') setHasAlertsFilter(true);
  };

  const handleClearAllFilters = () => {
    setSearchTerm('');
    setRiskFilter('Todos');
    setFilterMode('Todos');
    setCompensationFilter('Todos');
    setAppointmentFilter('Todos');
    setEstablishmentFilter('Todos');
    setSelectedDiagnoses([]);
    setPendingExamsFilter('Todos');
    setHasAlertsFilter(false);
    setHighlightedPatientId(null);
    setPriorityFilter('Todos');
  };

  const isQuickFilterActive = (type: string) => {
    const isReset = riskFilter === 'Todos' && filterMode === 'Todos' && compensationFilter === 'Todos' && appointmentFilter === 'Todos' && !hasAlertsFilter && selectedDiagnoses.length === 0 && pendingExamsFilter === 'Todos' && establishmentFilter === 'Todos' && priorityFilter === 'Todos';
    if (type === 'Todos') return isReset;
    if (type === 'Alto') return riskFilter === 'Alto' && !hasAlertsFilter && filterMode === 'Todos';
    if (type === 'NoCompensado') return compensationFilter === 'No compensado' && !hasAlertsFilter;
    if (type === 'Inactivos') return filterMode === 'Inactivo' && !hasAlertsFilter;
    if (type === 'SinCita') return appointmentFilter === 'Sin próxima cita' && !hasAlertsFilter;
    if (type === 'Alertas') return hasAlertsFilter;
    return false;
  };

  const handleExportExcel = () => {
    const headers = [
      'Nombre', 'RUT', 'Fecha de Nacimiento', 'Establecimiento', 
      'Estado', 'Riesgo Cardiovascular', 'Diagnósticos', 
      'Compensación', 'Último Control', 'Próxima Cita', 
      'Alertas', 'Exámenes Pendientes'
    ];
    const rows = filteredPatients.map(p => [
      p.name,
      p.rut,
      p.birthDate,
      p.establishment || 'Hualañé',
      getEstadoPscv(p),
      p.risk,
      (p.diagnoses || []).join(', '),
      getCompensationSummary(p).label,
      p.lastControlDate || 'Sin registro',
      p.nextAppointmentDate || 'Sin cita',
      (p.alerts || []).join(', '),
      (p.pendingExams || []).join(', ')
    ]);
    
    const csvContent = "\uFEFF" + [
      headers.join(';'),
      ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(';'))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `nomina_pacientes_pscv.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Active filter chips
  const activeChips = [];
  if (riskFilter !== 'Todos') activeChips.push({ id: 'risk', label: `Riesgo: ${riskFilter}`, onRemove: () => setRiskFilter('Todos') });
  if (filterMode !== 'Todos') activeChips.push({ id: 'status', label: `Estado: ${filterMode}`, onRemove: () => setFilterMode('Todos') });
  if (compensationFilter !== 'Todos') activeChips.push({ id: 'comp', label: `Compensación: ${compensationFilter}`, onRemove: () => setCompensationFilter('Todos') });
  if (appointmentFilter !== 'Todos') activeChips.push({ id: 'appt', label: `Seguimiento: ${appointmentFilter}`, onRemove: () => setAppointmentFilter('Todos') });
  if (establishmentFilter !== 'Todos') activeChips.push({ id: 'est', label: `Establecimiento: ${establishmentFilter}`, onRemove: () => setEstablishmentFilter('Todos') });
  if (hasAlertsFilter) activeChips.push({ id: 'alerts', label: 'Con alertas', onRemove: () => setHasAlertsFilter(false) });
  if (pendingExamsFilter !== 'Todos') activeChips.push({ id: 'exams', label: `Pendiente: ${pendingExamsFilter}`, onRemove: () => setPendingExamsFilter('Todos') });
  if (priorityFilter !== 'Todos') activeChips.push({ id: 'priority', label: `Prioridad: ${priorityFilter}`, onRemove: () => setPriorityFilter('Todos') });
  selectedDiagnoses.forEach(d => {
    activeChips.push({ id: `diag-${d}`, label: `Diagnóstico: ${d}`, onRemove: () => setSelectedDiagnoses(prev => prev.filter(x => x !== d)) });
  });

  return (
    <div id="vipent-patient-list-view" className="flex-1 flex flex-col min-h-0 bg-gray-50/30">
      {/* Header section with summaries */}
      <div className="p-6 md:p-8 bg-white border-b border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Heart className="text-brand-blue" size={24} />
            <span>Pacientes PSCV</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestión y priorización de pacientes del Programa de Salud Cardiovascular
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-200 shadow-xs text-xs">
            <div className="px-2 border-r border-gray-150">
              <span className="text-gray-400 font-bold text-[10px] block uppercase leading-none">Total Encontrados</span>
              <span className="text-sm font-black text-brand-blue">{filteredPatients.length}</span>
            </div>
            <div className="px-2 border-r border-gray-150">
              <span className="text-gray-400 font-bold text-[10px] block uppercase leading-none">Filtros Activos</span>
              <span className="text-sm font-black text-gray-800">{activeChips.length}</span>
            </div>
            <div className="px-2">
              <span className="text-gray-400 font-bold text-[10px] block uppercase leading-none">Actualizado</span>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 leading-none mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>En vivo</span>
              </span>
            </div>
          </div>

          <button 
            id="btn-exportar-pacientes"
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-all shadow-sm cursor-pointer"
          >
            <Download size={14} />
            <span>Exportar nómina</span>
          </button>
        </div>
      </div>

      <div className="p-4 md:p-8 flex-1 flex flex-col min-h-0">
        
        {/* CONTAINER PRINCIPAL DE LA TABLA Y FILTROS */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-xs flex flex-col flex-1 min-h-0 overflow-hidden">
          
          {/* FILTROS COMPACTOS EN UN GRID */}
          <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              
              {/* Buscador */}
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre, RUT, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all shadow-2xs font-semibold text-slate-705 placeholder-slate-400"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-650 cursor-pointer">
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Filtro Estado PSCV */}
              <div>
                <select
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue font-bold text-slate-700 transition-all shadow-sm cursor-pointer"
                >
                  <option value="Todos">Estado: Todos</option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              {/* Filtro Riesgo */}
              <div>
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue font-bold text-slate-700 transition-all shadow-sm cursor-pointer"
                >
                  <option value="Todos">Riesgo: Todos</option>
                  <option value="Alto">Alto</option>
                  <option value="Moderado">Moderado</option>
                  <option value="Bajo">Bajo</option>
                </select>
              </div>

              {/* Filtro Compensación */}
              <div>
                <select
                  value={compensationFilter}
                  onChange={(e) => setCompensationFilter(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue font-bold text-slate-700 transition-all shadow-sm cursor-pointer"
                >
                  <option value="Todos">Compensación: Todos</option>
                  <option value="Compensado">Compensado</option>
                  <option value="No compensado">No compensado (Cerradas/Cualquiera)</option>
                  <option value="No compensado HTA">No compensado HTA</option>
                  <option value="No compensado DPN">No compensado DPN</option>
                  <option value="No compensado HTA + DPN">No compensado HTA + DPN</option>
                </select>
              </div>

              {/* Filtro Prioridad */}
              <div>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue font-bold text-slate-700 transition-all shadow-sm cursor-pointer"
                >
                  <option value="Todos">Prioridad: Todos</option>
                  <option value="Normal">Normal</option>
                  <option value="Requiere revisión">Requiere revisión</option>
                  <option value="Requiere rescate">Requiere rescate</option>
                  <option value="Sin próxima cita">Sin próxima cita</option>
                  <option value="Examen pendiente">Examen pendiente</option>
                </select>
              </div>

            </div>

            {/* Extra row for quick trigger buttons */}
            <div className="flex items-center gap-2 mt-1 select-none">
              <button
                onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <SlidersHorizontal size={13} className="text-brand-blue" />
                <span>Búsqueda avanzada / Diagnósticos</span>
                {activeChips.length > 0 && (
                  <span className="bg-brand-blue text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-black">
                    {activeChips.length}
                  </span>
                )}
              </button>
            </div>

            {/* Active filter chips */}
            {activeChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-150 mt-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">Filtros activos:</span>
                {activeChips.map(c => (
                  <span key={c.id} className="inline-flex items-center gap-1 pl-2 pr-1.5 py-0.5 bg-brand-blue/5 text-brand-blue border border-brand-blue/15 rounded-lg text-[10px] font-bold">
                    <span>{c.label}</span>
                    <button onClick={c.onRemove} className="p-0.5 rounded-full hover:bg-brand-blue/20 text-brand-blue/85 hover:text-brand-blue cursor-pointer">
                      <X size={10} />
                    </button>
                  </span>
                ))}
                <button onClick={handleClearAllFilters} className="text-[10px] font-black uppercase text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-md cursor-pointer ml-auto transition-colors">
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-auto hidden md:block">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f8fafc] sticky top-0 z-10 border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[24%]">
                    Paciente / RUT
                  </th>
                  <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[14%]">
                    Estado PSCV
                  </th>
                  <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[14%]">
                    Riesgo Cardiovascular
                  </th>
                  <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[18%]">
                    Compensación
                  </th>
                  <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[18%]">
                    Prioridad
                  </th>
                  <th className="py-3.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[12%] pr-6">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 select-none">
              {paginatedPatients.map(patient => {
                const isHighlighted = highlightedPatientId === patient.id;
                const pscvState = getEstadoPscv(patient);
                const priority = getPriorityInfo(patient);
                const compSummary = getCompensationSummary(patient);

                return (
                  <tr 
                    key={patient.id}
                    className={`hover:bg-slate-50/75 transition-colors group ${
                      isHighlighted ? 'bg-brand-blue/5 border-l-4 border-l-brand-blue font-semibold' : ''
                    }`}
                  >
                    {/* Col 1: Paciente */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-900 group-hover:text-brand-blue transition-colors text-sm">{formatShortName(patient.name)}</div>
                      <div className="text-[10px] text-gray-400 font-bold mt-1">RUT: {patient.rut}</div>
                    </td>

                    {/* Col 2: Estado */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        pscvState === 'Activo' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {pscvState}
                      </span>
                    </td>

                    {/* Col 3: Riesgo */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${
                        patient.risk === 'Alto' ? 'border-red-200 text-red-655 bg-red-50/50' : 
                        patient.risk === 'Moderado' ? 'border-orange-200 text-orange-655 bg-orange-50/50' : 
                        'border-blue-200 text-blue-655 bg-blue-50/50'
                      }`}>
                        {patient.risk}
                      </span>
                    </td>

                    {/* Col 4: Compensación (hta / dm2) */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        compSummary.tone === 'success' ? 'bg-emerald-50 text-emerald-750 border-emerald-250' :
                        compSummary.tone === 'danger' ? 'bg-red-50 text-red-750 border-red-250' :
                        'bg-slate-100 text-slate-705 border-slate-200'
                      }`}>
                        {compSummary.label}
                      </span>
                    </td>

                    {/* Col 5: Prioridad */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wide border ${priority.color}`}>
                        {priority.label}
                      </span>
                    </td>

                    {/* Col 6: Acción (Menú de tres puntos únicamente) */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end relative">
                        <button
                          onClick={() => setActiveDropdownPatientId(activeDropdownPatientId === patient.id ? null : patient.id)}
                          className="p-1 px-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer shrink-0 animate-pulse"
                        >
                          <BulletListSvgIcon size={15} />
                        </button>

                        {activeDropdownPatientId === patient.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10 cursor-default" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdownPatientId(null);
                              }} 
                            />
                            <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 text-left font-bold text-xs text-gray-700">
                              <button 
                                onClick={() => {
                                  setActiveDropdownPatientId(null);
                                  setDrawerPatient(patient);
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-50 font-bold"
                              >
                                <Eye size={13} className="text-brand-blue" />
                                Previsualizar resumen PSCV
                              </button>
                              <button 
                                onClick={() => {
                                  setActiveDropdownPatientId(null);
                                  onViewDetails(patient);
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-50 font-bold"
                              >
                                <User size={13} className="text-emerald-600" />
                                Ver ficha completa
                              </button>
                              <button 
                                onClick={() => {
                                  setActiveDropdownPatientId(null);
                                  alert(`Generando y exportando Ficha Clínica de ${patient.name}...\nCumple con Ley 19.628 de Protección de Datos de Carácter Personal.`);
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-gray-50 flex items-center gap-2 font-bold"
                              >
                                <FileText size={13} className="text-amber-500" />
                                Exportar ficha clínica
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedPatients.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-bold text-xs italic">
                    No se encontraron pacientes para los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Compact Responsive Mobile Cards View */}
        <div className="flex-1 overflow-auto md:hidden p-4 space-y-4 bg-gray-50/50">
          {paginatedPatients.map(patient => {
            const pscvState = getEstadoPscv(patient);
            const priority = getPriorityInfo(patient);
            
            const compSummary = getCompensationSummary(patient);
            
            return (
              <div 
                key={patient.id} 
                className={`p-4 rounded-xl border border-gray-200 bg-white hover:shadow-xs transition-all space-y-3 relative flex flex-col ${
                  highlightedPatientId === patient.id ? 'border-2 border-brand-blue bg-blue-50/5' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 leading-tight text-sm group-hover:text-brand-blue">{formatShortName(patient.name)}</h3>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">RUT: {patient.rut}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                    pscvState === 'Activo' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' : 
                    'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {pscvState}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs font-semibold py-2 border-t border-b border-gray-100 bg-gray-50/50 px-2 py-1 rounded-lg">
                  <div>
                    <span className="text-[9px] text-gray-405 uppercase font-black block">Riesgo</span>
                    <span className={`inline-flex items-center px-1 py-0.5 rounded-sm border text-[8px] font-bold uppercase mt-0.5 ${
                      patient.risk === 'Alto' ? 'border-red-200 text-red-650 bg-red-50/50' : 
                      patient.risk === 'Moderado' ? 'border-orange-200 text-orange-655 bg-orange-50/50' : 
                      'border-blue-200 text-blue-650 bg-blue-50/50'
                    }`}>
                      {patient.risk}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-405 uppercase font-black block">Compensación</span>
                    <span className={`inline-flex items-center px-1 py-0.5 rounded-sm border text-[8px] font-bold uppercase mt-0.5 ${
                      compSummary.tone === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      compSummary.tone === 'danger' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-slate-100 text-slate-705 border-slate-200'
                    }`}>
                      {compSummary.label}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-405 uppercase font-black block">Prioridad</span>
                    <span className={`inline-flex items-center px-1 py-0.5 rounded text-[8px] font-black mt-0.5 border ${priority.color}`}>
                      {priority.label}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => onViewDetails(patient)} 
                    className="flex-1 py-1.5 bg-brand-blue hover:bg-blue-800 text-white rounded-lg text-xs font-bold text-center uppercase tracking-wider cursor-pointer shadow-3xs"
                  >
                    Ver Detalle
                  </button>
                  <button 
                    onClick={() => setDrawerPatient(patient)} 
                    className="px-3 py-1.5 border border-gray-250 hover:border-gray-400 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer flex items-center justify-center gap-1.5"
                    title="Previsualizar"
                  >
                    <Eye size={14} className="text-gray-500" />
                    <span className="text-[11px] font-extrabold text-gray-500">Previsualizar</span>
                  </button>
                </div>
              </div>
            );
          })}
          {paginatedPatients.length === 0 && (
            <div className="py-12 text-center text-gray-400 italic font-semibold text-xs border border-gray-200 rounded-xl bg-white">
              No se encontraron pacientes para los filtros seleccionados.
            </div>
          )}
        </div>

        {/* Master Paginator */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between bg-white text-xs select-none gap-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-bold">Páginas:</span>
            <select 
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-gray-200 rounded p-1 text-xs font-bold cursor-pointer"
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={25}>25 por página</option>
              <option value={50}>50 por página</option>
            </select>
            <span className="text-gray-450 ml-1">
              Mostrando {totalPatients > 0 ? (currentPage - 1) * pageSize + 1 : 0} a {Math.min(currentPage * pageSize, totalPatients)} de {totalPatients}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="px-2.5 py-1 border border-gray-200 rounded text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
            >
              Inicio
            </button>
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1 border border-gray-200 rounded text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            
            <span className="px-3 py-1 bg-brand-blue text-white rounded text-xs font-black shadow-2xs">
              {currentPage} de {totalPages}
            </span>

            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1 border border-gray-200 rounded text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="px-2.5 py-1 border border-gray-200 rounded text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
            >
              Final
            </button>
          </div>
        </div>
      </div>

      {/* Sliding Advanced Filters Drawer */}
        {isAdvancedFiltersOpen && (
          <div className="absolute inset-y-0 right-0 z-30 w-80 bg-white border-l border-gray-200 shadow-xl flex flex-col justify-between animate-slideIn">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-1.5 text-gray-900 font-bold">
                <SlidersHorizontal size={14} className="text-brand-blue" />
                <h3 className="text-xs font-black uppercase tracking-wider">Filtros Avanzados</h3>
              </div>
              <button onClick={() => setIsAdvancedFiltersOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-650 rounded-full hover:bg-gray-100 cursor-pointer">
                <X size={15} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-bold text-gray-700">
              {/* Estado */}
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1.5 font-bold">Estado</label>
                <select value={filterMode} onChange={(e) => setFilterMode(e.target.value as any)} className="w-full bg-white border border-gray-200 rounded-lg p-2 font-bold cursor-pointer">
                  <option value="Todos">Todos</option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              {/* Riesgo */}
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1.5 font-bold">Riesgo Cardiovascular</label>
                <div className="flex flex-wrap gap-1">
                  {['Todos', 'Alto', 'Moderado', 'Bajo'].map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setRiskFilter(lvl as any)}
                      className={`px-2.5 py-1 rounded-md border text-[10px] font-bold transition-all cursor-pointer ${
                        riskFilter === lvl ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Compensación */}
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1.5 font-bold">Compensación HTA / DPN</label>
                <select value={compensationFilter} onChange={(e) => setCompensationFilter(e.target.value as any)} className="w-full bg-white border border-gray-200 rounded-lg p-2 font-bold cursor-pointer">
                  <option value="Todos">Todos</option>
                  <option value="Compensado">Compensado</option>
                  <option value="No compensado">No compensado (Cualquiera)</option>
                  <option value="No compensado HTA">No compensado HTA</option>
                  <option value="No compensado DPN">No compensado DPN</option>
                  <option value="No compensado HTA + DPN">No compensado HTA + DPN</option>
                </select>
              </div>

              {/* Establecimiento */}
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1.5 font-bold">Establecimiento Hospitalario</label>
                <select value={establishmentFilter} onChange={(e) => setEstablishmentFilter(e.target.value as any)} className="w-full bg-white border border-gray-200 rounded-lg p-2 font-bold cursor-pointer">
                  <option value="Todos">Todos</option>
                  <option value="Hualañé">Hualañé</option>
                  <option value="Curepto">Curepto</option>
                </select>
              </div>

              {/* Diagnóstico */}
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1.5 font-bold">Diagnósticos Registrados</label>
                <div className="space-y-1.5 bg-gray-50 p-2.5 rounded-lg border border-gray-150">
                  {['HTA', 'DM2', 'Dislipidemia', 'Obesidad', 'ERC'].map(diag => {
                    const isChecked = selectedDiagnoses.includes(diag);
                    return (
                      <label key={diag} className="flex items-center gap-2 cursor-pointer select-none font-bold text-gray-650">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) setSelectedDiagnoses(prev => prev.filter(d => d !== diag));
                            else setSelectedDiagnoses(prev => [...prev, diag]);
                          }}
                          className="rounded border-gray-305 text-brand-blue"
                        />
                        <span>{diag}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Seguimiento */}
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1.5 font-bold">Seguimiento / Citas</label>
                <select value={appointmentFilter} onChange={(e) => setAppointmentFilter(e.target.value as any)} className="w-full bg-white border border-gray-200 rounded-lg p-2 font-bold cursor-pointer">
                  <option value="Todos">Todos</option>
                  <option value="Control vigente">Control vigente</option>
                  <option value="Control vencido">Control vencido</option>
                  <option value="Sin próxima cita">Sin próxima cita</option>
                  <option value="Inasistencia reciente">Inasistencia reciente</option>
                </select>
              </div>

              {/* Prioridad Operativa */}
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1.5 font-bold">Prioridad Operativa</label>
                <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as any)} className="w-full bg-white border border-gray-200 rounded-lg p-2 font-bold cursor-pointer">
                  <option value="Todos">Todos</option>
                  <option value="Normal">Normal</option>
                  <option value="Requiere revisión">Requiere revisión</option>
                  <option value="Requiere rescate">Requiere rescate</option>
                  <option value="Sin próxima cita">Sin próxima cita</option>
                  <option value="Examen pendiente">Examen pendiente</option>
                </select>
              </div>

              {/* Exámenes */}
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1.5 font-bold">Vigencias / Exámenes Pendientes</label>
                <select value={pendingExamsFilter} onChange={(e) => setPendingExamsFilter(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2 font-bold cursor-pointer">
                  <option value="Todos">Todos</option>
                  <option value="HbA1c pendiente">HbA1c pendiente</option>
                  <option value="Evaluación de pie pendiente">Evaluación de pie pendiente</option>
                  <option value="Perfil lipídico pendiente">Perfil lipídico pendiente</option>
                  <option value="VFG pendiente">VFG pendiente</option>
                  <option value="RAC pendiente">RAC pendiente</option>
                  <option value="Fondo de ojo vencido">Fondo de ojo vencido</option>
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/70 flex gap-2">
              <button onClick={handleClearAllFilters} className="flex-1 py-2 text-center border border-gray-250 rounded-lg font-black text-gray-500 hover:bg-gray-150 cursor-pointer">
                Limpiar
              </button>
              <button onClick={() => setIsAdvancedFiltersOpen(false)} className="flex-1 py-2 text-center bg-brand-blue hover:bg-blue-800 text-white rounded-lg font-black cursor-pointer shadow-2xs">
                Aplicar
              </button>
            </div>
          </div>
        )}

        {/* CLINICAL SUMMARY MODAL "Previsualizar Resumen PSCV" */}
        {drawerPatient && (
          <div 
            className="fixed inset-0 bg-slate-950/70 flex items-center justify-center z-50 p-4 sm:p-6 md:p-10 backdrop-blur-md overflow-hidden animate-fadeIn" 
            onClick={() => setDrawerPatient(null)}
          >
            {/* BEGIN: Modal Container */}
            <div 
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[85vh] animate-scaleUp text-left border border-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* BEGIN: Modal Header */}
              <header className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-50 p-3 rounded-full text-slate-500">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight uppercase">RESUMEN PSCV</h2>
                    <p className="text-sm text-slate-500 font-medium">Ficha de Previsualización Rápida</p>
                  </div>
                </div>
                <button 
                  onClick={() => setDrawerPatient(null)}
                  aria-label="Close modal" 
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </header>
              {/* END: Modal Header */}

              {/* BEGIN: Modal Body */}
              <div className="overflow-y-auto flex-1 p-6">
                {/* BEGIN: Patient Identifier Card */}
                <div className="bg-[#0f172a] rounded-xl p-6 text-white shadow-md mb-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#0ea5e9]"></div>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#0ea5e9] uppercase">
                        <span>Ficha Cardiovascular Rápida</span>
                      </div>
                      <h1 className="text-3xl font-extrabold tracking-tight uppercase">{drawerPatient.name}</h1>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-300">
                        <p><span className="text-gray-400 font-medium">RUT:</span> <span className="font-bold text-white">{drawerPatient.rut}</span></p>
                        <p><span className="text-gray-400 font-medium">Edad:</span> <span className="font-bold text-white">{calculateAge(drawerPatient.birthDate)} años</span></p>
                        <p><span className="text-gray-400 font-medium">Diag:</span> <span className="font-bold text-white uppercase">{drawerPatient.diagnoses?.join(' / ') || 'HTA / DM2'}</span></p>
                        <p><span className="text-gray-400 font-medium">Centro:</span> <span className="font-bold text-white">CESFAM {drawerPatient.establishment || 'Curepto'}</span></p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 mt-2 md:mt-0">
                      <span className={`px-3 py-1.5 rounded-md text-xs font-bold bg-[#0f172a] border uppercase tracking-wide flex items-center justify-center ${
                        getEstadoPscv(drawerPatient) === 'Activo' ? 'border-[#10b981] text-[#10b981]' : 'border-slate-500 text-slate-400'
                      }`}>
                        {getEstadoPscv(drawerPatient)}
                      </span>
                      <span className={`px-3 py-1.5 rounded-md text-xs font-bold bg-[#0f172a] border uppercase tracking-wide flex items-center justify-center ${
                        drawerPatient.risk === 'Alto' ? 'border-[#ef4444] text-[#ef4444]' :
                        drawerPatient.risk === 'Moderado' ? 'border-[#f59e0b] text-[#f59e0b]' :
                        'border-[#0ea5e9] text-[#0ea5e9]'
                      }`}>
                        Riesgo {drawerPatient.risk}
                      </span>
                    </div>
                  </div>
                </div>
                {/* END: Patient Identifier Card */}

                {/* BEGIN: Context-Right Utility Layout */}
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* BEGIN: Left Column (Main Clinical Data) */}
                  <div className="flex-1 space-y-6">
                    {/* Block 1: Estado Clínico */}
                    <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2 font-sans">
                        <span className="w-2 h-2 rounded-full bg-[#0ea5e9]"></span>
                        Estado Clínico PSCV Corto
                      </h3>
                      {(() => {
                        const measurements = getClinicalMeasurements(drawerPatient);
                        const cond = drawerPatient.compensationByCondition;
                        const htaStatus = cond?.hta || 'No aplica';
                        const dm2Status = cond?.dm2 || 'No aplica';

                        const parseMeasurement = (str: string) => {
                          if (!str || str === 'No aplica' || str === 'Sin registro') {
                            return { value: str, date: 'Sin registro' };
                          }
                          const match = str.match(/(.*?)\s*\((.*?)\)/);
                          if (match) {
                            return { value: match[1].trim(), date: match[2].trim() };
                          }
                          return { value: str, date: 'Reciente' };
                        };

                        const paParsed = parseMeasurement(measurements.pa);
                        const hba1cParsed = parseMeasurement(measurements.hba1c);

                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Presión Arterial Card */}
                            <div className="border border-gray-200 rounded-lg p-4 bg-slate-50 flex flex-col justify-between">
                              <div>
                                <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">PRESIÓN ARTERIAL</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Último valor:</span>
                                    <span className="font-bold text-gray-800 font-mono">{paParsed.value}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-505">Fecha:</span>
                                    <span className="text-gray-700 font-mono text-xs">{paParsed.date}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-xs text-gray-500 font-medium">ESTADO HTA:</span>
                                <span className={`px-2 py-1 border rounded text-xs font-bold uppercase tracking-wide ${
                                  cond?.hta === 'Compensado' ? 'bg-[#d1fae5] text-[#10b981] border-[#10b981]' :
                                  cond?.hta === 'No compensado' ? 'bg-[#fee2e2] text-[#ef4444] border-[#ef4444]' :
                                  'bg-gray-100 text-gray-600 border-gray-300'
                                }`}>
                                  {cond?.hta === 'Compensado' ? 'HTA COMPENSADA' : cond?.hta === 'No compensado' ? 'HTA NO COMPENSADA' : cond?.hta === 'No aplica' || htaStatus === 'No aplica' ? 'NO APLICA' : 'SIN DATO'}
                                </span>
                              </div>
                            </div>
                            {/* Diabetes Card */}
                            <div className="border border-gray-200 rounded-lg p-4 bg-slate-50 flex flex-col justify-between">
                              <div>
                                <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">DIABETES / HBA1C</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Último valor:</span>
                                    <span className="font-bold text-gray-800 font-mono">{hba1cParsed.value}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-505">Fecha:</span>
                                    <span className="text-gray-700 font-mono text-xs">{hba1cParsed.date}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-xs text-gray-500 font-medium">ESTADO DPN:</span>
                                <span className={`px-2 py-1 border rounded text-xs font-bold uppercase tracking-wide ${
                                  cond?.dm2 === 'Compensado' ? 'bg-[#d1fae5] text-[#10b981] border-[#10b981]' :
                                  cond?.dm2 === 'No compensado' ? 'bg-[#fee2e2] text-[#ef4444] border-[#ef4444]' :
                                  'bg-gray-100 text-gray-650 border-gray-300'
                                }`}>
                                  {cond?.dm2 === 'Compensado' ? 'DM2 COMPENSADA' : cond?.dm2 === 'No compensado' ? 'DM2 NO COMPENSADA' : cond?.dm2 === 'No aplica' || dm2Status === 'No aplica' ? 'NO APLICA' : 'SIN DATO'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </section>

                    {/* Block 3: Diagnósticos y Vigencias */}
                    <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2 font-sans">
                        <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                        Diagnósticos y Vigencias
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">DIAGNÓSTICOS REGISTRADOS EN PSCV</h4>
                          <div className="flex flex-wrap gap-2">
                            {drawerPatient.diagnoses && drawerPatient.diagnoses.length > 0 ? (
                              drawerPatient.diagnoses.map((dg, idx) => (
                                <span key={idx} className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 shadow-sm uppercase font-mono">
                                  {dg}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 italic text-xs">No registra diagnósticos</span>
                            )}
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center bg-gray-50">
                          <span className="text-sm font-medium text-gray-700">Vigencia Patología (GES)</span>
                          <span className="px-2 py-1 bg-[#d1fae5] text-[#10b981] border border-[#10b981] rounded text-xs font-bold uppercase tracking-wide font-mono">
                            VIGENTE / AL DÍA
                          </span>
                        </div>
                      </div>
                    </section>
                  </div>
                  {/* END: Left Column */}

                  {/* BEGIN: Right Column (Utility/Context) */}
                  <div className="w-full lg:w-80 space-y-6 bg-slate-50 p-5 rounded-xl border border-gray-200">
                    {/* Block 2: Seguimiento */}
                    <section>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2 font-sans">
                        <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span>
                        Seguimiento
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">ÚLTIMO CONTROL</h4>
                          <p className="text-lg font-bold text-gray-800 font-mono">{drawerPatient.lastControlDate || 'Sin registro'}</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                          <h4 className="text-xs font-semibold text-[#0ea5e9] uppercase tracking-wide mb-1">PRÓXIMA CITA</h4>
                          <p className={`text-lg font-bold font-mono ${drawerPatient.nextAppointmentDate === 'Sin cita' ? 'text-[#ef4444]' : 'text-[#10b981]'}`}>
                            {drawerPatient.nextAppointmentDate || 'Sin cita'}
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Block 4: Alertas */}
                    <section>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2 font-sans">
                        <span className="w-2 h-2 rounded-full bg-[#ef4444]"></span>
                        Alertas
                      </h3>
                      <div className="space-y-3">
                        {drawerPatient.alerts && drawerPatient.alerts.length > 0 ? (
                          drawerPatient.alerts.map((al, idx) => (
                            <div key={idx} className="bg-[#fee2e2] border border-red-200 rounded-lg p-4 flex items-start gap-3 shadow-sm">
                              <AlertTriangle className="w-5 h-5 text-[#ef4444] mt-0.5 shrink-0" />
                              <div>
                                <p className="text-sm font-bold text-[#ef4444]">{al}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="bg-[#d1fae5] border border-emerald-200 rounded-lg p-4 flex items-start gap-3 shadow-sm">
                            <CheckCircle className="w-5 h-5 text-[#10b981] mt-0.5 shrink-0" />
                            <div>
                              <p className="text-sm font-bold text-[#10b981]">Sin alertas activas registradas</p>
                            </div>
                          </div>
                        )}

                        {drawerPatient.pendingExams && drawerPatient.pendingExams.length > 0 && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col gap-1.5 shadow-sm">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-5 h-5 text-amber-550 shrink-0 mt-0.5" />
                              <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">EXÁMENES PENDIENTES</span>
                            </div>
                            <div className="space-y-1 pl-7">
                              {drawerPatient.pendingExams.map((exam, idx) => (
                                <div key={idx} className="text-xs text-amber-900 font-bold flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                  <span>{exam}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  </div>
                  {/* END: Right Column */}
                </div>
                {/* END: Context-Right Utility Layout */}
              </div>
              {/* END: Modal Body */}

              {/* BEGIN: Modal Footer */}
              <footer className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center bg-gray-50">
                <button 
                  onClick={() => setDrawerPatient(null)}
                  className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors shadow-sm cursor-pointer font-bold uppercase tracking-wider"
                >
                  CERRAR
                </button>
                <button 
                  onClick={() => {
                    setDrawerPatient(null);
                    onViewDetails(drawerPatient);
                  }}
                  className="px-6 py-2.5 bg-[#0f172a] rounded-lg text-sm font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm cursor-pointer font-bold uppercase tracking-wider"
                >
                  VER FICHA COMPLETA
                </button>
              </footer>
              {/* END: Modal Footer */}
            </div>
            {/* END: Modal Container */}
          </div>
        )}
      </div>
    </div>
  );
}
