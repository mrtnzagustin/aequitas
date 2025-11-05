# 001: User & Role Management

**Status:** Draft
**Epic:** Platform Administration
**Priority:** P0
**Assigned To:** TBD
**Target Release:** v1.0 (MVP)

## 1. Overview

The User & Role Management feature establishes the foundation for secure access control across the Aequitas platform. This feature implements a Role-Based Access Control (RBAC) system that ensures different users (Therapists, Teachers, Parents, Admins) have appropriate access to sensitive student data based on their responsibilities and relationships with students.

This is a foundational feature that must be implemented first, as all other features depend on proper user authentication and authorization.

## 2. Problem Statement

**Current State:**
In traditional educational and therapeutic settings, student information is scattered across notebooks, emails, and different systems with inconsistent access controls. There is no unified system for managing who can view or modify sensitive therapeutic notes, academic records, and family observations.

**Desired State:**
A centralized platform where user access is strictly controlled based on their role and relationship to each student. Therapists can access therapeutic notes, Teachers can view academic information, Parents have limited access to non-sensitive data, and Admins can manage the entire system.

**Impact if Not Addressed:**
Without proper RBAC, the platform would violate privacy laws, expose sensitive Personal Health Information (PHI), and create liability for schools and therapeutic practices. This would make the platform legally unusable.

## 3. User Personas

### Admin (School Administrator)
- **Needs:** Create user accounts, assign roles, manage student rosters, deactivate users, monitor system usage
- **Workflow:** Admin logs in → Accesses "User Management" panel → Invites users via email → Assigns roles → Sets permissions

### Therapist (Psycho-pedagogue)
- **Needs:** Full access to assigned students' therapeutic notes, view academic and family notes, manage student profiles
- **Workflow:** Therapist logs in → Sees list of assigned students → Selects student → Views all note types → Can edit therapeutic notes

### Teacher
- **Needs:** Access to students in their classes, view academic history, add academic notes, cannot see therapeutic notes
- **Workflow:** Teacher logs in → Sees students in their classes → Selects student → Views academic notes and family notes → Adds academic observations

### Parent
- **Needs:** View their child's progress (non-sensitive), add family notes, view approved adaptations, cannot see therapeutic notes
- **Workflow:** Parent logs in → Sees their child's profile → Views academic progress and family notes → Adds observations from home

## 4. Functional Requirements

### 4.1 Core Behaviors

#### Authentication

```gherkin
Given an unregistered user visits the login page
When they attempt to log in
Then they should be denied access and shown "Invalid credentials"

Given a registered user enters correct credentials
When they submit the login form
Then they should be authenticated and redirected to their dashboard

Given an authenticated user is inactive for 30 minutes
When they attempt any action
Then they should be logged out and redirected to login page
```

#### User Creation (Admin Only)

```gherkin
Given an Admin is logged in
When they access the "User Management" panel
Then they should see a list of all users with their roles

Given an Admin is on the "User Management" panel
When they click "Invite New User"
Then they should see a form to enter email, name, and role

Given an Admin submits a user invitation with valid data
When the invitation is sent
Then the new user receives an email with a secure registration link
And the link expires after 72 hours

Given a new user clicks a valid registration link
When they set their password and complete registration
Then they can log in with their new credentials
```

#### Role Assignment

```gherkin
Given an Admin is editing a user
When they select a role from the dropdown (Therapist, Teacher, Parent, Admin)
Then the user's permissions are updated immediately
And the change is logged in the audit trail

Given a non-Admin user is logged in
When they try to access the "User Management" panel
Then they should see a "403 Forbidden" error
```

#### Student Assignment

```gherkin
Given an Admin or Therapist is managing a student
When they assign a Teacher to that student
Then the Teacher can now see that student in their dashboard

Given a Teacher is assigned to a student
When they view the student's profile
Then they can see Academic Notes and Family Notes tabs
But they cannot see Therapeutic Notes tab

Given a Parent is linked to their child's profile
When they view the profile
Then they can see Academic Notes and Family Notes tabs
But they cannot see Therapeutic Notes tab
```

