import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    query,
    where,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import {
    Pet,
    Activity as ActivityLog,
    HealthRecord,
    Vaccination,
    Reminder,
    Activity,
    MedicalDocument,
} from '@/types/pet';
import {
    pets as mockPets,
    healthRecords as mockHealthRecords,
    vaccinations as mockVaccinations,
    reminders as mockReminders,
    activities as mockActivities,
    medicalDocuments as mockMedicalDocuments,
} from '@/mocks/pets';
import { Alert } from 'react-native';
import { act } from 'react';

interface PetState {
    pets: Pet[];
    activePetId: string | null;
    healthRecords: HealthRecord[];
    vaccinations: Vaccination[];
    reminders: Reminder[];
    activities: Activity[];
    medicalDocuments: MedicalDocument[];
    // Actions
    setHealthRecords: (hr: HealthRecord[]) => void;
    setActivePet: (petId: string) => void;
    addPet: (pet: Omit<Pet, 'id'>) => void;
    updatePet: (id: string, updates: Partial<Pet>) => void;
    deletePet: (id: string) => void;
    addHealthRecord: (record: Omit<HealthRecord, 'id'>) => void;
    updateHealthRecord: (id: string, updates: Partial<HealthRecord>) => void;
    deleteHealthRecord: (id: string, petId: string) => Promise<void>;
    addVaccination: (vaccination: Omit<Vaccination, 'id'>) => void;
    updateVaccination: (id: string, updates: Partial<Vaccination>) => void;
    deleteVaccination: (id: string) => void;
    addMedicalDocument: (document: Omit<MedicalDocument, 'id'>) => void;
    updateMedicalDocument: (id: string, updates: Partial<MedicalDocument>) => void;
    deleteMedicalDocument: (id: string) => void;
    addReminder: (reminder: Omit<Reminder, 'id'>) => void;
    updateReminder: (id: string, updates: Partial<Reminder>) => void;
    deleteReminder: (id: string) => void;
    completeReminder: (id: string) => void;
    addActivity: (activity: Omit<Activity, 'id'>) => void;
    updateActivity: (id: string, updates: Partial<Activity>) => void;
    deleteActivity: (id: string) => void;
    // Getters
    getActivePet: () => Pet | undefined;
    getPetHealthRecords: (petId: string) => HealthRecord[];
    getPetVaccinations: (petId: string) => Vaccination[];
    getPetMedicalDocuments: (petId: string) => MedicalDocument[];
    getPetReminders: (petId: string) => Reminder[];
    getPetActivities: (petId: string) => Activity[];
    getPetById: (id: string) => Pet | undefined;
    getUpcomingReminders: (days?: number) => Reminder[];
    getUpcomingVaccinations: (days?: number) => Vaccination[];
    getRecentActivities: (days?: number) => Activity[];
    addActivityLog: (record: any) => void;

    // Firestore-backed actions
    fetchUserPets: (userId: string) => Promise<void>;
    createPetForUser: (userId: string, pet: Omit<Pet, 'id'>) => Promise<void>;
}

