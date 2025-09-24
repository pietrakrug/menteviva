import { Habit, Checkin, ExecutionStatus, DifficultyMoment, SabotageType, MotivationType, EnergyLevel, NextDayPlan, User, TestSubmission, Archetype } from '../types';

// In-memory database
let users: User[] = [
    { id: 1, fullName: 'Usuário Teste', cpf: '123.456.789-00', birthDate: '1990-01-01', whatsapp: '11999999999', email: 'teste@mente-viva.com', avatarUrl: '' }
];
let habits: Habit[] = [];
let checkins: Checkin[] = [];
let testSubmissions: TestSubmission[] = [];
let nextId = { user: 2, habit: 1, checkin: 1, testSubmission: 1 };

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
  // --- AUTH ---
  login: async (email: string): Promise<User | null> => {
    await simulateDelay(500);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  },

  register: async (userData: Omit<User, 'id' | 'avatarUrl'>): Promise<User> => {
    await simulateDelay(700);
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        throw new Error("Email already registered.");
    }
    const newUser: User = { ...userData, id: nextId.user++, avatarUrl: '' };
    users.push(newUser);
    return newUser;
  },
  
  updateUser: async (updatedUser: User): Promise<User> => {
    await simulateDelay(300);
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    if (userIndex === -1) {
      throw new Error("User not found.");
    }
    users[userIndex] = updatedUser;
    return users[userIndex];
  },

  // --- HABITS ---
  getHabits: async (userId: number): Promise<Habit[]> => {
    await simulateDelay(400);
    return habits.filter(h => h.userId === userId);
  },

  addHabit: async (habitData: Omit<Habit, 'id'>): Promise<Habit> => {
    await simulateDelay(500);
    const newHabit: Habit = { ...habitData, id: nextId.habit++ };
    habits.push(newHabit);

    // In a real application, this is where you would trigger a backend process
    // to schedule a recurring job (e.g., using a cron job) to send email reminders
    // based on the habit's reminderTime and reminderDays.
    
    return newHabit;
  },
  
  deleteHabit: async (habitId: number, userId: number): Promise<void> => {
    await simulateDelay(500);
    const habitIndex = habits.findIndex(h => h.id === habitId && h.userId === userId);
    if (habitIndex === -1) {
        throw new Error("Habit not found or user does not have permission to delete it.");
    }
    habits.splice(habitIndex, 1);
    // Also remove checkins for this habit
    checkins = checkins.filter(c => c.habitId !== habitId);
  },


  // --- CHECKINS ---
  getCheckins: async (habitId: number): Promise<Checkin[]> => {
    await simulateDelay(600);
    return checkins.filter(c => c.habitId === habitId);
  },

  addCheckin: async (checkinData: Omit<Checkin, 'id' | 'checkinDate'>): Promise<Checkin> => {
     await simulateDelay(500);
     const newCheckin: Checkin = {
       ...checkinData,
       id: nextId.checkin++,
       checkinDate: new Date().toISOString(),
     };
     checkins.push(newCheckin);
     return newCheckin;
  },

  // --- TESTS ---
  getTestSubmissions: async (userId: number): Promise<TestSubmission[]> => {
      await simulateDelay(300);
      return testSubmissions.filter(ts => ts.userId === userId);
  },
  
  saveTestResult: async(submissionData: Omit<TestSubmission, 'id' | 'submissionDate'>): Promise<TestSubmission> => {
      await simulateDelay(500);
      const newSubmission: TestSubmission = {
          ...submissionData,
          id: nextId.testSubmission++,
          submissionDate: new Date().toISOString(),
      };
      // Allow only one submission per month by removing old ones for the same test
      testSubmissions = testSubmissions.filter(
        ts => !(ts.userId === newSubmission.userId && ts.testId === newSubmission.testId)
      );
      testSubmissions.push(newSubmission);
      return newSubmission;
  }
};