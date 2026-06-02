import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Calendar, 
  Stethoscope,
  Plus, 
  ChevronRight, 
  HeartPulse,
  FileBarChart,
  Activity,
  Edit3,
  X,
  Save,
  Trash2,
  Settings,
  ShieldAlert,
  Bell,
  Clock,
  TrendingUp,
  AlertTriangle,
  LayoutDashboard
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import MiniCalendar from './MiniCalendar';
import { APPOINTMENTS_MOCK } from '../types';
import CalendarQuickViewModal from './CalendarQuickViewModal';
import { createPortal } from 'react-dom';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Update trend data of Recharts to show Compensados and No Compensados over the last 6 months
const trendData = [
  { name: 'ENE', compensados: 680, noCompensados: 250 },
  { name: 'FEB', compensados: 710, noCompensados: 240 },
  { name: 'MAR', compensados: 750, noCompensados: 232 },
  { name: 'ABR', compensados: 814, noCompensados: 228 },
  { name: 'MAY', compensados: 848, noCompensados: 214 },
  { name: 'JUN', compensados: 890, noCompensados: 198 },
];

const kpis = {
  pscvActivos: { label: 'Pacientes PSCV Activos', value: '1.248', color: 'text-emerald-500', icon: Users, bg: 'bg-emerald-50/50' },
  altoRiesgo: { label: 'Alto Riesgo', value: '86', color: 'text-rose-600', icon: HeartPulse, bg: 'bg-rose-50/50' },
  noCompensados: { label: 'No Compensados', value: '214', color: 'text-amber-500', icon: Activity, bg: 'bg-amber-50/50' },
  seguimientoVencido: { label: 'Seguimiento Vencido', value: '57', color: 'text-red-500', icon: Calendar, bg: 'bg-red-50/50' },
};

const prioritiesData = [
  { id: 'CONTACTAR_HOY', title: 'Pacientes para contactar hoy', count: '24', desc: 'Seguimiento telefónico y citaciones pendientes', btnLabel: 'Ver nómina', color: 'border-l-teal-500 text-teal-600', bg: 'bg-teal-50/40', filter: { actionFilter: 'CONTACTAR_HOY' } },
  { id: 'SIN_CITA', title: 'Pacientes sin próxima cita', count: '32', desc: 'Alta de ciclo/controles sin cita agendada', btnLabel: 'Agendar', color: 'border-l-indigo-500 text-indigo-600', bg: 'bg-indigo-50/40', filter: { actionFilter: 'SIN_PROXIMA_CITA' } },
  { id: 'EXAMENES_PENDIENTES', title: 'Exámenes pendientes críticos', count: '18', desc: 'Perfil lipídico y HbA1c desactualizados', btnLabel: 'Revisar', color: 'border-l-amber-500 text-amber-600', bg: 'bg-amber-50/40', filter: { actionFilter: 'EXAMENES_PENDIENTES' } },
  { id: 'RESCATE_INASISTENCIA', title: 'Rescate por inasistencia', count: '11', desc: 'Inasistentes a controles médicos del mes', btnLabel: 'Gestionar rescate', color: 'border-l-rose-500 text-rose-600', bg: 'bg-rose-50/40', filter: { actionFilter: 'RESCATE_INASISTENCIA' } },
];

const recentAlertsData = [
  { id: 1, patientId: '2', patientName: 'María López', type: 'Control Vencido', description: 'María López (HTA) no registra control hace 4 meses.', severity: 'Alta', date: '2026-05-25' },
  { id: 2, patientId: '3', patientName: 'Carlos Sánchez', type: 'Examen Pendiente', description: 'Carlos Sánchez (DM2) requiere evaluación HbA1c.', severity: 'Media', date: '2026-05-24' },
  { id: 3, patientId: '4', patientName: 'Ana Torres', type: 'Sin Próxima Cita', description: 'Ana Torres finalizó ciclo dietoterapéutico sin re-agendar.', severity: 'Media', date: '2026-05-23' },
  { id: 4, patientId: '1', patientName: 'Cristian Abud', type: 'Riesgo de Abandono', description: 'Cristian Abud registra 2 inasistencias consecutivas.', severity: 'Alta', date: '2026-05-22' },
  { id: 5, patientId: '2', patientName: 'Pedro Vera', type: 'Inasistencia Reciente', description: 'Pedro Vera no asistió a control de enfermería programado.', severity: 'Baja', date: '2026-05-21' },
];

