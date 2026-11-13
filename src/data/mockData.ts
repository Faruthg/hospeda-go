import { Property, Experience, Booking, Conversation, PushNotification, Transaction, RideOption, ColombiaDestination } from '../types';

export const COLOMBIA_DESTINATIONS: ColombiaDestination[] = [
  {
    id: 'ctg',
    name: 'Cartagena',
    department: 'Bolívar',
    tag: 'Caribe & Colonial',
    badge: 'Más Popular',
    popularNeighborhoods: ['Ciudad Amurallada', 'Getsemaní', 'Bocagrande', 'Manga']
  },
  {
    id: 'med',
    name: 'Medellín',
    department: 'Antioquia',
    tag: 'Primavera & Innovación',
    badge: 'Tendencia',
    popularNeighborhoods: ['El Poblado', 'Provenza', 'Laureles', 'Envigado']
  },
  {
    id: 'bog',
    name: 'Bogotá',
    department: 'Cundinamarca',
    tag: 'Cultura & Gastronomía',
    popularNeighborhoods: ['Chapinero Alto', 'Usaquén', 'La Candelaria', 'Zona Rosa']
  },
  {
    id: 'smr',
    name: 'Santa Marta',
    department: 'Magdalena',
    tag: 'Playas & Tayrona',
    popularNeighborhoods: ['Bello Horizonte', 'El Rodadero', 'Taganga', 'Minca']
  },
  {
    id: 'eje',
    name: 'Eje Cafetero',
    department: 'Quindío / Caldas',
    tag: 'Café & Naturaleza',
    popularNeighborhoods: ['Salento', 'Valle del Cocora', 'Filandia', 'Armenia']
  },
  {
    id: 'adrez',
    name: 'San Andrés',
    department: 'Archipiélago',
    tag: 'Mar de 7 Colores',
    popularNeighborhoods: ['Spratt Bight', 'San Luis', 'La Loma']
  },
  {
    id: 'clo',
    name: 'Cali',
    department: 'Valle del Cauca',
    tag: 'Salsa & Brisa',
    popularNeighborhoods: ['San Antonio', 'Granada', 'El Peñón']
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Casa Colonial con Piscina Privada & Azotea en Ciudad Vieja',
    type: 'airbnb',
    subType: 'Casa Privada Exclusiva',
    city: 'Cartagena',
    department: 'Bolívar',
    neighborhood: 'Getsemaní / Ciudad Amurallada',
    lat: 10.422,
    lng: -75.548,
    pricePerNight: 280,
    priceCOP: 1150000,
    currency: 'COP',
    cleaningFee: 50,
    cleaningFeeCOP: 200000,
    serviceFeeRate: 0.12,
    maxGuests: 8,
    bedrooms: 4,
    beds: 5,
    bathrooms: 4,
    rating: 4.97,
    reviewCount: 142,
    rntNumber: 'RNT #48291',
    rntStatus: 'verified',
    amenities: [
      'Piscina en patio colonial',
      'WiFi 500 Mbps Fibra',
      'Aire acondicionado central',
      'Rooftop con vista a cúpulas',
      'Desayuno caribeño incluido',
      'Seguridad privada 24/7',
      'Cocina de chef',
      'Planta eléctrica total'
    ],
    photos: [
      '/src/assets/images/hero_stay_luxury_villa_1794422533159.jpg',
      '/src/assets/images/stay_boutique_hotel_room_1794422533615.jpg',
      '/src/assets/images/stay_cozy_urban_loft_1794422534491.jpg'
    ],
    host: {
      id: 'host-101',
      name: 'María Camila De La Vega',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      isSuperhost: true,
      responseTime: 'Menos de 15 minutos',
      verifiedIdentity: true,
      joinedYear: 2019,
      rating: 4.98,
      reviewCount: 380,
      rntNumber: 'RNT #48291',
      rntStatus: 'verified',
      taxId: 'NIT 901.428.192-3'
    },
    description: 'Impresionante casona republicana restaurada en el corazón histórico de Cartagena. Cuenta con techos de doble altura en madera, patio tropical con piscina privada bajo buganvilias y terraza con mirador 360° al atardecer sobre las murallas.',
    houseRules: [
      'Llegada a partir de las 15:00',
      'Salida antes de las 11:00',
      'Cumplimiento estricto Código de Policía y Turismo Ley 2068',
      'Registro con Cédula/Pasaporte obligatorio según normativa colombiana'
    ],
    instantBooking: true,
    status: 'active',
    reviews: [
      {
        id: 'rev-1',
        author: 'Andrés Gómez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
        date: 'Octubre 2026',
        rating: 5,
        comment: 'La mejor experiencia en Cartagena. La ubicación en Getsemaní es inmejorable, la piscina en el patio refresca después de recorrer la ciudad y el desayuno preparado por el personal es un 10/10.',
        verifiedStay: true,
        roomBooked: 'Estancia de 4 noches',
        categories: {
          cleanliness: 5.0,
          accuracy: 5.0,
          communication: 5.0,
          location: 5.0,
          value: 4.9
        },
        hostResponse: {
          date: 'Octubre 2026',
          text: '¡Muchas gracias Andrés! Siempre bienvenidos a nuestro rincón colonial en La Heroica.'
        }
      }
    ]
  },
  {
    id: 'prop-2',
    title: 'Hotel Boutique El Poblado & Rooftop Sky Lounge (5★)',
    type: 'hotel',
    subType: 'Hotel Boutique 5 Estrellas',
    city: 'Medellín',
    department: 'Antioquia',
    neighborhood: 'El Poblado / Provenza',
    lat: 6.208,
    lng: -75.567,
    pricePerNight: 165,
    priceCOP: 680000,
    currency: 'COP',
    cleaningFee: 20,
    cleaningFeeCOP: 80000,
    serviceFeeRate: 0.10,
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    rating: 4.94,
    reviewCount: 289,
    rntNumber: 'RNT #78902',
    rntStatus: 'verified',
    amenities: [
      'Piscina infinita en azotea',
      'Desayuno buffet paisa & gourmet',
      'Spa con aromaterapia de café',
      'Recepción bilingüe 24/7',
      'WiFi 1 Gbps dedicado',
      'Servicio de conserjería VIP',
      'Insonorización acústica triple',
      'Restaurante de autor'
    ],
    photos: [
      '/src/assets/images/stay_boutique_hotel_room_1794422533615.jpg',
      '/src/assets/images/hero_stay_luxury_villa_1794422533159.jpg',
      '/src/assets/images/stay_cozy_urban_loft_1794422534491.jpg'
    ],
    host: {
      id: 'host-102',
      name: 'Grupo Hotelero Provenza Luxe',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&h=200&q=80',
      isSuperhost: true,
      responseTime: 'Menos de 5 minutos',
      verifiedIdentity: true,
      joinedYear: 2021,
      rating: 4.95,
      reviewCount: 950,
      rntNumber: 'RNT #78902',
      rntStatus: 'verified',
      taxId: 'NIT 900.871.234-8'
    },
    description: 'Elegante hotel boutique ubicado a pasos de los mejores restaurantes de Provenza. Diseño bioclimático con jardines verticales, suites con acabados en maderas nativas y rooftop con cócteles de autor frente al skyline del valle.',
    houseRules: [
      'Recepción y check-in 24 horas',
      'Habitaciones libres de humo',
      'Prohibido el ingreso de visitantes no registrados en recepción'
    ],
    instantBooking: true,
    status: 'active',
    reviews: [
      {
        id: 'rev-2',
        author: 'Carolina Morales',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
        date: 'Noviembre 2026',
        rating: 5,
        comment: 'La suite es preciosa y el rooftop tiene la mejor vista de Medellín. El transfer desde el aeropuerto de Rionegro funcionó perfecto con el chofer de Hospeda Ride.',
        verifiedStay: true,
        roomBooked: 'Suite Ejecutiva Provenza',
        categories: {
          cleanliness: 5.0,
          accuracy: 5.0,
          communication: 5.0,
          location: 5.0,
          value: 4.9
        }
      }
    ]
  },
  {
    id: 'prop-3',
    title: 'Penthouse de Diseño con Chimenea & Vistas a los Cerros',
    type: 'airbnb',
    subType: 'Penthouse Dúplex',
    city: 'Bogotá',
    department: 'Cundinamarca',
    neighborhood: 'Chapinero Alto',
    lat: 4.653,
    lng: -74.057,
    pricePerNight: 125,
    priceCOP: 510000,
    currency: 'COP',
    cleaningFee: 25,
    cleaningFeeCOP: 100000,
    serviceFeeRate: 0.12,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    rating: 4.91,
    reviewCount: 108,
    rntNumber: 'RNT #63190',
    rntStatus: 'verified',
    amenities: [
      'Chimenea a gas contemporánea',
      'WiFi 600 Mbps dedicado',
      'Estudio ergonómico de teletrabajo',
      'Cafetera Chemex con café de Huila',
      'Terraza privada con calefactor',
      'Parqueadero subterráneo privado',
      'Cerradura inteligente 24h',
      'Smart TV 65" 4K OLED'
    ],
    photos: [
      '/src/assets/images/stay_cozy_urban_loft_1794422534491.jpg',
      '/src/assets/images/stay_boutique_hotel_room_1794422533615.jpg',
      '/src/assets/images/hero_stay_luxury_villa_1794422533159.jpg'
    ],
    host: {
      id: 'host-103',
      name: 'Felipe & Marcela Restrepo',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
      isSuperhost: true,
      responseTime: 'Menos de 20 minutos',
      verifiedIdentity: true,
      joinedYear: 2020,
      rating: 4.93,
      reviewCount: 215,
      rntNumber: 'RNT #63190',
      rntStatus: 'verified',
      taxId: 'CC 79.842.110'
    },
    description: 'Espectacular dúplex en Chapinero Alto con ventanales de suelo a techo frente a los cerros orientales de Bogotá. Rodeado de bistrós de autor y cafés de especialidad.',
    houseRules: [
      'Check-in digital con clave autónoma',
      'Apto para nómadas digitales y ejecutivos',
      'Espacio no fumador'
    ],
    instantBooking: true,
    status: 'active',
    reviews: []
  },
  {
    id: 'prop-4',
    title: 'Nomad Social Co-Living & Coworking Hub (Hostal Comunitario)',
    type: 'hostel',
    subType: 'Hostal / Cápsulas & Habitaciones Privadas',
    city: 'Santa Marta',
    department: 'Magdalena',
    neighborhood: 'Centro Histórico / Bahía',
    lat: 11.244,
    lng: -74.212,
    pricePerNight: 24,
    priceCOP: 98000,
    currency: 'COP',
    cleaningFee: 5,
    cleaningFeeCOP: 20000,
    serviceFeeRate: 0.08,
    maxGuests: 1,
    bedrooms: 1,
    beds: 1,
    bathrooms: 4,
    rating: 4.88,
    reviewCount: 420,
    rntNumber: 'RNT #55219',
    rntStatus: 'verified',
    amenities: [
      'Coworking con aire acondicionado 24/7',
      'Rooftop bar con vista a la bahía',
      'Tours directos a Parque Tayrona & Minca',
      'Cocina comunitaria compartida',
      'Taquillas con tarjeta magnética',
      'Desayuno tropical gratis',
      'Café colombiano ilimitado',
      'Guardaequipaje seguro'
    ],
    photos: [
      '/src/assets/images/stay_cozy_urban_loft_1794422534491.jpg',
      '/src/assets/images/exp_local_gastronomy_tour_1794422535302.jpg',
      '/src/assets/images/stay_boutique_hotel_room_1794422533615.jpg'
    ],
    host: {
      id: 'host-104',
      name: 'Comunidad Nomad Tayrona',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80',
      isSuperhost: false,
      responseTime: 'Menos de 1 hora',
      verifiedIdentity: true,
      joinedYear: 2022,
      rating: 4.89,
      reviewCount: 710,
      rntNumber: 'RNT #55219',
      rntStatus: 'verified',
      taxId: 'NIT 901.332.901-1'
    },
    description: 'El punto de encuentro para viajeros internacionales y nómadas digitales en Santa Marta. Cápsulas de descanso privadas con cortinas blackout, tomas USB y terraza social.',
    houseRules: [
      'Check-in 14:00 - 22:00',
      'Silencio en dormitorios después de las 23:00',
      'Áreas sociales abiertas hasta las 00:00'
    ],
    instantBooking: true,
    status: 'active',
    reviews: []
  },
  {
    id: 'prop-5',
    title: 'Finca Cafetera Tradicional & Glamping entre Palmas de Cera',
    type: 'airbnb',
    subType: 'Finca Campestre Privada',
    city: 'Eje Cafetero',
    department: 'Quindío',
    neighborhood: 'Salento / Valle del Cocora',
    lat: 4.637,
    lng: -75.570,
    pricePerNight: 195,
    priceCOP: 800000,
    currency: 'COP',
    cleaningFee: 30,
    cleaningFeeCOP: 120000,
    serviceFeeRate: 0.12,
    maxGuests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 3,
    rating: 4.99,
    reviewCount: 96,
    rntNumber: 'RNT #91024',
    rntStatus: 'verified',
    amenities: [
      'Sendero ecológico privado de café',
      'Jacuzzi climatizado al aire libre',
      'Fogata nocturna con malvaviscos',
      'Internet satelital Starlink',
      'Desayuno con arepa de choclo campesina',
      'Cabalgatas guiadas',
      'Avistamiento de aves endémicas',
      'Parqueadero gratuito'
    ],
    photos: [
      '/src/assets/images/hero_stay_luxury_villa_1794422533159.jpg',
      '/src/assets/images/stay_boutique_hotel_room_1794422533615.jpg',
      '/src/assets/images/stay_cozy_urban_loft_1794422534491.jpg'
    ],
    host: {
      id: 'host-105',
      name: 'Don Hernando & Familia',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80',
      isSuperhost: true,
      responseTime: 'Menos de 15 minutos',
      verifiedIdentity: true,
      joinedYear: 2018,
      rating: 4.99,
      reviewCount: 240,
      rntNumber: 'RNT #91024',
      rntStatus: 'verified',
      taxId: 'CC 10.128.490'
    },
    description: 'Auténtica arquitectura colonial antioqueña rodeada de cafetales en producción y palmas de cera. Vive la experiencia cafetera completa desde la recolección hasta la taza.',
    houseRules: [
      'Respeto por la fauna y flora nativa',
      'Check-in desde las 15:00',
      'Mascotas bienvenidas en áreas verdes'
    ],
    instantBooking: true,
    status: 'active',
    reviews: []
  }
];

