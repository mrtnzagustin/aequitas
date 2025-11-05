# 025: Student Self-Assessment Tools

**Status:** Draft
**Epic:** Student Empowerment
**Priority:** P2
**Assigned To:** TBD
**Target Release:** v1.2

## 1. Overview

Tools for students to reflect on learning, assess understanding, and set personal goals. Promotes metacognition and self-directed learning.

## 2. Key Features

### Self-Assessment After Tasks
- "How confident do you feel? (1-5 stars)"
- "What was hardest about this?"
- "What strategy helped you most?"
- "Would you like this easier/harder next time?"

### Goal Setting
- Student-created goals ("Read 5 pages daily")
- Progress tracking
- Visual goal completion
- Celebration when achieved

### Reflection Journal
- Weekly reflection prompts
- "What did you learn this week?"
- "What are you proud of?"
- "What do you want help with?"
- Private to student or shared with therapist

### Learning Preferences
- "I learn best with: visuals / audio / hands-on"
- "I prefer tasks that are: short / long"
- Preferences inform AI adaptation

## 3. Technical Requirements

```typescript
entity SelfAssessment {
  id: UUID;
  studentId: UUID;
  taskId: UUID;
  confidence: number; // 1-5
  difficulty: 'TOO_EASY' | 'JUST_RIGHT' | 'TOO_HARD';
  strategies: string[]; // What helped
  createdAt: Date;
}

entity StudentGoal {
  id: UUID;
  studentId: UUID;
  title: string;
  description: string;
  targetDate: Date;
  progress: number; // 0-100%
  status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
}
```

---

**Last Updated:** 2025-11-05
**Status:** Draft
