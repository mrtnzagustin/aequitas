# 045: Focus Mode & Distraction Blocker

**Status:** Implemented
**Epic:** Student Engagement
**Priority:** P1
**Assigned To:** TBD
**Target Release:** v1.2

## 1. Overview

Dedicated focus mode that eliminates distractions, blocks notifications, simplifies the interface, and creates an optimal environment for deep work. Essential for students with ADHD who struggle with focus and impulse control.

## 2. Functional Requirements

```gherkin
Given a student starts a task
When they enable focus mode
Then the system:
  - Hides all non-essential UI elements
  - Blocks notifications
  - Disables social feed
  - Shows only current task
  - Starts pomodoro timer (25 min default)
  - Plays focus sounds (optional)
  - Grays out navigation

Given focus session in progress
When timer ends
Then the system:
  - Announces break time
  - Shows accomplishments
  - Awards points
  - Suggests 5-minute break
  - Offers to continue or end session

Given distraction detected (tab switch, prolonged inactivity)
When system notices
Then it:
  - Gentle notification: "Stay focused!"
  - Logs distraction event
  - Offers to adjust environment
  - Suggests shorter session if pattern

Given therapist views focus data
When they analyze patterns
Then they see:
  - Average focus session length
  - Distraction frequency
  - Optimal time of day
  - Environment effectiveness
  - Improvement over time
```

## 3. Technical Requirements

```typescript
interface FocusSession {
  id: string; // UUID
  studentId: string;
  taskId?: string;
  startedAt: Date;
  endedAt?: Date;
  plannedDuration: number; // minutes
  actualDuration: number; // minutes
  distractionsCount: number;
  completedSuccessfully: boolean;
  focusScore: number; // 0-100
  environmentSettings: {
    soundscapeId?: string;
    timerDuration: number;
    strictMode: boolean;
  };
}

interface DistractionEvent {
  id: string; // UUID
  sessionId: string;
  timestamp: Date;
  type: 'TAB_SWITCH' | 'PROLONGED_INACTIVITY' | 'WINDOW_BLUR' | 'NOTIFICATION_CHECK';
  duration: number; // seconds
}
```

## 4. Success Metrics

- 65%+ students use focus mode weekly
- 50% increase in uninterrupted work time
- 40% reduction in task switching
- 70% completion rate for focus sessions

---

**Specification Last Updated:** 2025-11-05
