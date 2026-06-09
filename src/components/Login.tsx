
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Mail, ArrowLeft, KeyRound, Shield, Search as SearchIcon, User as UserIcon } from 'lucide-react';
import { User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [mode, setMode] = useState<'LOGIN' | 'RECOVERY'>('LOGIN');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    
    // Simulate API call
    setTimeout(() => {
      if (username === 'admin@vipent.cl' && password === 'demo123') {
        onLogin({ id: 'u1', name: 'Admin Usuario', email: 'admin@vipent.cl', role: 'Admin', status: 'Active', establishment: 'Clínica Central' });
      } else if (username === 'clinico@vipent.cl' && password === 'demo123') {
        onLogin({ id: 'u2', name: 'Dr. Clínico', email: 'clinico@vipent.cl', role: 'Medico', status: 'Active', establishment: 'Curepto' });
      } else if (username === 'investigador@vipent.cl' && password === 'demo123') {
        onLogin({ id: 'u3', name: 'Usuario Investigador', email: 'investigador@vipent.cl', role: 'Investigador', status: 'Active', establishment: 'Ambos / Datos anonimizados' });
      } else if (username && password) {
        // Fallback
        onLogin({ id: 'u99', name: username, email: username, role: 'Medico', status: 'Active', establishment: 'Hualañé' });
      } else {
        setMessage({ type: 'error', text: 'Por favor, introduce usuario y contraseña.' });
        setIsLoading(false);
      }
    }, 800);
  };

  const handleQuickLogin = (role: UserRole) => {
    let mockUsername = '';
    if (role === 'Admin') mockUsername = 'admin@vipent.cl';
    else if (role === 'Medico') mockUsername = 'clinico@vipent.cl';
    else mockUsername = 'investigador@vipent.cl';
    
    setUsername(mockUsername);
    setPassword('demo123');
    
    setTimeout(() => {
      setIsLoading(true);
      setTimeout(() => {
        if (role === 'Admin') {
          onLogin({ id: 'u1', name: 'Admin Usuario', email: mockUsername, role: 'Admin', status: 'Active', establishment: 'Clínica Central' });
        } else if (role === 'Medico') {
          onLogin({ id: 'u2', name: 'Dr. Clínico', email: mockUsername, role: 'Medico', status: 'Active', establishment: 'Curepto' });
        } else {
          onLogin({ id: 'u3', name: 'Usuario Investigador', email: mockUsername, role: 'Investigador', status: 'Active', establishment: 'Ambos / Datos anonimizados' });
        }
      }, 800);
    }, 400);
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Simulate API call
    setTimeout(() => {
      if (email) {
        setMessage({ type: 'success', text: 'Instrucciones enviadas a tu correo electrónico.' });
        setIsLoading(false);
      } else {
        setMessage({ type: 'error', text: 'Por favor, introduce tu correo electrónico.' });
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] p-4">
      <div className="w-full max-w-[480px]">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-10">
            <AnimatePresence mode="wait">
              {mode === 'LOGIN' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">Iniciar Sesión</h1>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 ml-1">Usuario</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-gray-700"
                        placeholder="Introduce tu usuario"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 ml-1">Contraseña</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-gray-700 font-mono"
                        placeholder="••••••••••••"
                        required
                      />
                    </div>

                    {message && (
                      <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {message.text}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <LogIn size={20} />
                          <span>Iniciar sesión</span>
                        </>
                      )}
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMode('RECOVERY');
                          setMessage(null);
                        }}
                        className="text-blue-600 font-semibold hover:underline transition-all"
                      >
                        Recuperar contraseña
                      </button>
                    </div>
                  </form>
                  
                  <div className="mt-8 border-t border-gray-100 pt-6">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-4">Acceso Rápido (Demo)</p>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickLogin('Admin')}
                        disabled={isLoading}
                        className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Shield size={16} className="text-slate-500" />
                        Ingresar como Administrador
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickLogin('Medico')}
                        disabled={isLoading}
                        className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <UserIcon size={16} className="text-blue-500" />
                        Ingresar como Clínico
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickLogin('Investigador')}
                        disabled={isLoading}
                        className="w-full py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded-lg transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <SearchIcon size={16} className="text-purple-500" />
                        Ingresar como Investigador
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="recovery"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight mb-4">Recuperar Contraseña</h1>
                    <p className="text-gray-500 font-medium px-4 leading-relaxed">
                      Introduce tu correo electrónico para recibir las instrucciones de restablecimiento de contraseña.
                    </p>
                  </div>

                  <form onSubmit={handleRecovery} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600 ml-1">Correo electrónico</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-gray-700"
                        placeholder="ejemplo@correo.com"
                        required
                      />
                    </div>

                    {message && (
                      <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {message.text}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Mail size={20} />
                          <span>Enviar credenciales</span>
                        </>
                      )}
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMode('LOGIN');
                          setMessage(null);
                        }}
                        className="flex items-center justify-center gap-2 w-full text-blue-600 font-semibold hover:underline transition-all"
                      >
                        <ArrowLeft size={16} />
                        <span>Volver al Login</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Simple footer for context */}
        <p className="text-center mt-8 text-gray-400 text-xs font-bold uppercase tracking-widest px-10">
          Sistema de Gestión Médica © 2026
        </p>
      </div>
    </div>
  );
}
