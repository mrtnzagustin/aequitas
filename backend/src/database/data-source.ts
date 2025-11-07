import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'aequitas',
  password: process.env.DATABASE_PASSWORD || 'aequitas_dev_password',
  database: process.env.DATABASE_NAME || 'aequitas_dev',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  synchronize: false, // ALWAYS false - use migrations instead
  logging: process.env.NODE_ENV === 'development',
  migrationsRun: false, // Don't auto-run migrations, do it explicitly
});