#### Profile Viewing (RBAC in Action)

```gherkin
Given a Therapist is viewing a student profile
When they navigate to the notes section
Then they should see tabs for "Therapeutic Notes," "Academic Notes," and "Family Notes"
And all tabs are accessible

Given a Teacher is viewing the same student profile
When they navigate to the notes section
Then they should see tabs for "Academic Notes" and "Family Notes"
And "Therapeutic Notes" tab is not visible

Given a Parent is viewing their child's profile
When they navigate to the notes section
Then they should see tabs for "Academic Notes" and "Family Notes"
And "Therapeutic Notes" tab is not visible
And some fields may be redacted based on privacy settings
```

#### User Deactivation

```gherkin
Given an Admin is viewing a user
When they click "Deactivate User"
Then the user is immediately logged out
And they cannot log in again until reactivated
And their audit trail is preserved

Given a deactivated user tries to log in
When they submit their credentials
Then they see "Account deactivated. Contact your administrator."
```

### 4.2 User Interface

#### Login Page
- Email input (with validation)
- Password input (masked, with "Show password" toggle)
- "Remember me" checkbox
- "Forgot password?" link
- "Sign in" button
- Error messages displayed inline
- Support for password managers

#### Admin: User Management Panel
**Layout:**
- Header: "User Management"
- Search bar (search by name or email)
- Filter dropdowns (Role, Status)
- "Invite New User" button (primary action)
- Table:
  - Columns: Name, Email, Role, Status, Last Login, Actions
  - Actions: Edit, Deactivate/Activate, View Audit Log
- Pagination (50 users per page)

**Invite User Modal:**
- Email input (required, validated)
- First name input (required)
- Last name input (required)
- Role dropdown (required): Therapist, Teacher, Parent, Admin
- "Send Invitation" button
- "Cancel" button
- Success message: "Invitation sent to {email}"

#### Role-Based Dashboard
**Therapist Dashboard:**
- Sidebar: List of assigned students
- Main area: Student details, notes tabs, adaptation history

**Teacher Dashboard:**
- Dropdown: Select class
- Grid: Students in selected class
- Main area: Student details, academic notes, task adaptations

**Parent Dashboard:**
- Header: Child's name and profile photo
- Main area: Progress overview, family notes, upcoming tasks

**Admin Dashboard:**
- System metrics: Total users, active students, recent activity
- Quick actions: Invite user, Create student profile
- Recent audit logs

### 4.3 Data Model

#### User Entity
```typescript
interface User {
  id: string; // UUID
  email: string; // Unique, validated
  firstName: string;
  lastName: string;
  role: UserRole; // Enum: ADMIN, THERAPIST, TEACHER, PARENT
  status: UserStatus; // Enum: ACTIVE, INACTIVE, PENDING
  locale: string; // Default: 'es-AR'
  passwordHash: string; // bcrypt hashed
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID of creator
}

enum UserRole {
  ADMIN = 'ADMIN',
  THERAPIST = 'THERAPIST',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT',
}

enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
}
```

#### UserInvitation Entity
```typescript
interface UserInvitation {
  id: string; // UUID
  email: string;
  token: string; // Secure random token
  role: UserRole;
  invitedBy: string; // User ID of admin
  expiresAt: Date; // 72 hours from creation
  acceptedAt: Date | null;
  createdAt: Date;
}
```

#### StudentAssignment Entity (Relationship Table)
```typescript
interface StudentAssignment {
  id: string; // UUID
  userId: string; // User ID
  studentId: string; // Student ID
  assignedBy: string; // User ID of assigner
  assignedAt: Date;
}
```

#### Relationships
- User → StudentAssignment: One-to-many
- Student → StudentAssignment: One-to-many
- Therapist can be assigned to any student
- Teacher can be assigned to students in their classes
- Parent is automatically assigned to their child

### 4.4 Business Logic

#### Password Requirements
- Minimum 12 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Cannot be the same as the last 3 passwords
- Password strength indicator shown during registration