const remP4Indicators = [
  { label: 'DM2 Compensados', value: '52%', percentage: 52, desc: 'Meta nacional HbA1c < 7.0%', color: 'bg-emerald-500', trackColor: 'bg-emerald-50' },
  { label: 'Evaluación Anual de Pie DM2', value: '88%', percentage: 88, desc: 'Vigencia examen monofilamento', color: 'bg-blue-600', trackColor: 'bg-blue-50' },
  { label: 'HTA Compensados', value: '69%', percentage: 69, desc: 'Meta nacional PA < 140/90', color: 'bg-indigo-500', trackColor: 'bg-indigo-50' },
];

// Predefined available widgets
const AVAILABLE_WIDGETS = [
  { id: 'kpi-pscv-activos', title: 'KPI: Pacientes PSCV Activos' },
  { id: 'kpi-alto-riesgo', title: 'KPI: Alto Riesgo' },
  { id: 'kpi-no-compensados', title: 'KPI: No Compensados' },
  { id: 'kpi-seguimiento-vencido', title: 'KPI: Seguimiento Vencido' },
  { id: 'chart-trends', title: 'Gráfico: Tendencias PSCV' },
  { id: 'quick-actions', title: 'Accesos Directos' },
  { id: 'chronic-indicators', title: 'Cumplimiento REM-P4' },
  { id: 'recent-alerts', title: 'Alertas Recientes' },
  { id: 'tracking-priorities', title: 'Acciones prioritarias' },
  { id: 'my-calendar', title: 'Agenda de Hoy' },
];

