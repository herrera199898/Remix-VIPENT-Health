import React from 'react';
import { Database, Search, ShieldAlert, Download, AreaChart } from 'lucide-react';
import { motion } from 'motion/react';

export default function ResearchDashboard() {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-transparent space-y-6">
      <div className="p-6 md:p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 font-sans animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Search className="text-purple-600" size={24} />
            <span>Dashboard del Investigador</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Entorno seguro de acceso a datos clínicos anonimizados
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg border border-purple-100">
          <ShieldAlert size={16} className="text-purple-600" />
          <span className="text-sm font-semibold text-purple-700">Modo de Privacidad Estricta</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 hidden-scrollbar pb-6 space-y-6">
        
        {/* Placeholder Alert */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-600 rounded-xl p-6 shadow-sm border border-purple-700 text-white flex flex-col gap-2 relative overflow-hidden"
        >
          <div className="absolute -right-6 -top-6 opacity-10">
            <Database size={120} />
          </div>
          <h2 className="text-xl font-bold">Módulo en Construcción (Fase 2)</h2>
          <p className="max-w-2xl text-purple-100 text-sm leading-relaxed">
            Actualmente te encuentras autenticado como Investigador en la maqueta del portal. 
            El proceso de anonimización de la ficha clínica, la eliminación de identificadores directos 
            y la entrega de sets de datos para análisis estadístico se habilitarán en la siguiente etapa.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Database size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Acceso a Datos Anonimizados</h3>
              <p className="text-sm text-gray-500 mt-1">
                Visualiza datos de salud sin exponer RUT, nombre, ni datos de contacto directos de los pacientes.
              </p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
              <Download size={24} className="text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Exportación para Análisis</h3>
              <p className="text-sm text-gray-500 mt-1">
                Descarga de sets de datos filtrados para análisis estadístico y clínico, garantizando el cumplimiento normativo.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <AreaChart size={24} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Trazabilidad de Consultas</h3>
              <p className="text-sm text-gray-500 mt-1">
                Registro inmutable de qué datos han sido descargados, por quién y para qué propósito de investigación.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
