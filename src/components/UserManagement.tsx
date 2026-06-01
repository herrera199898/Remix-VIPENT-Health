import React, { useState, useEffect } from 'react';
import { 
  Search, SlidersHorizontal, UserPlus, Shield, Building2, 
  CheckCircle, AlertCircle, Calendar, Edit2, Lock, Key, 
  Eye, ToggleLeft, ToggleRight, X, Check, CheckSquare 
} from 'lucide-react';
import { BulletListSvgIcon } from './PatientList';

// Types for user management
export interface MockUser {
  id: string;
  fullName: string;
  email: string;
  rut: string;
  role: 'Administrador' | 'Clínico';
  specialty?: string;
  establishment: 'Hualañé' | 'Curepto' | 'Ambos' | 'Sin asignar';
  status: 'Activo' | 'Inactivo' | 'Pendiente' | 'Bloqueado';
  lastAccess: string;
  phone?: string;
  notes?: string;
}

// Initial mock data of users
const INITIAL_USERS: MockUser[] = [
  {
    id: 'u-1',
    fullName: 'Usuario Administrador',
    email: 'salarcon@vipent.cl',
    rut: '14.892.428-K',
    role: 'Administrador',
    specialty: 'Director de Informática',
    establishment: 'Ambos',
    status: 'Activo',
    lastAccess: 'Hoy, 15:42',
    phone: '+56987654321',
    notes: 'Administradora general del ecosistema VIPENT.'
  },
  {
    id: 'u-2',
    fullName: 'Roberto Gómez Pardo',
    email: 'rgomez@hualane.cl',
    rut: '12.345.678-9',
    role: 'Clínico',
    specialty: 'Médico Coordinador PSCV',
    establishment: 'Hualañé',
    status: 'Activo',
    lastAccess: 'Ayer, 09:12',
    phone: '+56912345678',
    notes: 'Coordina piloto de APS en establecimiento Hualañé.'
  },
  {
    id: 'u-3',
    fullName: 'Patricia Rojas Silva',
    email: 'projas@curepto.cl',
    rut: '15.678.910-K',
    role: 'Clínico',
    specialty: 'Enfermera Coordinadora',
    establishment: 'Curepto',
    status: 'Activo',
    lastAccess: '24 May 2026',
    phone: '+56923456789',
    notes: 'Coordinadora de salud cardiovascular Curepto.'
  },
  {
    id: 'u-4',
    fullName: 'Carlos Mendoza Aliste',
    email: 'cmendoza@hualane.cl',
    rut: '16.543.210-2',
    role: 'Clínico',
    specialty: 'Médico Cirujano',
    establishment: 'Hualañé',
    status: 'Activo',
    lastAccess: 'Hoy, 11:20',
    phone: '+56934567890',
    notes: 'Médico clínico del Programa Salud Cardiovascular.'
  },
  {
    id: 'u-5',
    fullName: 'Camila Silva Torres',
    email: 'csilva@curepto.cl',
    rut: '17.890.123-4',
    role: 'Clínico',
    specialty: 'Enfermera',
    establishment: 'Curepto',
    status: 'Activo',
    lastAccess: 'Hoy, 08:05',
    phone: '+56945678901',
    notes: 'Profesional de enfermería, atención domiciliaria y box.'
  },
  {
    id: 'u-6',
    fullName: 'María José Flores',
    email: 'mjflores@hualane.cl',
    rut: '18.234.567-8',
    role: 'Clínico',
    specialty: 'Nutricionista',
    establishment: 'Hualañé',
    status: 'Pendiente',
    lastAccess: 'Sin acceso registrado',
    phone: '+56956789012',
    notes: 'Pendiente aceptación de invitación por correo.'
  },
  {
    id: 'u-7',
    fullName: 'Juan Carlos Plaza',
    email: 'jplaza@hualane.cl',
    rut: '13.412.569-4',
    role: 'Clínico',
    specialty: 'Administrador de SOME',
    establishment: 'Hualañé',
    status: 'Inactivo',
    lastAccess: '12 Abr 2026',
    phone: '+56967890123',
    notes: 'Asignación de cupos y agendas de morbilidad PSCV.'
  },
  {
    id: 'u-8',
    fullName: 'Gloria Mandiola Fuentes',
    email: 'gmandiola@minsal.cl',
    rut: '10.987.654-3',
    role: 'Clínico',
    specialty: 'Auditor Externo',
    establishment: 'Ambos',
    status: 'Bloqueado',
    lastAccess: '10 May 2026',
    phone: '+56978901234',
    notes: 'Auditoría externa y validación de cobertura REM.'
  }
];

