import { getDocs, collection , query, where } from 'firebase/firestore';
import { create } from 'zustand';// cập nhật đúng đường dẫn config của bạn
import { db } from '@/config/firebase'; 
import { doc, getDoc , addDoc , deleteDoc } from 'firebase/firestore';


export async function createAppointment(appointmentData: {
    petId: string;
    petName: string;
    doctor_id: string;
    doctor_name: string;
    appointmentDate: string;
    appointmentTime: string;
    reason: string;
  }) {
    try {
      const docRef = await addDoc(collection(db, 'Appointments'), appointmentData);
      console.log('Đã tạo lịch hẹn với ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Lỗi khi tạo lịch hẹn:', error);
      throw error;
    }
  }

  export async function getAppointmentsByPetId(petId: string): Promise<Appointment[]> {
    try {
      const q = query(collection(db, 'Appointments'), where('petId', '==', petId));
      const snapshot = await getDocs(q);
  
      const appointments = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          petId: data.petId || '', // Nếu không có petId, gán giá trị mặc định
          petName: data.petName || '', // Gán giá trị mặc định cho petName
          doctor_id: data.doctor_id || '', // Gán giá trị mặc định cho doctor_id
          doctor_name: data.doctor_name || '', // Gán giá trị mặc định cho doctor_name
          appointmentDate: data.appointmentDate || '', // Gán giá trị mặc định cho appointmentDate
          appointmentTime: data.appointmentTime || '', // Gán giá trị mặc định cho appointmentTime
          reason: data.reason || '' // Gán giá trị mặc định cho reason
        };
      });
  
      return appointments;
    } catch (error) {
      console.error('Lỗi khi lấy lịch hẹn theo petId:', error);
      return []; // Trả về mảng rỗng nếu có lỗi
    }
  }
export type Appointment = {
    id: string; // Đây là ID từ Firestore
    petId: string;
    petName: string;
    doctor_id: string;
    doctor_name: string;
    appointmentDate: string;
    appointmentTime: string;
    reason: string;
};


export async function deleteAppointmentById(id: string) {
    try {
      await deleteDoc(doc(db, 'Appointments', id));
      console.log(`Đã xóa lịch hẹn ${id}`);
    } catch (error) {
      console.error('Lỗi khi xóa lịch hẹn:', error);
      throw error;
    }
  }
  