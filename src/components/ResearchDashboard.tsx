import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Search, ShieldAlert, Download, Database, Users, AlertTriangle, AlertCircle, FileText, ChevronRight, Info, HeartPulse, Activity, Calendar, FileBarChart, Plus, X, Trash2, Edit3, Save, Settings, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, LabelList } from 'recharts';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { PATIENTS_MOCK } from '../types';
import { anonymizePatient } from '../utils/anonymization';
import { createPortal } from 'react-dom';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Definición de widgets disponibles
const AVAILABLE_WIDGETS = [
  { id: 'kpi-pscv-activos', title: 'KPI: Pacientes PSCV' },
  { id: 'kpi-alto-riesgo', title: 'KPI: Alto Riesgo' },
  { id: 'kpi-no-compensados', title: 'KPI: No Compensados' },
  { id: 'kpi-seguimiento-vencido', title: 'KPI: Seguimiento Vencido' },
  { id: 'chart-trends', title: 'Gráfico: Tendencias PSCV' },
  { id: 'chart-risk', title: 'Gráfico: Riesgo CV' },
  { id: 'chart-diagnosis', title: 'Gráfico: Diagnósticos' },
  { id: 'chronic-indicators', title: 'Cumplimiento REM-P4' },
  { id: 'aggregated-alerts', title: 'Alertas Agregadas' },
];