export const INITIAL_EXPERIENCES: Experience[] = [
  {
    id: 'exp-1',
    title: 'Ruta Gastronómica de Frituras Caribeñas & Ron en Getsemaní',
    category: 'gastronomy',
    categoryLabel: 'Gastronomía Caribeña',
    location: 'Cartagena / Barrio Getsemaní',
    duration: '3.5 horas',
    price: 45,
    rating: 4.98,
    reviewCount: 164,
    guide: {
      name: 'Chef Nayibe Arnedo',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=120&h=120&q=80',
      role: 'Matrona Culinaria Certificada',
      certified: true
    },
    includes: [
      'Arepas de huevo tradicionales y carimañolas',
      'Ceviche cartagenero de pescado fresco',
      'Cata guiada de rones añejos colombianos',
      'Recorrido histórico de murales con anécdotas'
    ],
    photo: '/src/assets/images/exp_local_gastronomy_tour_1794422535302.jpg',
    spotsLeft: 4,
    description: 'Sumérgete en la cultura culinaria del Caribe colombiano guiado por una matrona tradicional en los callejones coloridos de Getsemaní.',
    schedule: ['11:00 AM', '04:30 PM', '07:00 PM']
  },
  {
    id: 'exp-2',
    title: 'Cata de Cafés Especiales Geisha & Maridaje en Finca Quindío',
    category: 'culture',
    categoryLabel: 'Cultura del Café',
    location: 'Salento / Eje Cafetero',
    duration: '3 horas',
    price: 35,
    rating: 4.97,
    reviewCount: 132,
    guide: {
      name: 'Juan Pablo Barista Q-Grader',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
      role: 'Catador Profesional Q-Grader',
      certified: true
    },
    includes: [
      'Paseo por plantación de café bajo sombra',
      'Taller práctico de métodos de filtrado (V60, Chemex, Aeropress)',
      'Degustación de 4 microlotes de origen',
      'Bolsa de 250g de café recién tostado de cortesía'
    ],
    photo: '/src/assets/images/stay_cozy_urban_loft_1794422534491.jpg',
    spotsLeft: 6,
    description: 'Aprende a diferenciar notas frutales, acidez cítrica y dulzor en los cafés de especialidad más premiados de Colombia.',
    schedule: ['09:30 AM', '02:30 PM']
  },
  {
    id: 'exp-3',
    title: 'Tour en Lancha Rápida a Islas del Rosario & Plankton Luminoso',
    category: 'adventure',
    categoryLabel: 'Aventura Marina',
    location: 'Cartagena / Archipiélago del Rosario',
    duration: '7 horas (Día Completo)',
    price: 75,
    rating: 4.95,
    reviewCount: 220,
    guide: {
      name: 'Capitán Jairo Marrugo',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
      role: 'Piloto Náutico Certificado Dimar',
      certified: true
    },
    includes: [
      'Transporte en lancha deportiva bi-motor',
      'Almuerzo típico caribeño (pescado frito, arroz con coco, patacones)',
      'Careteo de snorkel en arrecife de coral',
      'Avistamiento nocturno de plancton bioluminiscente en Barú'
    ],
    photo: '/src/assets/images/hero_stay_luxury_villa_1794422533159.jpg',
    spotsLeft: 5,
    description: 'Pasa el día nadando en aguas turquesas del Parque Nacional Natural Corales del Rosario y termina con el espectáculo de luces vivas en el mar.',
    schedule: ['08:00 AM']
  }
];

