import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileCheck2, 
  Users2, 
  DollarSign, 
  AlertTriangle, 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2, 
  Car, 
  Compass, 
  Eye, 
  ArrowUpRight, 
  Check, 
  Download,
  Filter,
  Search,
  ExternalLink,
  Edit,
  Sliders,
  UserCheck,
  UserX,
  X,
  Sparkles,
  Percent,
  Calculator,
  KeyRound
} from 'lucide-react';
import { DemoAccount, Property, Booking, Transaction, UserRole } from '../types';
import { soundManager } from '../utils/audio';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  idDoc: string;
  city: string;
  status: 'Activo / Verificado' | 'En Revisión RNT' | 'Suspendido Temporalmente';
  totalBookings: number;
  totalEarningsCOP: string;
  notes: string;
}

interface AdminSuperDashboardProps {
  activeAdminTab: 'verifications' | 'users' | 'commissions' | 'disputes' | 'analytics';
  setActiveAdminTab: (tab: 'verifications' | 'users' | 'commissions' | 'disputes' | 'analytics') => void;
  properties: Property[];
  accounts: DemoAccount[];
  currentAdminEmail: string;
  onGenerateTemporaryPassword: (email: string) => string | null;
  onApproveProperty: (id: string) => void;
  onRejectProperty: (id: string) => void;
}

