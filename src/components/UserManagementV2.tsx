import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Plus, Edit2, Trash2, Search, Filter, ShieldAlert, X, ArrowUpDown, ChevronUp, ChevronDown, Users } from 'lucide-react';

interface UsuariosTabProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id'>) => void;
  onEditUser: (id: string, updated: Omit<User, 'id'>) => void;
  onDeleteUser: (id: string) => void;
}

export default function UserManagementV2({
  users,
  onAddUser,
  onEditUser,
  onDeleteUser,
}: UsuariosTabProps) {
  const [roleFilter, setRoleFilter] = useState<'Todos' | 'Medico' | 'Enfermera' | 'Admin'>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sorting state
  const [sortField, setSortField] = useState<'name' | 'email' | 'role' | 'status' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page to 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter, searchTerm]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  // Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<'Medico' | 'Enfermera' | 'Admin'>('Medico');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');
  
  // Validation errors
  const [valError, setValError] = useState('');

  // Delete confirm modal state
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Filter users based on role selector & search engine
  const filteredUsers = users.filter((user) => {
    const matchesRole = roleFilter === 'Todos' || user.role === roleFilter;
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleSort = (field: 'name' | 'email' | 'role' | 'status') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortField) return 0;
    
    const valA = a[sortField].toLowerCase();
    const valB = b[sortField].toLowerCase();
    
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const totalItems = sortedUsers.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedUserId(null);
    setFormName('');
    setFormEmail('');
    setFormRole('Medico');
    setFormStatus('Active');
    setValError('');
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setModalMode('edit');
    setSelectedUserId(user.id);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormStatus(user.status);
    setValError('');
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    setValError('');

    if (!formName.trim()) {
      setValError('El nombre es obligatorio.');
      return;
    }
    if (!formEmail.trim() || !formEmail.includes('@')) {
      setValError('Por favor introduce un correo válido.');
      return;
    }

    if (modalMode === 'create') {
      onAddUser({
        name: formName.trim(),
        email: formEmail.trim(),
        role: formRole,
        status: formStatus,
      });
    } else if (modalMode === 'edit' && selectedUserId) {
      onEditUser(selectedUserId, {
        name: formName.trim(),
        email: formEmail.trim(),
        role: formRole,
        status: formStatus,
      });
    }

    setIsModalOpen(false);
  };

  const confirmDelete = (user: User) => {
    setUserToDelete(user);
  };

  const handleDeleteConfirmed = () => {
    if (userToDelete) {
      onDeleteUser(userToDelete.id);
      setUserToDelete(null);
    }
  };

  const renderSortIcon = (field: 'name' | 'email' | 'role' | 'status') => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-55 group-hover/sort:opacity-100 transition-opacity" />;
    }
    return sortOrder === 'asc' ? (
      <ChevronUp className="h-3.5 w-3.5 text-blue-600 font-bold shrink-0" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-blue-600 font-bold shrink-0" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header compact view */}
      <div className="p-6 md:p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="text-brand-blue" size={24} />
            <span>Gestión de usuarios</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Administración de accesos, roles y establecimientos del sistema VIPENT
          </p>
        </div>
      </div>

      {/* Search and Quick Filters banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            id="user-search-input"
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-55/40 border border-slate-200 focus:bg-white rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans font-medium"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          id="create-user-btn"
          onClick={openCreateModal}
          className="w-full sm:w-auto bg-[#2563eb] hover:bg-[#1d4ed8] hover:shadow-lg hover:shadow-blue-500/15 text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer font-sans shrink-0 text-center"
        >
          <Plus className="h-4.5 w-4.5" />
          Crear usuario
        </button>
      </div>

      {/* Main mockup card frame */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md shadow-slate-100/40 overflow-hidden">
        {/* Card header with tools matching the mockup exactly */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 bg-gradient-to-r from-slate-50/30 to-white">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 w-full md:w-auto">
            <span className="text-slate-500 font-bold text-xs uppercase tracking-wider font-sans shrink-0">Filtrar por roles</span>
            <div className="flex flex-wrap gap-1 bg-slate-100/80 p-1 rounded-xl">
              {(['Todos', 'Medico', 'Enfermera', 'Admin'] as const).map((role) => {
                const isSelected = roleFilter === role;
                const label = role === 'Todos' ? 'Todos' : role === 'Medico' ? 'Médicos' : role === 'Enfermera' ? 'Enfermeras' : 'Administradores';
                return (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-white text-blue-600 shadow-xs font-extrabold'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {/* Kept here styled invisible with absolute layout for programmatic/E2E test compliance if searching by select */}
            <select
              id="role-filter-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="sr-only"
            >
              <option value="Todos">Todos</option>
              <option value="Medico">Medico</option>
              <option value="Enfermera">Enfermera</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>

        {/* User Table matching the mockup exactly */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans select-none">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1.5 uppercase hover:text-slate-600 transition-colors focus:outline-hidden cursor-pointer group/sort"
                    title="Ordenar por nombre"
                  >
                    <span>Nombre</span>
                    {renderSortIcon('name')}
                  </button>
                </th>
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans select-none">
                  <button
                    onClick={() => handleSort('email')}
                    className="flex items-center gap-1.5 uppercase hover:text-slate-600 transition-colors focus:outline-hidden cursor-pointer group/sort"
                    title="Ordenar por correo"
                  >
                    <span>Correo</span>
                    {renderSortIcon('email')}
                  </button>
                </th>
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans select-none">
                  <button
                    onClick={() => handleSort('role')}
                    className="flex items-center gap-1.5 uppercase hover:text-slate-600 transition-colors focus:outline-hidden cursor-pointer group/sort"
                    title="Ordenar por rol"
                  >
                    <span>Rol</span>
                    {renderSortIcon('role')}
                  </button>
                </th>
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans select-none">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center gap-1.5 uppercase hover:text-slate-600 transition-colors focus:outline-hidden cursor-pointer group/sort"
                    title="Ordenar por estado"
                  >
                    <span>Estado</span>
                    {renderSortIcon('status')}
                  </button>
                </th>
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400 font-sans text-sm">
                    No se encontraron usuarios que coincidan con la búsqueda o filtro.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group">
                       <td className="py-4 px-6 font-medium text-slate-800 text-sm font-sans">
                        <span className="font-bold text-slate-800 tracking-tight text-[14.5px]">{user.name}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-sans text-[13.5px]">
                        {user.email}
                      </td>
                      <td className="py-4 px-6 text-sm font-sans">
                        {user.role === 'Medico' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 shadow-xs">
                            Médico
                          </span>
                        ) : user.role === 'Enfermera' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-xs">
                            Enfermera
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs">
                            Admin
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-sm font-sans">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                          user.status === 'Active' 
                            ? 'bg-emerald-50/80 text-emerald-700 border border-emerald-100/60 shadow-xs' 
                            : 'bg-rose-50/80 text-rose-700 border border-rose-100/60 shadow-xs'
                        }`}>
                          {user.status === 'Active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right space-x-2 whitespace-nowrap">
                        <button
                          id={`edit-user-btn-${user.id}`}
                          onClick={() => openEditModal(user)}
                          className="text-[#2563eb] hover:text-[#1d4ed8] bg-blue-50/60 hover:bg-blue-100/60 border border-blue-100/50 font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 font-sans shadow-xs"
                          style={{ borderStyle: 'solid', borderWidth: '1px' }}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Editar
                        </button>
                        <button
                          id={`delete-user-btn-${user.id}`}
                          onClick={() => confirmDelete(user)}
                          className="text-[#ef4444] hover:text-[#dc2626] bg-red-50/60 hover:bg-red-100/60 border border-red-100/50 font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 font-sans shadow-xs"
                          style={{ borderStyle: 'solid', borderWidth: '1px' }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Bar matching the design image perfectly */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-100 bg-slate-50/30 font-sans text-xs font-semibold text-slate-500">
          {/* Left: Size configuration and status */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-600 font-bold">Páginas:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-bold shadow-xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-xs"
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
              <option value={50}>50 por página</option>
            </select>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-medium">
              Mostrando {totalItems === 0 ? 0 : startIndex + 1} a {endIndex} de {totalItems}
            </span>
          </div>

          {/* Right: Controller Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={activePage === 1}
              className="px-3.5 py-1.5 border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-slate-500 disabled:cursor-not-allowed rounded-lg cursor-pointer transition-all duration-150 font-bold active:scale-95"
              title="Ir al inicio"
            >
              Inicio
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={activePage === 1}
              className="px-3 py-1.5 border border-slate-200 bg-white text-slate-550 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-slate-550 disabled:cursor-not-allowed rounded-lg cursor-pointer transition-all duration-150 font-bold active:scale-95 flex items-center justify-center font-mono"
              title="Anterior"
            >
              &lt;
            </button>

            <div className="bg-[#1e293b] text-white border-transparent font-bold py-1.5 px-3.5 rounded-lg border shadow-xs min-w-[72px] text-center shrink-0 text-xs">
              {activePage} de {totalPages}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={activePage === totalPages}
              className="px-3 py-1.5 border border-slate-200 bg-white text-slate-550 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-slate-550 disabled:cursor-not-allowed rounded-lg cursor-pointer transition-all duration-150 font-bold active:scale-95 flex items-center justify-center font-mono"
              title="Siguiente"
            >
              &gt;
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={activePage === totalPages}
              className="px-3.5 py-1.5 border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-slate-550 disabled:cursor-not-allowed rounded-lg cursor-pointer transition-all duration-150 font-bold active:scale-95"
              title="Ir al final"
            >
              Final
            </button>
          </div>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-extrabold text-[17px] text-slate-800 font-sans tracking-wide">
                {modalMode === 'create' ? 'Crear Nuevo Usuario' : 'Editar Usuario'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser}>
              <div className="p-6 space-y-4">
                {valError && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3.5 rounded-xl text-sm flex gap-2 items-center font-sans">
                    <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                    <span>{valError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider font-sans">
                    Nombre Completo
                  </label>
                  <input
                    id="form-name-input"
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans font-medium"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider font-sans">
                    Correo Electrónico
                  </label>
                  <input
                    id="form-email-input"
                    type="email"
                    required
                    placeholder="ejemplo@clincavipent.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans font-medium"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider font-sans">
                      Rol Clínico
                    </label>
                    <select
                      id="form-role-select"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-hidden focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans font-bold text-slate-700 cursor-pointer"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value as any)}
                    >
                      <option value="Medico">Medico</option>
                      <option value="Enfermera">Enfermera</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider font-sans">
                      Estado
                    </label>
                    <select
                      id="form-status-select"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-hidden focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans font-bold text-slate-700 cursor-pointer"
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                    >
                      <option value="Active">Activo</option>
                      <option value="Inactive">Inactivo</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-sm font-bold transition-colors cursor-pointer font-sans"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl text-sm font-bold transition-all shadow-xs hover:shadow-lg hover:shadow-blue-500/15 cursor-pointer font-sans"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-6 text-center space-y-4">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 mb-1">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-800 font-sans tracking-tight">
                ¿Eliminar este usuario?
              </h3>
              <p className="text-slate-550 text-sm font-sans leading-relaxed">
                ¿Estás seguro de que quieres eliminar a <b className="text-slate-800 font-extrabold">{userToDelete.name}</b> de la plataforma? Esta acción no se puede deshacer y quedará registrada en la bitácora de trazabilidad.
              </p>
            </div>

            <div className="p-5 bg-slate-50/50 flex justify-end gap-2.5 border-t border-slate-100">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-sm font-bold transition-colors cursor-pointer font-sans"
              >
                Cancelar
              </button>
              <button
                id="confirm-delete-user-btn"
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer font-sans shadow-sm shadow-red-500/10"
              >
                Eliminar Registro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
