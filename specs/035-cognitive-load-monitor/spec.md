# 035: Cognitive Load Monitor

**Status:** Draft
**Epic:** AI-Powered Learning Support
**Priority:** P2
**Assigned To:** TBD
**Target Release:** v1.3

## 1. Overview

Real-time cognitive load monitoring that analyzes interaction patterns, task performance, and time-on-task to detect when students are reaching cognitive overload. Automatically adjusts content complexity and suggests breaks.

## 2. Problem Statement

**Current State:**
- No objective measure of cognitive load
- Students push past optimal learning threshold
- Overwhelm leads to shutdowns (especially ADHD/autism)
- Teachers can't monitor each student's mental state
- No data-driven content difficulty adjustment

**Desired State:**
- Real-time cognitive load estimation
- Automatic content simplification when overloaded
- Proactive break suggestions
- Optimal difficulty calibration
- Therapist alerts for concerning patterns

## 3. Functional Requirements

```gherkin
Given a student is working on a task
When the system monitors behavior
Then it tracks:
  - Time between interactions (clicks, typing)
  - Error rate and pattern
  - Task switching frequency
  - Re-reading count (scrolling back)
  - Help requests frequency
  - Micro-pauses duration

Given cognitive load exceeds 80%
When detected for >5 minutes
Then the system:
  - Simplifies current content
  - Breaks task into smaller steps
  - Suggests 10-minute break
  - Reduces visual clutter
  - Offers audio version instead

Given cognitive load patterns identified
When therapist reviews
Then they see:
  - Times of day with highest load
  - Subjects causing most strain
  - Optimal session length
  - Recommended accommodations
```

## 4. Technical Requirements

```typescript
interface CognitiveLoadMeasurement {
  id: string; // UUID
  studentId: string;
  taskId: string;
  timestamp: Date;
  loadScore: number; // 0-100
  indicators: {
    interactionPace: number;
    errorRate: number;
    taskSwitches: number;
    reReadingCount: number;
    helpRequests: number;
    microPauses: number;
  };
  interventionTriggered?: string;
}

interface LoadPattern {
  id: string; // UUID
  studentId: string;
  subject: string;
  averageLoad: number;
  peakLoadTime: string;
  optimalSessionLength: number;
  overloadTriggers: string[];
  effectiveInterventions: string[];
  updatedAt: Date;
}
```

## 5. Success Metrics

- 40% reduction in cognitive overload incidents
- 30% fewer task abandonment
- 50% better optimal session length calibration
- 75% accuracy in load prediction

---

**Specification Last Updated:** 2025-11-05
