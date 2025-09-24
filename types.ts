export enum ExecutionStatus {
  COMPLETED = 'Cumpri integralmente',
  PARTIAL = 'Cumpri parcialmente',
  MISSED = 'Não cumpri',
}

export enum DifficultyMoment {
  MORNING = 'Manhã',
  AFTERNOON = 'Tarde',
  NIGHT = 'Noite',
  NONE = 'Não senti dificuldade',
}

export enum SabotageType {
  INTERNAL = 'Minha própria mente me atrapalhou (ansiedade, autocrítica)',
  EXTERNAL = 'O ambiente ao redor me tirou o foco (distrações)',
  ENERGY = 'Cansaço ou falta de energia me venceram',
  SOCIAL = 'Senti o peso da opinião ou expectativa dos outros',
  NONE = 'Hoje o dia fluiu bem, sem grandes barreiras',
}

export enum MotivationType {
  GROWTH = 'Fiz por mim, pelo meu crescimento pessoal',
  JOY = 'A alegria de simplesmente fazer a atividade me moveu',
  SUPPORT = 'O apoio e reconhecimento de outros me incentivou',
  GOAL = 'Pensei na recompensa ou no resultado final',
  AUTOMATIC = 'Fiz no automático, sem pensar muito',
  NOT_APPLICABLE = 'Não se aplica (hábito não realizado)',
}


export enum EnergyLevel {
  BETTER = 'Melhor',
  SAME = 'Igual',
  WORSE = 'Pior',
  NOT_APPLICABLE = 'Não se aplica (hábito não realizado)',
}

export enum NextDayPlan {
  REPEAT = 'Repetir a estratégia que funcionou',
  ADJUST = 'Ajustar o ambiente ou horário para facilitar',
  SIMPLIFY = 'Simplificar o hábito para garantir a execução',
  PAUSE = 'Fazer uma pausa consciente para recarregar',
}

export interface Habit {
  id: number;
  userId: number;
  name: string;
  daysPerWeek: number;
  timesPerDay: number;
  durationDays: 7 | 10 | 15 | 30;
  startDate: string; // ISO string
  reminderTime?: string; // e.g., "20:00"
  reminderDays?: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday
}

export interface Checkin {
  id: number;
  habitId: number;
  checkinDate: string; // ISO string
  executionStatus: ExecutionStatus;
  difficultyMoment: DifficultyMoment;
  sabotageType: SabotageType;
  motivationType: MotivationType;
  energyLevel: EnergyLevel;
  nextDayPlan: NextDayPlan;
  learnings: string;
}

export interface Insight {
    title: string;
    message: string;
}

export interface User {
  id: number;
  fullName: string;
  cpf: string;
  birthDate: string;
  whatsapp: string;
  email: string;
  avatarUrl?: string;
}

// Types for Behavioral Tests
export enum Archetype {
  // Test 1
  GUARDIAN = 'Guardião da Disciplina',
  WANDERER = 'Andarilho Oscilante',
  WIND = 'Vento Errante',
  // Test 2
  FIRE = 'Fogo Interno',
  MIRROR = 'Espelho Social',
  MAZE = 'Labirinto Difuso',
  // Test 3
  BUILDER = 'Construtor Consciente',
  WARRIOR = 'Guerreiro Ansioso',
  SHADOW = 'Sombra Repetitiva',
}

export interface Answer {
  text: string;
  archetype: Archetype;
}

export interface Question {
  id: number;
  text: string;
  answers: Answer[];
}

export interface TestResultDetails {
  archetype: Archetype;
  behaviorPattern: string;
  habitImpact: string;
  interventionTips: string;
}

export interface Test {
  id: string;
  title: string;
  icon: any; // Lucide icon component
  archetypes: Archetype[];
  questions: Question[];
  results: TestResultDetails[];
}

export interface TestSubmission {
    id: number;
    testId: string;
    userId: number;
    resultArchetype: Archetype;
    submissionDate: string; // ISO string
}

// Types for Tips Page
export interface Tip {
    title: string;
    content: string;
}

export interface TipCategory {
    id: string;
    title: string;
    icon: React.ElementType;
    tips: Tip[];
}