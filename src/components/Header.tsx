import React, { useState } from 'react';
import { 
  Building2, 
  Compass, 
  Car, 
  LayoutDashboard, 
  Bell, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  MessageSquare,
  Search,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  FileCheck2,
  Users2,
  DollarSign,
  AlertTriangle,
  BarChart3,
  PlusCircle,
  ChevronDown,
  Sparkles,
  LogIn,
  LogOut,
  UserPlus,
  CalendarCheck
} from 'lucide-react';
import { UserRole, CurrencyCode, ColombiaDestination, AuthUser } from '../types';
import { COLOMBIA_DESTINATIONS } from '../data/mockData';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  // Current active role & setter
  currentRole: UserRole;
  currentUser: AuthUser | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;

  // Guest tabs navigation
  activeGuestTab: 'stays' | 'experiences' | 'rides' | 'bookings';
  setActiveGuestTab: (tab: 'stays' | 'experiences' | 'rides' | 'bookings') => void;

  // Host tabs navigation
  activeHostTab: 'properties' | 'rnt' | 'calendar' | 'earnings';
  setActiveHostTab: (tab: 'properties' | 'rnt' | 'calendar' | 'earnings') => void;

  // Admin tabs navigation
  activeAdminTab: 'verifications' | 'users' | 'commissions' | 'disputes' | 'analytics';
  setActiveAdminTab: (tab: 'verifications' | 'users' | 'commissions' | 'disputes' | 'analytics') => void;

  // Quick search states (Colombia)
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  checkInDate: string;
  setCheckInDate: (date: string) => void;
  checkOutDate: string;
  setCheckOutDate: (date: string) => void;
  guestCount: number;
  setGuestCount: (count: number) => void;
  onSearchSubmit?: () => void;

  // Utilities
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  unreadCount: number;
  unreadMessagesCount: number;
  openNotifications: () => void;
  openChat: () => void;
  onOpenNewListingModal?: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  currentUser,
  onOpenAuth,
  onLogout,
  activeGuestTab,
  setActiveGuestTab,
  activeHostTab,
  setActiveHostTab,
  activeAdminTab,
  setActiveAdminTab,
  selectedCity,
  setSelectedCity,
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  guestCount,
  setGuestCount,
  onSearchSubmit,
  currency,
  setCurrency,
  unreadCount,
  unreadMessagesCount,
  openNotifications,
  openChat,
  onOpenNewListingModal,
  darkMode,
  setDarkMode
}) => {
  const [soundOn, setSoundOn] = useState(soundManager.isEnabled());
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const handleToggleSound = () => {
    const newState = soundManager.toggleSound();
    setSoundOn(newState);
  };

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    setIsCityDropdownOpen(false);
    if (onSearchSubmit) onSearchSubmit();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      
      {/* ========================================================= */}
      {/* TOP ROW: BRAND, ROLE SWITCHER (RBAC) & UTILITY ACTIONS   */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-16">
          
          {/* ZONE 1: BRAND LOGO & COLOMBIA COUNTRY CONTEXT */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                if (currentRole === 'guest') setActiveGuestTab('stays');
              }} 
              className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-sm transition-transform group-hover:scale-105">
                <Building2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                    Hospeda<span className="text-emerald-600 dark:text-emerald-400">&amp;</span>Go
                  </span>
                  {/* Bandera / Tag Colombia sutil */}
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                    Colombia 🇨🇴
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  Stays · Experiencias · Movilidad
                </p>
              </div>
            </button>
          </div>

          {/* ZONE 2: AUTHENTICATED ACCOUNT */}
          <div className="flex items-center">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className={`hidden sm:block text-right text-[11px] leading-tight ${
                  currentRole === 'admin' ? 'text-purple-700 dark:text-purple-300' : currentRole === 'host' ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300'
                }`}>
                  <div className="font-bold max-w-32 truncate">{currentUser.name}</div>
                  <div>{currentRole === 'admin' ? 'Administrador' : currentRole === 'host' ? 'Anfitrión' : 'Huésped'}</div>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Ingresar</span>
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Crear cuenta</span>
                </button>
              </div>
            )}
          </div>

          {/* ZONE 3: UTILITY ACTIONS (CURRENCY COP/USD, CHAT, NOTIFS, THEME) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Currency Selector (Pesos Colombianos COP / USD) */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-bold">
              <button
                onClick={() => setCurrency('COP')}
                className={`px-2 py-1 rounded-md transition-all ${
                  currency === 'COP'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Moneda oficial: Pesos Colombianos"
              >
                COP
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-1 rounded-md transition-all ${
                  currency === 'USD'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Dólares estadounidenses"
              >
                USD
              </button>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              title={soundOn ? 'Sonidos push activados' : 'Sonidos desactivados'}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Alternar sonido"
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Alternar tema"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Private Chat Button */}
            <button
              onClick={openChat}
              className="relative p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Chat privado en tiempo real"
              aria-label="Chat privado"
            >
              <MessageSquare className="w-4 h-4" />
              {unreadMessagesCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Push Notifications Bell */}
            <button
              onClick={openNotifications}
              className="relative p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Notificaciones push"
              aria-label="Notificaciones"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Role Action CTA */}
            {currentRole === 'host' && (
              <button
                onClick={onOpenNewListingModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-xs whitespace-nowrap"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Publicar Anuncio</span>
              </button>
            )}

            {currentRole === 'admin' && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>DIAN &amp; MinComercio</span>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* SECOND ROW: DYNAMIC NAVBAR ACCORDING TO SELECTED ROLE     */}
      {/* ========================================================= */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ------------------------------------------------------- */}
          {/* A. NAVBAR FOR 'MODO HUÉSPED': 3 MAIN TABS + QUICK SEARCH */}
          {/* ------------------------------------------------------- */}
          {currentRole === 'guest' && (
            <div className="py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              {/* LAS 3 PESTAÑAS PRINCIPALES (ALOJAMIENTOS, EXPERIENCIAS, TRANSPORTE PRIVADO) */}
              <nav className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setActiveGuestTab('stays')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
                    activeGuestTab === 'stays'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <Building2 className="w-4 h-4 opacity-80" />
                  <span>Alojamientos</span>
                </button>

                <button
                  onClick={() => setActiveGuestTab('experiences')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
                    activeGuestTab === 'experiences'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <Compass className="w-4 h-4 opacity-80" />
                  <span>Experiencias</span>
                </button>

                <button
                  onClick={() => setActiveGuestTab('rides')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
                    activeGuestTab === 'rides'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <Car className="w-4 h-4 opacity-80" />
                  <span>Transporte Privado</span>
                </button>
                <button
                  onClick={() => setActiveGuestTab('bookings')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
                    activeGuestTab === 'bookings'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <CalendarCheck className="w-4 h-4 opacity-80" />
                  <span>Mis reservas</span>
                </button>
              </nav>

              {/* BUSCADOR RÁPIDO ADAPTADO A DESTINOS DE COLOMBIA */}
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs text-xs">
                
                {/* Selector de Ciudad en Colombia con Menú Desplegable */}
                <div className="relative">
                  <button
                    onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="truncate max-w-[110px] sm:max-w-[140px]">
                      {selectedCity || 'Destino Colombia'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {/* Dropdown de Destinos Top de Colombia */}
                  {isCityDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Destinos Principales de Colombia
                      </div>
                      <div className="mt-1 space-y-0.5">
                        <button
                          onClick={() => handleCitySelect('')}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          🇨🇴 Todas las Regiones de Colombia
                        </button>
                        {COLOMBIA_DESTINATIONS.map(dest => (
                          <button
                            key={dest.id}
                            onClick={() => handleCitySelect(dest.name)}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors"
                          >
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600">
                                {dest.name}
                              </span>
                              <span className="text-[11px] text-slate-400 ml-1.5">
                                ({dest.department})
                              </span>
                            </div>
                            {dest.badge && (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                {dest.badge}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

                {/* Fechas de Viaje */}
                <div className="hidden sm:flex items-center gap-1.5 px-2 text-slate-600 dark:text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="bg-transparent text-[11px] font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                  />
                  <span className="text-slate-300 dark:text-slate-600">&rarr;</span>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="bg-transparent text-[11px] font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                  />
                </div>

                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden md:block" />

                {/* Selector de Huéspedes */}
                <div className="hidden md:flex items-center gap-1.5 px-2 text-slate-600 dark:text-slate-300">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="bg-transparent text-[11px] font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                      <option key={n} value={n} className="dark:bg-slate-800">
                        {n} {n === 1 ? 'huésped' : 'huéspedes'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Botón Buscar */}
                <button
                  onClick={onSearchSubmit}
                  className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors flex items-center gap-1 shrink-0"
                  title="Buscar en Colombia"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Buscar</span>
                </button>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* B. NAVBAR FOR 'MODO ANFITRIÓN' (HOST PORTAL / RNT)     */}
          {/* ------------------------------------------------------- */}
          {currentRole === 'host' && (
            <div className="py-2.5 flex items-center justify-between gap-4 overflow-x-auto">
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                  <span>Portal Anfitrión Colombia:</span>
                </span>
                
                <nav className="flex items-center gap-1 text-xs font-semibold">
                  <button
                    onClick={() => setActiveHostTab('properties')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      activeHostTab === 'properties'
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Mis Publicaciones
                  </button>

                  <button
                    onClick={() => setActiveHostTab('rnt')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      activeHostTab === 'rnt'
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Cumplimiento RNT &amp; Ley 2068</span>
                  </button>

                  <button
                    onClick={() => setActiveHostTab('calendar')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      activeHostTab === 'calendar'
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Calendario &amp; Temporadas
                  </button>

                  <button
                    onClick={() => setActiveHostTab('earnings')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      activeHostTab === 'earnings'
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Ingresos &amp; Payouts (COP)</span>
                  </button>
                </nav>
              </div>

              {/* RNT Status Banner */}
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 shrink-0">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  RNT Homologado ante MinCIT
                </span>
                <span className="text-slate-300">·</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">RNT #48291 Vigente</span>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* C. NAVBAR FOR 'PANEL ADMINISTRADOR' (SUPERADMIN STAFF)  */}
          {/* ------------------------------------------------------- */}
          {currentRole === 'admin' && (
            <div className="py-2.5 flex items-center justify-between gap-4 overflow-x-auto">
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>SuperAdmin Staff:</span>
                </span>
                
                <nav className="flex items-center gap-1 text-xs font-semibold">
                  <button
                    onClick={() => setActiveAdminTab('verifications')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      activeAdminTab === 'verifications'
                        ? 'bg-purple-700 text-white shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Verificación RNT &amp; NIT</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                      3 pend.
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveAdminTab('users')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      activeAdminTab === 'users'
                        ? 'bg-purple-700 text-white shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Users2 className="w-3.5 h-3.5" />
                    <span>Gestión de Usuarios</span>
                  </button>

                  <button
                    onClick={() => setActiveAdminTab('commissions')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      activeAdminTab === 'commissions'
                        ? 'bg-purple-700 text-white shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Tasas &amp; Comisiones</span>
                  </button>

                  <button
                    onClick={() => setActiveAdminTab('disputes')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      activeAdminTab === 'disputes'
                        ? 'bg-purple-700 text-white shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Disputas &amp; Reclamos</span>
                  </button>

                  <button
                    onClick={() => setActiveAdminTab('analytics')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      activeAdminTab === 'analytics'
                        ? 'bg-purple-700 text-white shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Analytics GMV Colombia</span>
                  </button>
                </nav>
              </div>

              {/* Live Colombia GMV Indicator */}
              <div className="hidden lg:flex items-center gap-3 text-xs">
                <span className="text-slate-500">GMV Nacional Mes:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                  $384.500.000 COP
                </span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                  +18.4%
                </span>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* QUICK DESTINATIONS PILL BAR FOR COLOMBIA (VISIBLE IN GUEST MODE) */}
      {currentRole === 'guest' && (
        <div className="border-t border-slate-100 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center gap-2 overflow-x-auto text-xs pb-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                Destinos Populares:
              </span>
              <button
                onClick={() => handleCitySelect('')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                  !selectedCity
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Todos los Destinos
              </button>
              {COLOMBIA_DESTINATIONS.map(city => (
                <button
                  key={city.id}
                  onClick={() => handleCitySelect(city.name)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                    selectedCity === city.name
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