#### Session Management
- JWT tokens with 30-minute expiration
- Refresh tokens stored in httpOnly cookie (7-day expiration)
- Token includes: user ID, role, email, issued at, expires at
- Token refresh happens automatically when user is active

#### Permission Hierarchy
```
ADMIN > THERAPIST > TEACHER > PARENT

ADMIN:
- Full system access
- Manage all users
- Manage all students
- View all notes

THERAPIST:
- Manage assigned students
- View/edit therapeutic notes
- View academic and family notes
- Assign teachers to students

TEACHER:
- View assigned students
- View/edit academic notes
- View family notes
- Cannot view therapeutic notes
- Upload tasks for adaptation

PARENT:
- View own child only
- View academic notes (public fields)
- View/edit family notes
- Cannot view therapeutic notes
- Cannot view sensitive academic data
```

#### RBAC Implementation Strategy
- Decorator-based guards in NestJS
- Guards check JWT token role
- Service layer performs entity-level permission checks
- Database queries filter by user assignments
- Audit log records all access attempts

## 5. Non-Functional Requirements

### 5.1 Security & Privacy

#### Authentication
- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens signed with RS256 (asymmetric keys)
- Private keys stored in environment variables
- HTTPS required for all connections
- CSRF protection enabled

#### Authorization (RBAC)
- Every endpoint requires authentication (except login/registration)
- Role checked at controller level via `@Roles()` decorator
- Entity-level permission checks at service level
- Database queries use row-level security (RLS) where possible
- Failed authorization attempts logged

#### Audit Logging
All authentication and authorization events must be logged:
- User login attempts (success and failure)
- User logout
- Password changes
- Role changes
- Student assignment changes
- Failed permission checks

Log format:
```json
{
  "timestamp": "2025-11-05T14:30:00Z",
  "eventType": "USER_LOGIN",
  "userId": "uuid",
  "email": "user@example.com",
  "role": "THERAPIST",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "result": "SUCCESS",
  "metadata": {}
}
```

#### Compliance
- GDPR-compliant data export (users can request their data)
- Data deletion on user deactivation (with retention policy)
- Consent tracking for data collection
- Privacy policy link on login page
- Cookie consent banner

### 5.2 Performance

- User login: < 1 second (95th percentile)
- Dashboard load: < 2 seconds (95th percentile)
- User list (Admin panel): < 500ms for 1000 users
- JWT token validation: < 10ms
- Password hashing: Acceptable delay of 200-500ms for security

### 5.3 Internationalization

#### UI Strings
All strings in locale files:
```json
// i18n/locales/es/auth.json
{
  "login": {
    "title": "Iniciar Sesión",
    "email": "Correo Electrónico",
    "password": "Contraseña",
    "rememberMe": "Recordarme",
    "forgotPassword": "¿Olvidaste tu contraseña?",
    "signIn": "Ingresar",
    "errors": {
      "invalidCredentials": "Credenciales inválidas",
      "accountDeactivated": "Cuenta desactivada. Contacte al administrador."
    }
  },
  "userManagement": {
    "title": "Gestión de Usuarios",
    "inviteUser": "Invitar Usuario",
    "roles": {
      "ADMIN": "Administrador",
      "THERAPIST": "Psicopedagogo",
      "TEACHER": "Docente",
      "PARENT": "Padre/Madre"
    }
  }
}
```

### 5.4 Accessibility

- Login form fully keyboard navigable
- ARIA labels on all form fields
- Error messages announced to screen readers
- Focus indicators on all interactive elements
- Password strength meter screen-reader accessible
- Color not the only indicator of status (icons + color)

## 6. API Specifications

### 6.1 Authentication Endpoints

#### POST /api/auth/login
Authenticate a user and return JWT tokens.

**Request:**
```json
{
  "email": "therapist@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "therapist@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "THERAPIST",
    "locale": "es-AR"
  },
  "accessToken": "eyJhbGciOiJSUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJSUzI1NiIs..."
}
```

**Response (401):**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

