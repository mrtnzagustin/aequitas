-- Aequitas Platform - PostgreSQL Initialization Script
-- This script runs automatically when the PostgreSQL container is first created
-- It sets up the necessary extensions for the platform

-- Enable UUID generation (required for PrimaryGeneratedColumn('uuid'))
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgvector for vector embeddings (AI/RAG features)
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable pg_trgm for trigram-based text search (useful for fuzzy search)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Enable btree_gin for composite indexes (performance optimization)
CREATE EXTENSION IF NOT EXISTS btree_gin;

-- Enable btree_gist for exclusion constraints and range types
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Create a schema for the application if needed
-- (TypeORM will use the public schema by default)
-- CREATE SCHEMA IF NOT EXISTS aequitas;

-- Grant privileges to the aequitas user
GRANT ALL PRIVILEGES ON DATABASE aequitas_dev TO aequitas;

-- Display installed extensions for verification
SELECT extname, extversion FROM pg_extension WHERE extname IN ('uuid-ossp', 'vector', 'pg_trgm', 'btree_gin', 'btree_gist');

-- Log successful initialization
DO $$
BEGIN
  RAISE NOTICE 'Aequitas database initialized successfully';
  RAISE NOTICE 'Extensions: uuid-ossp, vector, pg_trgm, btree_gin, btree_gist';
END $$;
