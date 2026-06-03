import React, { useState, useMemo } from 'react';
import { Search, Download, ChevronLeft, ChevronRight, FileText, Eye, X, AlertTriangle, User, Calendar, Activity, Info } from 'lucide-react';
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/40 backdrop-blur-sm sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-xl flex flex-col font-sans h-[85vh] sm:h-auto sm:max-h-[85vh] border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-150 flex justify-between items-start bg-slate-50 rounded-t-2xl">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    ID Investigativo
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">{drawerPatient.anonymousId}</h2>
                <div className="text-xs font-semibold text-gray-500 mt-0.5">
                   Rango Etario: {drawerPatient.ageRange} | Sexo: {drawerPatient.gender || 'N/E'} | {drawerPatient.establishment || 'N/E'}
                </div>
              </div>
              <button onClick={() => setDrawerPatient(null)} className="text-gray-400 hover:text-gray-600 bg-white shadow-xs p-1.5 rounded-full border border-gray-200">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto bg-white flex-1 space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2">
                <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <p>Este resumen no contiene identificadores directos ni permite acceder a la ficha clínica real.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Estado Clínico</h3>
                  <div className="font-semibold text-slate-800 text-sm">{drawerPatient.pscvStatus}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Riesgo CV</h3>
                  <div className="font-semibold text-slate-800 text-sm">{drawerPatient.risk}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 col-span-2">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Diagnósticos ({drawerPatient.diagnoses.length})</h3>
                  <div className="font-semibold text-slate-800 text-sm">
                    {drawerPatient.diagnoses.join(', ') || 'Sin diagnósticos registrados'}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 col-span-2">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Estado de Compensación</h3>
                  <div className="font-semibold text-slate-800 text-sm">{drawerPatient.compensationStatus}</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3">Seguimiento</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Último Control</span>
                    <span className="text-xs font-semibold text-slate-800">{drawerPatient.lastControlPeriod}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Próxima Cita</span>
                    <span className="text-xs font-semibold text-slate-800">
                      {drawerPatient.nextControlStatus} {drawerPatient.nextControlPeriod ? `(${drawerPatient.nextControlPeriod})` : ''}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3">Alertas & Exámenes</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Exámenes Pendientes</span>
                    {drawerPatient.pendingExams.length > 0 ? (
                      <ul className="list-disc ml-4 text-xs font-semibold text-slate-800">
                        {drawerPatient.pendingExams.map(ex => <li key={ex}>{ex}</li>)}
                      </ul>
                    ) : (
                      <span className="text-xs text-slate-500 font-medium">Ninguno registrado</span>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Alertas Estructuradas</span>
                    {drawerPatient.alerts.length > 0 ? (
                      <ul className="list-disc ml-4 text-xs font-semibold text-rose-700">
                        {drawerPatient.alerts.map(al => <li key={al}>{al}</li>)}
                      </ul>
                    ) : (
                       <span className="text-xs text-slate-500 font-medium">Sin alertas emitidas</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex justify-between items-center shrink-0">
              <span className="text-[10px] text-gray-500 font-semibold">Uso exclusivo de investigación.</span>
              <button 
                onClick={() => setDrawerPatient(null)} 
                className="px-4 py-2 border border-gray-300 font-bold rounded-lg bg-white text-gray-700 text-sm hover:bg-gray-50"
              >
                Cerrar resumen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