#### POST /api/auth/refresh
Refresh an expired access token using a refresh token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJSUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJSUzI1NiIs..."
}
```

#### POST /api/auth/logout
Invalidate refresh token and log out user.

**Request:** (Authenticated)
```json
{
  "refreshToken": "eyJhbGciOiJSUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

### 6.2 User Management Endpoints (Admin Only)

#### GET /api/users
List all users with pagination and filtering.

**Auth:** Required (Admin only)

**Query Params:**
- `page` (number, default: 1)
- `limit` (number, default: 50)
- `role` (UserRole, optional)
- `status` (UserStatus, optional)
- `search` (string, optional) - searches name and email

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "María",
      "lastName": "González",
      "role": "TEACHER",
      "status": "ACTIVE",
      "lastLoginAt": "2025-11-05T10:30:00Z",
      "createdAt": "2025-10-01T08:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 150
  }
}
```

#### POST /api/users/invite
Invite a new user to the platform.

**Auth:** Required (Admin only)

**Request:**
```json
{
  "email": "newuser@example.com",
  "firstName": "Carlos",
  "lastName": "Rodríguez",
  "role": "TEACHER"
}
```

**Response (201):**
```json
{
  "message": "Invitation sent successfully",
  "invitation": {
    "id": "uuid",
    "email": "newuser@example.com",
    "role": "TEACHER",
    "expiresAt": "2025-11-08T14:30:00Z"
  }
}
```

**Response (400):**
```json
{
  "statusCode": 400,
  "message": "User with this email already exists",
  "error": "Bad Request"
}
```

#### PATCH /api/users/:id
Update a user's details (name, role, status).

**Auth:** Required (Admin only)

**Request:**
```json
{
  "role": "THERAPIST",
  "status": "INACTIVE"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "María",
  "lastName": "González",
  "role": "THERAPIST",
  "status": "INACTIVE",
  "updatedAt": "2025-11-05T14:45:00Z"
}
```

#### POST /api/students/:studentId/assign-user
Assign a user (Teacher, Therapist) to a student.

**Auth:** Required (Admin or Therapist)

**Request:**
```json
{
  "userId": "uuid"
}
```

**Response (201):**
```json
{
  "message": "User assigned successfully",
  "assignment": {
    "id": "uuid",
    "userId": "uuid",
    "studentId": "uuid",
    "assignedBy": "uuid",
    "assignedAt": "2025-11-05T14:50:00Z"
  }
}
```

## 7. Edge Cases & Error Handling

### Invalid Login Attempts
- **Scenario:** User enters wrong password 5 times in 10 minutes
- **Detection:** Track failed attempts per email in Redis
- **Error Message:** "Too many failed login attempts. Please try again in 15 minutes."
- **Recovery:** Temporary IP-based rate limit (15 min lockout)

### Expired Invitation
- **Scenario:** User clicks registration link after 72 hours
- **Detection:** Check `expiresAt` timestamp in database
- **Error Message:** "This invitation has expired. Please request a new one from your administrator."
- **Recovery:** Admin can resend invitation

### Concurrent Role Change
- **Scenario:** Admin changes user role while user is logged in
- **Detection:** JWT token contains old role
- **Error Message:** "Your permissions have changed. Please log in again."
- **Recovery:** Force logout on next request, user re-authenticates

### User Deactivated Mid-Session
- **Scenario:** Admin deactivates user while they're actively using the platform
- **Detection:** Check user status on each authenticated request
- **Error Message:** "Your account has been deactivated. Contact your administrator."
- **Recovery:** Immediate logout, refresh token invalidated

### Missing Student Assignment
- **Scenario:** Teacher tries to view a student they're not assigned to
- **Detection:** Service layer checks StudentAssignment table
- **Error Message:** "You do not have permission to view this student."
- **Recovery:** Redirect to dashboard, log failed access attempt

## 8. Testing Strategy

### 8.1 Unit Tests

**Services:**
- `AuthService.login()` - valid credentials, invalid credentials, inactive user
- `AuthService.refreshToken()` - valid token, expired token, invalid token
- `UserService.createInvitation()` - valid data, duplicate email, invalid role
- `UserService.updateUser()` - valid update, invalid role, non-existent user
- `RbacService.canAccess()` - various role/resource combinations

**Guards:**
- `JwtAuthGuard` - valid token, expired token, missing token
- `RolesGuard` - allowed role, disallowed role, no role decorator

### 8.2 Integration Tests

**API Endpoints:**
- `POST /api/auth/login` - successful login, failed login, rate limiting
- `POST /api/auth/refresh` - token refresh flow
- `GET /api/users` - pagination, filtering, search, unauthorized access
- `POST /api/users/invite` - successful invitation, duplicate email
- `PATCH /api/users/:id` - role change, status change, unauthorized update

### 8.3 E2E Tests

**Critical Flows:**
1. **Admin invites a Teacher:**
   - Admin logs in
   - Navigates to User Management
   - Clicks "Invite User"
   - Fills form with Teacher details
   - Submits
   - Verifies success message
   - Teacher receives invitation email

2. **Teacher registers and logs in:**
   - Teacher clicks invitation link
   - Sets password
   - Completes registration
   - Logs in with new credentials
   - Sees Teacher dashboard

3. **RBAC enforcement:**
   - Teacher logs in
   - Tries to access User Management (should be denied)
   - Views assigned student (should succeed)
   - Tries to view unassigned student (should be denied)
   - Tries to view Therapeutic Notes (should not see tab)

4. **Admin deactivates user:**
   - Admin logs in
   - Selects a Teacher
   - Clicks "Deactivate"
   - Teacher is immediately logged out (if online)
   - Teacher cannot log in again

### 8.4 Accessibility Tests

- Run aXe DevTools on Login page (0 violations)
- Run aXe DevTools on User Management panel (0 violations)
- Keyboard navigation test (all features accessible via keyboard)
- Screen reader test (VoiceOver/NVDA) - all forms and errors announced

## 9. Success Metrics

### Quantitative
- 100% of users onboarded within 2 days of invitation
- < 1% failed login attempts due to forgotten passwords (within first month)
- 0 unauthorized access incidents
- 0 RBAC bypass incidents
- Average login time < 1 second

### Qualitative
- User feedback: "Login process is simple and secure"
- Admin feedback: "User management is straightforward"
- No complaints about incorrect permissions or access issues

## 10. Dependencies

### Required Infrastructure
- PostgreSQL database for user and assignment storage
- Redis for rate limiting and session management
- SMTP server for sending invitation emails
- Environment variables for JWT keys

### Required Libraries
- NestJS: `@nestjs/passport`, `@nestjs/jwt`, `@nestjs/typeorm`
- Password hashing: `bcrypt`
- Validation: `class-validator`, `class-transformer`
- JWT: `jsonwebtoken`

### Third-Party Services
- Email service (SendGrid, AWS SES, or similar)

## 11. Open Questions

1. **Password Recovery:** Should password reset be email-based or Admin-initiated?
   - **Decision needed by:** Pre-implementation
   - **Assumption:** Email-based with secure token

2. **Multi-Factor Authentication (MFA):** Should MFA be required for Admins or all users?
   - **Decision needed by:** Post-MVP (Phase 2)
   - **Assumption:** Not required for MVP

3. **SSO Integration:** Should we support SSO (Google, Microsoft) for schools?
   - **Decision needed by:** Post-MVP (Phase 2)
   - **Assumption:** Not required for MVP

4. **Session Timeout:** Should the timeout be configurable per organization?
   - **Decision needed by:** Pre-implementation
   - **Assumption:** Fixed 30-minute timeout for MVP

## 12. Future Enhancements

### Phase 2
- Multi-Factor Authentication (MFA) for Admin accounts
- Single Sign-On (SSO) integration (Google, Microsoft)
- Configurable session timeout per organization
- Advanced audit log filtering and export
- User activity dashboard (for Admins)

### Phase 3
- API keys for third-party integrations
- Webhook support for user events
- Custom roles with granular permissions
- LDAP/Active Directory integration
- Mobile app authentication (OAuth 2.0)

---

**Specification Last Updated:** 2025-11-05
**Next Review:** 2025-12-05
