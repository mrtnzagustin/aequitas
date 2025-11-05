# 040: Smart Reminder System

**Status:** Draft
**Epic:** Student Engagement
**Priority:** P1
**Assigned To:** TBD
**Target Release:** v1.2

## 1. Overview

Intelligent reminder system that learns optimal reminder timing, frequency, and delivery methods for each student. Helps with executive function challenges by providing just-in-time prompts without causing notification fatigue.

## 2. Functional Requirements

```gherkin
Given a student has upcoming deadline
When the system calculates reminders
Then it sends:
  - First reminder: 3 days before (start planning)
  - Second reminder: 1 day before (final push)
  - Third reminder: 2 hours before (last chance)
  - Adjusted based on task complexity

Given a student ignores reminders
When pattern detected
Then the system:
  - Changes reminder time
  - Tries different delivery method
  - Increases urgency tone
  - Notifies therapist

Given a student responds well to reminders
When pattern detected
Then the system:
  - Continues successful pattern
  - Reduces frequency if possible
  - Maintains optimal timing
```

## 3. Technical Requirements

```typescript
interface ReminderRule {
  id: string; // UUID
  studentId: string;
  eventType: 'TASK_DUE' | 'MOOD_CHECKIN' | 'BREAK_TIME' | 'SESSION_START';
  advanceMinutes: number;
  deliveryMethod: 'PUSH' | 'EMAIL' | 'SMS' | 'IN_APP';
  tone: 'GENTLE' | 'NEUTRAL' | 'URGENT';
  effectiveness: number; // 0-100 based on response rate
}

interface ReminderDelivery {
  id: string; // UUID
  ruleId: string;
  studentId: string;
  sentAt: Date;
  deliveryMethod: string;
  opened: boolean;
  actedUpon: boolean;
  dismissed: boolean;
}
```

## 4. Success Metrics

- 70%+ reminder action rate
- 50% reduction in missed deadlines
- <10% reminder dismissal rate
- High student satisfaction

---

**Specification Last Updated:** 2025-11-05
