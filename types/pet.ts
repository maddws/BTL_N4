export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'fish' | 'other';
  breed: string;
  age: number;
  weight: number;
  gender: 'male' | 'female';
  imageUrl: string;
  birthDate: string;
  color: string;
  microchipId?: string;
  isActive: boolean;
}

export interface HealthRecord {
  id: string;
  petId: string;
  date: string;
  weight: number;
  symptoms?: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  vetVisit: boolean;
  vetName?: string;
}

export interface Vaccination {
  id: string;
  petId: string;
  name: string;
  date: string;
  nextDueDate: string;
  vetName: string;
  notes?: string;
  completed: boolean;
}

export interface MedicalDocument {
  id: string;
  petId: string;
  title: string;
  type: 'lab_result' | 'prescription' | 'xray' | 'certificate' | 'other';
  date: string;
  description?: string;
  imageUrl?: string;
  vetName?: string;
  clinicName?: string;
  notes?: string;
}

export interface Reminder {
  id: string;
  petId: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
  type: 'feeding' | 'medication' | 'grooming' | 'exercise' | 'vet' | 'other';
  completed: boolean;
}

export interface Activity {
  id: string;
  petId: string;
  type: 'walk' | 'play' | 'rest' | 'eat' | 'other';
  duration?: number; // in minutes
  distance?: number; // in meters
  date: string;
  time: string;
  notes?: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  date: string;
  saved: boolean;
  liked: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  date: string;
  likes: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'food' | 'toys' | 'accessories' | 'health' | 'grooming' | 'other';
  rating: number;
  reviews: number;
  inStock: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}