// Definition of permissions per role
interface RolePermission {
  roleName: string;
  description: string;
  permissions: {
    module: string;
    description: string;
    items: string[];
  }[];
}

const ROLE_PERMISSIONS_MATRIX: Record<string, RolePermission> = {
  'Administrador': {
    roleName: 'Administrador',
    description: 'Acceso total y sin restricciones al sistema, configuraciones globales, logs de auditoría y gestión de cuentas.',
    permissions: [
      { module: 'Pacientes', description: 'Ficha clínica del paciente', items: ['Ver listado', 'Ver ficha', 'Editar datos'] },
      { module: 'Citas', description: 'Agenda y reservas de citas', items: ['Ver agenda', 'Crear/editar cita', 'Marcar inasistencia'] },
      { module: 'REM-P4', description: 'Cálculo de cobertura y corte ministerial', items: ['Ver reporte', 'Validar reporte', 'Exportar reporte'] },
      { module: 'Usuarios', description: 'Seguridad y credenciales de acceso', items: ['Ver usuarios', 'Crear/editar usuarios', 'Bloquear usuarios'] },
      { module: 'Auditoría', description: 'Trazabilidad y firma digital', items: ['Ver trazabilidad', 'Exportar registros'] },
      { module: 'Configuración', description: 'Configuraciones críticas', items: ['Configurar establecimiento', 'Administrar roles'] }
    ]
  },
  'Clínico': {
    roleName: 'Clínico',
    description: 'Acceso clínico para evaluación de pacientes, metas de compensación, gestión de citas e inasistencias en APS.',
    permissions: [
      { module: 'Pacientes', description: 'Ficha clínica del paciente', items: ['Ver listado', 'Ver ficha', 'Editar datos clínicos (Evaluación, signos vitales y controles)'] },
      { module: 'Citas', description: 'Agenda y reservas de citas', items: ['Ver agenda', 'Crear/editar cita', 'Marcar inasistencia'] },
      { module: 'REM-P4', description: 'Cálculo de cobertura', items: ['Ver reporte', 'Exportar reporte'] }
    ]
  }
};

