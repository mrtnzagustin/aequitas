# 013: Parent Portal & Communication Hub

**Status:** Draft
**Epic:** User Roles & Communication
**Priority:** P1
**Assigned To:** TBD
**Target Release:** v1.1

## 1. Overview

Dedicated parent portal for viewing child progress, receiving updates, adding family observations, and communicating with therapists/teachers. Strengthens home-school collaboration.

## 2. Key Features

### Dashboard
- Child's weekly progress summary
- Upcoming tasks and deadlines
- Recent mood check-ins
- Celebration of achievements (badges earned)

### Communication
- Direct messaging with therapist
- Teacher announcements
- Meeting scheduler
- Document sharing (IEP, reports)

### Family Notes
- Add observations from home
- Log behavior patterns
- Share strategies that work
- Request support

### Progress Tracking
- Monthly progress reports (auto-generated)
- Skill development charts
- Goal completion status
- Attendance and engagement

## 3. Technical Requirements

```typescript
entity ParentMessage {
  id: UUID;
  parentId: UUID;
  recipientId: UUID; // therapist or teacher
  subject: string;
  content: string;
  read: boolean;
  sentAt: Date;
}

entity FamilyNote {
  id: UUID;
  studentId: UUID;
  parentId: UUID;
  category: 'BEHAVIOR' | 'HOMEWORK' | 'SOCIAL' | 'HEALTH';
  content: string;
  sharedWithTherapist: boolean;
  createdAt: Date;
}
```

## 4. API Endpoints

```
GET /api/parents/dashboard
POST /api/parents/messages
GET /api/parents/student/:studentId/progress
POST /api/parents/family-notes
GET /api/parents/reports/monthly
```

## 5. Success Metrics

- 75%+ parent weekly login rate
- 60% parent engagement (add family notes)
- 50% reduction in email communication
- Parent satisfaction >4.3/5

---

**Last Updated:** 2025-11-05
**Status:** Draft
