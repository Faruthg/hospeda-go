export type UserRole = 'guest' | 'host' | 'admin';
export type CurrencyCode = 'COP' | 'USD';
export type PropertyType = 'airbnb' | 'hotel' | 'hostel';

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
}

export interface DemoAccount extends AuthUser {
  password: string;
}

export interface GuestReservation {
  id: string;
  email: string;
  title: string;
  type: 'experience' | 'ride';
  details: string;
  amount: number;
  createdAt: string;
}

export interface ColombiaDestination {
  id: string;
  name: string;
  department: string;
  tag: string;
  badge?: string;
  popularNeighborhoods: string[];
}

export interface ReviewCategoryRatings {
  cleanliness: number;
  accuracy: number;
  communication: number;
  location: number;
  value: number;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
  verifiedStay: boolean;
  roomBooked?: string;
  categories: ReviewCategoryRatings;
  hostResponse?: {
    date: string;
    text: string;
  };
}

export interface Host {
  id: string;
  name: string;
  avatar: string;
  isSuperhost: boolean;
  responseTime: string;
  verifiedIdentity: boolean;
  joinedYear: number;
  rating: number;
  reviewCount: number;
  rntNumber?: string;
  rntStatus?: 'verified' | 'pending' | 'rejected';
  taxId?: string; // NIT o Cédula Colombia
}

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  subType: string;
  city: string;
  department?: string; // Departamento en Colombia (Bolívar, Antioquia, Cundinamarca, etc.)
  neighborhood: string;
  lat: number;
  lng: number;
  pricePerNight: number; // in USD or base
  priceCOP: number; // in Colombian Pesos COP
  currency: string;
  cleaningFee: number;
  cleaningFeeCOP: number;
  serviceFeeRate: number; // e.g. 0.12 (12%)
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  rating: number;
  reviewCount: number;
  amenities: string[];
  photos: string[];
  host: Host;
  description: string;
  houseRules: string[];
  instantBooking: boolean;
  status: 'active' | 'paused' | 'occupied';
  reviews: Review[];
  rntNumber: string; // Registro Nacional de Turismo
  rntStatus: 'verified' | 'pending' | 'rejected';
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyType: PropertyType;
  propertyPhoto: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalNights: number;
  nightlyTotal: number;
  cleaningFee: number;
  serviceFee: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  payoutStatus: 'settled' | 'pending' | 'processing';
  guestName: string;
  guestEmail: string;
  guestAvatar: string;
  hostId: string;
  createdAt: string;
  bookingCode: string;
}

export interface Experience {
  id: string;
  title: string;
  category: 'gastronomy' | 'culture' | 'adventure' | 'nightlife' | 'wellness';
  categoryLabel: string;
  location: string;
  duration: string;
  price: number;
  rating: number;
  reviewCount: number;
  guide: {
    name: string;
    avatar: string;
    role: string;
    certified: boolean;
  };
  includes: string[];
  photo: string;
  spotsLeft: number;
  description: string;
  schedule: string[];
}

export interface RideOption {
  id: 'eco' | 'comfort' | 'van' | 'moto';
  name: string;
  description: string;
  capacity: string;
  multiplier: number;
  basePrice: number;
  perKm: number;
  iconName: string;
}

export interface ActiveRide {
  id: string;
  serviceType: 'eco' | 'comfort' | 'van' | 'moto';
  typeName: string;
  pickupAddress: string;
  dropoffAddress: string;
  distanceKm: number;
  fare: number;
  etaMinutes: number;
  status: 'searching' | 'driver_assigned' | 'in_transit' | 'arrived' | 'completed';
  driver: {
    name: string;
    avatar: string;
    rating: number;
    phone: string;
    vehicle: string;
    plate: string;
  };
  progressPercent: number;
  startTime: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isHost: boolean;
  read: boolean;
  isOffer?: boolean;
}

export interface Conversation {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyPhoto: string;
  otherParty: {
    id: string;
    name: string;
    avatar: string;
    role: 'host' | 'guest';
    status: 'online' | 'offline';
  };
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface PushNotification {
  id: string;
  type: 'booking' | 'payment' | 'chat' | 'ride' | 'review';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface Transaction {
  id: string;
  bookingCode: string;
  date: string;
  propertyTitle: string;
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  status: 'settled' | 'pending' | 'processing';
  payoutMethod: string;
}