const defaultLayouts: any = {
  lg: [
    { i: 'kpi-pscv-activos', x: 0, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
    { i: 'kpi-alto-riesgo', x: 3, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
    { i: 'kpi-no-compensados', x: 6, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
    { i: 'kpi-seguimiento-vencido', x: 9, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
    
    { i: 'chart-trends', x: 0, y: 4, w: 8, h: 10, minW: 4, minH: 8 },
    { i: 'chronic-indicators', x: 8, y: 4, w: 4, h: 10, minW: 3, minH: 6 },
    
    { i: 'chart-risk', x: 0, y: 14, w: 6, h: 9, minW: 4, minH: 6 },
    { i: 'chart-diagnosis', x: 6, y: 14, w: 6, h: 9, minW: 4, minH: 6 },

    { i: 'aggregated-alerts', x: 0, y: 23, w: 12, h: 8, minW: 4, minH: 6 },
  ],
  md: [
    { i: 'kpi-pscv-activos', x: 0, y: 0, w: 2, h: 4, minW: 2, minH: 3 },
    { i: 'kpi-alto-riesgo', x: 2, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
    { i: 'kpi-no-compensados', x: 5, y: 0, w: 2, h: 4, minW: 2, minH: 3 },
    { i: 'kpi-seguimiento-vencido', x: 7, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
    
    { i: 'chart-trends', x: 0, y: 4, w: 6, h: 10, minW: 4, minH: 8 },
    { i: 'chronic-indicators', x: 6, y: 4, w: 4, h: 10, minW: 3, minH: 6 },
    
    { i: 'chart-risk', x: 0, y: 14, w: 5, h: 9, minW: 3, minH: 6 },
    { i: 'chart-diagnosis', x: 5, y: 14, w: 5, h: 9, minW: 3, minH: 6 },

    { i: 'aggregated-alerts', x: 0, y: 23, w: 10, h: 9, minW: 4, minH: 6 },
  ]
};

defaultLayouts.sm = defaultLayouts.lg;
defaultLayouts.xs = defaultLayouts.lg;
defaultLayouts.xxs = defaultLayouts.lg;

interface ResearchDashboardProps {
  onNavigate?: (view: any, params?: any) => void;
}

export default function ResearchDashboard({ onNavigate }: ResearchDashboardProps) {
  const [selectedFacility, setSelectedFacility] = useState<string>("Todos");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Mes actual");

  const filteredPatients = useMemo(() => {
    let patients = PATIENTS_MOCK.map(anonymizePatient);
    if (selectedFacility !== "Todos") {
      patients = patients.filter(p => p.establishment === selectedFacility);
    }
    return patients;
  }, [selectedFacility, selectedPeriod]);

  const totalPatients = filteredPatients.length;
  const highRiskPatients = filteredPatients.filter(p => p.risk === "Alto").length;
  const uncompensatedPatients = filteredPatients.filter(p => p.compensationStatus.toLowerCase().includes("no compensado")).length;
  const noAppointmentPatients = filteredPatients.filter(p => p.nextControlStatus === "Sin próxima cita" || p.nextControlStatus === "Control vencido").length;
  const pendingExamPatients = filteredPatients.filter(p => p.pendingExams.length > 0).length;

  const riskData = [
    { name: "Alto", value: highRiskPatients, color: "#e11d48" },
    { name: "Moderado", value: filteredPatients.filter(p => p.risk === "Moderado").length, color: "#d97706" },
    { name: "Bajo", value: filteredPatients.filter(p => p.risk === "Bajo").length, color: "#0284c7" },
  ];

  const estabData = [
    { name: "Hualañé", Compensado: filteredPatients.filter(p => p.establishment === "Hualañé" && p.compensationStatus === "Compensado").length, "No compensado": filteredPatients.filter(p => p.establishment === "Hualañé" && p.compensationStatus.toLowerCase().includes("no compensado")).length },
    { name: "Curepto", Compensado: filteredPatients.filter(p => p.establishment === "Curepto" && p.compensationStatus === "Compensado").length, "No compensado": filteredPatients.filter(p => p.establishment === "Curepto" && p.compensationStatus.toLowerCase().includes("no compensado")).length }
  ];

  const diagCounts = { HTA: 0, DM2: 0, Dislipidemia: 0, Obesidad: 0, ERC: 0 };
  filteredPatients.forEach(p => {
    p.diagnoses.forEach(d => {
      // @ts-ignore
      if (diagCounts[d] !== undefined) diagCounts[d]++;
    });
  });
  const diagData = Object.entries(diagCounts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  const totalDiagnoses = diagData.reduce((acc, curr) => acc + curr.value, 0);

  const trendData = [
    { name: "ENE", compensados: 680, noCompensados: 250 },
    { name: "FEB", compensados: 710, noCompensados: 240 },
    { name: "MAR", compensados: 750, noCompensados: 232 },
    { name: "ABR", compensados: 814, noCompensados: 228 },
    { name: "MAY", compensados: 848, noCompensados: 214 },
    { name: "JUN", compensados: 890, noCompensados: 198 },
  ];

  const remP4Indicators = [
    { label: "DM2 Compensados", value: "52%", percentage: 52, desc: "Meta nacional HbA1c < 7.0%", color: "bg-emerald-500", trackColor: "bg-emerald-50" },
    { label: "Evaluación Anual de Pie DM2", value: "88%", percentage: 88, desc: "Vigencia examen monofilamento", color: "bg-blue-600", trackColor: "bg-blue-50" },
    { label: "HTA Compensados", value: "69%", percentage: 69, desc: "Meta nacional PA < 140/90", color: "bg-indigo-500", trackColor: "bg-indigo-50" },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-xs font-sans">
          <p className="font-bold text-gray-900 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
              <span className="text-gray-700">{entry.name}:</span>
              <span className="font-bold">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // -------------------------------------------------------------
  // ESTADO Y FUNCIONES DE GRID LAYOUT
  // -------------------------------------------------------------
  const [isEditing, setIsEditing] = useState(false);
  const [layouts, setLayouts] = useState<any>(defaultLayouts);
  const [activeWidgets, setActiveWidgets] = useState<string[]>(defaultLayouts.lg.map((item: any) => item.i));
  const [chartVisible, setChartVisible] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const savedLayout = localStorage.getItem("researchd_layout");
    const savedWidgets = localStorage.getItem("researchd_widgets");
    
    if (savedLayout && savedWidgets) {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        const parsedWidgets = JSON.parse(savedWidgets);

        const mergedLayout: Record<string, any[]> = {};
        const breakpointsKeys = ["lg", "md", "sm", "xs", "xxs"] as const;
        for (const bk of breakpointsKeys) {
          const dl = defaultLayouts[bk] || defaultLayouts.lg;
          const pl = parsedLayout[bk] || [];
          mergedLayout[bk] = dl.map((defaultItem: any) => {
            const found = pl.find((pi: any) => pi.i === defaultItem.i);
            return found ? { ...defaultItem, x: found.x, y: found.y, w: found.w, h: found.h } : defaultItem;
          });
        }
        
        setLayouts(mergedLayout as any);
        setActiveWidgets(parsedWidgets);
      } catch (e) {
        console.error("Failed to parse research dashboard layout", e);
      }
    }

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
    return () => observer.disconnect();
  }, [chartVisible, activeWidgets, layouts]);

  const saveLayout = () => {
    setIsEditing(false);
    localStorage.setItem("researchd_layout", JSON.stringify(layouts));
    localStorage.setItem("researchd_widgets", JSON.stringify(activeWidgets));
  };

  const onLayoutChange = (currentLayout: any, allLayouts: any) => {
    if (isEditing) {
      setLayouts(allLayouts);
    }
  };

  const addWidget = (id: string) => {
    if (activeWidgets.includes(id)) return;
    setActiveWidgets(prev => [...prev, id]);
    setLayouts((prev: any) => {
      const isChart = id.startsWith("chart") || id === "chronic-indicators" || id === "aggregated-alerts";
      return {
        lg: [...(prev.lg || []), { i: id, x: 0, y: Infinity, w: isChart ? 4 : 4, h: isChart ? 8 : 6, minW: 3, minH: 3 }],
        md: [...(prev.md || []), { i: id, x: 0, y: Infinity, w: isChart ? 4 : 3, h: isChart ? 8 : 6, minW: 2, minH: 3 }],
        sm: [...(prev.sm || []), { i: id, x: 0, y: Infinity, w: isChart ? 6 : 4, h: isChart ? 8 : 6, minW: 2, minH: 3 }],
        xs: [...(prev.xs || []), { i: id, x: 0, y: Infinity, w: isChart ? 4 : 4, h: isChart ? 8 : 6, minW: 2, minH: 2 }],
        xxs: [...(prev.xxs || []), { i: id, x: 0, y: Infinity, w: isChart ? 2 : 2, h: isChart ? 8 : 6, minW: 1, minH: 2 }]
      };
    });
  };

  const removeWidget = (id: string) => {
    setActiveWidgets(prev => prev.filter(wId => wId !== id));
  };

  const restoreDefaultLayout = () => {
    setLayouts(defaultLayouts);
    setActiveWidgets(defaultLayouts.lg.map((item: any) => item.i));
    localStorage.removeItem("researchd_layout");
    localStorage.removeItem("researchd_widgets");
  };

  // -------------------------------------------------------------
  // CUSTOM CHART LABELS
  // -------------------------------------------------------------
  const CustomVerticalLabel = (props: any) => {
    const { x, y, width, height, value, index } = props;
    if (value === 0 || !value) return null;
    
    const item = trendData[index];
    const total = item ? item.compensados + item.noCompensados : value;
    const percent = Math.round((value / total) * 100) + '%';
    
    const isSmall = height < 20;
    const labelY = isSmall ? y - 10 : y + height / 2;
    const fill = isSmall ? '#64748b' : '#ffffff';
    
    return (
      <text x={x + width / 2} y={labelY} fill={fill} fontSize={10} fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
        {percent}
      </text>
    );
  };

  const CustomHorizontalLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    if (value === 0 || !value) return null;
    
    const percent = ((value / totalDiagnoses) * 100).toFixed(1) + '%';
    
    const isSmall = width < 35;
    const labelX = isSmall ? x + width + 8 : x + width - 8;
    const fill = isSmall ? '#64748b' : '#ffffff';
    const textAnchor = isSmall ? 'start' : 'end';
    
    return (
      <text x={labelX} y={y + height / 2 + 1} fill={fill} fontSize={10} fontWeight="bold" textAnchor={textAnchor} dominantBaseline="middle">
        {percent}
      </text>
    );
  };

  // -------------------------------------------------------------
  // RENDER WIDGETS
  // -------------------------------------------------------------
  const renderKPI = (label: string, value: string|number, color: string, Icon: any, bg: string) => (
    <div className="w-full h-full flex flex-col justify-center pointer-events-none overflow-hidden select-none">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider truncate">
            {label}
          </p>
          <p className={`text-2xl sm:text-3xl lg:text-4xl font-black mt-1 ${color} truncate leading-none`}>
            {value}
          </p>
        </div>
        <div className={`p-2 sm:p-2.5 lg:p-3 rounded-xl shrink-0 ${bg} flex items-center justify-center`}>
          <Icon className={color} size={22} />
        </div>
      </div>
    </div>
  );

  const renderWidgetContent = (id: string) => {
    switch (id) {
      case "kpi-pscv-activos":
        return renderKPI("Pacientes PSCV Activos", totalPatients, "text-emerald-500", Users, "bg-emerald-50");
      case "kpi-alto-riesgo":
        return renderKPI("Alto Riesgo", highRiskPatients, "text-rose-600", HeartPulse, "bg-rose-50");
      case "kpi-no-compensados":
        return renderKPI("No Compensados", uncompensatedPatients, "text-amber-500", Activity, "bg-amber-50");
      case "kpi-seguimiento-vencido":
        return renderKPI("Seguimiento Vencido", noAppointmentPatients, "text-red-500", Calendar, "bg-red-50");

      case "chart-trends":
        return (
          <div className="w-full h-full flex flex-col space-y-4">
            <div className="flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider">Tendencias de Compensación</h3>
                <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Últimos 6 meses</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /><span className="text-[10px] font-bold text-gray-500 uppercase">Compensados</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-rose-500" /><span className="text-[10px] font-bold text-gray-500 uppercase">No Compensados</span></div>
              </div>
            </div>
            <div className="flex-1 min-h-[0] w-full flex items-center justify-center overflow-hidden">
              {chartVisible && (
               <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                 <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                   <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                   <Bar dataKey="compensados" name="Compensados" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} maxBarSize={40}>
                     <LabelList dataKey="compensados" content={<CustomVerticalLabel />} />
                   </Bar>
                   <Bar dataKey="noCompensados" name="No compensados" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40}>
                     <LabelList dataKey="noCompensados" content={<CustomVerticalLabel />} />
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
              )}
            </div>
          </div>
        );

      case "chronic-indicators":
        return (
          <div className="w-full h-full flex flex-col">
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
               <FileBarChart size={16} className="text-blue-500" /> Cumplimiento REM-P4
             </h3>
             <div className="flex-1 overflow-y-auto pr-1 hidden-scrollbar space-y-4 min-h-0">
               {remP4Indicators.map((ind, i) => (
                 <div key={i} className="flex flex-col text-sm">
                   <div className="flex justify-between items-baseline mb-2">
                     <span className="font-bold text-gray-700 pr-2 truncate" title={ind.label}>{ind.label}</span>
                     <span className="font-black text-slate-900 text-lg shrink-0">{ind.value}</span>
                   </div>
                   <div className={`w-full h-3 rounded-full ${ind.trackColor} overflow-hidden mb-1`}>
                     <div className={`h-full ${ind.color} rounded-full`} style={{ width: `${ind.percentage}%` }} />
                   </div>
                   <span className="text-xs text-gray-500 font-medium">{ind.desc}</span>
                 </div>
               ))}
             </div>
          </div>
        );

      case "chart-risk":
        return (
          <div className="w-full h-full flex flex-col">
            <h3 className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
              Riesgo Cardiovascular
            </h3>
            <div className="flex-1 min-h-[0] w-full" ref={chartContainerRef}>
              {chartVisible && (
               <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                 <PieChart>
                   <Pie 
                     data={riskData} 
                     cx="50%" 
                     cy="50%" 
                     innerRadius={0} 
                     outerRadius="80%" 
                     paddingAngle={0} 
                     dataKey="value" 
                     label={({ cx, cy, midAngle, outerRadius, value, index }) => {
                       const RADIAN = Math.PI / 180;
                       const percent = ((value / totalPatients) * 100).toFixed(1);
                       if (value === 0) return null;
                       
                       // Inner label (percentage)
                       const innerR = outerRadius * 0.65;
                       const inX = cx + innerR * Math.cos(-midAngle * RADIAN);
                       const inY = cy + innerR * Math.sin(-midAngle * RADIAN);
 
                       return (
                         <text 
                           x={inX} 
                           y={inY} 
                           fill="#ffffff" 
                           textAnchor="middle" 
                           dominantBaseline="central"
                           fontSize={20}
                           fontWeight="bold"
                         >
                           {percent}%
                         </text>
                       );
                     }}
                     labelLine={false}
                   >
                     {riskData.map((entry, index) => (
                       <Cell key={index} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                     ))}
                   </Pie>
                   <Tooltip content={<CustomTooltip />} />
                   <Legend 
                     layout="vertical" 
                     verticalAlign="middle" 
                     align="right" 
                     iconType="square" 
                     formatter={(v) => <span className="text-xs font-semibold text-gray-700">{v}</span>} 
                   />
                 </PieChart>
               </ResponsiveContainer>
              )}
            </div>
          </div>
        );

      case "chart-diagnosis":
        return (
          <div className="w-full h-full flex flex-col">
            <h3 className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
              Diagnósticos Principales
            </h3>
            <div className="flex-1 min-h-[0] w-full">
              {chartVisible && (
               <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                 <BarChart layout="vertical" data={diagData} margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                   <XAxis type="number" hide />
                   <YAxis type="category" dataKey="name" tick={{fontSize: 10, fill: '#475569', fontWeight: 600}} axisLine={false} tickLine={false} />
                   <Tooltip content={<CustomTooltip />} cursor={{fill: '#f1f5f9'}} />
                   <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20}>
                     <LabelList dataKey="value" content={<CustomHorizontalLabel />} />
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
              )}
            </div>
          </div>
        );

      case "aggregated-alerts":
        return (
          <div className="w-full h-full flex flex-col">
            <h3 className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
              <AlertTriangle className="text-rose-500" size={16} /> Alertas Agregadas
            </h3>
            <div className="flex-1 overflow-y-auto pr-1 hidden-scrollbar space-y-3">
              <div className="flex items-center justify-between p-3 bg-rose-50 rounded-xl border border-rose-100">
                <span className="text-xs font-bold text-rose-800">Alto Riesgo no compensados</span>
                <span className="text-xs font-black text-rose-900 bg-white px-2 py-0.5 rounded shadow-xs">{filteredPatients.filter(p => p.risk === "Alto" && p.compensationStatus.toLowerCase().includes("no compensado")).length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100">
                <span className="text-xs font-bold text-amber-800">Sin cita o Vencidos</span>
                <span className="text-xs font-black text-amber-900 bg-white px-2 py-0.5 rounded shadow-xs">{noAppointmentPatients}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-100">
                <span className="text-xs font-bold text-orange-800">Exámenes pendientes</span>
                <span className="text-xs font-black text-orange-900 bg-white px-2 py-0.5 rounded shadow-xs">{pendingExamPatients}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-100">
                <span className="text-xs font-bold text-purple-800">Inasistencia reciente</span>
                <span className="text-xs font-black text-purple-900 bg-white px-2 py-0.5 rounded shadow-xs">{filteredPatients.filter(p => p.alerts.includes("Inasistencia reciente")).length}</span>
              </div>
            </div>
          </div>
        );

      default:
        return <div>{id}</div>;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent space-y-6">
      
      {/* Header and Widget Menu */}
      <div className="p-6 md:p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col shrink-0 mb-6 font-sans relative overflow-hidden">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 animate-fade-in">
          <div className="absolute inset-y-[-24px] left-[-24px] md:left-[-32px] w-1 bg-purple-500 h-[200%]"></div>
          
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <LayoutDashboard className="text-gray-500" size={24} />
                <span>Dashboard PSCV (Investigador)</span>
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
                  onChange={(e) => setSelectedFacility(e.target.value)}
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
                  onChange={(e) => setSelectedPeriod(e.target.value)}
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
             {!isEditing ? (
               <button
                 onClick={() => setIsEditing(true)}
                 className="flex items-center justify-center p-2 bg-gray-50 hover:bg-slate-100 text-gray-600 rounded-lg border border-gray-200 transition-colors shadow-sm"
                 title="Personalizar Dashboard"
               >
                 <Edit3 size={18} />
                 <span className="ml-2 font-semibold text-sm hidden md:inline">Personalizar</span>
               </button>
             ) : (
               <button
                 onClick={saveLayout}
                 className="flex items-center justify-center p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md shadow-blue-200"
                 title="Guardar diseño"
               >
                 <Save size={18} />
                 <span className="ml-2 font-semibold text-sm hidden md:inline">Guardar diseño</span>
               </button>
             )}
          </div>
        </div>

        {/* Edit Panel (Slide down animation) */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 24 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden shrink-0"
            >
              <div className="p-4 bg-gray-50 rounded-xl border border-blue-100 flex flex-col gap-3">
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
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-50 text-gray-700 hover:text-brand-blue rounded-lg border border-gray-200 hover:border-blue-200 text-sm font-medium transition-colors"
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
      </div>

      {/* Grid Layout */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10 min-h-0">
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
                className={`group bg-white rounded-2xl border ${isEditing ? 'border-dashed border-blue-300 shadow-sm animate-pulse-slow' : 'border-gray-200 shadow-sm'} flex flex-col relative overflow-hidden`}
              >
                {/* Drag handle area when editing */}
                {isEditing && (
                  <div className="drag-handle absolute top-0 left-0 right-0 h-5 sm:h-6 bg-blue-50/80 cursor-move border-b border-blue-100 flex items-center justify-center z-10 space-x-1">
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
                <div className={`p-4 sm:p-5 w-full h-full flex-1 flex flex-col min-h-0 ${isEditing ? 'pt-7 sm:pt-9' : ''}`}>
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
    </div>
  );
}
