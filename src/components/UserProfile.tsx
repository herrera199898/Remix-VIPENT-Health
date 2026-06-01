import { User, ShieldCheck, Mail, MapPin, Calendar, Phone, Fingerprint, Lock, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function UserProfile() {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Perfil de usuario</h1>
        <p className="text-sm text-gray-500 mt-1">Gestione sus datos personales y de seguridad</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
        {/* Header Profile Section */}
        <div className="p-8 border-b border-gray-100 bg-gray-50/30">
          <div className="flex items-center gap-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center overflow-hidden shadow-inner">
                <User size={48} className="text-gray-400 translate-y-1" />
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-brand-red text-white rounded-full shadow-lg border-2 border-white hover:bg-red-700 transition-colors">
                <ShieldCheck size={14} />
              </button>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 uppercase">Juan Pérez</h2>
              <div className="flex items-center gap-2 mt-1 text-gray-500">
                <Mail size={14} />
                <span className="text-sm">juan.perez@example.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Form */}
        <div className="p-8 space-y-12">
          {/* Personal Info Section */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 bg-brand-red rounded-full" />
              <h3 className="text-lg font-bold text-gray-900">Información Personal</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">Nombre Completo</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400 group-focus-within:text-brand-red transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    defaultValue="Juan Pérez"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">Fecha de Nacimiento</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-400 group-focus-within:text-brand-red transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    defaultValue="15/08/1985"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">RUT/Identificación</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Fingerprint size={16} className="text-gray-400 group-focus-within:text-brand-red transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    defaultValue="12.345.678-9"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">Número de Teléfono</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={16} className="text-gray-400 group-focus-within:text-brand-red transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    defaultValue="+56 9 1234 5678"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Security & Access Section */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 bg-brand-red rounded-full" />
              <h3 className="text-lg font-bold text-gray-900">Seguridad y Acceso</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">Contraseña Actual</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400 group-focus-within:text-brand-red transition-colors" />
                  </div>
                  <input 
                    type="password" 
                    placeholder="••••••••••••"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all"
                  />
                </div>
              </div>

              <div className="md:col-start-1 space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">Nueva Contraseña</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ShieldAlert size={16} className="text-gray-400 group-focus-within:text-brand-red transition-colors" />
                  </div>
                  <input 
                    type="password" 
                    placeholder="Mínimo 8 caracteres"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">Confirmar Nueva Contraseña</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ShieldAlert size={16} className="text-gray-400 group-focus-within:text-brand-red transition-colors" />
                  </div>
                  <input 
                    type="password" 
                    placeholder="Repita su nueva contraseña"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex items-center justify-start gap-4 pt-6 border-t border-gray-100">
            <button className="px-8 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 shadow-sm">
              Cancelar
            </button>
            <motion.button 
              whileTap={{ scale: 0.98 }}
              className="px-8 py-2.5 text-sm font-semibold text-white bg-brand-blue hover:bg-blue-700 rounded-lg transition-colors shadow-md shadow-blue-200"
            >
              Guardar Cambios
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
