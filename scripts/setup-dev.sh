#!/bin/bash

# Aequitas Development Environment Setup Script
# This script sets up the entire development environment with test data

set -e  # Exit on error

echo "🚀 Aequitas Platform - Development Setup"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Helper functions
print_step() {
    echo -e "\n${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if Docker is running
print_step "Checking Docker..."
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi
print_success "Docker is running"

# Create .env files if they don't exist
print_step "Setting up environment files..."

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    print_success "Created backend/.env from .env.example"
else
    print_warning "backend/.env already exists, skipping"
fi

if [ ! -f frontend/.env.local ]; then
    if [ -f frontend/.env.example ]; then
        cp frontend/.env.example frontend/.env.local
        print_success "Created frontend/.env.local from .env.example"
    fi
else
    print_warning "frontend/.env.local already exists, skipping"
fi

# Stop any running containers
print_step "Stopping any running containers..."
docker-compose down > /dev/null 2>&1 || true
print_success "Containers stopped"

# Start PostgreSQL and Redis
print_step "Starting database and cache services..."
docker-compose up -d postgres redis

# Wait for PostgreSQL to be ready
print_step "Waiting for PostgreSQL to be ready..."
max_attempts=30
attempt=0
while ! docker-compose exec -T postgres pg_isready -U aequitas > /dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [ $attempt -eq $max_attempts ]; then
        print_error "PostgreSQL failed to start after $max_attempts attempts"
        exit 1
    fi
    echo -n "."
    sleep 1
done
echo ""
print_success "PostgreSQL is ready"

# Install backend dependencies if needed
print_step "Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
    print_success "Backend dependencies installed"
else
    print_warning "node_modules exists, skipping install (run 'npm install' manually if needed)"
fi

# Wait a bit for database to fully initialize
sleep 2

# Run database seeding
print_step "Populating database with test data..."
npm run seed
print_success "Database populated with test data"

cd ..

# Install frontend dependencies if needed
print_step "Installing frontend dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
    print_success "Frontend dependencies installed"
else
    print_warning "node_modules exists, skipping install (run 'npm install' manually if needed)"
fi
cd ..

# Start all services
print_step "Starting all services..."
docker-compose up -d

# Wait for backend to be ready
print_step "Waiting for backend to be ready..."
max_attempts=60
attempt=0
while ! curl -s http://localhost:3001/api > /dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [ $attempt -eq $max_attempts ]; then
        print_warning "Backend didn't respond after $max_attempts attempts, but containers are running"
        break
    fi
    echo -n "."
    sleep 1
done
echo ""

# Show final status
echo ""
echo "=========================================="
echo -e "${GREEN}✅ Setup complete!${NC}"
echo "=========================================="
echo ""
echo "📊 Services Status:"
docker-compose ps
echo ""
echo "🌐 Access URLs:"
echo "   • Frontend:  http://localhost:3000"
echo "   • Backend:   http://localhost:3001"
echo "   • API Docs:  http://localhost:3001/api"
echo ""
echo "🔑 Test Credentials:"
echo "   Email:    admin@aequitas.test"
echo "   Password: Test1234!"
echo ""
echo "📝 Useful Commands:"
echo "   • View logs:        docker-compose logs -f"
echo "   • Stop services:    docker-compose down"
echo "   • Restart services: docker-compose restart"
echo "   • Reset database:   cd backend && npm run db:reset"
echo ""
echo "🎉 Happy coding!"
echo ""
