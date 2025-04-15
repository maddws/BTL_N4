import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet, HealthRecord, Vaccination, Reminder, Activity, MedicalDocument } from '@/types/pet';
import { pets as mockPets, healthRecords as mockHealthRecords, vaccinations as mockVaccinations, reminders as mockReminders, activities as mockActivities, medicalDocuments as mockMedicalDocuments } from '@/mocks/pets';

interface PetState {
  pets: Pet[];
  activePetId: string | null;
  healthRecords: HealthRecord[];
  vaccinations: Vaccination[];
  reminders: Reminder[];
  activities: Activity[];
  medicalDocuments: MedicalDocument[];
  
  // Actions
  setActivePet: (petId: string) => void;
  addPet: (pet: Omit<Pet, 'id'>) => void;
  updatePet: (id: string, updates: Partial<Pet>) => void;
  deletePet: (id: string) => void;
  
  addHealthRecord: (record: Omit<HealthRecord, 'id'>) => void;
  updateHealthRecord: (id: string, updates: Partial<HealthRecord>) => void;
  deleteHealthRecord: (id: string) => void;
  
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
}

export const usePetStore = create<PetState>()(
  persist(
    (set, get) => ({
      pets: mockPets,
      activePetId: mockPets.length > 0 ? mockPets[0].id : null,
      healthRecords: mockHealthRecords,
      vaccinations: mockVaccinations,
      reminders: mockReminders,
      activities: mockActivities,
      medicalDocuments: mockMedicalDocuments || [],
      
      setActivePet: (petId) => set({ activePetId: petId }),
      
      addPet: (pet) => {
        const newPet = { ...pet, id: Date.now().toString(), isActive: true };
        set((state) => ({ 
          pets: [...state.pets, newPet],
          activePetId: state.activePetId || newPet.id
        }));
      },
      
      updatePet: (id, updates) => set((state) => ({
        pets: state.pets.map(pet => 
          pet.id === id ? { ...pet, ...updates } : pet
        )
      })),
      
      deletePet: (id) => set((state) => {
        const newPets = state.pets.filter(pet => pet.id !== id);
        const newActivePetId = state.activePetId === id 
          ? (newPets.length > 0 ? newPets[0].id : null) 
          : state.activePetId;
          
        return {
          pets: newPets,
          activePetId: newActivePetId,
          healthRecords: state.healthRecords.filter(record => record.petId !== id),
          vaccinations: state.vaccinations.filter(vacc => vacc.petId !== id),
          reminders: state.reminders.filter(reminder => reminder.petId !== id),
          activities: state.activities.filter(activity => activity.petId !== id),
          medicalDocuments: state.medicalDocuments.filter(doc => doc.petId !== id)
        };
      }),
      
      addHealthRecord: (record) => set((state) => ({
        healthRecords: [...state.healthRecords, { ...record, id: Date.now().toString() }]
      })),
      
      updateHealthRecord: (id, updates) => set((state) => ({
        healthRecords: state.healthRecords.map(record => 
          record.id === id ? { ...record, ...updates } : record
        )
      })),
      
      deleteHealthRecord: (id) => set((state) => ({
        healthRecords: state.healthRecords.filter(record => record.id !== id)
      })),
      
      addVaccination: (vaccination) => set((state) => ({
        vaccinations: [...state.vaccinations, { ...vaccination, id: Date.now().toString() }]
      })),
      
      updateVaccination: (id, updates) => set((state) => ({
        vaccinations: state.vaccinations.map(vacc => 
          vacc.id === id ? { ...vacc, ...updates } : vacc
        )
      })),
      
      deleteVaccination: (id) => set((state) => ({
        vaccinations: state.vaccinations.filter(vacc => vacc.id !== id)
      })),
      
      addMedicalDocument: (document) => set((state) => ({
        medicalDocuments: [...state.medicalDocuments, { ...document, id: Date.now().toString() }]
      })),
      
      updateMedicalDocument: (id, updates) => set((state) => ({
        medicalDocuments: state.medicalDocuments.map(doc => 
          doc.id === id ? { ...doc, ...updates } : doc
        )
      })),
      
      deleteMedicalDocument: (id) => set((state) => ({
        medicalDocuments: state.medicalDocuments.filter(doc => doc.id !== id)
      })),
      
      addReminder: (reminder) => set((state) => ({
        reminders: [...state.reminders, { ...reminder, id: Date.now().toString() }]
      })),
      
      updateReminder: (id, updates) => set((state) => ({
        reminders: state.reminders.map(reminder => 
          reminder.id === id ? { ...reminder, ...updates } : reminder
        )
      })),
      
      deleteReminder: (id) => set((state) => ({
        reminders: state.reminders.filter(reminder => reminder.id !== id)
      })),
      
      completeReminder: (id) => set((state) => ({
        reminders: state.reminders.map(reminder => 
          reminder.id === id ? { ...reminder, completed: true } : reminder
        )
      })),
      
      addActivity: (activity) => set((state) => ({
        activities: [...state.activities, { ...activity, id: Date.now().toString() }]
      })),
      
      updateActivity: (id, updates) => set((state) => ({
        activities: state.activities.map(activity => 
          activity.id === id ? { ...activity, ...updates } : activity
        )
      })),
      
      deleteActivity: (id) => set((state) => ({
        activities: state.activities.filter(activity => activity.id !== id)
      })),
      
      getActivePet: () => {
        const { pets, activePetId } = get();
        return pets.find(pet => pet.id === activePetId);
      },
      
      getPetHealthRecords: (petId) => {
        return get().healthRecords.filter(record => record.petId === petId);
      },
      
      getPetVaccinations: (petId) => {
        return get().vaccinations.filter(vacc => vacc.petId === petId);
      },
      
      getPetMedicalDocuments: (petId) => {
        return get().medicalDocuments.filter(doc => doc.petId === petId);
      },
      
      getPetReminders: (petId) => {
        return get().reminders.filter(reminder => reminder.petId === petId);
      },
      
      getPetActivities: (petId) => {
        return get().activities.filter(activity => activity.petId === petId);
      },
      getPetById: (id) => {
        const { pets } = get();
        return pets.find(pet => pet.id === id);
      },
      
      getUpcomingReminders: (days = 7) => {
        const { reminders, activePetId } = get();
        if (!activePetId) return [];
        
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + days);
        
        return reminders.filter(reminder => 
          reminder.petId === activePetId && 
          !reminder.completed &&
          new Date(reminder.date) <= endDate
        );
      },
      
      getUpcomingVaccinations: (days = 30) => {
        const { vaccinations, activePetId } = get();
        if (!activePetId) return [];
        
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + days);
        
        return vaccinations.filter(vaccination => 
          vaccination.petId === activePetId && 
          !vaccination.completed &&
          new Date(vaccination.nextDueDate) <= endDate
        );
      },
      
      getRecentActivities: (days = 7) => {
        const { activities, activePetId } = get();
        if (!activePetId) return [];
        
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - days);
        
        return activities.filter(activity => 
          activity.petId === activePetId && 
          new Date(activity.date) >= startDate
        );
      }
    }),
    {
      name: 'pet-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);