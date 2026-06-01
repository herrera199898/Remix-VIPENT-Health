import React from 'react';
import { Patient } from '../types';

interface PatientEditProps {
  patient: Patient;
  onCancel: () => void;
}

export default function PatientEdit({ patient, onCancel }: PatientEditProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de paciente</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8 max-w-4xl">
        
        {/* Detalles del Paciente Section */}
        <div>
          <div className="bg-gray-200/50 px-6 py-3 border-b border-gray-200">
            <h2 className="text-sm font-bold text-gray-700">Detalles del Paciente</h2>
          </div>
          
          <div className="p-8 pb-6 border-b border-gray-100 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 flex flex-col">
                <label className="text-xs font-bold text-gray-600">Nombre:</label>
                <input 
                  type="text" 
                  defaultValue={patient.name}
                  className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5 flex flex-col">
                <label className="text-xs font-bold text-gray-600">Fecha de Nacimiento:</label>
                <input 
                  type="text" 
                  defaultValue={patient.birthDate}
                  className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5 flex flex-col">
                <label className="text-xs font-bold text-gray-600">Teléfono:</label>
                <input 
                  type="text" 
                  defaultValue={patient.phone}
                  className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5 flex flex-col">
                <label className="text-xs font-bold text-gray-600">Email:</label>
                <input 
                  type="email" 
                  defaultValue={patient.email}
                  className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6">
              <button 
                onClick={onCancel}
                className="px-5 py-2 border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button className="px-5 py-2 bg-brand-blue text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-900 transition-colors">
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>

        {/* Configuración de Acceso Section */}
        <div>
          <div className="bg-gray-200/50 px-6 py-3 border-b border-gray-200">
            <h2 className="text-sm font-bold text-gray-700">Configuración de Acceso</h2>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700 font-medium">Acceso a historial médico:</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700 font-medium">Notificaciones por correo electrónico:</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end pt-4">
              <button className="px-5 py-2 bg-brand-blue text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-900 transition-colors">
                Actualizar Permisos
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
