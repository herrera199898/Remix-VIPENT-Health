import React, { useState, Fragment, useEffect, useRef } from 'react';
import { 
  RefreshCcw, ChevronLeft, ChevronRight, 
  MapPin, Calendar, Clock, ClipboardCheck, AlertTriangle, 
  FileSpreadsheet, Printer, Search, Database, UserCheck, 
  Eye, CornerDownRight, CheckCircle, ArrowUpRight, HelpCircle,
  FileText
} from 'lucide-react';
import { PATIENTS_MOCK } from '../types';

const UsersSvgIcon = ({ className = "w-5 h-5", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg 
    fill="currentColor" 
    viewBox="0 0 32 32" 
    version="1.1" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path d="M16 21.416c-5.035 0.022-9.243 3.537-10.326 8.247l-0.014 0.072c-0.018 0.080-0.029 0.172-0.029 0.266 0 0.69 0.56 1.25 1.25 1.25 0.596 0 1.095-0.418 1.22-0.976l0.002-0.008c0.825-3.658 4.047-6.35 7.897-6.35s7.073 2.692 7.887 6.297l0.010 0.054c0.127 0.566 0.625 0.982 1.221 0.982 0.69 0 1.25-0.559 1.25-1.25 0-0.095-0.011-0.187-0.031-0.276l0.002-0.008c-1.098-4.78-5.305-8.295-10.337-8.316h-0.002zM9.164 11.102c0 0 0 0 0 0 2.858 0 5.176-2.317 5.176-5.176s-2.317-5.176-5.176-5.176c-2.858 0-5.176 2.317-5.176 5.176v0c0.004 2.857 2.319 5.172 5.175 5.176h0zM9.164 3.25c0 0 0 0 0 0 1.478 0 2.676 1.198 2.676 2.676s-1.198 2.676-2.676 2.676c-1.478 0-2.676-1.198-2.676-2.676v0c0.002-1.477 1.199-2.674 2.676-2.676h0zM22.926 11.102c2.858 0 5.176-2.317 5.176-5.176s-2.317-5.176-5.176-5.176c-2.858 0-5.176 2.317-5.176 5.176v0c0.004 2.857 2.319 5.172 5.175 5.176h0zM22.926 3.25c1.478 0 2.676 1.198 2.676 2.676s-1.198 2.676-2.676 2.676c-1.478 0-2.676-1.198-2.676-2.676v0c0.002-1.477 1.199-2.674 2.676-2.676h0zM31.311 19.734c-0.864-4.111-4.46-7.154-8.767-7.154-0.395 0-0.784 0.026-1.165 0.075l0.045-0.005c-0.93-2.116-3.007-3.568-5.424-3.568-2.414 0-4.49 1.448-5.407 3.524l-0.015 0.038c-0.266-0.034-0.58-0.057-0.898-0.063l-0.009-0c-4.33 0.019-7.948 3.041-8.881 7.090l-0.012 0.062c-0.018 0.080-0.029 0.173-0.029 0.268 0 0.691 0.56 1.251 1.251 1.251 0.596 0 1.094-0.417 1.22-0.975l0.002-0.008c0.684-2.981 3.309-5.174 6.448-5.186h0.001c0.144 0 0.282 0.020 0.423 0.029 0.056 3.218 2.679 5.805 5.905 5.805 3.224 0 5.845-2.584 5.905-5.794l0-0.006c0.171-0.013 0.339-0.035 0.514-0.035 3.14 0.012 5.765 2.204 6.442 5.14l0.009 0.045c0.126 0.567 0.625 0.984 1.221 0.984 0.69 0 1.249-0.559 1.249-1.249 0-0.094-0.010-0.186-0.030-0.274l0.002 0.008zM16 18.416c-0 0-0 0-0.001 0-1.887 0-3.417-1.53-3.417-3.417s1.53-3.417 3.417-3.417c1.887 0 3.417 1.53 3.417 3.417 0 0 0 0 0 0.001v-0c-0.003 1.886-1.53 3.413-3.416 3.416h-0z"></path>
  </svg>
);

interface REMReportProps {
  onNavigate?: (view: string, filters?: any) => void;
}

export default function REMReport({ onNavigate }: REMReportProps) {
  const [activeTab, setActiveTab] = useState('Sección A');

  const tabs = [
    'Sección A: Programa Salud Cardiovascular',
    'Sección B: Metas de Compensación',
    'Sección C: Variables de Seguimiento'
  ];

  const agePages = [
    ['15-19 (Años)', '20-24 (Años)', '25-29 (Años)', '30-34 (Años)', '35-39 (Años)'],
    ['40-44 (Años)', '45-49 (Años)', '50-54 (Años)', '55-59 (Años)', '60-64 (Años)'],
    ['65-69 (Años)', '70-74 (Años)', '75-79 (Años)', '>80 (Años)']
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const currentAgeGroups = agePages[currentPage];

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < agePages.length - 1) setCurrentPage(currentPage + 1);
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- Context Filters States ---
  const [selectedEstablecimiento, setSelectedEstablecimiento] = useState<'Todos' | 'Hualañé' | 'Curepto'>('Todos');
  const [selectedPeriodo, setSelectedPeriodo] = useState<'current' | '3months' | '12months' | 'custom'>('current');
  const [selectedCorte, setSelectedCorte] = useState<'last_update' | 'close_date'>('last_update');
  const [selectedEstado, setSelectedEstado] = useState<'Borrador' | 'En validación' | 'Validado' | 'Exportado' | 'Validado con observaciones'>('Borrador');

  // --- Mock Interactive States ---
  const [lastUpdate, setLastUpdate] = useState('28/05/2026 10:30');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // --- Modals States for Simplification ---
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);

  // --- Drill-down / Associated Patients Modal State ---
  const [associatedPatientsData, setAssociatedPatientsData] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    patients: any[];
  }>({
    isOpen: false,
    title: '',
    description: '',
    patients: []
  });

  // --- Interactive Handlers ---
  const handleActualizarDatos = () => {
    setIsUpdating(true);
    setTimeout(() => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const formatted = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
      setLastUpdate(formatted);
      setIsUpdating(false);
      alert('Sincronización con repositorio SISMAULE y fichas clínicas comunales finalizada correctamente.');
    }, 800);
  };

  const handleValidarReporte = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      setSelectedEstado('Validado con observaciones');
      setShowValidationModal(true);
    }, 900);
  };

  const handleExportarExcel = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setSelectedEstado('Exportado');
      alert('La exportación de la planilla ministerial "REM-P4_CARDIOVASCULAR_MAYO_2026.xlsx" se ha completado. Se incluyeron metadatos de sincronización.');
    }, 1000);
  };

  const handleImprimir = () => {
    const backupTitle = document.title;
    document.title = "Reporte_REM-P4_PSCV_Ministerial";
    window.print();
    document.title = backupTitle;
  };

  // Trigger Navigation with parameters to filter the Patient list
  const handleReviewIssue = (categoryKey: string) => {
    let filters: any = {};
    if (categoryKey === 'sin_edad_sexo') {
      filters = { searchTerm: 'Sin Edad' };
    } else if (categoryKey === 'sin_diagnostico') {
      filters = { alertFilter: 'SIN_DIAGNOSTICO_PSCV' };
    } else if (categoryKey === 'sin_compensacion') {
      filters = { compensationFilter: 'Sin dato' };
    } else if (categoryKey === 'duplicados') {
      filters = { searchTerm: 'Duplicado' };
    } else if (categoryKey === 'sin_establecimiento') {
      filters = { establishmentFilter: 'Todos' };
    } else if (categoryKey === 'examenes_vigencia') {
      filters = { appointmentFilter: 'Control vencido' };
    }

    if (onNavigate) {
      // TODO: conectar observaciones REM-P4 con filtros de Pacientes PSCV.
      onNavigate('PACIENTES', filters);
    } else {
      // Fallback modal preview
      const list = getMockPatientsForIssue(categoryKey);
      setAssociatedPatientsData({
        isOpen: true,
        title: `Observación: ${getCategoryLabel(categoryKey)}`,
        description: 'Detalle de registros de pacientes locales identificados en la comprobación mensual REM.',
        patients: list
      });
    }
  };

  // Navigates directly to the Patient list applying concept-specific filters
  const handleConceptNavigation = (groupTitle: string, rowText: string | null) => {
    let filters: any = {};
    const textToMatch = rowText || groupTitle;

    // Check if the concept corresponds to a risk filter (Clasificación del Riesgo Cardiovascular)
    if (groupTitle === 'Clasificación del Riesgo Cardiovascular') {
      if (textToMatch === 'Bajo' || textToMatch === 'Moderado' || textToMatch === 'Alto') {
        filters.riskFilter = textToMatch;
      }
    } 
    // Patología o Factores de riesgo
    else if (groupTitle === 'Personas bajo control según patología y factores de riesgo (existencia)') {
      if (textToMatch === 'Hipertensión Arterial') {
        filters.searchTerm = 'Hipertensión';
      } else if (textToMatch === 'Diabetes Mellitus tipo 2') {
        filters.searchTerm = 'Diabetes';
      } else if (textToMatch === 'Dislipidemia') {
        filters.searchTerm = 'Dislipidemia';
      } else {
        filters.searchTerm = textToMatch;
      }
    } 
    // Compensation Filters
    else if (groupTitle === 'Personas bajo control por hipertensión') {
      if (textToMatch.includes('PA <')) {
        filters.compensationFilter = 'Compensado';
        filters.searchTerm = 'HTA';
      } else {
        filters.searchTerm = textToMatch;
      }
    } else if (groupTitle === 'Personas bajo control por diabetes mellitus') {
      if (textToMatch.includes('HbA1c <')) {
        filters.compensationFilter = 'Compensado';
        filters.searchTerm = 'Diabetes';
      } else {
        filters.searchTerm = textToMatch;
      }
    } else if (groupTitle === 'Personas con RCV alto') {
      filters.riskFilter = 'Alto';
      filters.searchTerm = textToMatch;
    } else {
      // General fallback using the text
      filters.searchTerm = textToMatch;
    }

    // Always preserve current establishment context
    if (selectedEstablecimiento !== 'Todos') {
      filters.establishmentFilter = selectedEstablecimiento;
    }

    if (onNavigate) {
      onNavigate('PACIENTES', filters);
    }
  };

  const getCategoryLabel = (key: string) => {
    switch(key) {
      case 'sin_edad_sexo': return 'Pacientes sin Edad o Sexo';
      case 'sin_diagnostico': return 'Pacientes sin Diagnóstico PSCV';
      case 'sin_compensacion': return 'HTA/DM2 sin dato de compensación';
      case 'duplicados': return 'Registros Duplicados';
      case 'sin_establecimiento': return 'Pacientes sin Establecimiento';
      case 'examenes_vigencia': return 'Exámenes o vigencias incompletas';
      default: return 'Pacientes Filtrados';
    }
  };

  const getMockPatientsForIssue = (key: string) => {
    const standard = [
      { id: 'p1', name: 'GONZALEZ ALARCON REINALDO JOSÉ (S/D)', rut: '11.531.062-8', val: 'Falta campo Sexo en Registro', establishment: 'Hualañé', risk: 'Alto' },
      { id: 'p2', name: 'ZUNIGA PARRA CARMEN GLORIA', rut: '12.451.982-K', val: 'Sin fecha nacimiento en ficha', establishment: 'Hualañé', risk: 'Moderado' },
      { id: 'p3', name: 'CASTILLO FUENTES LUIS HERNAN', rut: '10.887.425-4', val: 'HTA activa sin código CIE-10', establishment: 'Curepto', risk: 'Alto' },
      { id: 'p4', name: 'VALENZUELA GOMEZ ELISA CRISTINA', rut: '11.556.772-8', val: 'Control PA vencido hace 130 días', establishment: 'Curepto', risk: 'Bajo' },
      { id: 'p5', name: 'ARAVENA PEREZ PEDRO JERE', rut: '7.854.120-K', val: 'VFG y Albúmina vencidas (>12 meses)', establishment: 'Hualañé', risk: 'Bajo' }
    ];
    if (key === 'sin_edad_sexo') return standard.slice(0, 2);
    if (key === 'sin_diagnostico') return [standard[2]];
    if (key === 'sin_compensacion') return [standard[3]];
    if (key === 'examenes_vigencia') return [standard[4]];
    return standard;
  };

  const getEstadoBadgeStyle = (estado: string) => {
    switch (estado) {
      case 'Borrador':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'En validación':
        return 'bg-blue-50 text-blue-800 border-blue-200 animate-pulse';
      case 'Validado':
        return 'bg-emerald-50 text-emerald-800 border-emerald-250';
      case 'Exportado':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Validado con observaciones':
        return 'bg-rose-50 text-rose-800 border-rose-250 font-bold';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  const sectionData: Record<string, any[]> = {
    'Sección A': [
      { title: 'Numero de personas en PSCV', rows: [null], isSingle: true },
      { 
        title: 'Clasificación del Riesgo Cardiovascular', 
        rows: ['Bajo', 'Moderado', 'Alto']
      },
      {
        title: 'Personas bajo control según patología y factores de riesgo (existencia)',
        rows: [
          'Hipertensión Arterial',
          'Diabetes Mellitus tipo 2',
          'Dislipidemia',
          'Tabaquismo ≥ 55 años',
          'Antecedentes de Infarto Agudo al Miocardio (IAM)',
          'Antecedentes de Ataque Cerebro Vascular (ACV)'
        ]
      },
      {
        title: 'DETECCIÓN Y PREVENCION DE LA PROGRESION DE LA ENFERMEDAD RENAL CRÓNICA (ERC)',
        rows: [
          'SIN ENFERMEDAD RENAL (S/ERC)',
          'ETAPA G1',
          'ETAPA G2',
          'ETAPA G3a',
          'ETAPA G3b',
          'ETAPA G4',
          'ETAPA G5'
        ]
      }
    ],
    'Sección B': [
      {
        title: 'Personas bajo control por hipertensión',
        rows: ['PA < 140/90 mmHg', 'PA < 150/90 mmHg']
      },
      {
        title: 'Personas bajo control por diabetes mellitus',
        rows: [
          'HbA1c < 7%',
          'HbA1c < 8%',
          { text: 'HbA1c < 7% - PA < 140/90 mmHg y Colesterol LDL < 100 mg/dl', className: 'text-[9px]' }
        ]
      },
      {
        title: 'Personas con RCV alto',
        rows: ['Colesterol LDL < 100 mg/dl']
      },
      {
        title: 'Personas bajo control con antecedentes de enfermedad cardiovascular (ECV)',
        rows: [
          'En tratamiento con Antiagregantes plaquetarios',
          'En tratamiento con Estatina',
          'Fumador actual'
        ]
      }
    ],
    'Sección C': [
      {
        title: 'Personas con diabetes en PSCV',
        rows: [
          'Con razón albúmina creatinina (RAC), vigente',
          'Con velocidad de filtración glomerular estimada (VFG), vigente',
          'Con velocidad de filtración glomerular estimada (VFG) y con razón albúmina creatinina (RAC) vigente',
          'Con fondo de ojo, vigente',
          'Con atención podológica vigente',
          'Con ECG vigente',
          'En tratamiento con Insulina',
          'En tratamiento con Insulina que logra meta con HBA1C según edad',
          'Con HBA1C >= 9 %',
          'Con ERC (todas las etapas) y en tratamiento con IECA o ARA II',
          'Con un examen de colesterol LDL vigente',
          'Con hipoglicemias recurrentes',
          'Con riesgo bajo de ulceración en evaluación de pie',
          'Con riesgo moderado de ulceración en evaluación de pie',
          'Con riesgo alto de ulceración en evaluación de pie',
          'Con riesgo maximo de ulceración en evaluación de pie',
          'Con curación convencional para tratar ulceración de pie diabético',
          'Con curación avanzada para tratar ulceración de pie diabético',
          'Con ayuda técnica de descarga para tratar ulceración de pie diabético',
          'Con curación avanzada en ulcera venosa',
          'Con amputación por pie diabético',
          'Con diagnóstico asociado de hipertensión arterial',
          'Con diagnóstico de enfermedad renal crónica',
          'Antecedente de ataque cerebro vascular',
          'Antecedentes de infarto agudo al miocardio',
          'Retinopatía diabética'
        ]
      },
      {
        title: 'Personas con hipertensión en PSCV',
        rows: [
          'Con razón albúmina creatinina (RAC), vigente',
          'Con velocidad de filtración glomerular estimada (VFG) y con razón albúmina creatinina (RAC) vigente',
          'Con presión arterial Igual o mayor 160/100 mmHg',
          'Con velocidad de filtración glomerular estimada (VFG) vigente',
          'Protocolo hearts',
          'Sobrepeso: IMC entre 25 y 29.9 <65',
          'Sobrepeso: IMC entre 28 y 31.9 >65'
        ]
      },
      {
        title: 'Todas las personas en PSCV',
        rows: [
          'Obesidad: IMC igual o mayor a 30kg/m2 <65',
          'Obesidad: IMC igual o mayor a 32kg/m2 >65',
          'Personas en actividad física salud cardiovascular'
        ]
      }
    ]
  };

  const clinicalObservatios = [
    { key: 'sin_edad_sexo', title: 'Pacientes sin edad o sexo', count: 12, severity: 'Alta', color: 'text-red-650 border-red-200 bg-red-50' },
    { key: 'sin_diagnostico', title: 'Pacientes sin diagnóstico PSCV', count: 4, severity: 'Alta', color: 'text-red-650 border-red-200 bg-red-50' },
    { key: 'sin_compensacion', title: 'Pacientes con HTA/DM2 sin dato de compensación', count: 24, severity: 'Media', color: 'text-amber-650 border-amber-200 bg-amber-50' },
    { key: 'duplicados', title: 'Registros duplicados', count: 2, severity: 'Alta', color: 'text-red-650 border-red-200 bg-red-50' },
    { key: 'sin_establecimiento', title: 'Pacientes sin establecimiento asociado', count: 6, severity: 'Media', color: 'text-amber-650 border-amber-200 bg-amber-50' },
    { key: 'examenes_vigencia', title: 'Exámenes o vigencias incompletas', count: 10, severity: 'Baja', color: 'bg-slate-50 text-slate-500 border-slate-200' },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 text-left">
      
      {/* 1. Simplified Header Area with Action Buttons */}
      <div className="p-6 md:p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 shrink-0 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <FileText className="text-brand-blue" size={24} />
              <span>Reporte REM-P4</span>
            </h1>
            <span className={`px-2.5 py-0.5 text-[10px] uppercase font-extrabold tracking-wider border rounded-full ${getEstadoBadgeStyle(selectedEstado)}`}>
              {selectedEstado}
            </span>
          </div>
          
          {/* Quick interactive on-demand elements right next to the subtext */}
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500 font-semibold">
            <span>Control consolidado de población PSCV</span>
            <span className="text-slate-300 font-normal">|</span>
            <button 
              onClick={() => setShowInfoModal(true)} 
              className="text-blue-600 hover:text-blue-800 font-extrabold hover:underline flex items-center gap-1 cursor-pointer transition-colors"
              title="Ver metadata de sincronización y procedencia de datos"
            >
              <Database size={12} className="text-blue-500" />
              Información del reporte
            </button>
            <span className="text-slate-300 font-normal">|</span>
            <button 
              onClick={() => setShowValidationModal(true)} 
              className="text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all hover:scale-103 active:scale-97 text-[11px]"
              title="Ver observaciones e inconsistencias del reporte para corregir"
            >
              <AlertTriangle size={12} className="text-amber-600" />
              Observaciones: 58
            </button>
          </div>
        </div>

        {/* Action Buttons list */}
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={handleActualizarDatos}
            disabled={isUpdating}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-250 rounded-lg text-xs font-bold text-gray-700 uppercase tracking-tight transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCcw size={13} className={`text-blue-500 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? 'Sincronizando...' : 'Actualizar datos'}
          </button>

          <button 
            onClick={handleValidarReporte}
            disabled={isValidating}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-xs font-bold text-indigo-700 uppercase tracking-tight transition-colors cursor-pointer"
          >
            <ClipboardCheck size={13} className="text-indigo-500" />
            {isValidating ? 'Validando...' : 'Validar reporte'}
          </button>

          <button 
            onClick={handleExportarExcel}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-700 uppercase tracking-tight transition-colors cursor-pointer"
          >
            <FileSpreadsheet size={13} className="text-emerald-600" />
            {isExporting ? 'Procesando...' : 'Exportar Excel'}
          </button>

          <button 
            onClick={handleImprimir}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-bold text-gray-700 uppercase tracking-tight transition-colors cursor-pointer"
          >
            <Printer size={13} className="text-slate-600" />
            Vista Impresión
          </button>
        </div>
      </div>

      {/* 2. Compact Contexual Filters Panel (Single desktop row containing Sede, Periodo and Corte) */}
      <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center gap-4 shrink-0 text-xs text-slate-700">
        
        {/* Sede Select */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <MapPin size={11} className="text-blue-500" />
            Establecimiento:
          </label>
          <select 
            value={selectedEstablecimiento}
            onChange={(e) => setSelectedEstablecimiento(e.target.value as any)}
            className="bg-white border border-slate-200 px-2 py-1 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Todos">Todos los Establecimientos</option>
            <option value="Hualañé">Establecimiento Hualañé</option>
            <option value="Curepto">Establecimiento Curepto</option>
          </select>
        </div>

        {/* Period Select */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Calendar size={11} className="text-blue-500" />
            Periodo:
          </label>
          <select 
            value={selectedPeriodo}
            onChange={(e) => setSelectedPeriodo(e.target.value as any)}
            className="bg-white border border-slate-200 px-2 py-1 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="current">Mes actual (Mayo 2026)</option>
            <option value="3months">Últimos 3 meses</option>
            <option value="12months">Últimos 12 meses (Anual)</option>
            <option value="custom">Personalizado (Rango)</option>
          </select>
        </div>

        {/* Cutting Mode */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Database size={11} className="text-blue-500" />
            Corte de Datos:
          </label>
          <select 
            value={selectedCorte}
            onChange={(e) => setSelectedCorte(e.target.value as any)}
            className="bg-white border border-slate-200 px-2 py-1 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="last_update">Última sincronización disponible</option>
            <option value="close_date">Fecha de cierre del reporte</option>
          </select>
        </div>

        {/* Feedback info on right */}
        <div className="md:ml-auto text-[10.5px] text-slate-500 font-semibold flex items-center gap-1">
          <Clock size={12} className="text-blue-500" />
          <span>Último consolidado: <strong className="text-slate-700">{lastUpdate}</strong></span>
        </div>
      </div>

      {/* 6. Tabs for ministerials data navigation */}
      <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
        
        {/* Tab Buttons */}
        <div className="flex border-b border-gray-200 bg-gray-50/30 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.split(':')[0])}
              className={`px-6 py-3 text-[11px] font-bold tracking-tight transition-all relative border-r border-gray-200 last:border-r-0 ${
                activeTab === tab.split(':')[0]
                  ? 'bg-white text-gray-900 border-b-white -mb-[1px]'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab}
              {activeTab === tab.split(':')[0] && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue-500" />
              )}
            </button>
          ))}
        </div>

        {/* 7. Content Area Containing the ministerial table layout */}
        <div className="flex-1 p-5 md:p-6 bg-gray-50/20 flex flex-col justify-start overflow-hidden min-h-0">
          <div className="bg-white p-4 border border-gray-300 rounded shadow-sm max-h-full w-full flex flex-col">
            
            {/* Title and brief description of the table (Requirement 8) */}
            <div className="mb-3 shrink-0">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Tabla consolidada REM-P4</h2>
              <p className="text-[11px] font-semibold text-slate-500">Distribución por tramo etario y sexo según sección seleccionada.</p>
            </div>

            <div className="relative flex-1 min-h-0 flex flex-col">
              
              {/* Scrollable container for the huge ministerial columns */}
              <div 
                ref={scrollContainerRef}
                className="overflow-auto border border-gray-400 rounded-sm bg-white custom-scrollbar flex-1"
              >
                <table className="w-full text-[10px] border-collapse min-w-[1240px] font-sans">
                  <thead className="sticky top-0 z-30 shadow-md bg-white outline outline-1 outline-gray-400">
                    {/* Pagination Controls embedded in header */}
                    <tr className="bg-gray-200 h-10 relative z-30">
                      <th colSpan={5} className="border border-gray-400 py-2 bg-gray-300 relative z-30 bg-clip-padding"></th>
                      
                      {/* Previous Button above first age column */}
                      <th colSpan={2} className="border border-gray-400 relative bg-slate-800 p-0 z-30 bg-clip-padding">
                        <button 
                          onClick={handlePrevPage}
                          disabled={currentPage === 0}
                          className={`w-full h-full flex items-center justify-center text-white hover:bg-slate-700 transition-colors ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                           <ChevronLeft size={20} />
                        </button>
                      </th>
 
                      <th colSpan={Math.max(0, (currentAgeGroups.length - 2) * 2)} className="border border-gray-400 bg-gray-300 relative z-30 bg-clip-padding"></th>
 
                      {/* Next Button above last age column */}
                      <th colSpan={2} className="border border-gray-400 relative bg-slate-800 p-0 z-30 bg-clip-padding">
                         <button 
                          onClick={handleNextPage}
                          disabled={currentPage === agePages.length - 1}
                          className={`w-full h-full flex items-center justify-center text-white hover:bg-slate-700 transition-colors ${currentPage === agePages.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                         >
                            <ChevronRight size={20} />
                         </button>
                      </th>
                    </tr>
 
                    {/* Primary Labels Header */}
                    <tr className="bg-gray-100 relative z-30">
                      <th colSpan={2} rowSpan={2} className="border border-gray-400 py-2.5 font-bold text-gray-700 bg-gray-100 uppercase tracking-tight text-center relative z-30 bg-clip-padding align-middle">Concepto</th>
                      <th colSpan={3} className="border border-gray-400 py-2.5 font-bold text-gray-600 bg-gray-100 px-4 relative z-30 bg-clip-padding">Total</th>
                      {currentAgeGroups.map((group) => (
                        <th key={group} colSpan={2} className="border border-gray-400 py-2.5 font-bold text-gray-600 bg-gray-100 px-4 relative z-30 bg-clip-padding">{group}</th>
                      ))}
                    </tr>
 
                    {/* Gender Labels Header */}
                    <tr className="bg-white relative z-30">
                      <th className="border border-gray-400 py-1.5 font-bold text-gray-500 bg-white w-16 italic text-center relative z-30 bg-clip-padding">Ambos</th>
                      <th className="border border-gray-400 py-1.5 font-bold text-gray-500 bg-white w-16 italic text-center relative z-30 bg-clip-padding">Hombres</th>
                      <th className="border border-gray-400 py-1.5 font-bold text-gray-500 bg-white w-16 italic text-center relative z-30 bg-clip-padding">Mujeres</th>
                      {Array.from({ length: currentAgeGroups.length }).map((_, i) => (
                        <Fragment key={i}>
                          <th className="border border-gray-400 py-1.5 font-bold text-gray-500 bg-white w-16 italic text-center relative z-30 bg-clip-padding">Hombres</th>
                          <th className="border border-gray-400 py-1.5 font-bold text-gray-500 bg-white w-16 italic text-center relative z-30 bg-clip-padding">Mujeres</th>
                        </Fragment>
                      ))}
                    </tr>
                  </thead>
                  
                  {/* Table Body */}
                  <tbody className="font-mono">
                    {sectionData[activeTab]?.map((group, groupIndex) => (
                      <Fragment key={groupIndex}>
                        {group.rows.map((row: any, rowIndex: number) => {
                          const rowText = typeof row === 'object' && row !== null ? row.text : row;
                          const currentMetricName = rowText || group.title;
                          
                          return (
                            <tr key={rowIndex} className="text-center hover:bg-blue-50/30 transition-colors">
                              
                              {/* Left Concept First Column */}
                              {rowIndex === 0 && (
                                <td 
                                  rowSpan={group.isSingle ? 1 : group.rows.length} 
                                  colSpan={group.isSingle ? 2 : 1}
                                  className={`border border-gray-400 py-3 bg-blue-100/50 font-sans font-bold text-blue-900 px-4 align-middle text-[11px] leading-tight ${group.isSingle ? 'text-left' : 'text-center w-40'}`}
                                >
                                  <div className={`flex items-center gap-2 ${group.isSingle ? 'justify-between' : 'justify-center'}`}>
                                    <span>{group.title}</span>
                                    {group.isSingle && (
                                      <button 
                                        onClick={() => handleConceptNavigation(group.title, null)}
                                        className="text-[#0059e4] hover:text-[#0048b3] shrink-0 focus:outline-none p-1 bg-white hover:bg-slate-100 rounded-lg border border-blue-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
                                        title={`Ver listado de pacientes filtrado por ${group.title}`}
                                      >
                                        <UsersSvgIcon className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              )}

                              {/* Left Concept Subcategory / Second Column if available */}
                              {!group.isSingle && (
                                <td className={`border border-gray-400 py-3 bg-blue-50/20 font-sans font-medium text-left px-4 w-64 ${typeof row === 'object' ? row.className : ''}`}>
                                  <div className="flex justify-between items-center gap-2">
                                    <span className="leading-tight">{rowText}</span>
                                    
                                    {/* Link directo a listado de pacientes con filtro */}
                                    <button 
                                      onClick={() => handleConceptNavigation(group.title, currentMetricName)}
                                      className="text-[#0059e4] hover:text-[#0048b3] shrink-0 focus:outline-none p-1 bg-blue-50 hover:bg-blue-100/50 rounded-lg border border-blue-100 transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
                                      title={`Ver listado de pacientes filtrado por ${currentMetricName}`}
                                    >
                                      <UsersSvgIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              )}

                              {/* Ambos Column */}
                              <td className="border border-gray-400 py-3 font-bold text-blue-700 bg-blue-50/30 w-16">
                                {selectedEstablecimiento === 'Curepto' ? '38' : selectedEstablecimiento === 'Hualañé' ? '42' : '80'}
                              </td>
                              {/* Hombres/Mujeres Total Column */}
                              <td className="border border-gray-400 py-3 text-gray-700 font-medium w-16">
                                {selectedEstablecimiento === 'Curepto' ? '18' : selectedEstablecimiento === 'Hualañé' ? '22' : '40'}
                              </td>
                              <td className="border border-gray-400 py-3 text-gray-700 font-medium w-16">
                                {selectedEstablecimiento === 'Curepto' ? '20' : selectedEstablecimiento === 'Hualañé' ? '20' : '40'}
                              </td>
                              
                              {/* Age Group Columns */}
                              {[...Array(currentAgeGroups.length * 2)].map((_, i) => (
                                <td key={`cell-${i}`} className="border border-gray-400 py-3 text-slate-500 w-16">
                                  {i % 3 === 0 ? '4' : i % 2 === 0 ? '2' : '1'}
                                </td>
                              ))}

                            </tr>
                          );
                        })}
                      </Fragment>
                    ))}
                  </tbody>

                </table>
              </div>



            </div>
          </div>
        </div>

      </div>

      {/* --- DRILL DOWN / ASSOCIATED PATIENTS MODAL DIALOG --- */}
      {associatedPatientsData.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4 text-left">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-100 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-6 bg-[#0059E4] text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md text-white">
                  <UserCheck size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold leading-none">{associatedPatientsData.title}</h3>
                  <p className="text-blue-100 text-[10px] uppercase font-bold tracking-wider mt-1.5">Nómina Operativa de Trazabilidad</p>
                </div>
              </div>
              <button 
                onClick={() => setAssociatedPatientsData(prev => ({ ...prev, isOpen: false }))}
                className="text-white hover:bg-white/10 font-bold p-1.5 rounded-full transition-colors font-mono"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
              <p className="text-xs text-slate-500 font-semibold">{associatedPatientsData.description}</p>
              
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-3xs">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="py-2.5 px-4 font-bold text-slate-505 text-[10px] uppercase tracking-wider">Nombre del Paciente</th>
                      <th className="py-2.5 px-3 font-bold text-slate-505 text-[10px] uppercase tracking-wider">RUT</th>
                      <th className="py-2.5 px-3 font-bold text-slate-505 text-[10px] uppercase tracking-wider">Centro</th>
                      <th className="py-2.5 px-3 font-bold text-slate-505 text-[10px] uppercase tracking-wider">Indicador/Trama</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {associatedPatientsData.patients.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800">{p.name}</td>
                        <td className="py-3 px-3 font-mono font-medium text-slate-500">{p.rut}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-100">
                            {p.establishment}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                            {p.val}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-150/40 flex items-start gap-3">
                <HelpCircle size={15} className="text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wide">Acceso Seguro a la Ficha del Paciente (VIPENT)</h4>
                  <p className="text-[10.5px] font-semibold text-slate-500 leading-normal">
                    Para visualizar diagnósticos detallados, metas de compensación, controles de riesgo biológicos e interconsultas pendientes, diríjase a la sección <strong className="font-extrabold text-slate-700">"Pacientes PSCV"</strong> del menú principal.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setAssociatedPatientsData(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 bg-white text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
              >
                Cerrar Nómina
              </button>
              
              <button 
                onClick={() => {
                  setAssociatedPatientsData(prev => ({ ...prev, isOpen: false }));
                  if (onNavigate) {
                    onNavigate('PACIENTES');
                  } else {
                    alert('Utilice la pestaña "Pacientes PSCV" en la barra de navegación lateral.');
                  }
                }}
                className="px-4 py-2 bg-[#0059E4] hover:bg-[#0048B3] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-3xs"
              >
                <CornerDownRight size={13} />
                Ir a Listado Pacientes
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- REQUISITO 4: VALIDATION OBSERVATIONS MODAL DIALOG --- */}
      {showValidationModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4 text-left">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-100 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-5 bg-indigo-600 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md text-white">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold leading-none">Observaciones de Validación REM-P4</h3>
                  <p className="text-indigo-150 text-[10px] uppercase font-bold tracking-wider mt-1.5">Consistencia y validación ministerial</p>
                </div>
              </div>
              <button 
                onClick={() => setShowValidationModal(false)}
                className="text-white hover:bg-white/10 font-bold p-1.5 rounded-full transition-colors font-mono"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
              <p className="text-xs text-slate-500 font-semibold">
                Siguiente consolidación de advertencias y alertas menores calculadas automáticamente por los parámetros de validación del REM-P4. Resuelva las inconsistencias clínicas para evitar rechazos en el cierre.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {clinicalObservatios.map((obs) => (
                  <div key={obs.key} className="p-3 bg-slate-50/70 border border-slate-250 rounded-lg flex justify-between items-center hover:bg-slate-50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold tracking-widest ${obs.color}`}>
                          {obs.severity}
                        </span>
                        <span className="text-xs font-bold text-slate-800 leading-none">{obs.title}</span>
                      </div>
                      <p className="text-[10px] font-medium text-slate-400">Total identificados: <strong className="font-mono text-slate-700">{obs.count} personas</strong></p>
                    </div>
                    <button 
                      onClick={() => {
                        setShowValidationModal(false);
                        handleReviewIssue(obs.key);
                      }}
                      className="px-2.5 py-1 text-[10px] font-bold text-blue-600 border border-blue-250 rounded hover:bg-white hover:shadow-3xs transition-all active:scale-95 flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      Revisar
                      <ArrowUpRight size={11} className="text-blue-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button 
                onClick={() => setShowValidationModal(false)}
                className="px-4 py-2 bg-white text-slate-505 hover:text-slate-700 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
              >
                Cerrar Validación
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- REQUISITO 5: COMPLIANT ORIGIN AND TRACEBIILITY MODAL --- */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4 text-left">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-150 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-5 bg-slate-800 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md text-white">
                  <Database size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold leading-none">Origen y Trazabilidad del Reporte</h3>
                  <p className="text-slate-300 text-[10px] uppercase font-bold tracking-wider mt-1.5">Metadatos técnicos y de consolidación</p>
                </div>
              </div>
              <button 
                onClick={() => setShowInfoModal(false)}
                className="text-white hover:bg-white/10 font-bold p-1.5 rounded-full transition-colors font-mono"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs font-medium text-slate-650">
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-extrabold uppercase text-[9px] tracking-wider">Fuente Principal</span>
                  <span className="font-extrabold text-slate-800">SISMAULE (Ficha Integral Integrada)</span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-extrabold uppercase text-[9px] tracking-wider">Última Sincronización</span>
                  <span className="font-extrabold text-slate-850">{lastUpdate}</span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-150 pb-2">
                  <span className="text-slate-400 font-extrabold uppercase text-[9px] tracking-wider">Responsable / Operador</span>
                  <span className="font-extrabold text-slate-855">Carlos Mendoza (Clínico Líder)</span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-extrabold uppercase text-[9px] tracking-wider">Registros Procesados</span>
                  <span className="font-extrabold text-slate-850">1.248 pacientes bajo control</span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-extrabold uppercase text-[9px] tracking-wider">Estado de Rescate</span>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide rounded-lg border border-emerald-150">
                    Correcto
                  </span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/55 rounded-xl border border-blue-100/50 flex gap-2.5 mt-2">
                <span className="text-blue-600 font-extrabold text-sm leading-none shrink-0">i</span>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                  Este reporte ministerial se rescata dinámicamente desde fichas clínicas comunales de Hualañé y Curepto, utilizando llaves SHA-256 de seguridad sanitaria para sincronización con repositorios nacionales.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button 
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 bg-white text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
