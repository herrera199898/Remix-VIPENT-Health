import { User, ShieldCheck, Mail, MapPin, Calendar, Phone, Fingerprint, Lock, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function UserProfile() {
  return (
    <div className="flex-1 overflow-y-auto pr-2 pb-8 max-h-full custom-scrollbar">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-sans">Perfil de usuario</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Gestione sus datos personales y de seguridad</p>
      </div>

      <div className="bg-white border border-gray-300 rounded-xl shadow-xs overflow-hidden mb-8">
        {/* Header Profile Section */}
        <div className="p-4 sm:p-8 border-b border-gray-100 bg-gray-50/30">
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-8">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center overflow-hidden shadow-inner">
                <User className="text-gray-400 translate-y-1 w-10 h-10 sm:w-12 sm:h-12" />
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-brand-red text-white rounded-full shadow-lg border-2 border-white hover:bg-red-700 transition-colors">
                <ShieldCheck size={14} />
              </button>
            </div>
            
            <div className="flex flex-col items-center sm:items-start">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase font-sans">Juan Pérez</h2>
              <div className="flex items-center gap-2 mt-1.5 text-gray-500 font-sans">
                <Mail size={14} className="shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">juan.perez@example.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Form */}
        <div className="p-4 sm:p-8 space-y-8 sm:space-y-12">
          {/* Personal Info Section */}
          <section>
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-1 h-5 bg-brand-red rounded-full" />
              <h3 className="text-base sm:text-lg font-bold text-gray-900 font-sans">Información Personal</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Nombre Completo</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                    <User size={15} className="text-gray-400 group-focus-within:text-brand-red transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    defaultValue="Juan Pérez"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-lg py-2 sm:py-2.5 pl-9 sm:pl-10 pr-3 sm:pr-4 text-xs sm:text-sm font-semibold text-gray-800 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Fecha de Nacimiento</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                    <Calendar size={15} className="text-gray-400 group-focus-within:text-brand-red transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    defaultValue="15/08/1985"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-lg py-2 sm:py-2.5 pl-9 sm:pl-10 pr-3 sm:pr-4 text-xs sm:text-sm font-semibold text-gray-800 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider px-1">RUT/Identificación</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                    <Fingerprint size={15} className="text-gray-400 group-focus-within:text-brand-red transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    defaultValue="12.345.678-9"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-lg py-2 sm:py-2.5 pl-9 sm:pl-10 pr-3 sm:pr-4 text-xs sm:text-sm font-semibold text-gray-800 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Número de Teléfono</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                    <Phone size={15} className="text-gray-400 group-focus-within:text-brand-red transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    defaultValue="+56 9 1234 5678"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-lg py-2 sm:py-2.5 pl-9 sm:pl-10 pr-3 sm:pr-4 text-xs sm:text-sm font-semibold text-gray-800 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Security & Access Section */}
          <section>
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-1 h-5 bg-brand-red rounded-full" />
              <h3 className="text-base sm:text-lg font-bold text-gray-900 font-sans">Seguridad y Acceso</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 sm:gap-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Contraseña Actual</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                    <Lock size={15} className="text-gray-400 group-focus-within:text-brand-red transition-colors" />
                  </div>
                  <input 
                    type="password" 
                    placeholder="••••••••••••"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-lg py-2 sm:py-2.5 pl-9 sm:pl-10 pr-3 sm:pr-4 text-xs sm:text-sm font-semibold text-gray-800 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                  />
                </div>
              </div>

              <div className="md:col-start-1 space-y-1.5">
                <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Nueva Contraseña</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                    <ShieldAlert size={15} className="text-gray-400 group-focus-within:text-brand-red transition-colors" />
                  </div>
                  <input 
                    type="password" 
                    placeholder="Mínimo 8 caracteres"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-lg py-2 sm:py-2.5 pl-9 sm:pl-10 pr-3 sm:pr-4 text-xs sm:text-sm font-semibold text-gray-800 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Confirmar Nueva Contraseña</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                    <ShieldAlert size={15} className="text-gray-400 group-focus-within:text-brand-red transition-colors" />
                  </div>
                  <input 
                    type="password" 
                    placeholder="Repita su nueva contraseña"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-lg py-2 sm:py-2.5 pl-9 sm:pl-10 pr-3 sm:pr-4 text-xs sm:text-sm font-semibold text-gray-800 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-start gap-3 sm:gap-4 pt-6 border-t border-gray-100 w-full">
            <button className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-gray-600 hover:bg-gray-150 bg-white rounded-lg transition-all border border-gray-250 shadow-xs cursor-pointer">
              Cancelar
            </button>
            <motion.button 
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-brand-blue hover:bg-blue-700 rounded-lg transition-all shadow-md shadow-blue-200 cursor-pointer"
            >
              Guardar Cambios
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
