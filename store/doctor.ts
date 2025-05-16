import { getDocs, collection } from 'firebase/firestore';
import { create } from 'zustand';// cập nhật đúng đường dẫn config của bạn
import { db } from '@/config/firebase'; 
import { doc, getDoc , addDoc } from 'firebase/firestore';

export async function getDoctorList() {
    try {
        const snapshot = await getDocs(collection(db, 'Doctor'));
        return snapshot.docs.map((doc) => ({
            ...doc.data(),     // field như name, clinic, id = "doc1"
            id: doc.id, 
        }));
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bác sĩ:', error);
        throw error; // Cho phép xử lý lỗi ở nơi gọi
    }
}


export async function getDoctorById(id: string): Promise<Doctor | null> {
    try {
        const docRef = doc(db, 'Doctor', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                ...docSnap.data(),
                id: docSnap.id,
            } as Doctor;
        } else {
            console.warn(`Không tìm thấy bác sĩ với id: ${id}`);
            return null;
        }
    } catch (error) {
        console.error('Lỗi khi lấy bác sĩ theo ID:', error);
        throw error;
    }
}

export type Doctor = {
    id: string;
    name: string;
    clinic: string;
    distance: string;
    specialization: string;
};
