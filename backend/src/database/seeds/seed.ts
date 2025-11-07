import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { DataFactory } from './data-factory';
import { User, UserRole } from '../../modules/users/entities/user.entity';
import { Student } from '../../modules/students/entities/student.entity';
import { StudentAssignment } from '../../modules/students/entities/student-assignment.entity';
import { Note } from '../../modules/notes/entities/note.entity';
import { TaskAdaptation } from '../../modules/adaptations/entities/task-adaptation.entity';
import { LearningStyleProfile } from '../../modules/learning-style/entities/learning-style-profile.entity';
import { MoodCheckin } from '../../modules/mood-checkins/entities/mood-checkin.entity';

// Load environment variables
config();

/**
 * Main seeding script for Aequitas platform
 * Creates realistic test data for development and testing
 */
async function seed() {
  console.log('🌱 Starting database seeding...\n');

  // Create data source
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER || 'aequitas',
    password: process.env.DATABASE_PASSWORD || 'aequitas_dev_password',
    database: process.env.DATABASE_NAME || 'aequitas_dev',
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    synchronize: false, // Don't auto-sync, tables should exist
    logging: false,
  });

  try {
    // Connect to database
    await dataSource.initialize();
    console.log('✅ Connected to database\n');

    // Clear existing data (in correct order to respect foreign keys)
    console.log('🗑️  Clearing existing data...');
    const entities = [
      MoodCheckin,
      LearningStyleProfile,
      TaskAdaptation,
      Note,
      StudentAssignment,
      Student,
      User,
    ];

    for (const entity of entities) {
      await dataSource.getRepository(entity).clear();
    }
    console.log('✅ Existing data cleared\n');

    // Create users
    console.log('👥 Creating users...');
    const users: User[] = [];

    // Admin user
    const adminData = await DataFactory.createUser(UserRole.ADMIN, {
      email: 'admin@aequitas.test',
      firstName: 'Admin',
      lastName: 'Sistema'
    });
    const admin = await dataSource.getRepository(User).save(adminData);
    users.push(admin);
    console.log(`   ✓ Created admin: ${admin.email}`);

    // Therapists
    for (let i = 0; i < 3; i++) {
      const therapistData = await DataFactory.createUser(UserRole.THERAPIST);
      const therapist = await dataSource.getRepository(User).save(therapistData);
      users.push(therapist);
      console.log(`   ✓ Created therapist: ${therapist.email}`);
    }

    // Teachers
    for (let i = 0; i < 5; i++) {
      const teacherData = await DataFactory.createUser(UserRole.TEACHER);
      const teacher = await dataSource.getRepository(User).save(teacherData);
      users.push(teacher);
      console.log(`   ✓ Created teacher: ${teacher.email}`);
    }

    // Parents
    for (let i = 0; i < 8; i++) {
      const parentData = await DataFactory.createUser(UserRole.PARENT);
      const parent = await dataSource.getRepository(User).save(parentData);
      users.push(parent);
      console.log(`   ✓ Created parent: ${parent.email}`);
    }

    console.log(`\n✅ Created ${users.length} users\n`);

    // Create students
    console.log('🎓 Creating students...');
    const students: Student[] = [];
    const therapists = users.filter(u => u.role === UserRole.THERAPIST);
    const teachers = users.filter(u => u.role === UserRole.TEACHER);
    const parents = users.filter(u => u.role === UserRole.PARENT);

    for (let i = 0; i < 15; i++) {
      const studentData = DataFactory.createStudent();
      const student = await dataSource.getRepository(Student).save(studentData);
      students.push(student);

      // Assign therapist
      const assignedTherapist = DataFactory.random.item(therapists);
      await dataSource.getRepository(StudentAssignment).save({
        student,
        user: assignedTherapist,
        assignmentType: 'THERAPIST',
        assignedAt: DataFactory.random.date(180),
      });

      // Assign 1-2 teachers
      const assignedTeachers = DataFactory.random.items(teachers, DataFactory.random.int(1, 2));
      for (const teacher of assignedTeachers) {
        await dataSource.getRepository(StudentAssignment).save({
          student,
          user: teacher,
          assignmentType: 'TEACHER',
          assignedAt: DataFactory.random.date(180),
        });
      }

      // Assign parent
      const assignedParent = parents[i % parents.length]; // Each parent gets ~2 students
      await dataSource.getRepository(StudentAssignment).save({
        student,
        user: assignedParent,
        assignmentType: 'PARENT',
        assignedAt: DataFactory.random.date(365),
      });

      console.log(`   ✓ Created student: ${student.firstName} ${student.lastName}`);
    }

    console.log(`\n✅ Created ${students.length} students with assignments\n`);

    // Create notes
    console.log('📝 Creating notes...');
    let noteCount = 0;
    for (const student of students) {
      // Get student's assigned professionals
      const assignments = await dataSource.getRepository(StudentAssignment).find({
        where: { student: { id: student.id } },
        relations: ['user'],
      });

      const professionals = assignments
        .filter(a => a.assignmentType === 'THERAPIST' || a.assignmentType === 'TEACHER')
        .map(a => a.user);

      // Each student gets 3-8 notes
      const numNotes = DataFactory.random.int(3, 8);
      for (let i = 0; i < numNotes; i++) {
        const author = DataFactory.random.item(professionals);
        const noteData = DataFactory.createNote(author.id, student.id);
        await dataSource.getRepository(Note).save({
          ...noteData,
          author,
          student,
        });
        noteCount++;
      }
    }
    console.log(`✅ Created ${noteCount} notes\n`);

    // Create task adaptations
    console.log('📋 Creating task adaptations...');
    let adaptationCount = 0;
    for (const student of students) {
      // Each student gets 2-5 task adaptations
      const numAdaptations = DataFactory.random.int(2, 5);
      for (let i = 0; i < numAdaptations; i++) {
        const adaptationData = DataFactory.createTaskAdaptation(student.id);
        await dataSource.getRepository(TaskAdaptation).save({
          ...adaptationData,
          student,
        });
        adaptationCount++;
      }
    }
    console.log(`✅ Created ${adaptationCount} task adaptations\n`);

    // Create learning style profiles
    console.log('🎨 Creating learning style profiles...');
    for (const student of students) {
      const profileData = DataFactory.createLearningStyleProfile(student.id);
      await dataSource.getRepository(LearningStyleProfile).save({
        ...profileData,
        student,
      });
    }
    console.log(`✅ Created ${students.length} learning style profiles\n`);

    // Create mood check-ins
    console.log('😊 Creating mood check-ins...');
    let checkinCount = 0;
    for (const student of students) {
      // Each student gets 5-15 mood check-ins over the last 30 days
      const numCheckins = DataFactory.random.int(5, 15);
      for (let i = 0; i < numCheckins; i++) {
        const checkinData = DataFactory.createMoodCheckin(student.id);
        await dataSource.getRepository(MoodCheckin).save({
          ...checkinData,
          student,
        });
        checkinCount++;
      }
    }
    console.log(`✅ Created ${checkinCount} mood check-ins\n`);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log('\n📊 Summary:');
    console.log(`   • ${users.length} users created`);
    console.log(`     - 1 admin`);
    console.log(`     - ${therapists.length} therapists`);
    console.log(`     - ${teachers.length} teachers`);
    console.log(`     - ${parents.length} parents`);
    console.log(`   • ${students.length} students created`);
    console.log(`   • ${noteCount} notes created`);
    console.log(`   • ${adaptationCount} task adaptations created`);
    console.log(`   • ${students.length} learning style profiles created`);
    console.log(`   • ${checkinCount} mood check-ins created`);
    console.log('\n🔑 Test Credentials:');
    console.log('   Email: admin@aequitas.test');
    console.log('   Password: Test1234!');
    console.log('   (All users have the same password for testing)\n');

  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

// Run the seed
seed()
  .then(() => {
    console.log('👋 Seeding completed. Exiting...\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