export default function UserManagement() {
  const [usersList, setUsersList] = useState<MockUser[]>(() => {
    const saved = localStorage.getItem('vipent_users_mock');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // State to notify changes
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('Todos');
  const [selectedEstablishment, setSelectedEstablishment] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todos');

  // Multi-dropdown state for table actions
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modal / Drawer state for creating/editing user
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<MockUser | null>(null);

  // Details popover state for permissions matrix
  const [selectedRolePermissions, setSelectedRolePermissions] = useState<RolePermission | null>(null);

  // Form Fields State
  const [formName, setFormName] = useState('');
  const [formRut, setFormRut] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<MockUser['role']>('Clínico');
  const [formSpecialty, setFormSpecialty] = useState('');
  const [formEstablishment, setFormEstablishment] = useState<MockUser['establishment']>('Hualañé');
  const [formStatus, setFormStatus] = useState<MockUser['status']>('Activo');
  const [formNotes, setFormNotes] = useState('');

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5500);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Persist mock list to local storage
  const saveUsers = (newList: MockUser[]) => {
    setUsersList(newList);
    localStorage.setItem('vipent_users_mock', JSON.stringify(newList));
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setNotification({ message, type });
  };

  // Close active menus when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveMenuId(null);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  // Filtered Users List
  const filteredUsers = usersList.filter(user => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = 
      user.fullName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.rut.toLowerCase().includes(query);

    const matchesRole = selectedRole === 'Todos' || user.role === selectedRole;
    const matchesEstablishment = selectedEstablishment === 'Todos' || user.establishment === selectedEstablishment || user.establishment === 'Ambos';
    const matchesStatus = selectedStatus === 'Todos' || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesEstablishment && matchesStatus;
  });

  // Action handlers
  const handleOpenCreateForm = () => {
    setEditingUser(null);
    setFormName('');
    setFormRut('');
    setFormEmail('');
    setFormPhone('');
    setFormRole('Clínico');
    setFormSpecialty('');
    setFormEstablishment('Hualañé');
    setFormStatus('Activo');
    setFormNotes('');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (user: MockUser) => {
    setEditingUser(user);
    setFormName(user.fullName);
    setFormRut(user.rut);
    setFormEmail(user.email);
    setFormPhone(user.phone || '');
    setFormRole(user.role);
    setFormSpecialty(user.specialty || '');
    setFormEstablishment(user.establishment);
    setFormStatus(user.status);
    setFormNotes(user.notes || '');
    setIsFormOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      showToast('El nombre completo es obligatorio.', 'warning');
      return;
    }
    if (!formEmail.trim() || !formEmail.includes('@')) {
      showToast('Por favor ingrese un correo institucional válido.', 'warning');
      return;
    }
    if (!formRut.trim()) {
      showToast('El RUT es obligatorio.', 'warning');
      return;
    }

    const finalName = formRole === 'Administrador' ? 'Usuario Administrador' : formName.trim();
    const finalSpecialty = formRole === 'Administrador' ? 'Administrador de Sistema' : formSpecialty.trim();

    if (editingUser) {
      // Edit mode
      const updatedList = usersList.map(u => {
        if (u.id === editingUser.id) {
          return {
            ...u,
            fullName: finalName,
            rut: formRut.trim(),
            email: formEmail.trim(),
            phone: formPhone.trim(),
            role: formRole,
            specialty: finalSpecialty,
            establishment: formEstablishment,
            status: formStatus,
            notes: formNotes.trim()
          };
        }
        return u;
      });
      saveUsers(updatedList);
      showToast(`Usuario "${finalName}" actualizado correctamente.`);
      
      // TODO: registrar cambios de usuario en AuditLog.
      console.log(`[AuditLog] Usuario ${editingUser.id} modificado. Rol: ${formRole}, Sede: ${formEstablishment}`);
    } else {
      // Create mode
      const newUser: MockUser = {
        id: `u-${Date.now()}`,
        fullName: finalName,
        rut: formRut.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        role: formRole,
        specialty: finalSpecialty,
        establishment: formEstablishment,
        status: formStatus,
        lastAccess: 'Sin acceso registrado',
        notes: formNotes.trim()
      };
      saveUsers([...usersList, newUser]);
      showToast(`Usuario "${finalName}" creado con rol de ${formRole}.`);
      
      // TODO: registrar cambios de usuario en AuditLog.
      console.log(`[AuditLog] Nuevo usuario creado. RUT: ${formRut}, Rol: ${formRole}`);
    }

    setIsFormOpen(false);
  };

  const handleToggleStatus = (user: MockUser) => {
    const nextStatus = user.status === 'Activo' ? 'Inactivo' : 'Activo';
    const updated = usersList.map(u => 
      u.id === user.id ? { ...u, status: nextStatus as any } : u
    );
    saveUsers(updated);
    showToast(`Usuario "${user.fullName}" cambiado a estado ${nextStatus}.`, 'info');
    
    // TODO: registrar cambios de usuario en AuditLog.
    console.log(`[AuditLog] Estado de usuario ${user.id} actualizado a: ${nextStatus}`);
  };

  const handleBlockUser = (user: MockUser) => {
    const nextStatus = user.status === 'Bloqueado' ? 'Activo' : 'Bloqueado';
    const updated = usersList.map(u => 
      u.id === user.id ? { ...u, status: nextStatus as any } : u
    );
    saveUsers(updated);
    showToast(`Usuario "${user.fullName}" ha sido ${nextStatus === 'Bloqueado' ? 'BLOQUEADO por medidas de seguridad' : 'Desbloqueado'}.`, nextStatus === 'Bloqueado' ? 'warning' : 'success');
  
    // TODO: registrar cambios de usuario en AuditLog.
    console.log(`[AuditLog] Bloqueo de usuario ${user.id} cambiado a: ${nextStatus === 'Bloqueado'}`);
  };

  const handleResetPassword = (user: MockUser) => {
    showToast(`Se ha enviado una solicitud de restablecimiento de contraseña mock para ${user.email}. El enlace expira en 24 horas.`, 'info');
    
    // TODO: registrar cambios de usuario en AuditLog.
    console.log(`[AuditLog] Contraseña de usuario ${user.id} solicitada para reinicio.`);
  };

  const handleOpenPermissions = (role: MockUser['role']) => {
    const matrix = ROLE_PERMISSIONS_MATRIX[role] || {
      roleName: role,
      description: 'Sin matriz de permisos detallada.',
      permissions: []
    };
    setSelectedRolePermissions(matrix);
  };

  const getInitials = (name: string): string => {
    if (!name) return 'US';
    return name.split(' ')
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Badge stylings 
  const getRoleBadgeStyle = (role: MockUser['role']) => {
    const mapping: Record<MockUser['role'], string> = {
      'Administrador': 'bg-red-50 text-red-700 border-red-200',
      'Clínico': 'bg-teal-50 text-teal-700 border-teal-200'
    };
    return `border px-2 py-0.5 rounded-full text-[11px] font-bold tracking-tight inline-block ${mapping[role] || 'bg-gray-50 text-gray-700 border-gray-200'}`;
  };

  const getStatusBadgeStyle = (status: MockUser['status']) => {
    const mapping: Record<MockUser['status'], string> = {
      'Activo': 'bg-emerald-100 text-emerald-800 border-emerald-300',
      'Inactivo': 'bg-slate-100 text-slate-700 border-slate-300',
      'Pendiente': 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse',
      'Bloqueado': 'bg-rose-100 text-rose-800 border-rose-300'
    };
    return `border px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold tracking-wider uppercase inline-block ${mapping[status]}`;
  };

  const getEstablishmentIcon = (est: MockUser['establishment']) => {
    if (est === 'Ambos') return 'Hualañé + Curepto';
    if (est === 'Sin asignar') return 'Sin Establecimiento';
    return est;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f8fafc] overflow-y-auto min-h-0 relative px-2 py-1">
      {/* Toast Notification Bar */}
      {notification && (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl max-w-md transition-all animate-bounce ${
          notification.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' :
          notification.type === 'warning' ? 'bg-amber-50 text-amber-900 border-amber-200' :
          'bg-blue-50 text-blue-900 border-blue-200'
        }`}>
          {notification.type === 'success' ? (
                <CheckCircle className="text-emerald-500 w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className={`w-5 h-5 shrink-0 ${notification.type === 'warning' ? 'text-amber-500' : 'text-blue-500'}`} />
              )}
          <span className="text-xs font-semibold leading-relaxed">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="hover:bg-black/5 p-1 rounded-full"><X size={14} /></button>
        </div>
      )}

      {/* Header compact view */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="text-brand-blue w-6 h-6" />
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Gestión de usuarios</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">Administración de accesos, roles y establecimientos del sistema VIPENT</p>
        </div>
        <button 
          onClick={handleOpenCreateForm}
          className="bg-brand-blue hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer scale-100 hover:scale-102 active:scale-98 shrink-0"
        >
          <UserPlus size={15} />
          Nuevo usuario
        </button>
      </div>

      {/* Search and Filters panel */}
      <div className="bg-white border border-gray-200 rounded-xl p-3.5 my-4 flex flex-col gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-slate-400 border-b border-gray-100 pb-2">
          <SlidersHorizontal size={14} className="text-slate-500" />
          <span className="text-[10px] uppercase font-bold tracking-wider leading-none">Filtros de Búsqueda</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Subfilter search bar */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre, correo o RUT" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand-blue"
            />
          </div>

          {/* Subfilter Role */}
          <div>
            <select 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand-blue"
            >
              <option value="Todos">Rol: Todos ({usersList.length})</option>
              <option value="Administrador">Administrador</option>
              <option value="Clínico">Clínico</option>
            </select>
          </div>

          {/* Subfilter Establishment */}
          <div>
            <select 
              value={selectedEstablishment}
              onChange={(e) => setSelectedEstablishment(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand-blue"
            >
              <option value="Todos">Establecimiento: Todos</option>
              <option value="Hualañé">Hualañé</option>
              <option value="Curepto">Curepto</option>
              <option value="Ambos">Ambos</option>
            </select>
          </div>

          {/* Subfilter States */}
          <div>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand-blue"
            >
              <option value="Todos">Estado: Todos</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Bloqueado">Bloqueado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table card view */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs flex-1 min-h-[400px] flex flex-col">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto flex-1 min-h-0">
          <table className="w-full border-collapse text-left text-xs text-gray-700">
            <thead className="bg-[#f8fafc] border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] w-[25%]">Usuario</th>
                <th className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] w-[12%]">Rol</th>
                <th className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] w-[20%]">Especialidad / Profesión</th>
                <th className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] w-[15%]">Establecimiento</th>
                <th className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] w-[10%] text-center">Estado</th>
                <th className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] w-[13%]">Último Acceso</th>
                <th className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider text-[10px] w-[5%] text-right pr-6">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* User Profile column */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className={`w-9 h-9 rounded-full font-black text-xs flex items-center justify-center shrink-0 shadow-xs border ${
                          user.status === 'Bloqueado' ? 'bg-rose-50 text-rose-500 border-rose-200' :
                          user.status === 'Inactivo' ? 'bg-slate-100 text-slate-500 border-slate-300' :
                          user.role === 'Administrador' ? 'bg-red-50 text-red-600 border-red-200' :
                          'bg-teal-50 text-teal-600 border-teal-200'
                        }`}>
                          {getInitials(user.fullName)}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-slate-900 truncate tracking-tight">{user.fullName}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 text-[10px] text-slate-400 font-bold font-mono">
                            <span className="text-slate-500 truncate">{user.email}</span>
                            <span className="hidden sm:inline text-slate-300">|</span>
                            <span className="text-slate-500 truncate shrink-0">RUT: {user.rut}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role column */}
                    <td className="py-3.5 px-4 vertical-align-middle">
                      <span className={getRoleBadgeStyle(user.role)}>
                        {user.role}
                      </span>
                    </td>

                    {/* Specialty / Profession column */}
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold text-slate-700 font-sans">
                        {user.specialty || 'No especificada'}
                      </span>
                    </td>

                    {/* Establishment column */}
                    <td className="py-3.5 px-4 font-bold text-slate-700">
                      <div className="flex items-center gap-1.5 text-xs text-semibold">
                        <Building2 size={13} className="text-slate-400 shrink-0" />
                        <span>{getEstablishmentIcon(user.establishment)}</span>
                      </div>
                    </td>

                    {/* Status column */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={getStatusBadgeStyle(user.status)}>
                        {user.status}
                      </span>
                    </td>

                    {/* Last access column */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-[11px] text-slate-500 font-mono">
                        <Calendar size={12} className="text-slate-400 shrink-0" />
                        <span>{user.lastAccess}</span>
                      </div>
                    </td>

                    {/* Actions column */}
                    <td className="py-3.5 px-4 text-right pr-6 relative">
                      <div className="inline-block">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === user.id ? null : user.id);
                          }}
                          className="p-1 px-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                        >
                          <BulletListSvgIcon size={14} />
                        </button>

                        {activeMenuId === user.id && (
                          <>
                            {/* Overlay covering screen to handle clicks outside */}
                            <div 
                              className="fixed inset-0 z-10 cursor-default" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(null);
                              }} 
                            />
                            <div className="absolute right-0 top-full mt-1.5 w-60 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 text-left font-bold text-xs text-gray-700">
                              <button 
                                onClick={() => {
                                  setActiveMenuId(null);
                                  handleOpenEditForm(user);
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-50 font-bold"
                              >
                                <Edit2 size={13} className="text-blue-600" />
                                Editar usuario
                              </button>
                              <button 
                                onClick={() => {
                                  setActiveMenuId(null);
                                  handleOpenPermissions(user.role);
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-50 font-bold"
                              >
                                <Eye size={13} className="text-emerald-600" />
                                Ver permisos del rol
                              </button>
                              <button 
                                onClick={() => {
                                  setActiveMenuId(null);
                                  handleToggleStatus(user);
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-50 font-bold text-slate-700"
                              >
                                <Lock size={13} className="text-slate-400" />
                                {user.status === 'Activo' ? 'Inactivar usuario' : 'Activar usuario'}
                              </button>
                              <button 
                                onClick={() => {
                                  setActiveMenuId(null);
                                  handleBlockUser(user);
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-50 font-bold"
                              >
                                <Lock size={13} className="text-rose-500" />
                                {user.status === 'Bloqueado' ? 'Desbloquear cuenta' : 'Bloquear de seguridad'}
                              </button>
                              <button 
                                onClick={() => {
                                  setActiveMenuId(null);
                                  handleResetPassword(user);
                                }}
                                className="w-full text-left px-3.5 py-2 hover:bg-gray-50 flex items-center gap-2 font-bold text-amber-600"
                              >
                                <Key size={13} className="text-amber-500" />
                                Restablecer contraseña
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-20 text-center font-medium italic text-slate-400">
                    No se encontraron usuarios que coincidan con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tablet / Mobile View */}
        <div className="md:hidden flex-1 overflow-y-auto p-4 space-y-3">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs relative space-y-3.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full font-black text-xs flex items-center justify-center shrink-0 bg-slate-100 text-slate-700 border">
                      {getInitials(user.fullName)}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-gray-900 truncate leading-tight">{user.fullName}</h4>
                      <p className="text-[10px] text-slate-400 font-bold font-mono tracking-tight">{user.email}</p>
                      {user.specialty && (
                        <p className="text-[10px] text-brand-blue font-bold tracking-tight mt-0.5">{user.specialty}</p>
                      )}
                    </div>
                  </div>
                  {/* Status Badge */}
                  <span className={getStatusBadgeStyle(user.status)}>
                    {user.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-gray-100">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Rol asignado</p>
                    <span className={`mt-1 ${getRoleBadgeStyle(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Establecimiento</p>
                    <p className="font-extrabold text-slate-700 mt-1 flex items-center gap-1.5">
                      <Building2 size={12} className="text-slate-400 shrink-0" />
                      {getEstablishmentIcon(user.establishment)}
                    </p>
                  </div>
                </div>

                {/* RUT or Last access info */}
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 font-mono pt-1">
                  <span>RUT: {user.rut}</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={11} className="text-slate-400" />
                    {user.lastAccess}
                  </span>
                </div>

                {/* Mobile action buttons toolbar */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap">
                  <button 
                    onClick={() => handleOpenPermissions(user.role)}
                    className="px-2.5 py-1.5 text-xs font-bold text-brand-blue border border-blue-200 bg-blue-50/20 hover:bg-blue-50 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Eye size={12} />
                    Ver permisos
                  </button>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleOpenEditForm(user)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                      title="Editar"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(user)}
                      className={`p-1.5 border rounded-lg cursor-pointer ${user.status === 'Activo' ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 border-slate-200' : 'text-emerald-500 border-emerald-200 hover:bg-emerald-50/50'}`}
                      title={user.status === 'Activo' ? 'Inactivar' : 'Activar'}
                    >
                      {user.status === 'Activo' ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                    </button>
                    <button 
                      onClick={() => handleBlockUser(user)}
                      className={`p-1.5 border rounded-lg cursor-pointer ${user.status === 'Bloqueado' ? 'text-emerald-600 border-emerald-200' : 'text-rose-500 border-rose-200'}`}
                      title={user.status === 'Bloqueado' ? 'Desbloquear' : 'Bloquear'}
                    >
                      <Lock size={13} />
                    </button>
                    <button 
                      onClick={() => handleResetPassword(user)}
                      className="p-1.5 text-amber-600 border border-amber-200 rounded-lg hover:bg-amber-50 cursor-pointer"
                      title="Reiniciar clave"
                    >
                      <Key size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center font-medium italic text-slate-400">
              No se encontraron usuarios que coincidan con los filtros.
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-4 pb-2 text-[10px] text-slate-400 font-mono uppercase text-right leading-none">
        VIPENT ADMIN PROFILE (MOCK ENGINE)
      </div>

      {/* POPUP: ROLES PERMISSIONS MATRIX VIEW */}
      {selectedRolePermissions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
            {/* Header */}
            <div className="bg-brand-blue text-white px-5 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase text-blue-200">MATRIZ DE PERMISOS</span>
                <h3 className="text-base font-black tracking-tight mt-0.5">{selectedRolePermissions.roleName}</h3>
              </div>
              <button 
                onClick={() => setSelectedRolePermissions(null)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Context summary */}
            <div className="px-5 py-3.5 bg-slate-50 border-b border-gray-100">
              <p className="text-xs font-semibold text-slate-500 italic leading-relaxed">
                {selectedRolePermissions.description}
              </p>
            </div>

            {/* Matrix view container */}
            <div className="p-5 max-h-[380px] overflow-y-auto no-scrollbar space-y-3.5">
              {selectedRolePermissions.permissions.map((modulePerm, idx) => (
                <div key={idx} className="border border-slate-100 rounded-xl p-3 bg-white space-y-2 last:border-b last:mb-0">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-1.5">
                    <span className="text-xs font-extrabold text-slate-800 uppercase tracking-tight">{modulePerm.module}</span>
                    <span className="text-[9px] text-slate-400 font-bold italic">{modulePerm.description}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {modulePerm.items.map((it, idx2) => (
                      <div key={idx2} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <CheckSquare size={13} className="text-brand-blue shrink-0" />
                        <span>{it}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {selectedRolePermissions.permissions.length === 0 && (
                <p className="text-xs font-semibold text-center italic py-4 text-slate-400">
                  No se registran permisos configurados para este rol en el piloto.
                </p>
              )}
            </div>

            {/* Policy disclaimer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-slate-50 text-[10px] font-bold text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2">
              <span className="text-slate-400 uppercase tracking-wider text-[9px]">VIPENT SECURITY SCHEMA</span>
              <span className="text-slate-500 italic text-center sm:text-right">
                Los permisos se asignan por rol. La edición granular se considera configuración avanzada.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER / SLIDE-OVER: CREATE OR EDIT USER */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs flex justify-end z-50">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
            {/* Header */}
            <div className="bg-[#f8fafc] border-b border-gray-200 px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">
                  {editingUser ? 'Editar usuario' : 'Nuevo usuario'}
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                  {editingUser ? 'Actualizar cuenta' : 'Invitar nuevo profesional'}
                </p>
              </div>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveUser} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
                {/* Full name field */}
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest block">Nombre completo *</label>
                  <input 
                    type="text" 
                    required={formRole !== 'Administrador'}
                    disabled={formRole === 'Administrador'}
                    placeholder={formRole === 'Administrador' ? 'Usuario Administrador' : 'Ej. Sofia Alarcón Peña'}
                    value={formRole === 'Administrador' ? 'Usuario Administrador' : formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-blue ${
                      formRole === 'Administrador' ? 'bg-slate-50 text-slate-500 border-gray-200 cursor-not-allowed font-bold' : ''
                    }`}
                  />
                  {formRole === 'Administrador' && (
                    <p className="text-[10px] text-brand-blue font-bold italic mt-0.5">※ Nombre fijado automáticamente para el rol Administrador</p>
                  )}
                </div>

                {/* RUT field */}
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest block">RUT *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ej. 14.892.428-K"
                    value={formRut}
                    onChange={(e) => setFormRut(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                </div>

                {/* Email field */}
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest block">Correo institucional *</label>
                  <input 
                    type="email" 
                    required
                    placeholder="Ej. salarcon@vipent.cl"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                </div>

                {/* Phone number */}
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest block">Teléfono (Opcional)</label>
                  <input 
                    type="text" 
                    placeholder="Ej. +56987654321"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                </div>

                {/* Assign Role selection */}
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest block">Rol del sistema *</label>
                  <select 
                    value={formRole}
                    onChange={(e) => {
                      const selected = e.target.value as MockUser['role'];
                      setFormRole(selected);
                      if (selected === 'Administrador') {
                        setFormName('Usuario Administrador');
                        setFormSpecialty('Administrador de Sistema');
                      } else if (formName === 'Usuario Administrador') {
                        setFormName('');
                        setFormSpecialty('');
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Clínico">Clínico</option>
                  </select>
                </div>

                {/* Specialty/Profession field */}
                {formRole !== 'Administrador' && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest block">Especialidad / Profesión</label>
                    <input 
                      type="text" 
                      placeholder="Ej. Médico, Enfermera Coordinadora, Nutricionista, etc."
                      value={formSpecialty}
                      onChange={(e) => setFormSpecialty(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                  </div>
                )}

                {/* Assign Establishment selection */}
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest block">Establecimiento asociado *</label>
                  <select 
                    value={formEstablishment}
                    onChange={(e) => setFormEstablishment(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  >
                    <option value="Hualañé">Establecimiento Hualañé</option>
                    <option value="Curepto">Establecimiento Curepto</option>
                    <option value="Ambos">Ambos (Acceso general)</option>
                    <option value="Sin asignar">Sin asignar</option>
                  </select>
                </div>

                {/* status toggle */}
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest block">Estado del acceso *</label>
                  <select 
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  >
                    <option value="Activo">Activo (Habilitado)</option>
                    <option value="Inactivo">Inactivo (Suspendido)</option>
                    <option value="Pendiente">Pendiente (Invitación por correo)</option>
                    <option value="Bloqueado">Bloqueado (Acceso cancelado)</option>
                  </select>
                </div>

                {/* Notes/observations box */}
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest block">Observaciones administrativas</label>
                  <textarea 
                    rows={3} 
                    placeholder="Bitácora o notas adicionales..."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-blue resize-none"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="bg-slate-50 px-5 py-4 border-t border-gray-200 flex items-center justify-end gap-3.5">
                <button 
                  type="button" 
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-extrabold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-brand-blue hover:bg-blue-700 text-white font-extrabold text-xs rounded-lg shadow-sm cursor-pointer scale-100 hover:scale-102 active:scale-98 transition-all"
                >
                  {editingUser ? 'Guardar usuario' : 'Crear usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