export const AdminSuperDashboard: React.FC<AdminSuperDashboardProps> = ({
  activeAdminTab,
  setActiveAdminTab,
  properties,
  accounts,
  currentAdminEmail,
  onGenerateTemporaryPassword,
  onApproveProperty,
  onRejectProperty
}) => {
  // Commission rates configuration
  const [commissionRates, setCommissionRates] = useState({
    stays: 12.0,
    experiences: 15.0,
    transport: 18.0,
    withholdingTax: 3.5
  });
  const [simulatedBookingAmount, setSimulatedBookingAmount] = useState(1200000); // 1.2M COP
  const [commSavedMsg, setCommSavedMsg] = useState(false);

  // Managed Users List
  const [usersList, setUsersList] = useState<ManagedUser[]>([
    {
      id: 'usr-1',
      name: 'María Camila De La Vega',
      email: 'mcamila@cartagenastays.co',
      phone: '+57 310 492 8812',
      role: 'Anfitrión Superhost',
      idDoc: 'NIT 901.428.192-3',
      city: 'Cartagena',
      status: 'Activo / Verificado',
      totalBookings: 142,
      totalEarningsCOP: '$84.200.000 COP',
      notes: 'Anfitriona de alto rendimiento con RNT vigente #48291.'
    },
    {
      id: 'usr-2',
      name: 'Javier Morales',
      email: 'javierm@hospedaride.co',
      phone: '+57 312 890 2311',
      role: 'Conductor Hospeda Ride',
      idDoc: 'CC 71.902.441',
      city: 'Cartagena / Aeropuerto',
      status: 'Activo / Verificado',
      totalBookings: 320,
      totalEarningsCOP: '$18.400.000 COP',
      notes: 'Vehículo Mercedes Clase E placas blancas de turismo.'
    },
    {
      id: 'usr-3',
      name: 'Rodrigo Echeverry',
      email: 'rodrigo@hotelprovidenceluxe.com',
      phone: '+57 301 552 1190',
      role: 'Anfitrión Hotel Boutique',
      idDoc: 'NIT 900.582.193-2',
      city: 'Medellín',
      status: 'En Revisión RNT',
      totalBookings: 89,
      totalEarningsCOP: '$52.800.000 COP',
      notes: 'Pendiente renovación de póliza extracontractual ante MinCIT.'
    },
    {
      id: 'usr-4',
      name: 'Carlos Santillana',
      email: 'carlos.s@gmail.com',
      phone: '+57 315 771 9043',
      role: 'Huésped Viajero',
      idDoc: 'CC 10.320.198',
      city: 'Bogotá',
      status: 'Activo / Verificado',
      totalBookings: 14,
      totalEarningsCOP: '$0 COP (Cliente)',
      notes: 'Viajero verificado con 14 estancias completadas sin incidencias.'
    },
    {
      id: 'usr-5',
      name: 'Nayibe Arnedo',
      email: 'nayibe.tours@getsemani.co',
      phone: '+57 320 812 7701',
      role: 'Guía de Experiencias',
      idDoc: 'RNT #48192',
      city: 'Cartagena',
      status: 'Activo / Verificado',
      totalBookings: 164,
      totalEarningsCOP: '$28.600.000 COP',
      notes: 'Guía profesional acreditada con carnet de Guía Nacional.'
    }
  ]);

  // Selected User for "Gestionar Perfil" Modal
  const [selectedUserToEdit, setSelectedUserToEdit] = useState<ManagedUser | null>(null);
  const [profileUpdatedMsg, setProfileUpdatedMsg] = useState<string | null>(null);
  const [generatedTemporaryPassword, setGeneratedTemporaryPassword] = useState<{ email: string; password: string } | null>(null);
  const [passwordResetError, setPasswordResetError] = useState<string | null>(null);

  // Pending Verifications
  const [pendingVerifications, setPendingVerifications] = useState([
    {
      id: 'verif-1',
      hostName: 'Hotel Boutique Casa San Agustín',
      ownerName: 'Rodrigo Echeverry',
      city: 'Cartagena (Bolívar)',
      rntNumber: 'RNT #94821',
      taxId: 'NIT 900.582.193-2',
      propertyType: 'Hotel Boutique 5★',
      submittedAt: '11/11/2026 09:30',
      documentStatus: 'Documentos RNT y Cámara de Comercio cargados',
      status: 'pending'
    },
    {
      id: 'verif-2',
      hostName: 'Glamping Los Nevados & Finca El Mirador',
      ownerName: 'Tatiana Quintero',
      city: 'Salento / Quindío',
      rntNumber: 'RNT #81290',
      taxId: 'CC 52.891.402',
      propertyType: 'Cabaña Campestre / Glamping',
      submittedAt: '10/11/2026 16:45',
      documentStatus: 'Cédula de ciudadanía y póliza extracontractual vigentes',
      status: 'pending'
    }
  ]);

  // Disputes
  const [disputes, setDisputes] = useState([
    {
      id: 'disp-301',
      guest: 'Fabián Arango',
      host: 'María Camila De La Vega',
      property: 'Casa Colonial Getsemaní',
      amount: '$1.150.000 COP',
      reason: 'Vuelo retrasado por clima en Bogotá; solicita reprogramar sin penalidad',
      status: 'open',
      priority: 'Media'
    }
  ]);

  // Handlers for Verifications
  const handleApprove = (id: string) => {
    soundManager.playCashRegister();
    setPendingVerifications(prev => prev.filter(v => v.id !== id));
    onApproveProperty(id);
  };

  const handleReject = (id: string) => {
    soundManager.playChime();
    setPendingVerifications(prev => prev.filter(v => v.id !== id));
    onRejectProperty(id);
  };

  // Handlers for Commissions
  const handleSaveCommissionRates = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playCashRegister();
    setCommSavedMsg(true);
    setTimeout(() => setCommSavedMsg(false), 3500);
  };

  // Handlers for User Profile Editing
  const handleOpenEditUser = (user: ManagedUser) => {
    setSelectedUserToEdit({ ...user });
  };

  const handleSaveEditedUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserToEdit) return;

    soundManager.playCashRegister();
    setUsersList(prev => prev.map(u => u.id === selectedUserToEdit.id ? selectedUserToEdit : u));
    setProfileUpdatedMsg(`Perfil de ${selectedUserToEdit.name} actualizado con éxito.`);
    setTimeout(() => {
      setProfileUpdatedMsg(null);
      setSelectedUserToEdit(null);
    }, 1500);
  };

  const handleToggleUserSuspension = () => {
    if (!selectedUserToEdit) return;
    const nextStatus: ManagedUser['status'] = selectedUserToEdit.status === 'Suspendido Temporalmente' ? 'Activo / Verificado' : 'Suspendido Temporalmente';
    const updated: ManagedUser = { ...selectedUserToEdit, status: nextStatus };
    setSelectedUserToEdit(updated);
    setUsersList(prev => prev.map(u => u.id === updated.id ? updated : u));
    soundManager.playChime();
  };

  // Commission Simulator Calculations
  const simulatedCommissionAmount = Math.round(simulatedBookingAmount * (commissionRates.stays / 100));
  const simulatedWithholding = Math.round(simulatedBookingAmount * (commissionRates.withholdingTax / 100));
  const simulatedHostNet = simulatedBookingAmount - simulatedCommissionAmount - simulatedWithholding;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top SuperAdmin Banner */}
      <div className="p-6 rounded-3xl bg-purple-950 text-white border border-purple-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-800/80 text-purple-200 border border-purple-600">
              SuperAdmin Staff · MinComercio &amp; DIAN
            </span>
            <span className="text-xs text-purple-300">· Colombia 🇨🇴</span>
          </div>
          <h1 className="text-2xl font-black mt-2">
            Panel de Control y Moderación Global Hospeda&amp;Go
          </h1>
          <p className="text-xs text-purple-300 mt-1 max-w-2xl leading-relaxed">
            Supervisa el cumplimiento de la Ley 2068 de Turismo, administra perfiles de usuarios, configura las tasas de comisión por reserva y resuelve disputas en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3.5 rounded-2xl bg-purple-900/60 border border-purple-700 text-center">
            <span className="text-[10px] text-purple-300 uppercase font-bold block">GMV Nacional Mes</span>
            <span className="text-base font-black tabular-nums text-emerald-400">
              $384.5M COP
            </span>
          </div>
          <button
            onClick={() => setActiveAdminTab('commissions')}
            className="p-3.5 rounded-2xl bg-purple-800 hover:bg-purple-700 border border-purple-600 text-center cursor-pointer transition-colors"
            title="Ajustar comisiones por reserva"
          >
            <span className="text-[10px] text-amber-300 uppercase font-bold block flex items-center justify-center gap-1">
              <Sliders className="w-3 h-3" />
              Comisión Stays
            </span>
            <span className="text-base font-black tabular-nums text-white">
              {commissionRates.stays}%
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUB-PANEL 1: VERIFICACIÓN RNT & NIT COLOMBIA              */}
      {/* ========================================================= */}
      {activeAdminTab === 'verifications' && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-purple-600" />
              <span>Solicitudes de Verificación RNT Pendientes ({pendingVerifications.length})</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Valida el Registro Nacional de Turismo ante el Ministerio de Comercio, Industria y Turismo antes de activar anuncios en Colombia.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {pendingVerifications.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Todas las solicitudes de RNT han sido procesadas
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  No hay anfitriones ni hoteles en cola de verificación legal.
                </p>
              </div>
            ) : (
              pendingVerifications.map(verif => (
                <div 
                  key={verif.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white text-base">
                        {verif.hostName}
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                        {verif.rntNumber}
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        {verif.taxId}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-2">
                      <span>Titular: <strong>{verif.ownerName}</strong></span>
                      <span>·</span>
                      <span>Ubicación: <strong>{verif.city}</strong></span>
                      <span>·</span>
                      <span>Tipo: <strong>{verif.propertyType}</strong></span>
                    </div>

                    <p className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl inline-block">
                      📄 {verif.documentStatus}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleReject(verif.id)}
                      className="px-3.5 py-2 rounded-xl border border-rose-300 text-rose-600 dark:border-rose-800 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors"
                    >
                      Rechazar por Inconsistencia
                    </button>
                    <button
                      onClick={() => handleApprove(verif.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Validar RNT &amp; Activar</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-PANEL 2: GESTIÓN DE USUARIOS + GESTIONAR PERFIL ACTIVO*/}
      {/* ========================================================= */}
      {activeAdminTab === 'users' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users2 className="w-5 h-5 text-purple-600" />
                <span>Directorio General de Usuarios Hospeda&amp;Go</span>
              </h2>
              <p className="text-xs text-slate-500">
                Haz clic en <strong>"Gestionar Perfil"</strong> para editar datos, cambiar roles, verificar documentos o suspender cuentas.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {usersList.length} cuentas registradas
            </span>
          </div>

          <section className="space-y-4 rounded-3xl border border-purple-200 bg-purple-50/60 p-5 dark:border-purple-900/60 dark:bg-purple-950/20">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-purple-100 p-2 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
                <KeyRound className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Restablecer acceso a una cuenta</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Genera una clave temporal para huéspedes, anfitriones u otros administradores. La persona deberá cambiarla al iniciar sesión.
                </p>
              </div>
            </div>

            {generatedTemporaryPassword && (
              <div className="rounded-2xl border border-emerald-200 bg-white p-4 dark:border-emerald-900 dark:bg-slate-900">
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Clave temporal para {generatedTemporaryPassword.email}
                </p>
                <p className="mt-2 select-all rounded-lg bg-slate-100 px-3 py-2 font-mono text-base font-bold tracking-wider text-slate-900 dark:bg-slate-800 dark:text-white">
                  {generatedTemporaryPassword.password}
                </p>
                <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                  Entrégala directamente al usuario por un canal seguro. Este prototipo no envía correos.
                </p>
              </div>
            )}

            {passwordResetError && (
              <p role="alert" className="text-xs font-semibold text-rose-600">{passwordResetError}</p>
            )}

            <div className="grid gap-2 sm:grid-cols-2">
              {accounts.map(account => (
                <div
                  key={account.email}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-900 dark:text-white">{account.name}</p>
                    <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">{account.email}</p>
                    <p className="mt-1 text-[10px] font-semibold text-purple-700 dark:text-purple-300">
                      {account.role === 'admin' ? 'Administrador' : account.role === 'host' ? 'Anfitrión' : 'Huésped'}
                      {account.mustChangePassword && ' · Cambio pendiente'}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={account.email === currentAdminEmail}
                    onClick={() => {
                      setPasswordResetError(null);
                      setGeneratedTemporaryPassword(null);
                      const password = onGenerateTemporaryPassword(account.email);
                      if (!password) {
                        setPasswordResetError('No se pudo generar la clave temporal para esta cuenta.');
                        return;
                      }
                      setGeneratedTemporaryPassword({ email: account.email, password });
                    }}
                    className="shrink-0 rounded-lg bg-purple-700 px-3 py-2 text-[11px] font-bold text-white transition-colors hover:bg-purple-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
                    title={account.email === currentAdminEmail ? 'No puedes restablecer la cuenta que tiene esta sesión' : 'Generar contraseña temporal'}
                  >
                    {account.email === currentAdminEmail ? 'Sesión actual' : 'Generar clave'}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-3.5 pl-5">Usuario / Contacto</th>
                    <th className="p-3.5">Rol en la Plataforma</th>
                    <th className="p-3.5">Identificación Legal</th>
                    <th className="p-3.5">Ciudad Base</th>
                    <th className="p-3.5">Estado Cuenta</th>
                    <th className="p-3.5 text-right pr-5">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {usersList.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 pl-5">
                        <span className="font-bold text-slate-900 dark:text-white block">{user.name}</span>
                        <span className="text-[11px] text-slate-400">{user.email}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{user.role}</span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">
                        {user.idDoc}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">
                        {user.city}
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          user.status === 'Activo / Verificado'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : user.status === 'En Revisión RNT'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right pr-5">
                        <button 
                          onClick={() => handleOpenEditUser(user)}
                          className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold text-xs transition-colors flex items-center gap-1.5 ml-auto"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Gestionar Perfil</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-PANEL 3: SECCIÓN PARA AJUSTAR % DE COMISIÓN (CORE)    */}
      {/* ========================================================= */}
      {activeAdminTab === 'commissions' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Main Commission Settings Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Percent className="w-5 h-5 text-purple-600" />
                  <span>Ajuste de Comisiones de Plataforma por Reserva</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Define el porcentaje (%) de comisión que Hospeda&amp;Go deduce automáticamente de cada reserva en las verticales de Alojamientos, Experiencias y Transporte.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Motor de Comisiones Activo</span>
              </div>
            </div>

            {commSavedMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>¡Tasas de comisión actualizadas con éxito! Se aplicarán en todas las nuevas reservas.</span>
              </div>
            )}

            <form onSubmit={handleSaveCommissionRates} className="space-y-6">
              
              {/* Sliders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Alojamientos (Stays) */}
                <div className="p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">Alojamientos (Stays)</h4>
                        <p className="text-[10px] text-slate-400">Casas, hoteles y hostales</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 shadow-xs">
                      <input
                        type="number"
                        min="5"
                        max="30"
                        step="0.5"
                        value={commissionRates.stays}
                        onChange={(e) => setCommissionRates({ ...commissionRates, stays: Number(e.target.value) })}
                        className="w-14 text-right font-black text-sm text-slate-900 dark:text-white tabular-nums bg-transparent focus:outline-none"
                      />
                      <span className="font-bold text-xs text-slate-500">%</span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="0.5"
                    value={commissionRates.stays}
                    onChange={(e) => setCommissionRates({ ...commissionRates, stays: Number(e.target.value) })}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />

                  <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                    <span>Mínimo: 5%</span>
                    <span className="text-emerald-600 font-bold">Activo: {commissionRates.stays}%</span>
                    <span>Máximo: 30%</span>
                  </div>
                </div>

                {/* 2. Experiencias (Tours) */}
                <div className="p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">Experiencias &amp; Tours</h4>
                        <p className="text-[10px] text-slate-400">Gastronomía y aventura</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 shadow-xs">
                      <input
                        type="number"
                        min="5"
                        max="35"
                        step="0.5"
                        value={commissionRates.experiences}
                        onChange={(e) => setCommissionRates({ ...commissionRates, experiences: Number(e.target.value) })}
                        className="w-14 text-right font-black text-sm text-slate-900 dark:text-white tabular-nums bg-transparent focus:outline-none"
                      />
                      <span className="font-bold text-xs text-slate-500">%</span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="5"
                    max="35"
                    step="0.5"
                    value={commissionRates.experiences}
                    onChange={(e) => setCommissionRates({ ...commissionRates, experiences: Number(e.target.value) })}
                    className="w-full accent-blue-600 cursor-pointer"
                  />

                  <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                    <span>Mínimo: 5%</span>
                    <span className="text-blue-600 font-bold">Activo: {commissionRates.experiences}%</span>
                    <span>Máximo: 35%</span>
                  </div>
                </div>

                {/* 3. Transporte Privado (Rides) */}
                <div className="p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600">
                        <Car className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">Transporte Privado</h4>
                        <p className="text-[10px] text-slate-400">Transfers y viajes urbanos</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 shadow-xs">
                      <input
                        type="number"
                        min="8"
                        max="35"
                        step="0.5"
                        value={commissionRates.transport}
                        onChange={(e) => setCommissionRates({ ...commissionRates, transport: Number(e.target.value) })}
                        className="w-14 text-right font-black text-sm text-slate-900 dark:text-white tabular-nums bg-transparent focus:outline-none"
                      />
                      <span className="font-bold text-xs text-slate-500">%</span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="8"
                    max="35"
                    step="0.5"
                    value={commissionRates.transport}
                    onChange={(e) => setCommissionRates({ ...commissionRates, transport: Number(e.target.value) })}
                    className="w-full accent-amber-600 cursor-pointer"
                  />

                  <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                    <span>Mínimo: 8%</span>
                    <span className="text-amber-600 font-bold">Activo: {commissionRates.transport}%</span>
                    <span>Máximo: 35%</span>
                  </div>
                </div>

              </div>

              {/* Live Simulator Box */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-purple-600" />
                    <span>Simulador de Liquidación en Tiempo Real por Reserva</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">Moneda: Pesos Colombianos (COP)</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Valor de la Reserva Simulada ($COP)
                    </label>
                    <input
                      type="number"
                      step="100000"
                      value={simulatedBookingAmount}
                      onChange={(e) => setSimulatedBookingAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white tabular-nums text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 flex-1 text-xs">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
                      <span className="text-[10px] text-slate-400 block font-semibold">Comisión Plataforma ({commissionRates.stays}%)</span>
                      <span className="text-sm font-black text-purple-600 dark:text-purple-400 tabular-nums">
                        ${simulatedCommissionAmount.toLocaleString('es-CO')} COP
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
                      <span className="text-[10px] text-slate-400 block font-semibold">ReteFuente DIAN (3.5%)</span>
                      <span className="text-sm font-black text-rose-500 tabular-nums">
                        -${simulatedWithholding.toLocaleString('es-CO')} COP
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
                      <span className="text-[10px] text-slate-400 block font-semibold">Neto Anfitrión</span>
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                        ${simulatedHostNet.toLocaleString('es-CO')} COP
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  Las nuevas tasas impactan inmediatamente el cálculo de checkout y facturación.
                </span>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <SaveCheck className="w-4 h-4" />
                  <span>Aplicar y Guardar Nuevas Tasas de Comisión</span>
                </button>
              </div>

            </form>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-PANEL 4: DISPUTAS & RECLAMOS                          */}
      {/* ========================================================= */}
      {activeAdminTab === 'disputes' && (
        <div className="space-y-4 animate-in fade-in">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Centro de Disputas &amp; Solución de Conflictos</span>
            </h2>
            <p className="text-xs text-slate-500">Manejo de cancelaciones, reclamos y autorizaciones de reembolso.</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {disputes.map(disp => (
              <div 
                key={disp.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-purple-700 dark:text-purple-400">{disp.id}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{disp.property}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                      Prioridad {disp.priority}
                    </span>
                  </div>
                  <span className="font-mono font-black text-slate-900 dark:text-white">{disp.amount}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl leading-relaxed">
                  <strong>Reclamo Huésped ({disp.guest} vs {disp.host}):</strong> "{disp.reason}"
                </p>

                <div className="flex items-center justify-end gap-2 pt-1 text-xs">
                  <button className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50">
                    Abrir Chat Tripartito
                  </button>
                  <button className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                    Autorizar Reembolso Parcial
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-PANEL 5: ANALYTICS GMV COLOMBIA                       */}
      {/* ========================================================= */}
      {activeAdminTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span>Volumen Transaccional Bruto (GMV) por Región de Colombia</span>
            </h2>
            <p className="text-xs text-slate-500">Métricas acumuladas del mes en curso.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { region: 'Cartagena (Bolívar)', gmv: '$142.800.000 COP', share: '37.1%', count: '284 reservas' },
              { region: 'Medellín (Antioquia)', gmv: '$128.400.000 COP', share: '33.4%', count: '312 reservas' },
              { region: 'Bogotá D.C.', gmv: '$67.300.000 COP', share: '17.5%', count: '198 reservas' },
              { region: 'Santa Marta & Tayrona', gmv: '$46.000.000 COP', share: '12.0%', count: '145 reservas' }
            ].map((reg, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">{reg.region}</span>
                <span className="text-lg font-black text-slate-900 dark:text-white tabular-nums block mt-1">{reg.gmv}</span>
                <div className="flex justify-between items-center text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>{reg.count}</span>
                  <span className="font-bold text-emerald-600">{reg.share}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: GESTIONAR PERFIL DE USUARIO (ACTIVADO)             */}
      {/* ========================================================= */}
      {selectedUserToEdit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95 text-xs">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Gestionar Perfil de Usuario
                  </h3>
                  <p className="text-[11px] text-slate-400">ID: {selectedUserToEdit.id}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserToEdit(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {profileUpdatedMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{profileUpdatedMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveEditedUser} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={selectedUserToEdit.name}
                    onChange={(e) => setSelectedUserToEdit({ ...selectedUserToEdit, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={selectedUserToEdit.email}
                    onChange={(e) => setSelectedUserToEdit({ ...selectedUserToEdit, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Rol Asignado
                  </label>
                  <select
                    value={selectedUserToEdit.role}
                    onChange={(e) => setSelectedUserToEdit({ ...selectedUserToEdit, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white font-semibold focus:outline-none"
                  >
                    <option value="Huésped Viajero" className="dark:bg-slate-900">Huésped Viajero</option>
                    <option value="Anfitrión Superhost" className="dark:bg-slate-900">Anfitrión Superhost</option>
                    <option value="Anfitrión Hotel Boutique" className="dark:bg-slate-900">Anfitrión Hotel Boutique</option>
                    <option value="Conductor Hospeda Ride" className="dark:bg-slate-900">Conductor Hospeda Ride</option>
                    <option value="Guía de Experiencias" className="dark:bg-slate-900">Guía de Experiencias</option>
                    <option value="SuperAdmin Staff" className="dark:bg-slate-900">SuperAdmin Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Estado de la Cuenta
                  </label>
                  <select
                    value={selectedUserToEdit.status}
                    onChange={(e) => setSelectedUserToEdit({ ...selectedUserToEdit, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white font-semibold focus:outline-none"
                  >
                    <option value="Activo / Verificado" className="dark:bg-slate-900">Activo / Verificado</option>
                    <option value="En Revisión RNT" className="dark:bg-slate-900">En Revisión RNT</option>
                    <option value="Suspendido Temporalmente" className="dark:bg-slate-900">Suspendido Temporalmente</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Identificación (Cédula / NIT)
                  </label>
                  <input
                    type="text"
                    value={selectedUserToEdit.idDoc}
                    onChange={(e) => setSelectedUserToEdit({ ...selectedUserToEdit, idDoc: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Ciudad Base en Colombia
                  </label>
                  <input
                    type="text"
                    value={selectedUserToEdit.city}
                    onChange={(e) => setSelectedUserToEdit({ ...selectedUserToEdit, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Notas Internas de Auditoría
                </label>
                <textarea
                  rows={2}
                  value={selectedUserToEdit.notes}
                  onChange={(e) => setSelectedUserToEdit({ ...selectedUserToEdit, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleToggleUserSuspension}
                  className={`px-3 py-2 rounded-xl font-bold transition-colors ${
                    selectedUserToEdit.status === 'Suspendido Temporalmente'
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                  }`}
                >
                  {selectedUserToEdit.status === 'Suspendido Temporalmente' ? 'Reactivar Cuenta' : 'Suspender Cuenta'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedUserToEdit(null)}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold shadow-xs transition-colors"
                  >
                    Guardar Cambios de Perfil
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

function SaveCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="w-4 h-4"
      {...props}
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}
