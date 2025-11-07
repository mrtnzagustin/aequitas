import * as bcrypt from 'bcrypt';
import { User, UserRole, UserStatus } from '../../modules/users/entities/user.entity';
import { Student } from '../../modules/students/entities/student.entity';
import { Note } from '../../modules/notes/entities/note.entity';
import { TaskAdaptation } from '../../modules/adaptations/entities/task-adaptation.entity';
import { LearningStyleProfile } from '../../modules/learning-style/entities/learning-style-profile.entity';
import { MoodCheckin } from '../../modules/mood-checkins/entities/mood-checkin.entity';

/**
 * Data factory utilities for generating realistic test data
 */

// Spanish names for realistic test data
const FIRST_NAMES = [
  'María', 'Juan', 'Ana', 'Carlos', 'Laura', 'Diego', 'Sofía', 'Miguel',
  'Valentina', 'Mateo', 'Isabella', 'Santiago', 'Camila', 'Sebastián',
  'Lucía', 'Martín', 'Emma', 'Nicolás', 'Olivia', 'Joaquín'
];

const LAST_NAMES = [
  'García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez',
  'Sánchez', 'Pérez', 'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández',
  'Díaz', 'Moreno', 'Álvarez', 'Romero', 'Torres', 'Domínguez', 'Vázquez'
];

const STUDENT_CONDITIONS = [
  'TDAH - Tipo Inatento',
  'TDAH - Tipo Hiperactivo',
  'TDAH - Tipo Combinado',
  'Trastorno del Espectro Autista (TEA)',
  'Dislexia',
  'Discalculia',
  'Trastorno de Ansiedad',
  'Sin diagnóstico específico'
];

const STUDENT_INTERESTS = [
  'Ciencias naturales', 'Matemáticas', 'Arte y dibujo', 'Música',
  'Deportes', 'Tecnología', 'Lectura', 'Videojuegos', 'Animales',
  'Historia', 'Astronomía', 'Cocina', 'Manualidades', 'Robótica'
];

const NOTE_CONTENT_SAMPLES = [
  'Excelente participación en clase hoy. Mostró gran interés en el tema.',
  'Necesita apoyo adicional con las fracciones. Proponer ejercicios visuales.',
  'Muy buena concentración durante la actividad de lectura.',
  'Se distrajo con facilidad. Considerar pausas activas más frecuentes.',
  'Logró completar todas las tareas asignadas antes del tiempo límite.',
  'Mostró frustración con problemas complejos. Trabajar estrategias de regulación emocional.',
  'Colaboró muy bien en trabajo grupal. Liderazgo natural.',
  'Excelente creatividad en el proyecto de arte.',
];

/**
 * Random utilities
 */
const random = {
  int: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min,
  item: <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)],
  items: <T>(array: T[], count: number): T[] => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
  },
  boolean: () => Math.random() > 0.5,
  date: (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - random.int(0, daysAgo));
    return date;
  }
};

/**
 * Generate a random full name
 */
export function generateName(): { firstName: string; lastName: string } {
  return {
    firstName: random.item(FIRST_NAMES),
    lastName: random.item(LAST_NAMES)
  };
}

/**
 * Generate a random email from a name
 */
export function generateEmail(firstName: string, lastName: string): string {
  const normalizedFirst = firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const normalizedLast = lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return `${normalizedFirst}.${normalizedLast}${random.int(1, 999)}@aequitas.test`;
}

/**
 * Hash a password for user creation
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Create a user with specified role
 */
export async function createUser(
  role: UserRole,
  customData: Partial<User> = {}
): Promise<Partial<User>> {
  const { firstName, lastName } = generateName();
  const email = customData.email || generateEmail(firstName, lastName);

  return {
    firstName,
    lastName,
    email,
    role,
    status: UserStatus.ACTIVE,
    locale: 'es-AR',
    passwordHash: await hashPassword('Test1234!'), // Default test password
    lastLoginAt: random.date(30),
    ...customData
  };
}

/**
 * Create a student profile
 */
