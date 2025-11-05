# 026: Attendance & Engagement Tracking

**Status:** Draft
**Epic:** Analytics & Monitoring
**Priority:** P2
**Assigned To:** TBD
**Target Release:** v1.2

## 1. Overview

Automated attendance tracking and engagement metrics showing login frequency, time spent, interaction patterns, and activity levels.

## 2. Key Metrics

### Attendance
- Daily logins (presence tracking)
- Session duration
- Last active timestamp
- Login streaks
- Absence patterns

### Engagement
- Tasks viewed vs completed
- Time spent per task
- Interaction depth (clicks, scrolls, edits)
- Resource usage
- Chat participation

### Early Warning Indicators
- 3+ days without login → alert
- Declining session duration → flag
- Incomplete task pattern → notify therapist

## 3. Technical Requirements

```typescript
entity AttendanceRecord {
  id: UUID;
  studentId: UUID;
  date: Date;
  present: boolean;
  loginTime: Date;
  logoutTime: Date;
  sessionDuration: number; // minutes
}

entity EngagementMetric {
  id: UUID;
  studentId: UUID;
  date: Date;
  tasksViewed: number;
  tasksCompleted: number;
  totalTimeSpent: number; // minutes
  interactionScore: number; // 0-100
}
```

## 4. Dashboards

- Therapist: See all students' attendance
- Admin: School-wide engagement trends
- Parent: Child's weekly attendance summary

---

**Last Updated:** 2025-11-05
**Status:** Draft
