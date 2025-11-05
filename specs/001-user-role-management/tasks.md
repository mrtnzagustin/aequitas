# Implementation Tasks: User & Role Management

## Phase 1: Database Schema & Core Entities

### Task 1.1: Create User Entity
- [ ] Define User interface in TypeScript
- [ ] Create User entity with TypeORM decorators
- [ ] Add UserRole and UserStatus enums
- [ ] Set up validation rules
- **Estimate**: 2 hours

### Task 1.2: Create UserInvitation Entity
- [ ] Define UserInvitation interface
- [ ] Create entity with TypeORM
- [ ] Add token generation logic
- [ ] Set up expiration handling (72 hours)
- **Estimate**: 1.5 hours

### Task 1.3: Create StudentAssignment Entity
- [ ] Define StudentAssignment interface
- [ ] Create relationship table entity
- [ ] Set up foreign key constraints
- **Estimate**: 1 hour

### Task 1.4: Database Migrations
- [ ] Create initial migration for all entities
- [ ] Add indexes on userId, studentId, email
- [ ] Test migrations up and down
- **Estimate**: 1.5 hours

## Phase 2: Authentication System

### Task 2.1: Password Hashing Service
- [ ] Create PasswordService with bcrypt
- [ ] Implement hash() method (cost factor 12)
- [ ] Implement compare() method
- [ ] Write unit tests
- **Estimate**: 2 hours

### Task 2.2: JWT Token Service
- [ ] Create JwtService wrapper
- [ ] Implement generateAccessToken()
- [ ] Implement generateRefreshToken()
- [ ] Implement verifyToken()
- [ ] Configure RS256 signing
- **Estimate**: 3 hours

### Task 2.3: Auth Service - Login
- [ ] Create AuthService
- [ ] Implement login() method
- [ ] Add credential validation
- [ ] Add user status check
- [ ] Return tokens on success
- [ ] Write unit tests
- **Estimate**: 4 hours

### Task 2.4: Auth Service - Token Refresh
- [ ] Implement refreshToken() method
- [ ] Validate refresh token
- [ ] Generate new token pair
- [ ] Write unit tests
- **Estimate**: 2 hours

### Task 2.5: Rate Limiting for Login
- [ ] Set up Redis connection
- [ ] Implement rate limiter (5 attempts per 10 min)
- [ ] Add rate limit decorator
- [ ] Test lockout behavior
- **Estimate**: 2 hours

## Phase 3: RBAC Implementation

### Task 3.1: Create Role Guards
- [ ] Create @Roles() decorator
- [ ] Implement RolesGuard
- [ ] Add role checking logic
- [ ] Write unit tests
- **Estimate**: 2 hours

### Task 3.2: Create JWT Auth Guard
- [ ] Implement JwtAuthGuard with Passport
- [ ] Create JWT strategy
- [ ] Add token validation
- [ ] Write unit tests
- **Estimate**: 3 hours

### Task 3.3: Permission Hierarchy Logic
- [ ] Define permission hierarchy (ADMIN > THERAPIST > TEACHER > PARENT)
- [ ] Create PermissionService
- [ ] Implement canAccess() method
- [ ] Write unit tests for all combinations
- **Estimate**: 3 hours

### Task 3.4: Entity-Level Permission Checks
- [ ] Add checkStudentAccess() to services
- [ ] Query StudentAssignment table
- [ ] Implement query filtering by user
- [ ] Write integration tests
- **Estimate**: 4 hours

## Phase 4: User Management (Admin Features)

### Task 4.1: User Invitation System
- [ ] Create UserService.inviteUser()
- [ ] Generate secure invitation token
- [ ] Set expiration date (72 hours)
- [ ] Send invitation email
- [ ] Write unit tests
- **Estimate**: 4 hours

### Task 4.2: User Registration
- [ ] Create acceptInvitation() endpoint
- [ ] Validate invitation token
- [ ] Check expiration
- [ ] Create user account
- [ ] Hash password
- [ ] Write integration tests
- **Estimate**: 3 hours

### Task 4.3: User CRUD Operations
- [ ] Implement UserService.findAll() with pagination
- [ ] Implement UserService.findOne()
- [ ] Implement UserService.update()
- [ ] Implement UserService.deactivate()
- [ ] Write unit tests for all methods
- **Estimate**: 4 hours

### Task 4.4: Student Assignment System
- [ ] Create assignUserToStudent() method
- [ ] Check assignment permissions
- [ ] Create StudentAssignment record
- [ ] Write unit tests
- **Estimate**: 2 hours

### Task 4.5: User API Endpoints
- [ ] POST /api/auth/login
- [ ] POST /api/auth/refresh
- [ ] POST /api/auth/logout
- [ ] GET /api/users (admin only)
- [ ] POST /api/users/invite (admin only)
- [ ] PATCH /api/users/:id (admin only)
- [ ] POST /api/students/:studentId/assign-user
- [ ] Write integration tests for all endpoints
- **Estimate**: 6 hours