export const usePetStore = create<PetState>()(
    persist(
        (set, get) => ({
            // initial state (can use mock data for dev)
            pets: [],
            activePetId: null,
            healthRecords: [],
            vaccinations: mockVaccinations,
            reminders: mockReminders,
            activities: mockActivities,
            medicalDocuments: mockMedicalDocuments,

            // Mutations
            addActivityLog: (record) => {
                try {
                    console.log(record);
                    const actDB = collection(db, 'ActivityLogs');
                    const q = addDoc(actDB, record);
                    Alert.alert('Thêm bản ghi thành công!!');
                } catch (error) {
                    console.error('Error adding health record:', error);
                }
            },
            setActivePet: (petId) => set({ activePetId: petId }),

            setHealthRecords: (hr) =>
                set({
                    healthRecords: hr,
                }),

            addPet: (pet) =>
                set((state) => {
                    const id = Date.now().toString();
                    const newPet = { ...pet, id } as Pet;
                    return {
                        pets: [...state.pets, newPet],
                        activePetId: state.activePetId || id,
                    };
                }),

            updatePet: (id, updates) =>
                set((state) => ({
                    pets: state.pets.map((p) => (p.id === id ? { ...p, ...updates } : p)),
                })),

            deletePet: (id) =>
                set((state) => {
                    const newPets = state.pets.filter((p) => p.id !== id);
                    const newActive =
                        state.activePetId === id ? newPets[0]?.id ?? null : state.activePetId;
                    return { pets: newPets, activePetId: newActive };
                }),

            // addHealthRecord: (record) =>
            //     set((state) => ({
            //         healthRecords: [
            //             ...state.healthRecords,
            //             { ...record, id: Date.now().toString() },
            //         ],
            //     })),
            addHealthRecord: async (record) => {
                try {
                    const healthRecordsRef = collection(db, 'HealthLogs');

                    // Ensuring that optional fields like symptoms, diagnosis, etc. are not undefined
                    const newRecord = {
                        ...record,
                        date: new Date(record.date).toISOString(), // Ensure the date is in ISO format
                        symptoms: record.symptoms?.trim() || null, // If symptoms is empty, set it as null
                        diagnosis: record.diagnosis?.trim() || null, // If diagnosis is empty, set it as null
                        treatment: record.treatment?.trim() || null, // If treatment is empty, set it as null
                        notes: record.notes?.trim() || null, // If notes are empty, set it as null
                        vetName: null,
                    };

                    // Add the health record to Firestore
                    const docRef = await addDoc(healthRecordsRef, newRecord);

                    // Update the state with the new health record
                    set((state) => ({
                        healthRecords: [
                            ...state.healthRecords,
                            { id: docRef.id, ...newRecord }, // Add the new record to state
                        ],
                    }));

                    console.log('Health record added successfully');
                    Alert.alert('Thêm bản ghi thành công!!');
                } catch (error) {
                    console.error('Error adding health record:', error);
                }
            },
            // addHealthRecord: async (record) => {
            //     try {
            //         const healthRecordsRef = collection(db, 'HealthLogs');

            //         // Kiểm tra các trường bắt buộc và bỏ qua các trường không có giá trị hợp lệ
            //         const newRecord = {
            //             ...record,
            //             date: new Date(record.date).toISOString(),
            //             symptoms: record.symptoms?.trim() || null,
            //             diagnosis: record.diagnosis?.trim() || null,
            //             treatment: record.treatment?.trim() || null,
            //             notes: record.notes?.trim() || null,
            //         } as HealthRecord;

            //         // Thêm vào Firestore nếu tất cả trường hợp cần thiết đã có giá trị
            //         const docRef = await addDoc(healthRecordsRef, newRecord); // Thêm vào Firestore

            //         // Cập nhật state sau khi thêm vào Firestore
            //         set((state) => ({
            //             healthRecords: [...state.healthRecords, { ...newRecord, id: docRef.id }],
            //         }));

            //         console.log('Health record added successfully');
            //     } catch (error) {
            //         console.error('Error adding health record:', error);
            //     }
            // },

            // addHealthRecord: async (record) => {
            //     try {
            //         const healthRecordsRef = collection(db, 'HealthLogs');
            //         const newRecord = { ...record, date: new Date(record.date).toISOString() }; // Đảm bảo định dạng ngày chuẩn ISO
            //         const docRef = await addDoc(healthRecordsRef, newRecord); // Thêm vào Firestore
            //         set((state) => ({
            //             healthRecords: [
            //                 ...state.healthRecords,
            //                 { id: docRef.id, ...newRecord }, // Thêm bản ghi vào state sau khi thêm vào Firestore
            //             ],
            //         }));
            //         console.log('Health record added successfully');
            //     } catch (error) {
            //         console.error('Error adding health record:', error);
            //     }
            // },
            // updateHealthRecord: (id, updates) =>
            //     set((state) => ({
            //         healthRecords: state.healthRecords.map((r) =>
            //             r.id === id ? { ...r, ...updates } : r
            //         ),
            //     })),
            updateHealthRecord: async (id, updates) => {
                try {
                    // Check if petId exists in the updates
                    if (!updates.petId) {
                        throw new Error('Pet ID is required for updating health record');
                    }
                    // console.log('idwtf', id);
                    // console.log(updates);

                    // Filter out fields with undefined values from the updates object
                    // const sanitizedUpdates = Object.fromEntries(
                    //     Object.entries(updates).filter(([key, value]) => value !== undefined)
                    // );

                    // Get reference to the document in Firestore
                    const recordRef = doc(db, 'HealthLogs', id);

                    // Update the health record in Firestore
                    await updateDoc(recordRef, updates);

                    // Update the state to reflect the changes
                    set((state) => ({
                        healthRecords: state.healthRecords.map((r) =>
                            r.id === id ? { ...r, ...updates } : r
                        ),
                    }));

                    console.log('Health record updated successfully');
                    Alert.alert('Sửa bản ghi thành công');
                } catch (error) {
                    console.error('Error updating health record:', error);
                }
            },

            // updateHealthRecord: async (id, updates) => {
            //     try {
            //         // Check if petId exists in the updates
            //         if (!updates.petId) {
            //             throw new Error('Pet ID is required for updating health record');
            //         }

            //         // Get reference to the document in Firestore
            //         const recordRef = doc(db, 'HealthLogs', id);

            //         // Update the health record in Firestore
            //         await updateDoc(recordRef, updates);

            //         // Update the state to reflect the changes
            //         set((state) => ({
            //             healthRecords: state.healthRecords.map((r) =>
            //                 r.id === id ? { ...r, ...updates } : r
            //             ),
            //         }));

            //         console.log('Health record updated successfully');
            //     } catch (error) {
            //         console.error('Error updating health record:', error);
            //     }
            // },
            // updateHealthRecord: async (id, updates) => {
            //     try {
            //         if (!updates.petId) {
            //             throw new Error('Pet ID is required for updating health record');
            //         }
            //         const recordRef = doc(db, 'HealthLogs', id);
            //         await updateDoc(recordRef, updates); // Cập nhật bản ghi trong Firestore
            //         set((state) => ({
            //             healthRecords: state.healthRecords.map((r) =>
            //                 r.id === id ? { ...r, ...updates } : r
            //             ),
            //         }));
            //         console.log('Health record updated successfully');
            //     } catch (error) {
            //         console.error('Error updating health record:', error);
            //     }
            // },

            // deleteHealthRecord: (id) =>
            //     set((state) => ({
            //         healthRecords: state.healthRecords.filter((r) => r.id !== id),
            //     })),
            deleteHealthRecord: async (id, petId) => {
                try {
                    console.log('Deleting ', id, 'Petid', petId);
                    const recordRef = doc(db, 'HealthLogs', id);
                    await deleteDoc(recordRef); // Xoá bản ghi trong Firestore
                    set((state) => ({
                        healthRecords: state.healthRecords.filter((r) => r.id !== id),
                    }));
                    console.log('Health record deleted successfully');
                    Alert.alert('Xoá bản ghi thành công!');
                } catch (error) {
                    console.error('Error deleting health record:', error);
                }
            },

            addVaccination: (v) =>
                set((state) => ({
                    vaccinations: [...state.vaccinations, { ...v, id: Date.now().toString() }],
                })),
            updateVaccination: (id, updates) =>
                set((state) => ({
                    vaccinations: state.vaccinations.map((v) =>
                        v.id === id ? { ...v, ...updates } : v
                    ),
                })),
            deleteVaccination: (id) =>
                set((state) => ({
                    vaccinations: state.vaccinations.filter((v) => v.id !== id),
                })),

            addMedicalDocument: (docItem) =>
                set((state) => ({
                    medicalDocuments: [
                        ...state.medicalDocuments,
                        { ...docItem, id: Date.now().toString() },
                    ],
                })),
            updateMedicalDocument: (id, updates) =>
                set((state) => ({
                    medicalDocuments: state.medicalDocuments.map((d) =>
                        d.id === id ? { ...d, ...updates } : d
                    ),
                })),
            deleteMedicalDocument: (id) =>
                set((state) => ({
                    medicalDocuments: state.medicalDocuments.filter((d) => d.id !== id),
                })),

            addReminder: (r) =>
                set((state) => ({
                    reminders: [...state.reminders, { ...r, id: Date.now().toString() }],
                })),
            updateReminder: (id, updates) =>
                set((state) => ({
                    reminders: state.reminders.map((r) => (r.id === id ? { ...r, ...updates } : r)),
                })),
            deleteReminder: (id) =>
                set((state) => ({
                    reminders: state.reminders.filter((r) => r.id !== id),
                })),
            completeReminder: (id) =>
                set((state) => ({
                    reminders: state.reminders.map((r) =>
                        r.id === id ? { ...r, completed: true } : r
                    ),
                })),

            addActivity: (a) =>
                set((state) => ({
                    activities: [...state.activities, { ...a, id: Date.now().toString() }],
                })),
            updateActivity: (id, updates) =>
                set((state) => ({
                    activities: state.activities.map((a) =>
                        a.id === id ? { ...a, ...updates } : a
                    ),
                })),
            deleteActivity: (id) =>
                set((state) => ({
                    activities: state.activities.filter((a) => a.id !== id),
                })),

            // Getters
            getActivePet: () => get().pets.find((p) => p.id === get().activePetId),
            getPetHealthRecords: (petId) => get().healthRecords.filter((r) => r.petId === petId),
            getPetVaccinations: (petId) => get().vaccinations.filter((v) => v.petId === petId),
            getPetMedicalDocuments: (petId) =>
                get().medicalDocuments.filter((d) => d.petId === petId),
            getPetReminders: (petId) => get().reminders.filter((r) => r.petId === petId),
            getPetActivities: (petId) => get().activities.filter((a) => a.petId === petId),
            getPetById: (id) => get().pets.find((p) => p.id === id),
            getUpcomingReminders: (days = 7) => {
                const today = new Date();
                const end = new Date();
                end.setDate(today.getDate() + days);
                return get().reminders.filter(
                    (r) => r.petId === get().activePetId && !r.completed && new Date(r.date) <= end
                );
            },
            getUpcomingVaccinations: (days = 30) => {
                const today = new Date();
                const end = new Date();
                end.setDate(today.getDate() + days);
                return get().vaccinations.filter(
                    (v) =>
                        v.petId === get().activePetId &&
                        !v.completed &&
                        new Date(v.nextDueDate) <= end
                );
            },
            getRecentActivities: (days = 7) => {
                const today = new Date();
                const start = new Date();
                start.setDate(today.getDate() - days);
                return get().activities.filter(
                    (a) => a.petId === get().activePetId && new Date(a.date) >= start
                );
            },

            // Firestore-backed actions
            fetchUserPets: async (userId) => {
                const upSnap = await getDocs(
                    query(collection(db, 'UserPet'), where('user_id', '==', userId))
                );
                const petIds = upSnap.docs.map((d) => d.data().pet_id as string);
                const pets: Pet[] = [];
                for (const pid of petIds) {
                    const petDoc = await getDoc(doc(db, 'Pets', pid));
                    if (petDoc.exists()) {
                        pets.push({ id: petDoc.id, ...(petDoc.data() as Omit<Pet, 'id'>) });
                    }
                }
                set({ pets, activePetId: pets[0]?.id ?? null });
            },

            createPetForUser: async (userId, petData) => {
                try {
                    const petRef = await addDoc(collection(db, 'Pets'), petData);
                    await addDoc(collection(db, 'UserPet'), {
                        user_id: userId,
                        pet_id: petRef.id,
                    });
                    set((state) => ({
                        pets: [...state.pets, { id: petRef.id, ...petData } as Pet],
                        activePetId: petRef.id,
                    }));
                } catch (error) {
                    console.error('Error creating pet:', error);
                }
            },
        }),
        {
            name: 'pet-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