export const RIDE_TIERS: RideOption[] = [
  {
    id: 'eco',
    name: 'Hospeda Eco',
    description: 'Sedán compacto con aire acondicionado (Renault Logan, Chevrolet Onix)',
    capacity: '3 pers. · 2 maletas',
    multiplier: 1.0,
    basePrice: 15000, // COP
    perKm: 2800,
    iconName: 'Car'
  },
  {
    id: 'comfort',
    name: 'Comfort Black Colombia',
    description: 'Camioneta SUV ejecutiva (Toyota Prado, Renault Duster, Mazda CX-5)',
    capacity: '4 pers. · 4 maletas',
    multiplier: 1.5,
    basePrice: 32000,
    perKm: 4500,
    iconName: 'ShieldCheck'
  },
  {
    id: 'van',
    name: 'Van Turística Grupal',
    description: 'Van especial de turismo con placas blancas (Hyundai H1 / Renault Master)',
    capacity: '7-10 pers. · 8 maletas',
    multiplier: 2.1,
    basePrice: 55000,
    perKm: 6200,
    iconName: 'Bus'
  },
  {
    id: 'moto',
    name: 'Moto Express Urbano',
    description: 'Traslado rápido esquivando tráfico con chaleco y casco sanitizado',
    capacity: '1 pers. · 1 morral',
    multiplier: 0.7,
    basePrice: 8000,
    perKm: 1900,
    iconName: 'Zap'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book-901',
    propertyId: 'prop-1',
    propertyTitle: 'Casa Colonial con Piscina Privada en Getsemaní',
    propertyType: 'airbnb',
    propertyPhoto: '/src/assets/images/hero_stay_luxury_villa_1794422533159.jpg',
    checkIn: '2026-11-15',
    checkOut: '2026-11-19',
    guests: 4,
    totalNights: 4,
    nightlyTotal: 4600000,
    cleaningFee: 200000,
    serviceFee: 552000,
    totalAmount: 5352000,
    status: 'confirmed',
    payoutStatus: 'settled',
    guestName: 'Valeria Méndez',
    guestEmail: 'valeria.mendez@example.com',
    guestAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
    hostId: 'host-101',
    createdAt: '2026-11-08T14:20:00Z',
    bookingCode: 'HG-COL-89312'
  },
  {
    id: 'book-902',
    propertyId: 'prop-2',
    propertyTitle: 'Hotel Boutique El Poblado & Rooftop Sky Lounge',
    propertyType: 'hotel',
    propertyPhoto: '/src/assets/images/stay_boutique_hotel_room_1794422533615.jpg',
    checkIn: '2026-11-20',
    checkOut: '2026-11-23',
    guests: 2,
    totalNights: 3,
    nightlyTotal: 2040000,
    cleaningFee: 80000,
    serviceFee: 204000,
    totalAmount: 2324000,
    status: 'confirmed',
    payoutStatus: 'pending',
    guestName: 'Carlos Santillana',
    guestEmail: 'carlos.s@example.com',
    guestAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    hostId: 'host-102',
    createdAt: '2026-11-10T09:12:00Z',
    bookingCode: 'HG-COL-77142'
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    propertyId: 'prop-1',
    propertyTitle: 'Casa Colonial Getsemaní',
    propertyPhoto: '/src/assets/images/hero_stay_luxury_villa_1794422533159.jpg',
    otherParty: {
      id: 'host-101',
      name: 'María Camila (Anfitriona)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      role: 'host',
      status: 'online'
    },
    lastMessage: '¡Buenas tardes! Les confirmamos que el chofer con placa blanca los esperará a la salida de llegadas del Aeropuerto Rafael Núñez.',
    lastTimestamp: '10:14 AM',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-1',
        senderId: 'guest-me',
        senderName: 'Tú',
        text: '¡Hola María Camila! Nuestro vuelo de Avianca aterriza a las 14:15.',
        timestamp: '09:48 AM',
        isHost: false,
        read: true
      },
      {
        id: 'msg-2',
        senderId: 'host-101',
        senderName: 'María Camila',
        text: '¡Buenas tardes! Les confirmamos que el chofer con placa blanca los esperará a la salida de llegadas del Aeropuerto Rafael Núñez.',
        timestamp: '10:14 AM',
        isHost: true,
        read: false
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: PushNotification[] = [
  {
    id: 'notif-1',
    type: 'booking',
    title: '¡Reserva confirmada en Cartagena!',
    message: 'Tu estancia en Casa Colonial Getsemaní ha sido confirmada con RNT verificado #48291.',
    timestamp: 'Hace 8 min',
    read: false,
    actionUrl: 'bookings'
  },
  {
    id: 'notif-2',
    type: 'payment',
    title: 'Liquidación procesada en pesos COP',
    message: 'Se han consignado $4,800,000 COP a tu cuenta Bancolombia.',
    timestamp: 'Hace 35 min',
    read: false,
    actionUrl: 'payments'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-801',
    bookingCode: 'HG-COL-89312',
    date: '2026-11-11',
    propertyTitle: 'Casa Colonial con Piscina Getsemaní',
    grossAmount: 5352000,
    platformFee: 552000,
    netAmount: 4800000,
    status: 'settled',
    payoutMethod: 'Bancolombia Ahorros (*9102)'
  },
  {
    id: 'tx-802',
    bookingCode: 'HG-COL-77142',
    date: '2026-11-10',
    propertyTitle: 'Hotel Boutique El Poblado Medellín',
    grossAmount: 2324000,
    platformFee: 204000,
    netAmount: 2120000,
    status: 'pending',
    payoutMethod: 'Davivienda Corriente (*4418)'
  }
];