## Phase 5: Frontend Implementation

### Task 5.1: Login Page
- [ ] Create login page component
- [ ] Add form validation (email, password)
- [ ] Implement login API call
- [ ] Handle errors (invalid credentials, rate limit)
- [ ] Add "Remember me" checkbox
- [ ] Add "Forgot password" link
- [ ] Write component tests
- **Estimate**: 6 hours

### Task 5.2: Admin User Management Panel
- [ ] Create user list component
- [ ] Add pagination controls
- [ ] Add search and filter functionality
- [ ] Create user table with actions
- [ ] Write component tests
- **Estimate**: 6 hours

### Task 5.3: User Invitation Modal
- [ ] Create invite user modal component
- [ ] Add form fields (email, name, role)
- [ ] Add validation
- [ ] Handle success/error states
- [ ] Write component tests
- **Estimate**: 4 hours

### Task 5.4: Role-Based Dashboard Routing
- [ ] Create dashboard routing logic
- [ ] Implement Therapist dashboard
- [ ] Implement Teacher dashboard
- [ ] Implement Parent dashboard
- [ ] Implement Admin dashboard
- [ ] Add route guards
- **Estimate**: 8 hours

### Task 5.5: Responsive UI
- [ ] Implement responsive layout for login
- [ ] Implement responsive layout for admin panel
- [ ] Test on mobile, tablet, desktop
- [ ] Fix any layout issues
- **Estimate**: 4 hours

## Phase 6: Audit Logging

### Task 6.1: Audit Log Entity
- [ ] Create AuditLog entity
- [ ] Define log event types enum
- [ ] Add indexes for query performance
- **Estimate**: 1.5 hours

### Task 6.2: Audit Logging Service
- [ ] Create AuditService
- [ ] Implement logEvent() method
- [ ] Add helper methods for common events
- [ ] Write unit tests
- **Estimate**: 2 hours

### Task 6.3: Integrate Audit Logging
- [ ] Log all login attempts
- [ ] Log password changes
- [ ] Log role changes
- [ ] Log failed authorization attempts
- [ ] Test logging in all scenarios
- **Estimate**: 3 hours

### Task 6.4: Audit Log Viewer (Admin)
- [ ] Create GET /api/audit-logs endpoint
- [ ] Add pagination and filtering
- [ ] Create frontend audit log viewer
- [ ] Write tests
- **Estimate**: 4 hours

## Phase 7: Testing & Security

### Task 7.1: Unit Tests
- [ ] Write tests for PasswordService
- [ ] Write tests for JwtService
- [ ] Write tests for AuthService
- [ ] Write tests for UserService
- [ ] Write tests for PermissionService
- [ ] Achieve >90% code coverage
- **Estimate**: 8 hours

### Task 7.2: Integration Tests
- [ ] Write tests for all auth endpoints
- [ ] Write tests for user management endpoints
- [ ] Write tests for RBAC enforcement
- [ ] Test rate limiting
- **Estimate**: 6 hours

### Task 7.3: E2E Tests
- [ ] Test admin invites user flow
- [ ] Test user registration flow
- [ ] Test RBAC enforcement flow
- [ ] Test user deactivation flow
- **Estimate**: 6 hours

### Task 7.4: Security Audit
- [ ] Run security linters
- [ ] Test for SQL injection
- [ ] Test for XSS vulnerabilities
- [ ] Test for CSRF attacks
- [ ] Test JWT security
- [ ] Fix any vulnerabilities found
- **Estimate**: 6 hours

### Task 7.5: Accessibility Tests
- [ ] Run aXe DevTools on all pages
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Fix any violations
- **Estimate**: 4 hours

### Task 7.6: Load Testing
- [ ] Set up load testing environment
- [ ] Test concurrent login attempts
- [ ] Test rate limiting under load
- [ ] Optimize if needed
- **Estimate**: 4 hours

## Phase 8: Documentation & Deployment

### Task 8.1: API Documentation
- [ ] Document all endpoints with Swagger
- [ ] Add request/response examples
- [ ] Document authentication flow
- [ ] Document RBAC rules
- **Estimate**: 4 hours

### Task 8.2: User Documentation
- [ ] Write admin user guide
- [ ] Write onboarding guide for new users
- [ ] Create FAQ section
- **Estimate**: 3 hours

### Task 8.3: README Updates
- [ ] Update setup instructions
- [ ] Add environment variable documentation
- [ ] Add deployment instructions
- **Estimate**: 2 hours

### Task 8.4: Deployment
- [ ] Configure staging environment
- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Conduct UAT
- [ ] Deploy to production
- **Estimate**: 6 hours

## Summary
**Total Estimated Hours**: ~120 hours
**Total Estimated Days**: ~25 days (assuming 5 hours productive work per day)

## Dependencies
- PostgreSQL and Redis must be running
- Email service must be configured
- Environment variables must be set

## Notes
- Tasks should be completed in order within each phase
- Each task should include tests before marking as complete
- Security tasks are non-negotiable and must be completed thoroughly