export function createStudent(customData: Partial<Student> = {}): Partial<Student> {
  const { firstName, lastName } = generateName();
  const age = random.int(6, 18);
  const gradeLevel = Math.min(age - 5, 12);

  return {
    firstName,
    lastName,
    dateOfBirth: new Date(new Date().getFullYear() - age, random.int(0, 11), random.int(1, 28)),
    gradeLevel,
    schoolName: random.item(['Escuela Primaria San Martín', 'Colegio Sarmiento', 'Instituto Belgrano']),
    diagnosedConditions: [random.item(STUDENT_CONDITIONS)],
    currentMedication: random.boolean() ? 'Metilfenidato 10mg' : null,
    interests: random.items(STUDENT_INTERESTS, random.int(2, 4)),
    strengths: ['Creatividad', 'Memoria visual'],
    challenges: ['Concentración sostenida', 'Organización temporal'],
    accessibilityNeeds: random.boolean() ? ['Tiempo adicional en exámenes'] : [],
    ...customData
  };
}

/**
 * Create a note
 */
export function createNote(
  authorId: string,
  studentId: string,
  customData: Partial<Note> = {}
): Partial<Note> {
  return {
    content: random.item(NOTE_CONTENT_SAMPLES),
    category: random.item(['GENERAL', 'ACADEMIC', 'BEHAVIORAL', 'SOCIAL']),
    isPrivate: random.boolean(),
    tags: random.items(['concentración', 'participación', 'tareas', 'conducta'], random.int(1, 3)),
    ...customData
  };
}

/**
 * Create a task adaptation
 */
export function createTaskAdaptation(
  studentId: string,
  customData: Partial<TaskAdaptation> = {}
): Partial<TaskAdaptation> {
  const originalTask = 'Resolver ejercicios de matemáticas del libro, páginas 45-47';

  return {
    originalTask,
    adaptedTask: 'Resolver 5 ejercicios seleccionados de la página 45, con apoyo visual de bloques',
    adaptationReason: 'Ajuste de carga cognitiva y apoyo visual para facilitar comprensión',
    adaptationType: random.item(['SIMPLIFICATION', 'BREAKDOWN', 'VISUAL_SUPPORT', 'EXTENDED_TIME']),
    effectivenessRating: random.int(3, 5),
    studentFeedback: random.boolean() ? 'Me ayudó mucho tener menos ejercicios' : null,
    ...customData
  };
}

/**
 * Create a learning style profile
 */
export function createLearningStyleProfile(
  studentId: string,
  customData: Partial<LearningStyleProfile> = {}
): Partial<LearningStyleProfile> {
  const profiles = {
    VISUAL: { visual: 0.7, auditory: 0.2, kinesthetic: 0.1 },
    AUDITORY: { visual: 0.2, auditory: 0.6, kinesthetic: 0.2 },
    KINESTHETIC: { visual: 0.2, auditory: 0.2, kinesthetic: 0.6 },
    BALANCED: { visual: 0.33, auditory: 0.34, kinesthetic: 0.33 }
  };

  const selectedProfile = random.item(Object.values(profiles));

  return {
    preferredModalityScores: selectedProfile,
    dominantModality: Object.keys(selectedProfile).reduce((a, b) =>
      selectedProfile[a] > selectedProfile[b] ? a : b
    ),
    confidenceScore: random.int(70, 95) / 100,
    lastAssessmentDate: random.date(60),
    ...customData
  };
}

/**
 * Create a mood check-in
 */
export function createMoodCheckin(
  studentId: string,
  customData: Partial<MoodCheckin> = {}
): Partial<MoodCheckin> {
  const moods = ['HAPPY', 'CALM', 'ANXIOUS', 'FRUSTRATED', 'EXCITED', 'TIRED', 'FOCUSED'];
  const energyLevel = random.int(1, 5);

  return {
    mood: random.item(moods),
    energyLevel,
    stressLevel: random.int(1, 5),
    sleepQuality: random.int(1, 5),
    notes: random.boolean() ? 'Hoy me siento bien, dormí bien anoche' : null,
    checkinTime: random.date(7),
    ...customData
  };
}

export const DataFactory = {
  generateName,
  generateEmail,
  hashPassword,
  createUser,
  createStudent,
  createNote,
  createTaskAdaptation,
  createLearningStyleProfile,
  createMoodCheckin,
  random
};
