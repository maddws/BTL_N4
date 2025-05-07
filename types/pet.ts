import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface Pet {
    id: string; // check
    name: string; // check
    species: string; // check
    breed: string; // check
    age: number;
    weight: number;
    gender: 'male' | 'female';
    imageUrl: string;
    birthDate: string;
    color: string;
    microchipId?: string;
    isActive: boolean;
    vaccinated: boolean;
    photo: string;
}

// export interface HealthRecord {
//     id: string;
//     petId: string;
//     date: string;
//     weight: number;
//     symptoms?: string;
//     diagnosis?: string;
//     treatment?: string;
//     notes?: string;
//     // vetVisit: boolean;
//     // vetName?: string;
// }
export interface HealthRecord {
    id: string;
    petId: string;
    date: string;
    weight: number;
    symptoms?: string | null; // Allow null instead of undefined
    diagnosis?: string | null; // Allow null instead of undefined
    treatment?: string | null; // Allow null instead of undefined
    notes?: string | null; // Allow null instead of undefined
    vetVisit?: boolean; // This can be a required field
    vetName?: string | null; // Vet name can be null if not available
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
    type: 'walk' | 'play' | 'rest' | 'eat' | 'other' | 'run';
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

export interface UserDoc {
    create_at: FirebaseFirestoreTypes.Timestamp;
    email: string;
    language: string;
    password: string;
    phone_number: string;
    profile_picture: string;
    updated_at: FirebaseFirestoreTypes.Timestamp;
    username: string;
}
export type OrderStatus =
    | 'pending' // vừa tạo, chờ xác nhận
    | 'shipping' // đang vận chuyển
    | 'done' // giao thành công
    | 'canceled'; // huỷ

export interface OrderItem {
    product_id: string; // ID sản phẩm
    quantity: number; // Số lượng
    /**
     * Cờ nội bộ (chỉ sử dụng trong client state):
     *  - true  : người dùng đã gửi đánh giá
     *  - false : chưa đánh giá
     * Không lưu lên Firestore.
     */
    rated?: boolean;
}

export interface Order {
    id: string; // = doc.id trên Firestore
    user_id: string; // UID chủ đơn
    status: OrderStatus; // Trạng thái hiện tại
    total_all: number; // Tổng tiền (đã gồm ship)
    created_at: number; // epoch millis – dùng Date.now()
    items: OrderItem[]; // Danh sách sản phẩm
}