const defaultLayouts = {
  lg: [
    { i: 'kpi-pscv-activos', x: 0, y: 0, w: 3, h: 4, minW: 3, minH: 3 },
    { i: 'kpi-alto-riesgo', x: 3, y: 0, w: 3, h: 4, minW: 3, minH: 3 },
    { i: 'kpi-no-compensados', x: 6, y: 0, w: 3, h: 4, minW: 3, minH: 3 },
    { i: 'kpi-seguimiento-vencido', x: 9, y: 0, w: 3, h: 4, minW: 3, minH: 3 },
    
    { i: 'chart-trends', x: 0, y: 4, w: 8, h: 10, minW: 4, minH: 8 },
    { i: 'quick-actions', x: 8, y: 4, w: 4, h: 5, minW: 3, minH: 4 },
    { i: 'my-calendar', x: 8, y: 9, w: 4, h: 8, minW: 3, minH: 6 },
    
    { i: 'tracking-priorities', x: 0, y: 14, w: 8, h: 7, minW: 4, minH: 5 },
    { i: 'chronic-indicators', x: 0, y: 21, w: 4, h: 7, minW: 3, minH: 4 },
    { i: 'recent-alerts', x: 4, y: 21, w: 8, h: 7, minW: 4, minH: 5 },
  ],
  md: [
    { i: 'kpi-pscv-activos', x: 0, y: 0, w: 2, h: 4, minW: 2, minH: 3 },
    { i: 'kpi-alto-riesgo', x: 2, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
    { i: 'kpi-no-compensados', x: 5, y: 0, w: 2, h: 4, minW: 2, minH: 3 },
    { i: 'kpi-seguimiento-vencido', x: 7, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
    
    { i: 'chart-trends', x: 0, y: 4, w: 6, h: 10, minW: 4, minH: 8 },
    { i: 'quick-actions', x: 6, y: 4, w: 4, h: 5, minW: 3, minH: 4 },
    { i: 'my-calendar', x: 6, y: 9, w: 4, h: 8, minW: 3, minH: 6 },
    
    { i: 'tracking-priorities', x: 0, y: 14, w: 6, h: 7, minW: 4, minH: 5 },
    { i: 'chronic-indicators', x: 0, y: 21, w: 4, h: 7, minW: 3, minH: 4 },
    { i: 'recent-alerts', x: 4, y: 21, w: 6, h: 7, minW: 4, minH: 5 },
  ],
  sm: [
    { i: 'kpi-pscv-activos', x: 0, y: 0, w: 3, h: 4, minW: 2, minH: 2 },
    { i: 'kpi-alto-riesgo', x: 3, y: 0, w: 3, h: 4, minW: 2, minH: 2 },
    { i: 'kpi-no-compensados', x: 0, y: 4, w: 3, h: 4, minW: 2, minH: 2 },
    { i: 'kpi-seguimiento-vencido', x: 3, y: 4, w: 3, h: 4, minW: 2, minH: 2 },
    
    { i: 'chart-trends', x: 0, y: 8, w: 6, h: 9, minW: 3, minH: 6 },
    { i: 'quick-actions', x: 0, y: 17, w: 6, h: 5, minW: 2, minH: 3 },
    { i: 'my-calendar', x: 0, y: 22, w: 6, h: 8, minW: 2, minH: 5 },
    
    { i: 'tracking-priorities', x: 0, y: 30, w: 6, h: 7, minW: 3, minH: 4 },
    { i: 'chronic-indicators', x: 0, y: 37, w: 6, h: 7, minW: 3, minH: 4 },
    { i: 'recent-alerts', x: 0, y: 44, w: 6, h: 6, minW: 3, minH: 4 },
  ],
  xs: [
    { i: 'kpi-pscv-activos', x: 0, y: 0, w: 2, h: 4, minW: 2, minH: 2 },
    { i: 'kpi-alto-riesgo', x: 2, y: 0, w: 2, h: 4, minW: 2, minH: 2 },
    { i: 'kpi-no-compensados', x: 0, y: 4, w: 2, h: 4, minW: 2, minH: 2 },
    { i: 'kpi-seguimiento-vencido', x: 2, y: 4, w: 2, h: 4, minW: 2, minH: 2 },
    
    { i: 'chart-trends', x: 0, y: 8, w: 4, h: 9, minW: 2, minH: 5 },
    { i: 'tracking-priorities', x: 0, y: 17, w: 4, h: 7, minW: 2, minH: 4 },
    { i: 'quick-actions', x: 0, y: 24, w: 4, h: 5, minW: 2, minH: 3 },
    { i: 'my-calendar', x: 0, y: 29, w: 4, h: 8, minW: 2, minH: 5 },
    { i: 'chronic-indicators', x: 0, y: 37, w: 4, h: 7, minW: 2, minH: 3 },
    { i: 'recent-alerts', x: 0, y: 44, w: 4, h: 6, minW: 2, minH: 3 },
  ],
  xxs: [
    { i: 'kpi-pscv-activos', x: 0, y: 0, w: 2, h: 4, minW: 1, minH: 2 },
    { i: 'kpi-alto-riesgo', x: 0, y: 4, w: 2, h: 4, minW: 1, minH: 2 },
    { i: 'kpi-no-compensados', x: 0, y: 8, w: 2, h: 4, minW: 1, minH: 2 },
    { i: 'kpi-seguimiento-vencido', x: 0, y: 12, w: 2, h: 4, minW: 1, minH: 2 },
    
    { i: 'chart-trends', x: 0, y: 16, w: 2, h: 9, minW: 1, minH: 5 },
    { i: 'tracking-priorities', x: 0, y: 25, w: 2, h: 7, minW: 1, minH: 4 },
    { i: 'quick-actions', x: 0, y: 32, w: 2, h: 5, minW: 1, minH: 3 },
    { i: 'my-calendar', x: 0, y: 37, w: 2, h: 8, minW: 1, minH: 5 },
    { i: 'chronic-indicators', x: 0, y: 45, w: 2, h: 7, minW: 1, minH: 3 },
    { i: 'recent-alerts', x: 0, y: 52, w: 2, h: 6, minW: 1, minH: 3 },
  ]
};

const ALL_ACTIONS = [
  { id: 'PACIENTES', label: 'Ver Pacientes PSCV', icon: Users, color: 'bg-orange-500' },
  { id: 'AGENDA', label: 'Ver Agenda', icon: Calendar, color: 'bg-emerald-500' },
  { id: 'REPORTE_REM', label: 'Ver REM-P4', icon: FileBarChart, color: 'bg-brand-blue' },
  { id: 'ALERTAS', label: 'Pacientes con alertas', icon: Bell, color: 'bg-red-500' },
  { id: 'AUDIT_LOG', label: 'Ver Auditoría', icon: Activity, color: 'bg-slate-700' },
  { id: 'USER_PROFILE', label: 'Mi Perfil', icon: Settings, color: 'bg-indigo-500' },
];

export default function Dashboard({ 
  onNavigateToCalendar, 
  onNavigate,
  onNewAppointment
}: { 
  onNavigateToCalendar?: (date: Date) => void,
  onNavigate?: (view: any, params?: any) => void,
  onNewAppointment?: () => void
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<string>(() => {
    return localStorage.getItem('dashboard_selected_facility') || 'Todos';
  });
  const [selectedPeriod, setSelectedPeriod] = useState<string>(() => {
    return localStorage.getItem('dashboard_selected_period') || 'Mes actual';
  });
  const [selectedWidgetDate, setSelectedWidgetDate] = useState<Date>(new Date());
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [layouts, setLayouts] = useState<React.ComponentProps<typeof ResponsiveGridLayout>['layouts']>(defaultLayouts);
  const [activeWidgets, setActiveWidgets] = useState<string[]>(
    defaultLayouts.lg.map(item => item.i)
  );
  // Default selected actions are updated to suggested list
  const [activeActions, setActiveActions] = useState<string[]>(['PACIENTES', 'AGENDA', 'REPORTE_REM', 'ALERTAS']);
  const [chartVisible, setChartVisible] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartDimensions, setChartDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    const savedLayout = localStorage.getItem('dashboard_layout');
    const savedWidgets = localStorage.getItem('dashboard_widgets');
    const savedActions = localStorage.getItem('dashboard_actions');
    
    const migrateWidgetIds = (wId: string) => {
      if (wId === 'kpi-users') return 'kpi-pscv-activos';
      if (wId === 'kpi-appointments') return 'kpi-no-compensados';
      if (wId === 'kpi-doctors') return 'kpi-alto-riesgo';
      if (wId === 'recent-activity') return 'recent-alerts';
      return wId;
    };

    if (savedLayout && savedWidgets) {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        let parsedWidgets = JSON.parse(savedWidgets);
        
        parsedWidgets = parsedWidgets.map(migrateWidgetIds);
        
        // Ensure standard widgets exist
        if (!parsedWidgets.includes('kpi-seguimiento-vencido')) {
          parsedWidgets.push('kpi-seguimiento-vencido');
        }
        if (!parsedWidgets.includes('tracking-priorities')) {
          parsedWidgets.push('tracking-priorities');
        }
        if (!parsedWidgets.includes('recent-alerts')) {
          parsedWidgets.push('recent-alerts');
        }

        const mergedLayout: Record<string, any[]> = {};
        const breakpointsKeys = ['lg', 'md', 'sm', 'xs', 'xxs'] as const;
        for (const bk of breakpointsKeys) {
          const dl = defaultLayouts[bk];
          const pl = parsedLayout[bk] || [];
          
          mergedLayout[bk] = dl.map(defaultItem => {
            const found = pl.find((pi: any) => migrateWidgetIds(pi.i) === defaultItem.i);
            if (found) {
              return { ...defaultItem, x: found.x, y: found.y, w: found.w, h: found.h };
            }
            return defaultItem;
          });
        }
        
        setLayouts(mergedLayout as any);
        setActiveWidgets(parsedWidgets);
      } catch (e) {
        console.error('Failed to parse dashboard layout', e);
      }
    }
    
    if (savedActions) {
      try {
        const parsedActions = JSON.parse(savedActions);
        // Map any old action ids to current ones if necessary
        const mappedActions = parsedActions.map((act: string) => {
          if (act === 'NEW_PATIENT') return 'PACIENTES';
          return act;
        });
        setActiveActions(Array.from(new Set(mappedActions)) as string[]);
      } catch (e) {
        console.error('Failed to parse dashboard actions', e);
      }
    }

    // Delay graph rendering until dimension calculations are ready
    const timer = setTimeout(() => {
      setChartVisible(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) {
        setChartDimensions({ width, height });
      }
    });

    observer.observe(chartContainerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [chartVisible]);

  const saveLayout = () => {
    setIsEditing(false);
    localStorage.setItem('dashboard_layout', JSON.stringify(layouts));
    localStorage.setItem('dashboard_widgets', JSON.stringify(activeWidgets));
    localStorage.setItem('dashboard_actions', JSON.stringify(activeActions));
  };

  const onLayoutChange = (currentLayout: any, allLayouts: any) => {
    if (isEditing) {
      setLayouts(allLayouts);
    }
  };

  const addWidget = (id: string) => {
    if (activeWidgets.includes(id)) return;
    
    setActiveWidgets(prev => [...prev, id]);
    setLayouts(prev => {
      const isChart = id.startsWith('chart') || id.startsWith('tracking');
      return {
        lg: [...(prev.lg || []), { i: id, x: 0, y: Infinity, w: isChart ? 8 : 4, h: isChart ? 10 : 6, minW: 3, minH: 3 }],
        md: [...(prev.md || []), { i: id, x: 0, y: Infinity, w: isChart ? 6 : 3, h: isChart ? 10 : 6, minW: 2, minH: 3 }],
        sm: [...(prev.sm || []), { i: id, x: 0, y: Infinity, w: isChart ? 6 : 4, h: isChart ? 9 : 6, minW: 2, minH: 3 }],
        xs: [...(prev.xs || []), { i: id, x: 0, y: Infinity, w: isChart ? 4 : 4, h: isChart ? 9 : 6, minW: 2, minH: 2 }],
        xxs: [...(prev.xxs || []), { i: id, x: 0, y: Infinity, w: isChart ? 2 : 2, h: isChart ? 9 : 6, minW: 1, minH: 2 }]
      };
    });
  };

  const removeWidget = (id: string) => {
    setActiveWidgets(prev => prev.filter(wId => wId !== id));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedWidgetDate(date);
    setIsQuickViewOpen(true);
  };

  const handleManageRedirect = () => {
    onNavigateToCalendar?.(selectedWidgetDate);
    setIsQuickViewOpen(false);
  };

  const restoreDefaultLayout = () => {
    setLayouts(defaultLayouts);
    setActiveWidgets(defaultLayouts.lg.map(item => item.i));
    setActiveActions(['PACIENTES', 'AGENDA', 'REPORTE_REM', 'ALERTAS']);
    localStorage.removeItem('dashboard_layout');
    localStorage.removeItem('dashboard_widgets');
    localStorage.removeItem('dashboard_actions');
  };

  const renderKPI = (kpiData: any) => (
    <div className="w-full h-full flex items-center justify-between gap-2 pointer-events-none overflow-hidden select-none">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider truncate">
          {kpiData.label}
        </p>
        <p className={`text-2xl sm:text-3xl lg:text-4xl font-black mt-1 ${kpiData.color} truncate leading-none`}>
          {kpiData.value}
        </p>
      </div>
      <div className={`p-2 sm:p-2.5 lg:p-3 rounded-xl shrink-0 ${kpiData.bg} flex items-center justify-center`}>
        <kpiData.icon className={kpiData.color} size={22} />
      </div>
    </div>
  );

  const handleActionClick = (actionId: string) => {
    if (isEditing) return;
    
    switch (actionId) {
      case 'PACIENTES':
        onNavigate?.('PACIENTES');
        break;
      case 'AGENDA':
        onNavigateToCalendar?.(new Date());
        break;
      case 'REPORTE_REM':
        onNavigate?.('REPORTE_REM');
        break;
      case 'ALERTAS':
        // TODO: implementar filtro CON_ALERTAS en PatientList.tsx
        onNavigate?.('PACIENTES', { actionFilter: 'CON_ALERTAS' });
        break;
      case 'AUDIT_LOG':
        onNavigate?.('AUDIT_LOG');
        break;
      case 'USER_PROFILE':
        onNavigate?.('USER_PROFILE');
        break;
      default:
        console.log('Action:', actionId);
    }
  };

  const renderWidgetContent = (id: string) => {
    switch (id) {
      case 'kpi-pscv-activos':
        return renderKPI(kpis.pscvActivos);
      case 'kpi-alto-riesgo':
        return renderKPI(kpis.altoRiesgo);
      case 'kpi-no-compensados':
        return renderKPI(kpis.noCompensados);
      case 'kpi-seguimiento-vencido':
        return renderKPI(kpis.seguimientoVencido);
        
      case 'chart-trends':
        return (
          <div className="w-full h-full flex flex-col space-y-4">
            <div className="flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider">Tendencias de Compensación PSCV</h3>
                <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Últimos 6 meses</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Compensados</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">No Compensados</span>
                </div>
              </div>
            </div>
            
            <div ref={chartContainerRef} className="flex-1 min-h-[150px] w-full flex items-center justify-center overflow-hidden">
              {chartVisible && chartDimensions.width > 0 && chartDimensions.height > 0 ? (
                <BarChart width={chartDimensions.width} height={chartDimensions.height} data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="compensados" name="Compensados" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={26} />
                  <Bar dataKey="noCompensados" name="No compensados" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={26} />
                </BarChart>
              ) : (
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Calculando dimensiones...</span>
              )}
            </div>
          </div>
        );
        
      case 'tracking-priorities':
        return (
          <div className="w-full h-full flex flex-col">
            <div className="mb-3 shrink-0 flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-brand-blue uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp size={16} />
                  Acciones prioritarias
                </h3>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase hidden sm:inline">PSCV</span>
            </div>
            <div className="flex-1 overflow-y-auto pr-1 min-h-0 grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
              {prioritiesData.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-3 rounded-xl border-l-[4px] border border-gray-100 ${item.color} ${item.bg} flex items-center justify-between gap-3 transition-all hover:shadow-xs text-xs`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black leading-none">{item.count}</span>
                      <h4 className="text-xs font-bold text-gray-900 truncate">{item.title}</h4>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium leading-snug mt-1 truncate" title={item.desc}>
                      {item.desc}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      // TODO: implementar soporte de actionFilter en PatientList.tsx
                      onNavigate?.('PACIENTES', item.filter);
                    }}
                    className="shrink-0 px-2.5 py-1.5 bg-white hover:bg-brand-blue text-brand-blue hover:text-white border border-gray-200 hover:border-brand-blue rounded-lg text-[9px] font-bold transition-all uppercase tracking-wider shadow-2xs"
                  >
                    {item.btnLabel}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'recent-alerts':
        return (
          <div className="w-full h-full flex flex-col">
            <div className="mb-3 shrink-0 flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert size={16} />
                Alertas Recientes
              </h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Filtro PSCV</span>
            </div>
            <div className="flex-1 space-y-2.5 overflow-y-auto pr-1 custom-scrollbar min-h-0">
              {recentAlertsData.map((alert) => (
                <div 
                  key={alert.id} 
                  className="p-2.5 bg-gray-50 hover:bg-white rounded-lg border border-gray-100 flex items-center justify-between gap-3 transition-colors text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] uppercase ${
                        alert.severity === 'Alta' 
                          ? 'bg-rose-100 text-rose-700' 
                          : alert.severity === 'Media' 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'bg-slate-100 text-slate-700'
                      }`}>
                        {alert.type}
                      </span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase">Sev. {alert.severity}</span>
                    </div>
                    <p className="text-gray-650 font-medium text-[11px] leading-snug mt-1 text-slate-600">
                      {alert.description}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      // TODO: implementar apertura directa de detalle de paciente por patientId
                      onNavigate?.('PACIENTES', { patientId: alert.patientId });
                    }}
                    className="shrink-0 px-2 py-1 bg-white hover:bg-brand-blue border border-gray-200 hover:border-brand-blue rounded text-[9px] font-bold text-gray-650 hover:text-white transition-all uppercase tracking-wider"
                  >
                    Revisar
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'chronic-indicators':
        return (
          <div className="w-full h-full flex flex-col">
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5 shrink-0 mb-3">
              <FileBarChart size={16} className="text-brand-blue" />
              Cumplimiento REM-P4
            </h3>
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-3.5 min-h-0">
              {remP4Indicators.map((ind, i) => (
                <div key={i} className="flex flex-col text-xs">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-gray-700 pr-2 truncate" title={ind.label}>{ind.label}</span>
                    <span className="font-black text-slate-900 text-sm shrink-0">{ind.value}</span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${ind.trackColor} overflow-hidden`}>
                    <div 
                      className={`h-full ${ind.color} rounded-full`}
                      style={{ width: `${ind.percentage}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-gray-400 font-medium mt-0.5">{ind.desc}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'quick-actions':
        const actionsToDisplay = ALL_ACTIONS.filter(action => activeActions.includes(action.id));
        return (
          <div className="w-full h-full flex flex-col">
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 sm:mb-3 shrink-0">Accesos Directos</h3>
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar grid grid-cols-[repeat(auto-fill,minmax(max(200px,30%),1fr))] gap-2 auto-rows-min content-start min-h-0">
              {actionsToDisplay.map((action) => (
                <div key={action.id} className="group/action relative">
                  <button
                    onClick={() => handleActionClick(action.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90 shadow-sm ${action.color}`}
                  >
                    <div className="flex items-center gap-3">
                      <action.icon size={18} />
                      <span className="truncate">{action.label}</span>
                    </div>
                    <ChevronRight size={16} className="opacity-50 shrink-0" />
                  </button>
                  {isEditing && (
                    <button 
                      onClick={() => setActiveActions(prev => prev.filter(id => id !== action.id))}
                      className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover/action:opacity-100 transition-opacity z-10"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                onClick={() => setIsShortcutsModalOpen(true)}
                className="w-full flex items-center justify-center p-3 rounded-lg border-2 border-dashed border-gray-200 text-gray-400 hover:text-brand-blue hover:border-brand-blue hover:bg-blue-50 transition-all group min-h-[46px]"
              >
                <Plus size={20} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        );

      case 'my-calendar':
        const appointmentsCount = APPOINTMENTS_MOCK.filter(a => a.date === selectedWidgetDate.toISOString().split('T')[0]).length;
        return (
          <div className="w-full h-full flex flex-col">
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5 shrink-0 mb-2 sm:mb-3">
              <Calendar size={16} className="text-brand-blue" />
              Agenda de Hoy
            </h3>
            <div className="flex-1 overflow-auto no-scrollbar min-h-0">
              <MiniCalendar 
                appointments={APPOINTMENTS_MOCK}
                selectedDate={selectedWidgetDate}
                onDateClick={handleDateSelect} 
              />
            </div>
            
            <CalendarQuickViewModal 
              isOpen={isQuickViewOpen}
              onClose={() => setIsQuickViewOpen(false)}
              date={selectedWidgetDate}
              appointmentCount={appointmentsCount}
              onManageClick={handleManageRedirect}
            />
          </div>
        );

      default:
        return <div>Widget Desconocido</div>;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative bg-[#f3f4f6]">
      {/* Header */}
      <div className="p-6 md:p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 shrink-0 mb-6 font-sans animate-fade-in">
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <LayoutDashboard className="text-brand-blue animate-pulse" size={24} />
              <span>Dashboard PSCV</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Resumen operativo del seguimiento cardiovascular</p>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 shadow-xs mr-2 ml-2">
            <Activity size={14} className="text-rose-500 animate-pulse" />
            <span>Monitoreo Piloto</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-600 shadow-xs">
              <span className="text-gray-400 font-medium font-sans">Establecimiento:</span>
              <select 
                value={selectedFacility}
                onChange={(e) => {
                  const facility = e.target.value;
                  setSelectedFacility(facility);
                  localStorage.setItem('dashboard_selected_facility', facility);
                }}
                className="border-none bg-transparent font-bold text-gray-800 focus:outline-none focus:ring-0 cursor-pointer py-0 text-xs"
              >
                <option value="Todos">Todos</option>
                <option value="Hualañé">Hualañé</option>
                <option value="Curepto">Curepto</option>
              </select>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-600 shadow-xs">
              <span className="text-gray-400 font-medium font-sans">Periodo:</span>
              <select 
                value={selectedPeriod}
                onChange={(e) => {
                  const period = e.target.value;
                  setSelectedPeriod(period);
                  localStorage.setItem('dashboard_selected_period', period);
                }}
                className="border-none bg-transparent font-bold text-gray-800 focus:outline-none focus:ring-0 cursor-pointer py-0 text-xs"
              >
                <option value="Mes actual">Mes actual</option>
                <option value="Últimos 3 meses">Últimos 3 meses</option>
                <option value="Últimos 12 meses">Últimos 12 meses</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          {isEditing ? (
            <motion.button
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={saveLayout}
              className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-semibold shadow-md hover:bg-blue-900 transition-colors cursor-pointer"
            >
              <Save size={16} />
              Guardar Cambios
            </motion.button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 rounded-lg text-sm font-semibold border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Edit3 size={16} />
              Personalizar
            </button>
          )}
        </div>
      </div>

      {/* Editing Toolbar */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 overflow-hidden shrink-0"
          >
            <div className="p-4 bg-white rounded-xl border border-blue-100 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-brand-blue">
                  <Settings size={18} />
                  <h3 className="text-sm font-bold uppercase tracking-wide">Widgets Disponibles</h3>
                </div>
                <button
                  onClick={restoreDefaultLayout}
                  className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg border border-rose-200 transition-colors"
                >
                  <Trash2 size={13} />
                  Restaurar diseño
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_WIDGETS.filter(w => !activeWidgets.includes(w.id)).length === 0 && (
                  <span className="text-sm text-gray-400 italic">Todos los widgets están en uso.</span>
                )}
                {AVAILABLE_WIDGETS.filter(w => !activeWidgets.includes(w.id)).map(widget => (
                  <button
                    key={widget.id}
                    onClick={() => addWidget(widget.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-brand-blue rounded-lg border border-gray-200 hover:border-blue-200 text-sm font-medium transition-colors"
                  >
                    <Plus size={14} />
                    {widget.title}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Layout */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        <div className="min-h-full">
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={30}
            onLayoutChange={onLayoutChange}
            isDraggable={isEditing}
            isResizable={isEditing}
            draggableHandle=".drag-handle"
            margin={[20, 20]}
            useCSSTransforms={true}
          >
            {activeWidgets.map((id) => (
              <div 
                key={id} 
                className={`group bg-white rounded-xl border ${isEditing ? 'border-dashed border-blue-300 shadow-sm animate-pulse-slow' : 'border-gray-200 shadow-sm'} flex flex-col relative overflow-hidden`}
              >
                {/* Drag handle area when editing */}
                {isEditing && (
                  <div className="drag-handle absolute top-0 left-0 right-0 h-5 sm:h-6 bg-blue-50/80 cursor-move border-b border-blue-100 flex items-center justify-center z-10">
                     <div className="w-8 sm:w-10 h-1 bg-blue-200 rounded-full animate-bounce-slow" />
                  </div>
                )}
                
                {/* Remove Widget Button */}
                {isEditing && (
                  <button
                    onClick={() => removeWidget(id)}
                    className="absolute top-0.5 right-0.5 z-20 p-1 bg-white text-gray-400 hover:text-red-500 rounded-md shadow-sm border border-gray-100 transition-colors"
                    title="Eliminar widget"
                  >
                    <Trash2 size={12} />
                  </button>
                )}

                {/* Content */}
                <div className={`p-3.5 sm:p-5 w-full h-full flex-1 flex flex-col min-h-0 ${isEditing ? 'pt-7 sm:pt-9' : ''}`}>
                  {renderWidgetContent(id)}
                </div>
                
                {/* Visual indicator for resizing corner */}
                {isEditing && (
                  <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-blue-300 rounded-br-sm opacity-50 cursor-se-resize pointer-events-none" />
                )}
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>
      </div>

      {/* Shortcuts Modal */}
      {isShortcutsModalOpen && createPortal(
         <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col"
           >
             <div className="p-4 flex justify-between items-center border-b border-gray-100 shrink-0">
               <div className="flex items-center gap-2">
                 <div className="p-2 bg-blue-50 rounded-lg text-brand-blue">
                   <Plus size={18} />
                 </div>
                 <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Personalizar Accesos</h3>
               </div>
               <button 
                 onClick={() => setIsShortcutsModalOpen(false)} 
                 className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
               >
                 <X size={20} />
               </button>
             </div>
 
             <div className="p-6">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Funcionalidades Disponibles</p>
               <div className="grid grid-cols-1 gap-2">
                 {ALL_ACTIONS.map((action) => {
                   const isActive = activeActions.includes(action.id);
                   return (
                     <button
                       key={action.id}
                       onClick={() => {
                         if (isActive) {
                           setActiveActions(prev => prev.filter(id => id !== action.id));
                         } else {
                           setActiveActions(prev => [...prev, action.id]);
                         }
                       }}
                       className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                         isActive 
                           ? 'border-brand-blue bg-blue-50 text-brand-blue' 
                           : 'border-gray-50 bg-gray-50 text-gray-600 hover:border-gray-200'
                       }`}
                     >
                       <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-lg ${isActive ? 'bg-brand-blue text-white' : 'bg-white text-gray-400 shadow-sm'}`}>
                           <action.icon size={18} />
                         </div>
                         <span className="font-bold text-sm">{action.label}</span>
                       </div>
                       {isActive ? (
                         <div className="w-5 h-5 bg-brand-blue text-white rounded-full flex items-center justify-center">
                           <X size={12} strokeWidth={3} />
                         </div>
                       ) : (
                         <Plus size={18} className="text-gray-300" />
                       )}
                     </button>
                   );
                 })}
               </div>
             </div>
 
             <div className="p-6 bg-gray-50 border-t border-gray-100 shrink-0">
               <button 
                 onClick={() => setIsShortcutsModalOpen(false)}
                 className="w-full py-3.5 bg-brand-blue text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-blue-900 transition-all shadow-lg shadow-blue-200"
               >
                 Listo
               </button>
             </div>
           </motion.div>
         </div>,
         document.body
      )}
    </div>
  );
}
