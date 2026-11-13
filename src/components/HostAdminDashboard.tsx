import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar as CalendarIcon, 
  Building2, 
  Plus, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Filter, 
  Download, 
  Send,
  ShieldCheck,
  CreditCard,
  Edit2,
  Trash2,
  Layers,
  Sparkles,
  RefreshCw,
  FileCheck2,
  CalendarCheck,
  Lock,
  Unlock,
  Check,
  AlertTriangle,
  UploadCloud,
  FileText
} from 'lucide-react';
import { Property, Booking, Transaction } from '../types';
import { soundManager } from '../utils/audio';

interface HostAdminDashboardProps {
  properties: Property[];
  bookings: Booking[];
  transactions: Transaction[];
  activeHostTab?: 'properties' | 'rnt' | 'calendar' | 'earnings';
  setActiveHostTab?: (tab: 'properties' | 'rnt' | 'calendar' | 'earnings') => void;
  onAddProperty: (newProp: Omit<Property, 'id' | 'rating' | 'reviewCount' | 'reviews'>) => void;
  onUpdatePropertyStatus: (id: string, status: Property['status']) => void;
  onUpdatePropertyPrice: (id: string, newPrice: number) => void;
  onRequestPayout: (amount: number, method: string) => void;
}

export const HostAdminDashboard: React.FC<HostAdminDashboardProps> = ({
  properties,
  bookings,
  transactions,
  activeHostTab = 'properties',
  setActiveHostTab,
  onAddProperty,
  onUpdatePropertyStatus,
  onUpdatePropertyPrice,
  onRequestPayout
}) => {
  const [internalTab, setInternalTab] = useState<'properties' | 'rnt' | 'calendar' | 'earnings'>(activeHostTab);
  const currentTab = activeHostTab || internalTab;

  const handleTabChange = (tab: 'properties' | 'rnt' | 'calendar' | 'earnings') => {
    setInternalTab(tab);
    if (setActiveHostTab) setActiveHostTab(tab);
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<string | null>(null);

  // New Property Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<Property['type']>('airbnb');
  const [newSubType, setNewSubType] = useState('Casa Colonial / Villa');
  const [newCity, setNewCity] = useState('Cartagena');
  const [newDepartment, setNewDepartment] = useState('Bolívar');
  const [newPrice, setNewPrice] = useState(250);
  const [newPriceCOP, setNewPriceCOP] = useState(1050000);
  const [newCleaningFee, setNewCleaningFee] = useState(40);
  const [newMaxGuests, setNewMaxGuests] = useState(6);
  const [newBedrooms, setNewBedrooms] = useState(3);
  const [newRntNumber, setNewRntNumber] = useState('RNT #59102');
  const [newDescription, setNewDescription] = useState('Espacio colonial de alto standing con piscina privada, patio tropical y cocina equipada.');

  // RNT Compliance State
  const [rntCode, setRntCode] = useState('48291');
  const [nitCode, setNitCode] = useState('901.428.192-3');
  const [rntSavedMsg, setRntSavedMsg] = useState(false);

  // Calendar Season Management
  const [selectedSeasonMode, setSelectedSeasonMode] = useState<'high' | 'normal' | 'low'>('high');
  const [blockedDays, setBlockedDays] = useState<number[]>([14, 15, 21]);

  // Calculate Real-Time Metrics in COP and USD
  const grossRevenueCOP = bookings.reduce((sum, b) => sum + (b.nightlyTotal || 0) + (b.cleaningFee || 0) + (b.serviceFee || 0), 0);
  const platformFeesCOP = bookings.reduce((sum, b) => sum + (b.serviceFee || 0), 0);
  const hostNetIncomeCOP = grossRevenueCOP - platformFeesCOP;
  
  const pendingPayoutCOP = transactions
    .filter(t => t.status !== 'settled')
    .reduce((sum, t) => sum + t.netAmount, 0) || 2120000;

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddProperty({
      title: newTitle,
      type: newType,
      subType: newSubType,
      city: newCity,
      department: newDepartment,
      neighborhood: 'Centro Histórico / Zona Turística',
      lat: 10.422 + (Math.random() - 0.5) * 0.05,
      lng: -75.548 + (Math.random() - 0.5) * 0.05,
      pricePerNight: Number(newPrice),
      priceCOP: Number(newPriceCOP),
      currency: 'COP',
      cleaningFee: Number(newCleaningFee),
      cleaningFeeCOP: Number(newCleaningFee) * 4100,
      serviceFeeRate: 0.12,
      maxGuests: Number(newMaxGuests),
      bedrooms: Number(newBedrooms),
      beds: Number(newBedrooms) + 1,
      bathrooms: 2,
      rntNumber: newRntNumber,
      rntStatus: 'verified',
      amenities: ['WiFi de alta velocidad', 'Aire acondicionado', 'Piscina / Jacuzzi', 'Cerradura inteligente'],
      photos: [
        '/src/assets/images/hero_stay_luxury_villa_1794422533159.jpg',
        '/src/assets/images/stay_boutique_hotel_room_1794422533615.jpg'
      ],
      host: {
        id: 'host-me',
        name: 'Tú (Anfitrión Verificado)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
        isSuperhost: true,
        responseTime: 'Inmediata',
        verifiedIdentity: true,
        joinedYear: 2026,
        rating: 5.0,
        reviewCount: 18,
        rntNumber: newRntNumber,
        rntStatus: 'verified',
        taxId: nitCode
      },
      description: newDescription,
      houseRules: ['Llegada 15:00', 'Salida 11:00', 'Prohibido fumar', 'Registro de huéspedes con Cédula según Ley 2068'],
      instantBooking: true,
      status: 'active'
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    soundManager.playCashRegister();
  };

  const handleTriggerPayout = () => {
    soundManager.playCashRegister();
    onRequestPayout(pendingPayoutCOP, 'Transferencia Bancolombia Ahorros (*9102)');
    setPayoutSuccessMsg(`¡Transferencia de $${pendingPayoutCOP.toLocaleString('es-CO')} COP enviada a tu cuenta Bancolombia con éxito!`);
    setTimeout(() => setPayoutSuccessMsg(null), 5000);
  };

  const handleSaveRNT = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playCashRegister();
    setRntSavedMsg(true);
    setTimeout(() => setRntSavedMsg(false), 4000);
  };

  const toggleDayBlock = (day: number) => {
    soundManager.playChime();
    setBlockedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Admin Title & Host Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Portal del Anfitrión · Hospeda&amp;Go Colombia
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              RNT Homologado
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Gestión integral de tus inmuebles, tarifas de temporada, libro de huéspedes y liquidaciones en pesos COP.
          </p>
        </div>

        {/* Tab Controls directly synced with Header */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto text-xs font-bold">
          <button
            onClick={() => handleTabChange('properties')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              currentTab === 'properties'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Mis Publicaciones ({properties.length})
          </button>
          <button
            onClick={() => handleTabChange('rnt')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              currentTab === 'rnt'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Cumplimiento RNT &amp; Ley 2068</span>
          </button>
          <button
            onClick={() => handleTabChange('calendar')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              currentTab === 'calendar'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Calendario &amp; Temporadas
          </button>
          <button
            onClick={() => handleTabChange('earnings')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              currentTab === 'earnings'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            <span>Ingresos &amp; Payouts (COP)</span>
          </button>
        </div>
      </div>

      {payoutSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{payoutSuccessMsg}</span>
          </div>
          <button onClick={() => setPayoutSuccessMsg(null)} className="text-emerald-600 hover:underline">
            Cerrar
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 1: MIS PUBLICACIONES (PROPERTIES MANAGEMENT)          */}
      {/* ========================================================= */}
      {currentTab === 'properties' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Tus Alojamientos Activos ({properties.length})
              </h2>
              <p className="text-xs text-slate-500">
                Propiedades habilitadas para reservas inmediatas en el mercado colombiano.
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar Nuevo Inmueble con RNT</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <div 
                key={property.id} 
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/9 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img 
                      src={property.photos[0]} 
                      alt={property.title} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white">
                        {property.rntNumber || 'RNT #48291'}
                      </span>
                      <select
                        value={property.status}
                        onChange={(e) => onUpdatePropertyStatus(property.id, e.target.value as Property['status'])}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border shadow-xs focus:outline-none cursor-pointer ${
                          property.status === 'active'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                            : property.status === 'occupied'
                            ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        <option value="active">Activo</option>
                        <option value="occupied">Ocupado</option>
                        <option value="paused">Pausado</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 capitalize flex items-center gap-1">
                      <span>{property.subType}</span>
                      <span>·</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{property.city}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{property.maxGuests} huéspedes</span>
                      <span>·</span>
                      <span>{property.bedrooms} dormitorios</span>
                      <span>·</span>
                      <span className="font-semibold text-slate-900 dark:text-white">★ {property.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Tarifa / noche:</span>
                    <input
                      type="number"
                      defaultValue={property.priceCOP || property.pricePerNight * 4100}
                      step="50000"
                      onBlur={(e) => onUpdatePropertyPrice(property.id, Math.round(Number(e.target.value) / 4100))}
                      className="w-28 px-1.5 py-0.5 border border-slate-300 dark:border-slate-700 rounded-md font-bold text-slate-900 dark:text-white text-right tabular-nums"
                    />
                    <span className="text-[11px] font-bold text-emerald-600">COP</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {property.reviewCount} reseñas
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: CUMPLIMIENTO RNT & LEY 2068 (COLOMBIA LEGAL)       */}
      {/* ========================================================= */}
      {currentTab === 'rnt' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Certificate Banner */}
          <div className="p-6 rounded-3xl bg-emerald-950 text-white border border-emerald-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-black uppercase tracking-wider border border-emerald-600">
                  Registro Homologado MinCIT 🇨🇴
                </span>
                <span className="text-xs text-emerald-300">· Ley 2068 de 2020</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                Cumplimiento del Registro Nacional de Turismo (RNT)
              </h2>
              <p className="text-xs text-emerald-300 leading-relaxed">
                De conformidad con la legislación colombiana, todos los prestadores de servicios turísticos y propietarios de vivienda turística deben mantener su RNT activo y renovado anualmente.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-700 text-center shrink-0">
              <span className="text-[10px] text-emerald-300 uppercase font-bold block">Tu RNT Principal</span>
              <span className="text-2xl font-mono font-black text-white block mt-0.5">
                RNT #{rntCode}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full inline-block mt-1">
                Vigente hasta 31/03/2027
              </span>
            </div>
          </div>

          {rntSavedMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>¡Datos de RNT y facturación ante la DIAN actualizados correctamente!</span>
            </div>
          )}

          {/* Form to update RNT & Tax ID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Datos Legales de Prestador Turístico</span>
              </h3>

              <form onSubmit={handleSaveRNT} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Número de RNT (MinCIT)
                    </label>
                    <input
                      type="text"
                      required
                      value={rntCode}
                      onChange={(e) => setRntCode(e.target.value)}
                      placeholder="Ej: 48291"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Cédula / NIT con Dígito de Verificación
                    </label>
                    <input
                      type="text"
                      required
                      value={nitCode}
                      onChange={(e) => setNitCode(e.target.value)}
                      placeholder="Ej: NIT 901.428.192-3"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Razón Social / Titular Inscrito en Cámara de Comercio
                  </label>
                  <input
                    type="text"
                    defaultValue="Inversiones Turísticas del Caribe SAS"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent font-medium text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
                  <UploadCloud className="w-7 h-7 mx-auto text-slate-400" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    Certificado RNT en Formato PDF
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Archivo emitido por Confecámaras o Cámara de Comercio local.
                  </p>
                  <button type="button" className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-[11px]">
                    Subir Documento Actualizado
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors shadow-xs"
                >
                  Guardar y Certificar Información Legal
                </button>
              </form>
            </div>

            {/* Checklist of obligations */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Obligaciones de Ley 2068 en Colombia</span>
              </h3>

              <div className="space-y-3 text-xs">
                {[
                  { title: 'Registro Digital de Huéspedes (TRA)', desc: 'Reportar diariamente las entradas y salidas de huéspedes con documento de identidad oficial.', active: true },
                  { title: 'Póliza de Responsabilidad Extracontractual', desc: 'Cobertura médica y de accidentes para todos los ocupantes del alojamiento.', active: true },
                  { title: 'Cumplimiento Código de Conducta Ley 679', desc: 'Compromiso público contra la explotación sexual comercial de niños, niñas y adolescentes.', active: true },
                  { title: 'Facturación Electrónica DIAN', desc: 'Emisión de soporte de pago o factura electrónica en pesos COP.', active: true }
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: CALENDARIO & TEMPORADAS (AVAILABILITY & PRICING)   */}
      {/* ========================================================= */}
      {currentTab === 'calendar' && (
        <div className="space-y-6 animate-in fade-in">
          
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Calendario de Disponibilidad y Tarifas de Temporada
                </h2>
                <p className="text-xs text-slate-500">
                  Haz clic en un día para bloquearlo o habilitarlo para reservas. Ajusta tarifas de temporada alta (Semana Santa, Fiestas, Vacaciones).
                </p>
              </div>

              {/* Season Multiplier Controls */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setSelectedSeasonMode('high')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedSeasonMode === 'high' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Temporada Alta (+25%)
                </button>
                <button
                  onClick={() => setSelectedSeasonMode('normal')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedSeasonMode === 'normal' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Estándar
                </button>
                <button
                  onClick={() => setSelectedSeasonMode('low')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedSeasonMode === 'low' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Temporada Baja (-15%)
                </button>
              </div>
            </div>

            {/* Interactive Month Grid */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                <span>Noviembre 2026 · Calendario de Estancias en Colombia</span>
                <span className="text-emerald-600">84% de ocupación confirmada</span>
              </div>

              <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800 text-center text-xs">
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                  <div key={day} className="p-2 bg-slate-100 dark:bg-slate-900 font-bold text-slate-500">
                    {day}
                  </div>
                ))}

                {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                  const isBlocked = blockedDays.includes(day);
                  const isBooked = [8, 9, 10, 11, 16, 17, 18, 19, 20].includes(day);

                  return (
                    <div
                      key={day}
                      onClick={() => !isBooked && toggleDayBlock(day)}
                      className={`p-3 h-20 flex flex-col justify-between items-start transition-all cursor-pointer ${
                        isBooked
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 cursor-not-allowed'
                          : isBlocked
                          ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300'
                          : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white'
                      }`}
                    >
                      <span className="font-bold tabular-nums text-xs">{day}</span>
                      
                      <div className="w-full text-left">
                        {isBooked ? (
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 block truncate">
                            Reservado
                          </span>
                        ) : isBlocked ? (
                          <span className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" /> Bloqueado
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 block tabular-nums">
                            Disponible
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                Reserva confirmada
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                Fechas bloqueadas por ti
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                Día libre para reservas
              </span>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: INGRESOS & PAYOUTS EN PESOS COLOMBIANOS (COP)      */}
      {/* ========================================================= */}
      {currentTab === 'earnings' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Payout Banner */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white dark:bg-slate-800 border border-slate-700 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
                Saldo Disponible para Retiro Inmediato (COP)
              </span>
              <div className="text-3xl font-black tabular-nums mt-1 text-emerald-400">
                ${pendingPayoutCOP.toLocaleString('es-CO')} COP
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Cuenta inscrita: Bancolombia Ahorros (*9102) a nombre de Inversiones Caribe SAS
              </p>
            </div>

            <button
              onClick={handleTriggerPayout}
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Solicitar Payout Inmediato (COP)</span>
            </button>
          </div>

          {/* Transactions Ledger */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Historial de Liquidaciones y Pagos Recibidos
                </h3>
                <p className="text-xs text-slate-400">Valores liquidados en pesos colombianos COP con deducción de comisión del 12%</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-3.5 pl-5">Código Reserva</th>
                    <th className="p-3.5">Fecha</th>
                    <th className="p-3.5">Alojamiento</th>
                    <th className="p-3.5 text-right">Total Bruto</th>
                    <th className="p-3.5 text-right">Comisión Plataforma (12%)</th>
                    <th className="p-3.5 text-right">Neto Consignado</th>
                    <th className="p-3.5 text-center pr-5">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 pl-5 font-mono font-bold text-slate-900 dark:text-white">
                        {tx.bookingCode}
                      </td>
                      <td className="p-3.5 text-slate-500 tabular-nums">
                        {tx.date}
                      </td>
                      <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200 max-w-[200px] truncate">
                        {tx.propertyTitle}
                      </td>
                      <td className="p-3.5 text-right font-medium text-slate-600 dark:text-slate-400 tabular-nums">
                        ${tx.grossAmount.toLocaleString('es-CO')} COP
                      </td>
                      <td className="p-3.5 text-right text-rose-500 dark:text-rose-400 tabular-nums">
                        -${tx.platformFee.toLocaleString('es-CO')} COP
                      </td>
                      <td className="p-3.5 text-right font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                        ${tx.netAmount.toLocaleString('es-CO')} COP
                      </td>
                      <td className="p-3.5 text-center pr-5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          tx.status === 'settled'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {tx.status === 'settled' ? 'Consignado' : 'Procesando'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Add Property Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Publicar Nuevo Alojamiento en Colombia
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Título del Alojamiento
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Casona Colonial en Getsemaní con Piscina Privada"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Tipo de Espacio
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as Property['type'])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="airbnb">Casa Privada / Airbnb</option>
                    <option value="hotel">Hotel Boutique 5★</option>
                    <option value="hostel">Hostal Social &amp; Co-Living</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Ciudad en Colombia
                  </label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Cartagena">Cartagena (Bolívar)</option>
                    <option value="Medellín">Medellín (Antioquia)</option>
                    <option value="Bogotá">Bogotá D.C.</option>
                    <option value="Santa Marta">Santa Marta (Magdalena)</option>
                    <option value="Eje Cafetero">Eje Cafetero (Salento/Quindío)</option>
                    <option value="San Andrés">San Andrés Islas</option>
                    <option value="Cali">Cali (Valle)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Tarifa / Noche ($COP)
                  </label>
                  <input
                    type="number"
                    step="50000"
                    value={newPriceCOP}
                    onChange={(e) => {
                      const cop = Number(e.target.value);
                      setNewPriceCOP(cop);
                      setNewPrice(Math.round(cop / 4100));
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white tabular-nums font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Número de RNT Homologado
                  </label>
                  <input
                    type="text"
                    required
                    value={newRntNumber}
                    onChange={(e) => setNewRntNumber(e.target.value)}
                    placeholder="Ej: RNT #59102"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Descripción del Espacio
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs"
                >
                  Publicar Inmueble
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
