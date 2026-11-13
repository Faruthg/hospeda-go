import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Map, 
  Grid, 
  SlidersHorizontal, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Star, 
  BellRing,
  Coffee,
  Waves,
  Wifi,
  UtensilsCrossed,
  X,
  Compass,
  Car,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { 
  INITIAL_PROPERTIES, 
  INITIAL_EXPERIENCES, 
  INITIAL_BOOKINGS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_TRANSACTIONS,
  COLOMBIA_DESTINATIONS
} from './data/mockData';
import { 
  Property, 
  Experience, 
  Booking, 
  Conversation, 
  PushNotification, 
  Transaction, 
  ActiveRide, 
  UserRole, 
  CurrencyCode,
  AuthUser,
  DemoAccount,
  GuestReservation
} from './types';
import { DEMO_ACCOUNTS } from './data/demoAccounts';
import { Header } from './components/Header';
import { PropertyCard } from './components/PropertyCard';
import { InteractiveMap } from './components/InteractiveMap';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { ChatModal } from './components/ChatModal';
import { HostAdminDashboard } from './components/HostAdminDashboard';
import { AdminSuperDashboard } from './components/AdminSuperDashboard';
import { ExperiencesSection } from './components/ExperiencesSection';
import { TransportRideSection } from './components/TransportRideSection';
import { VerifiedReviewsModal } from './components/VerifiedReviewsModal';
import { NotificationCenter } from './components/NotificationCenter';
import { PushToast } from './components/PushToast';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AuthModal } from './components/AuthModal';
import { GuestReservations } from './components/GuestReservations';
import { soundManager } from './utils/audio';

type BookingRequestData = Omit<Booking, 'id' | 'createdAt' | 'bookingCode' | 'status' | 'payoutStatus'>;
type PendingServiceAction =
  | { type: 'stay'; bookingData: BookingRequestData }
  | { type: 'experience'; experience: Experience; time: string; spots: number }
  | { type: 'ride'; ride: ActiveRide };

const ACCOUNTS_STORAGE_KEY = 'hospedago.demo.accounts';
const SESSION_STORAGE_KEY = 'hospedago.demo.session';
const RESERVATIONS_STORAGE_KEY = 'hospedago.demo.reservations';
const BOOKINGS_STORAGE_KEY = 'hospedago.demo.bookings';

const loadDemoAccounts = (): DemoAccount[] => {
  const saved = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
  if (!saved) return DEMO_ACCOUNTS;

  const parsed: unknown = JSON.parse(saved);
  if (!Array.isArray(parsed) || parsed.some(account =>
    !account || typeof account.name !== 'string' || typeof account.email !== 'string' ||
    typeof account.password !== 'string' ||
    !['guest', 'host', 'admin'].includes(account.role)
  )) {
    throw new Error('No se pudieron leer las cuentas de prueba guardadas en este navegador.');
  }

  const demoEmails = new Set(DEMO_ACCOUNTS.map(account => account.email));
  return [...DEMO_ACCOUNTS, ...(parsed as DemoAccount[]).filter(account => !demoEmails.has(account.email))];
};

const loadServiceReservations = (): GuestReservation[] => {
  const saved = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
  if (!saved) return [];

  const parsed: unknown = JSON.parse(saved);
  if (!Array.isArray(parsed) || parsed.some(reservation =>
    !reservation || typeof reservation.id !== 'string' || typeof reservation.email !== 'string' ||
    typeof reservation.title !== 'string' || !['experience', 'ride'].includes(reservation.type) ||
    typeof reservation.details !== 'string' || typeof reservation.amount !== 'number' ||
    typeof reservation.createdAt !== 'string'
  )) {
    throw new Error('No se pudieron leer las reservas guardadas en este navegador.');
  }
  return parsed as GuestReservation[];
};

const loadBookings = (): Booking[] => {
  const saved = localStorage.getItem(BOOKINGS_STORAGE_KEY);
  if (!saved) return INITIAL_BOOKINGS;

  const parsed: unknown = JSON.parse(saved);
  if (!Array.isArray(parsed) || parsed.some(booking =>
    !booking || typeof booking.id !== 'string' || typeof booking.guestEmail !== 'string' ||
    typeof booking.propertyTitle !== 'string' || typeof booking.bookingCode !== 'string'
  )) {
    throw new Error('No se pudieron leer las reservas guardadas en este navegador.');
  }
  const savedBookings = parsed as Booking[];
  const savedIds = new Set(savedBookings.map(booking => booking.id));
  return [...savedBookings, ...INITIAL_BOOKINGS.filter(booking => !savedIds.has(booking.id))];
};

