import React, { useState, useMemo } from 'react';
import { Search, Download, ChevronLeft, ChevronRight, FileText, Eye, X, AlertTriangle, User, Calendar, Activity, Info, CheckCircle, Database } from 'lucide-react';
import { PATIENTS_MOCK } from '../types';
import { anonymizePatient, AnonymizedPatient } from '../utils/anonymization';

interface AnonymizedPatientListProps {}

export default function AnonymizedPatientList({}: AnonymizedPatientListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Activo' | 'Inactivo'>('Todos');
  const [riskFilter, setRiskFilter] = useState<'Todos' | 'Alto' | 'Moderado' | 'Bajo'>('Todos');
  const [compFilter, setCompFilter] = useState<'Todos' | 'Compensado' | 'No compensado' | 'Sin dato'>('Todos');
  const [diagFilter, setDiagFilter] = useState<'Todos' | 'HTA' | 'DM2' | 'Dislipidemia' | 'Obesidad' | 'ERC'>('Todos');
  const [estabFilter, setEstabFilter] = useState<'Todos' | 'Hualañé' | 'Curepto'>('Todos');
  const [alertFilter, setAlertFilter] = useState<'Todos' | 'Con alertas' | 'Sin alertas'>('Todos');

  const [drawerPatient, setDrawerPatient] = useState<AnonymizedPatient | null>(null);
  const [showTechniques, setShowTechniques] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const dataset = useMemo(() => PATIENTS_MOCK.map(anonymizePatient), []);

  const filteredData = useMemo(() => {
    return dataset.filter(p => {
      if (searchTerm && !p.anonymousId.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (statusFilter !== 'Todos' && p.pscvStatus !== statusFilter) return false;
      if (riskFilter !== 'Todos' && p.risk !== riskFilter) return false;
      
      if (compFilter === 'Compensado' && p.compensationStatus !== 'Compensado') return false;
      if (compFilter === 'No compensado' && !p.compensationStatus.toLowerCase().includes('no compensado')) return false;
      if (compFilter === 'Sin dato' && p.compensationStatus !== 'Sin dato') return false;
      
      if (diagFilter !== 'Todos' && !p.diagnoses.includes(diagFilter)) return false;
      if (estabFilter !== 'Todos' && p.establishment !== estabFilter) return false;
      
      if (alertFilter === 'Con alertas' && p.alerts.length === 0) return false;
      if (alertFilter === 'Sin alertas' && p.alerts.length > 0) return false;

      return true;
    });
  }, [dataset, searchTerm, statusFilter, riskFilter, compFilter, diagFilter, estabFilter, alertFilter]);

  const totalPatients = filteredData.length;
  const totalPages = Math.ceil(totalPatients / pageSize) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const highRiskCount = filteredData.filter(p => p.risk === 'Alto').length;
  const noCompCount = filteredData.filter(p => p.compensationStatus.toLowerCase().includes('no compensado')).length;
  const alertsCount = filteredData.filter(p => p.alerts.length > 0 || p.nextControlStatus === 'Sin próxima cita').length;

  const handleExportCSV = () => {
    if (!window.confirm("El archivo exportado contiene solo datos anonimizados. No incluye nombre, RUT, teléfono, correo, dirección, ID real ni observaciones libres.")) {
      return;
    }

    const headers = [
      'anonymousId', 'ageRange', 'gender', 'establishment', 'pscvStatus', 'risk', 
      'diagnoses', 'compensationStatus', 'lastControlPeriod', 'nextControlStatus', 
      'nextControlPeriod', 'alerts', 'pendingExams', 'appliedTechniques'
    ];
    
    const rows = filteredData.map(p => [
      p.anonymousId,
      p.ageRange,
      p.gender || '',
      p.establishment || '',
      p.pscvStatus,
      p.risk,
      p.diagnoses.join('; '),
      p.compensationStatus,
      p.lastControlPeriod,
      p.nextControlStatus,
      p.nextControlPeriod || '',
      p.alerts.join('; '),
      p.pendingExams.join('; '),
      p.appliedTechniques.join('; ')
    ]);
    
    const csvContent = "\uFEFF" + [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `dataset_anonimizado_pscv_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="vipent-anonymized-list-view" className="flex-1 flex flex-col min-h-0 bg-transparent space-y-6">
      <div className="p-6 md:p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 shrink-0 font-sans animate-fade-in relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-1 bg-purple-500"></div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Eye className="text-purple-600" size={24} />
              <span>Datos anonimizados</span>
            </h1>
            <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Perfil Investigador
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Vista investigativa de pacientes PSCV sin identificadores directos.
          </p>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400 font-semibold bg-gray-50 max-w-fit px-2 py-1 rounded-md border border-gray-100">
            <Info size={12} className="text-purple-500" />
            Datos transformados mediante supresión, generalización, tokenización y categorización.
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-200 shadow-xs text-xs">
            <div className="px-2 border-r border-gray-150">
              <span className="text-gray-400 font-bold text-[10px] block uppercase leading-none">Registros</span>
              <span className="text-sm font-black text-purple-700">{totalPatients}</span>
            </div>
            <div className="px-2 border-r border-gray-150">
              <span className="text-gray-400 font-bold text-[10px] block uppercase leading-none">Alto Riesgo</span>
              <span className="text-sm font-black text-rose-600">{highRiskCount}</span>
            </div>
            <div className="px-2 border-r border-gray-150">
              <span className="text-gray-400 font-bold text-[10px] block uppercase leading-none">No compensados</span>
              <span className="text-sm font-black text-orange-600">{noCompCount}</span>
            </div>
            <div className="px-2">
              <span className="text-gray-400 font-bold text-[10px] block uppercase leading-none">Alertas / Sin Cita</span>
              <span className="text-sm font-black text-amber-600">{alertsCount}</span>
            </div>
          </div>

          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition-all shadow-sm cursor-pointer"
          >
            <Download size={14} />
            <span>Exportar dataset anonimizado</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="ID Anónimo"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 font-semibold text-slate-700"
                />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs bg-white font-bold text-slate-700 cursor-pointer">
                <option value="Todos">Visibilidad: Todos</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
              <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value as any)} className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs bg-white font-bold text-slate-700 cursor-pointer">
                <option value="Todos">Riesgo: Todos</option>
                <option value="Alto">Alto</option>
                <option value="Moderado">Moderado</option>
                <option value="Bajo">Bajo</option>
              </select>
              <select value={compFilter} onChange={(e) => setCompFilter(e.target.value as any)} className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs bg-white font-bold text-slate-700 cursor-pointer">
                <option value="Todos">Comp: Todos</option>
                <option value="Compensado">Compensado</option>
                <option value="No compensado">No compensado</option>
                <option value="Sin dato">Sin dato</option>
              </select>
              <select value={diagFilter} onChange={(e) => setDiagFilter(e.target.value as any)} className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs bg-white font-bold text-slate-700 cursor-pointer">
                <option value="Todos">Diag: Todos</option>
                <option value="HTA">HTA</option>
                <option value="DM2">DM2</option>
                <option value="Dislipidemia">Dislipidemia</option>
                <option value="Obesidad">Obesidad</option>
                <option value="ERC">ERC</option>
              </select>
              <select value={estabFilter} onChange={(e) => setEstabFilter(e.target.value as any)} className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs bg-white font-bold text-slate-700 cursor-pointer">
                <option value="Todos">Estab: Todos</option>
                <option value="Hualañé">Hualañé</option>
                <option value="Curepto">Curepto</option>
              </select>
              <select value={alertFilter} onChange={(e) => setAlertFilter(e.target.value as any)} className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs bg-white font-bold text-slate-700 cursor-pointer">
                <option value="Todos">Alertas: Todos</option>
                <option value="Con alertas">Con alertas</option>
                <option value="Sin alertas">Sin alertas</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowTechniques(!showTechniques)}
                className="text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 transition-colors"
              >
                Ver técnica de anonimización
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-gray-50 border-b border-gray-250 z-10">
                <tr className="font-sans">
                  <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-[20%] text-left">
                    ID Anónimo / Rango Etario
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-[12%] text-left">
                    Estado PSCV
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-[12%] text-left">
                    Riesgo
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-[15%] text-left">
                    Diagnósticos
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-[15%] text-left">
                    Compensación
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-[12%] text-left">
                    Último Control
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-[14%] text-left">
                    Próxima Cita
                  </th>
                  <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center pr-6">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 select-none">
                {paginatedData.map(p => (
                  <tr key={p.anonymousId} className="hover:bg-slate-50/50 transition-all font-mono align-middle">
                    <td className="px-5 py-3.5 font-sans">
                      <span className="text-xs font-bold text-purple-900 block leading-tight">{p.anonymousId}</span>
                      <div className="text-[10px] text-slate-500 font-mono tracking-tight mt-0.5">Edad: {p.ageRange} | {p.gender}</div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-700 font-sans">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-semibold leading-none ${
                        p.pscvStatus === 'Activo' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>{p.pscvStatus}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-700 font-sans">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-semibold leading-none ${
                        p.risk === 'Alto' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                        p.risk === 'Moderado' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-sky-50 text-sky-700 border-sky-200'
                      }`}>{p.risk}</span>
                    </td>
                    <td className="px-5 py-3.5 text-[10px] text-slate-600 font-sans">
                      {p.diagnoses.join(', ') || 'Ninguno'}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-700 font-sans">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-semibold leading-none ${
                        p.compensationStatus === 'Compensado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        p.compensationStatus === 'Sin dato' ? 'bg-slate-50 text-slate-600 border-slate-200' : 
                        'bg-orange-50 text-orange-700 border-orange-200'
                      }`}>{p.compensationStatus}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-600 font-sans">
                      {p.lastControlPeriod}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-700 font-sans">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-semibold leading-none ${
                        p.nextControlStatus === 'Control vencido' || p.nextControlStatus === 'Sin próxima cita' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {p.nextControlStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button 
                        onClick={() => setDrawerPatient(p)}
                        className="text-[10px] px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 font-bold text-gray-700 transition"
                      >
                        Resumen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-between z-10 shrink-0 select-none hidden md:flex">
            <span className="text-xs font-bold text-gray-500">
              Mostrando {Math.min((currentPage - 1) * pageSize + 1, totalPatients)} - {Math.min(currentPage * pageSize, totalPatients)} de {totalPatients} pacientes
            </span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 min-w-[28px] flex justify-center text-gray-500 hover:text-gray-900 border border-transparent hover:border-gray-200 rounded-md transition-colors disabled:opacity-30 disabled:hover:border-transparent"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 text-xs font-black rounded-md flex items-center justify-center transition-all ${
                    currentPage === page ? 'bg-white text-brand-blue border border-brand-blue shadow-sm' : 'text-gray-500 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1 min-w-[28px] flex justify-center text-gray-500 hover:text-gray-900 border border-transparent hover:border-gray-200 rounded-md transition-colors disabled:opacity-30 disabled:hover:border-transparent"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showTechniques && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col font-sans max-h-full">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Info size={18} className="text-purple-600" />
                Metodología de anonimización aplicada
              </h2>
              <button onClick={() => setShowTechniques(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-white transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 overflow-y-auto text-sm text-gray-700 space-y-4">
              <div>
                <strong className="block text-gray-900 mb-1">Supresión:</strong>
                Se ha eliminado nombre, RUT, teléfono, email, dirección, y hora exacta de las citas.
              </div>
              <div>
                <strong className="block text-gray-900 mb-1">Tokenización:</strong>
                Reemplazo de ID de paciente por pseudoidentificadores generados (ej. ANON-0001).
              </div>
              <div>
                <strong className="block text-gray-900 mb-1">Generalización:</strong>
                Edad exacta y fecha de nacimiento transformada a rangos etarios. Fechas de atención convertidas a mes y año.
              </div>
              <div>
                <strong className="block text-gray-900 mb-1">Categorización:</strong>
                Próximas citas y alertas representadas solo por estados clínicos (vigente, vencido, con alerta), omitiendo la temporalidad estricta.
              </div>
              <div>
                <strong className="block text-gray-900 mb-1">Exclusión:</strong>
                Se omiten por completo las observaciones clínicas, indicaciones textuales, e historial prescriptivo de formato libre.
              </div>
              <div>
                <strong className="block text-gray-900 mb-1">Minimización:</strong>
                Campos administrativos no esenciales no son extraídos hacia el dataset investigativo.
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setShowTechniques(false)} 
                className="px-4 py-2 border border-gray-300 font-bold rounded-lg bg-white text-gray-700 text-sm hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

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
            <header className="flex items-center justify-between p-6 border-b border-gray-200 bg-white shrink-0">
              <div className="flex items-center gap-4">
                <div className="bg-purple-50 p-3 rounded-full text-purple-500">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 tracking-tight uppercase">RESUMEN INVESTIGATIVO</h2>
                  <p className="text-sm text-slate-500 font-medium">Datos PSCV Anonimizados</p>
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
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-purple-400 uppercase">
                      <span>Registro Anonimizado</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight uppercase">{drawerPatient.anonymousId}</h1>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-300">
                      <p><span className="text-gray-400 font-medium">Edad:</span> <span className="font-bold text-white uppercase">{drawerPatient.ageRange}</span></p>
                      <p><span className="text-gray-400 font-medium">Sexo:</span> <span className="font-bold text-white uppercase">{drawerPatient.gender || 'N/E'}</span></p>
                      <p><span className="text-gray-400 font-medium">Diag:</span> <span className="font-bold text-white uppercase">{drawerPatient.diagnoses?.join(' / ') || 'Sin registro'}</span></p>
                      <p><span className="text-gray-400 font-medium">Centro:</span> <span className="font-bold text-white uppercase">{drawerPatient.establishment || 'N/E'}</span></p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-2 md:mt-0">
                    <span className={`px-3 py-1.5 rounded-md text-xs font-bold bg-[#0f172a] border uppercase tracking-wide flex items-center justify-center ${
                      drawerPatient.pscvStatus === 'Activo' ? 'border-[#10b981] text-[#10b981]' : 'border-slate-500 text-slate-400'
                    }`}>
                      {drawerPatient.pscvStatus}
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

              {/* Info Alert */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex items-start gap-3 mb-6 shadow-sm">
                <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <p><strong>Aviso:</strong> Este resumen no contiene identificadores directos ni permite acceder a la ficha clínica real. Uso exclusivo para investigación y análisis estadístico.</p>
              </div>

              {/* BEGIN: Context-Right Utility Layout */}
              <div className="flex flex-col lg:flex-row gap-6">
                {/* BEGIN: Left Column (Main Clinical Data) */}
                <div className="flex-1 space-y-6">
                  {/* Block 1: Estado Clínico */}
                  <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2 font-sans">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      Estado Compensación
                    </h3>
                    <div className="border border-gray-200 rounded-lg p-5 bg-slate-50 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">COMPENSACIÓN REGISTRADA</h4>
                        <div className={`mt-2 font-mono text-xl font-bold uppercase ${
                          drawerPatient.compensationStatus === 'Compensado' ? 'text-[#10b981]' :
                          drawerPatient.compensationStatus.toLowerCase().includes('no compensado') ? 'text-[#ef4444]' :
                          'text-slate-600'
                        }`}>
                          {drawerPatient.compensationStatus}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Block 3: Diagnósticos y Vigencias */}
                  <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2 font-sans">
                      <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                      Diagnósticos Agrupados
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">DIAGNÓSTICOS ESTRUCTURADOS</h4>
                        <div className="flex flex-wrap gap-2">
                          {drawerPatient.diagnoses && drawerPatient.diagnoses.length > 0 ? (
                            drawerPatient.diagnoses.map((dg, idx) => (
                              <span key={idx} className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 shadow-sm uppercase font-mono">
                                {dg}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 italic text-xs">No registra diagnósticos estructurados</span>
                          )}
                        </div>
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
                      Seguimiento Aproximado
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">ÚLTIMO CONTROL (PERIODO)</h4>
                        <p className="text-xl font-bold text-gray-800 font-mono">{drawerPatient.lastControlPeriod || 'Sin registro'}</p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <h4 className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">PRÓXIMA CITA (ESTADO)</h4>
                        <p className={`text-xl font-bold font-mono ${drawerPatient.nextControlStatus === 'Sin próxima cita' || drawerPatient.nextControlStatus === 'Control vencido' ? 'text-[#ef4444]' : 'text-[#10b981]'}`}>
                          {drawerPatient.nextControlStatus}
                        </p>
                        {drawerPatient.nextControlPeriod && (
                          <p className="text-xs text-gray-500 mt-1 uppercase font-bold">{drawerPatient.nextControlPeriod}</p>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Block 4: Alertas */}
                  <section>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2 font-sans">
                      <span className="w-2 h-2 rounded-full bg-[#ef4444]"></span>
                      Alertas Categorizadas
                    </h3>
                    <div className="space-y-3">
                      {drawerPatient.alerts && drawerPatient.alerts.length > 0 ? (
                        drawerPatient.alerts.map((al, idx) => (
                          <div key={idx} className="bg-[#fee2e2] border border-red-200 rounded-lg p-4 flex items-start gap-3 shadow-sm">
                            <AlertTriangle className="w-5 h-5 text-[#ef4444] mt-0.5 shrink-0" />
                            <div>
                              <p className="text-sm font-bold text-[#ef4444] uppercase">{al}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-[#d1fae5] border border-emerald-200 rounded-lg p-4 flex items-start gap-3 shadow-sm">
                          <CheckCircle className="w-5 h-5 text-[#10b981] mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-bold text-[#10b981] uppercase">Sin alertas estructuradas</p>
                          </div>
                        </div>
                      )}

                      {drawerPatient.pendingExams && drawerPatient.pendingExams.length > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col gap-2 shadow-sm">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <span className="text-[11px] font-black uppercase text-amber-700 tracking-wider">EXÁMENES PENDIENTES</span>
                          </div>
                          <div className="space-y-1.5 pl-7">
                            {drawerPatient.pendingExams.map((exam, idx) => (
                              <div key={idx} className="text-xs text-amber-900 font-bold flex items-center gap-2 uppercase">
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
          </div>
        </div>
      )}
    </div>
  );
}