export default function App() {
  const [accounts, setAccounts] = useState<DemoAccount[]>(loadDemoAccounts);
  const [sessionEmail, setSessionEmail] = useState<string | null>(() => localStorage.getItem(SESSION_STORAGE_KEY));
  const account = accounts.find(candidate => candidate.email === sessionEmail);
  const currentUser: AuthUser | null = account
    ? { name: account.name, email: account.email, role: account.role }
    : null;
  const currentRole: UserRole = currentUser?.role ?? 'guest';
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [pendingAction, setPendingAction] = useState<PendingServiceAction | null>(null);

  // Sub-tabs for each role
  const [activeGuestTab, setActiveGuestTab] = useState<'stays' | 'experiences' | 'rides' | 'bookings'>('stays');
  const [activeHostTab, setActiveHostTab] = useState<'properties' | 'rnt' | 'calendar' | 'earnings'>('properties');
  const [activeAdminTab, setActiveAdminTab] = useState<'verifications' | 'users' | 'commissions' | 'disputes' | 'analytics'>('verifications');

  // Currency & Theme
  const [currency, setCurrency] = useState<CurrencyCode>('COP');
  const [darkMode, setDarkMode] = useState(false);

  // Quick Colombia Search Bar States
  const [selectedCity, setSelectedCity] = useState('');
  const [checkInDate, setCheckInDate] = useState('2026-11-18');
  const [checkOutDate, setCheckOutDate] = useState('2026-11-22');
  const [guestCount, setGuestCount] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');

  // Stays View Options (Split, Grid, Map)
  const [viewMode, setViewMode] = useState<'split' | 'grid' | 'map'>('split');
  const [typeFilter, setTypeFilter] = useState<'all' | 'airbnb' | 'hotel' | 'hostel'>('all');
  const [maxPriceUSD, setMaxPriceUSD] = useState<number>(350);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating'>('recommended');

  // Core Data Collections
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [experiences, setExperiences] = useState<Experience[]>(INITIAL_EXPERIENCES);
  const [bookings, setBookings] = useState<Booking[]>(loadBookings);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [notifications, setNotifications] = useState<PushNotification[]>(INITIAL_NOTIFICATIONS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [serviceReservations, setServiceReservations] = useState<GuestReservation[]>(loadServiceReservations);

  // Modals & Interactive Overlays
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [reviewsModalProperty, setReviewsModalProperty] = useState<Property | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [latestToast, setLatestToast] = useState<PushNotification | null>(null);

  useEffect(() => {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (sessionEmail) localStorage.setItem(SESSION_STORAGE_KEY, sessionEmail);
    else localStorage.removeItem(SESSION_STORAGE_KEY);
  }, [sessionEmail]);

  useEffect(() => {
    localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(serviceReservations));
  }, [serviceReservations]);

  useEffect(() => {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Helper: Trigger Push Notification with Web Audio Chime
  const triggerPushNotification = (newNotif: Omit<PushNotification, 'id' | 'timestamp' | 'read'>) => {
    soundManager.playChime();
    const created: PushNotification = {
      ...newNotif,
      id: `notif-${Date.now()}`,
      timestamp: 'Ahora',
      read: false
    };
    setNotifications(prev => [created, ...prev]);
    setLatestToast(created);
  };

  // Filter properties according to search, city in Colombia, type, and price
  const filteredProperties = properties.filter(prop => {
    const matchesCity = !selectedCity || 
      prop.city.toLowerCase().includes(selectedCity.toLowerCase()) ||
      (prop.department && prop.department.toLowerCase().includes(selectedCity.toLowerCase()));

    const matchesQuery = !searchQuery ||
      prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || prop.type === typeFilter;
    const matchesPrice = prop.pricePerNight <= maxPriceUSD;

    return matchesCity && matchesQuery && matchesType && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.pricePerNight - b.pricePerNight;
    if (sortBy === 'price-desc') return b.pricePerNight - a.pricePerNight;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  // Booking Flow
  const handleCreateBooking = (bookingData: BookingRequestData, guest: AuthUser) => {
    const newCode = `HG-COL-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking: Booking = {
      ...bookingData,
      guestName: guest.name,
      guestEmail: guest.email,
      id: `book-${Date.now()}`,
      createdAt: new Date().toISOString(),
      bookingCode: newCode,
      status: 'confirmed',
      payoutStatus: 'pending'
    };

    setBookings(prev => [newBooking, ...prev]);

    const newTx: Transaction = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      bookingCode: newCode,
      date: new Date().toISOString().split('T')[0],
      propertyTitle: bookingData.propertyTitle,
      grossAmount: bookingData.totalAmount,
      platformFee: bookingData.serviceFee,
      netAmount: bookingData.totalAmount - bookingData.serviceFee,
      status: 'pending',
      payoutMethod: 'Bancolombia Ahorros (*9102)'
    };
    setTransactions(prev => [newTx, ...prev]);

    triggerPushNotification({
      type: 'booking',
      title: '¡Reserva Confirmada en Colombia!',
      message: `Tu estancia en "${bookingData.propertyTitle}" está lista. Código: ${newCode}.`,
      actionUrl: 'bookings'
    });
    return newCode;
  };

  const recordServiceReservation = (reservation: Omit<GuestReservation, 'id' | 'createdAt'>) => {
    const created: GuestReservation = {
      ...reservation,
      id: `reservation-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setServiceReservations(previous => [created, ...previous]);
    return created;
  };

  const saveExperienceReservation = (experience: Experience, time: string, spots: number, guest: AuthUser) => {
    recordServiceReservation({
      email: guest.email,
      title: experience.title,
      type: 'experience',
      details: `Horario: ${time} · ${spots} ${spots === 1 ? 'persona' : 'personas'}`,
      amount: experience.price * spots
    });
    triggerPushNotification({
      type: 'booking',
      title: '¡Experiencia Turística Reservada!',
      message: `Reserva para "${experience.title}" (${time}) confirmada para ${spots} personas.`,
      actionUrl: 'experiences'
    });
  };

  const saveRideReservation = (ride: ActiveRide, guest: AuthUser) => {
    recordServiceReservation({
      email: guest.email,
      title: `Hospeda Ride · ${ride.typeName}`,
      type: 'ride',
      details: `${ride.pickupAddress} → ${ride.dropoffAddress}`,
      amount: ride.fare
    });
    triggerPushNotification({
      type: 'ride',
      title: 'Vehículo Asignado en Colombia',
      message: `${ride.driver.name} en camino en ${ride.driver.vehicle} (${ride.driver.plate}). ETA: 4 min.`,
      actionUrl: 'rides'
    });
  };

  const handlePropertyBookingRequest = (bookingData: BookingRequestData): string | null => {
    if (!currentUser || currentUser.role !== 'guest') {
      setPendingAction({ type: 'stay', bookingData });
      setAuthMode('register');
      setIsAuthOpen(true);
      return null;
    }

    const bookingCode = handleCreateBooking(bookingData, currentUser);
    setSelectedProperty(null);
    setActiveGuestTab('bookings');
    return bookingCode;
  };

  const handleExperienceBookingRequest = (experience: Experience, time: string, spots: number): boolean => {
    if (!currentUser || currentUser.role !== 'guest') {
      setPendingAction({ type: 'experience', experience, time, spots });
      setAuthMode('register');
      setIsAuthOpen(true);
      return false;
    }

    saveExperienceReservation(experience, time, spots, currentUser);
    setActiveGuestTab('bookings');
    return true;
  };

  const handleRideBookingRequest = (ride: ActiveRide): boolean => {
    if (!currentUser || currentUser.role !== 'guest') {
      setPendingAction({ type: 'ride', ride });
      setAuthMode('register');
      setIsAuthOpen(true);
      return false;
    }

    saveRideReservation(ride, currentUser);
    setActiveGuestTab('bookings');
    return true;
  };

  const handleAuthSuccess = (signedInAccount: DemoAccount, isNewAccount: boolean): boolean => {
    if (pendingAction && signedInAccount.role !== 'guest') return false;

    if (isNewAccount) setAccounts(previous => [...previous, signedInAccount]);
    setSessionEmail(signedInAccount.email);
    setIsAuthOpen(false);

    const signedInUser: AuthUser = {
      name: signedInAccount.name,
      email: signedInAccount.email,
      role: signedInAccount.role
    };
    if (pendingAction) {
      if (pendingAction.type === 'stay') {
        handleCreateBooking(pendingAction.bookingData, signedInUser);
        setSelectedProperty(null);
      } else if (pendingAction.type === 'experience') {
        saveExperienceReservation(pendingAction.experience, pendingAction.time, pendingAction.spots, signedInUser);
      } else {
        saveRideReservation(pendingAction.ride, signedInUser);
      }
      setPendingAction(null);
      setActiveGuestTab('bookings');
    }
    return true;
  };

  const handleLogout = () => {
    setSessionEmail(null);
    setActiveGuestTab('stays');
    setSelectedProperty(null);
    setPendingAction(null);
  };

  // Chat message sending
  const handleSendMessage = (conversationId: string, text: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const isFromHost = !text.startsWith('¡Hola!') && text.length > 30;
        const newMsg = {
          id: `msg-${Date.now()}-${Math.random()}`,
          senderId: isFromHost ? conv.otherParty.id : 'guest-me',
          senderName: isFromHost ? conv.otherParty.name : 'Tú',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isHost: isFromHost,
          read: true
        };

        if (isFromHost) {
          triggerPushNotification({
            type: 'chat',
            title: `Nuevo mensaje de ${conv.otherParty.name}`,
            message: text,
            actionUrl: 'chat'
          });
        }

        return {
          ...conv,
          lastMessage: text,
          lastTimestamp: 'Ahora',
          messages: [...conv.messages, newMsg]
        };
      }
      return conv;
    }));
  };

  // Host Actions
  const handleAddProperty = (newProp: Omit<Property, 'id' | 'rating' | 'reviewCount' | 'reviews'>) => {
    const created: Property = {
      ...newProp,
      id: `prop-${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
      rntNumber: 'RNT #10842',
      rntStatus: 'verified',
      reviews: []
    };
    setProperties(prev => [created, ...prev]);
    triggerPushNotification({
      type: 'booking',
      title: 'Alojamiento Publicado con RNT',
      message: `"${newProp.title}" ya está activo en Hospeda&Go con verificación RNT.`,
      actionUrl: 'properties'
    });
  };

  const handleUpdatePropertyStatus = (id: string, status: Property['status']) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const handleUpdatePropertyPrice = (id: string, newPrice: number) => {
    setProperties(prev => prev.map(p => p.id === id ? { 
      ...p, 
      pricePerNight: newPrice,
      priceCOP: newPrice * 4100 
    } : p));
  };

  const handleRequestPayout = (amount: number, method: string) => {
    setTransactions(prev => prev.map(tx => ({
      ...tx,
      status: 'settled',
      payoutMethod: method
    })));

    triggerPushNotification({
      type: 'payment',
      title: 'Liquidación Consignada',
      message: `Transferencia realizada a través de ${method}.`,
      actionUrl: 'payments'
    });
  };

  const handleAddReview = (propId: string, review: any) => {
    setProperties(prev => prev.map(p => {
      if (p.id === propId) {
        const nextReviews = [review, ...p.reviews];
        const nextRating = Math.round(((p.rating * p.reviewCount + review.rating) / (p.reviewCount + 1)) * 100) / 100;
        return {
          ...p,
          rating: nextRating,
          reviewCount: p.reviewCount + 1,
          reviews: nextReviews
        };
      }
      return p;
    }));

    triggerPushNotification({
      type: 'review',
      title: 'Reseña Verificada Registrada',
      message: `${review.author} valoró su estancia en Colombia con ${review.rating} estrellas.`,
      actionUrl: 'stays'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors pb-16 md:pb-0">
      
      {/* ========================================================= */}
      {/* COMPONENTE PRINCIPAL DE DISEÑO: HEADER Y NAVBAR           */}
      {/* ========================================================= */}
      <Header
        currentRole={currentRole}
        currentUser={currentUser}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setIsAuthOpen(true);
        }}
        onLogout={handleLogout}
        activeGuestTab={activeGuestTab}
        setActiveGuestTab={setActiveGuestTab}
        activeHostTab={activeHostTab}
        setActiveHostTab={setActiveHostTab}
        activeAdminTab={activeAdminTab}
        setActiveAdminTab={setActiveAdminTab}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        checkInDate={checkInDate}
        setCheckInDate={setCheckInDate}
        checkOutDate={checkOutDate}
        setCheckOutDate={setCheckOutDate}
        guestCount={guestCount}
        setGuestCount={setGuestCount}
        onSearchSubmit={() => {
          setActiveGuestTab('stays');
        }}
        currency={currency}
        setCurrency={setCurrency}
        unreadCount={notifications.filter(n => !n.read).length}
        unreadMessagesCount={conversations.reduce((sum, c) => sum + c.unreadCount, 0)}
        openNotifications={() => setIsNotificationsOpen(true)}
        openChat={() => {
          setActiveConversationId(conversations[0]?.id || null);
          setIsChatOpen(true);
        }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Floating Push Toast Simulator */}
      <PushToast
        notification={latestToast}
        onClose={() => setLatestToast(null)}
        onOpenCenter={() => setIsNotificationsOpen(true)}
        onActionClick={(url) => {
          if (url === 'chat') setIsChatOpen(true);
          else if (url === 'payments' || url === 'properties') setActiveHostTab('properties');
        }}
      />

      {/* ========================================================= */}
      {/* CUERPO DINÁMICO SEGÚN EL ROL SELECCIONADO                 */}
      {/* ========================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* ------------------------------------------------------- */}
        {/* ROL 1: MODO HUÉSPED (CLIENTE FINAL)                     */}
        {/* ------------------------------------------------------- */}
        {currentRole === 'guest' && (
          <div className="space-y-6">
            
            {/* PESTAÑA A: ALOJAMIENTOS (STAYS: AIRBNB, HOTEL, HOSTEL) */}
            {activeGuestTab === 'stays' && (
              <div className="space-y-6">
                
                {/* Filtros de Tipología y Presupuesto */}
                <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    {[
                      { id: 'all', label: 'Todos los Espacios' },
                      { id: 'airbnb', label: 'Casas Privadas / Airbnb' },
                      { id: 'hotel', label: 'Hoteles Boutique 5★' },
                      { id: 'hostel', label: 'Hostales & Co-Living' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setTypeFilter(tab.id as any)}
                        className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                          typeFilter === tab.id
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    {/* Switch de Vistas: Dividida / Cuadrícula / Mapa */}
                    <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl font-semibold">
                      <button
                        onClick={() => setViewMode('split')}
                        className={`px-2.5 py-1 rounded-lg transition-colors ${viewMode === 'split' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
                        title="Lista y Mapa contiguo"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 inline mr-1" />
                        Dividida
                      </button>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`px-2.5 py-1 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
                        title="Cuadrícula completa"
                      >
                        <Grid className="w-3.5 h-3.5 inline mr-1" />
                        Cuadrícula
                      </button>
                      <button
                        onClick={() => setViewMode('map')}
                        className={`px-2.5 py-1 rounded-lg transition-colors ${viewMode === 'map' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
                        title="Mapa interactivo completo"
                      >
                        <Map className="w-3.5 h-3.5 inline mr-1" />
                        Mapa
                      </button>
                    </div>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="recommended" className="dark:bg-slate-800">Recomendados</option>
                      <option value="rating" className="dark:bg-slate-800">Mejor Valorados</option>
                      <option value="price-asc" className="dark:bg-slate-800">Precio: Menor a Mayor</option>
                      <option value="price-desc" className="dark:bg-slate-800">Precio: Mayor a Menor</option>
                    </select>
                  </div>
                </div>

                {/* Vista Dividida (Lista + Mapa Interactivo) */}
                {viewMode === 'split' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Lista de Tarjetas */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>
                          {filteredProperties.length} alojamientos encontrados en {selectedCity || 'Colombia'}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Registro RNT Certificado MinCIT
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredProperties.map(property => (
                          <PropertyCard
                            key={property.id}
                            property={property}
                            onSelect={(p) => setSelectedProperty(p)}
                            isHovered={hoveredPropertyId === property.id}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Mapa Interactivo */}
                    <div className="hidden lg:block lg:col-span-5 sticky top-36 h-[660px]">
                      <InteractiveMap
                        properties={filteredProperties}
                        selectedProperty={selectedProperty}
                        onSelectProperty={(p) => setSelectedProperty(p)}
                        hoveredPropertyId={hoveredPropertyId}
                        onHoverProperty={(id) => setHoveredPropertyId(id)}
                      />
                    </div>

                  </div>
                ) : viewMode === 'grid' ? (
                  /* Vista Cuadrícula */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map(property => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        onSelect={(p) => setSelectedProperty(p)}
                      />
                    ))}
                  </div>
                ) : (
                  /* Vista Mapa */
                  <div className="h-[750px]">
                    <InteractiveMap
                      properties={filteredProperties}
                      selectedProperty={selectedProperty}
                      onSelectProperty={(p) => setSelectedProperty(p)}
                      hoveredPropertyId={hoveredPropertyId}
                      onHoverProperty={(id) => setHoveredPropertyId(id)}
                    />
                  </div>
                )}

              </div>
            )}

            {/* PESTAÑA B: EXPERIENCIAS TURÍSTICAS Y CULTURALES */}
            {activeGuestTab === 'experiences' && (
              <ExperiencesSection
                experiences={experiences}
                onBookExperience={handleExperienceBookingRequest}
              />
            )}

            {/* PESTAÑA C: TRANSPORTE PRIVADO (UBER-STYLE RIDES) */}
            {activeGuestTab === 'rides' && (
              <TransportRideSection
                onRideBooked={handleRideBookingRequest}
              />
            )}

            {activeGuestTab === 'bookings' && (
              <GuestReservations
                user={currentUser}
                bookings={bookings.filter(booking => booking.guestEmail === currentUser?.email)}
                serviceReservations={serviceReservations.filter(reservation => reservation.email === currentUser?.email)}
                onOpenAuth={() => {
                  setAuthMode('login');
                  setIsAuthOpen(true);
                }}
              />
            )}

          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* ROL 2: MODO ANFITRIÓN (HOST PORTAL / RNT)               */}
        {/* ------------------------------------------------------- */}
        {currentRole === 'host' && (
          <HostAdminDashboard
            properties={properties}
            bookings={bookings}
            transactions={transactions}
            activeHostTab={activeHostTab}
            setActiveHostTab={setActiveHostTab}
            onAddProperty={handleAddProperty}
            onUpdatePropertyStatus={handleUpdatePropertyStatus}
            onUpdatePropertyPrice={handleUpdatePropertyPrice}
            onRequestPayout={handleRequestPayout}
          />
        )}

        {/* ------------------------------------------------------- */}
        {/* ROL 3: PANEL ADMINISTRADOR (SUPERADMIN STAFF COLOMBIA)  */}
        {/* ------------------------------------------------------- */}
        {currentRole === 'admin' && (
          <AdminSuperDashboard
            activeAdminTab={activeAdminTab}
            setActiveAdminTab={setActiveAdminTab}
            properties={properties}
            onApproveProperty={(id) => {
              triggerPushNotification({
                type: 'booking',
                title: 'RNT Verificado y Aprobado',
                message: `El anuncio ha sido activado en la plataforma Hospeda&Go.`,
                actionUrl: 'verifications'
              });
            }}
            onRejectProperty={(id) => {
              triggerPushNotification({
                type: 'booking',
                title: 'Solicitud RNT Rechazada',
                message: `Se ha notificado al prestador para corregir documentos ante MinCIT.`,
                actionUrl: 'verifications'
              });
            }}
          />
        )}

      </main>

      {/* MODALES DEL ECOSISTEMA */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onBook={handlePropertyBookingRequest}
        onStartChat={(p) => {
          setSelectedProperty(null);
          const conv = conversations.find(c => c.propertyId === p.id);
          setActiveConversationId(conv ? conv.id : conversations[0]?.id || null);
          setIsChatOpen(true);
        }}
        onOpenReviews={(p) => {
          setReviewsModalProperty(p);
        }}
      />

      {isAuthOpen && (
        <AuthModal
          initialMode={authMode}
          accounts={accounts}
          onClose={() => {
            setIsAuthOpen(false);
            setPendingAction(null);
          }}
          onSuccess={handleAuthSuccess}
        />
      )}

      <VerifiedReviewsModal
        property={reviewsModalProperty}
        onClose={() => setReviewsModalProperty(null)}
        onAddReview={handleAddReview}
      />

      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={(id) => setActiveConversationId(id)}
        onSendMessage={handleSendMessage}
      />

      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }}
        onMarkAsRead={(id) => {
          setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        }}
        onClearNotifications={() => {
          setNotifications([]);
        }}
        onNavigateAction={(actionUrl) => {
          if (actionUrl === 'chat') {
            setIsChatOpen(true);
          } else if (actionUrl === 'payments' || actionUrl === 'properties') {
            setActiveHostTab('properties');
          } else if (actionUrl === 'rides') {
            setActiveGuestTab('rides');
          } else if (actionUrl === 'experiences') {
            setActiveGuestTab('experiences');
          } else if (actionUrl === 'bookings') {
            setActiveGuestTab('bookings');
          }
        }}
      />

      {/* Barra Inferior Táctil para Móviles */}
      {currentRole === 'guest' && (
        <MobileBottomNav
          activeTab={activeGuestTab}
          setActiveTab={setActiveGuestTab}
          isMapVisible={viewMode === 'map'}
          setIsMapVisible={(show) => setViewMode(show ? 'map' : 'split')}
          unreadCount={notifications.filter(n => !n.read).length}
        />
      )}

    </div>
  );
}
