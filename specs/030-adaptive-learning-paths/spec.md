# 030: Adaptive Learning Paths Engine

**Status:** Draft
**Epic:** Personalized Learning
**Priority:** P1
**Assigned To:** TBD
**Target Release:** v1.2

## 1. Overview

An AI-powered adaptive learning path engine that dynamically adjusts content difficulty, sequencing, and pacing based on real-time student performance, engagement, and learning patterns. Creates personalized learning journeys that optimize for each student's unique needs and progress rate.

## 2. Problem Statement

**Current State:**
- One-size-fits-all learning sequences
- Students move at class pace, not their own
- No automatic adjustment for mastery/struggle
- Teachers manually track and adjust for each student
- Gaps in knowledge not systematically identified

**Desired State:**
- Dynamic learning paths that adapt in real-time
- Students progress when ready, review when needed
- Automatic difficulty adjustment based on performance
- Knowledge gap identification and remediation
- Predictive recommendations for next best learning step

**Impact if Not Addressed:**
- Students bored (too easy) or overwhelmed (too hard)
- Learning gaps compound over time
- Reduced motivation and engagement
- Inefficient use of learning time

## 3. Functional Requirements

### 3.1 Adaptive Path Generation

```gherkin
Given a student starts a new learning unit
When the system analyzes their profile
Then it creates a personalized path based on:
  - Current knowledge level (from assessments)
  - Learning condition (ADHD, dyslexia, etc.)
  - Past performance patterns
  - Learning pace (fast, moderate, slow)
  - Interests and preferences

Given a student completes a task successfully (>80%)
When the system evaluates performance
Then it:
  - Marks topic as mastered
  - Increases difficulty for next task
  - Unlocks advanced concepts
  - Reduces review frequency

Given a student struggles with a task (<50%)
When the system detects difficulty
Then it:
  - Adds prerequisite review
  - Decreases difficulty temporarily
  - Provides alternative explanations
  - Schedules more practice opportunities
  - Suggests multi-sensory content
```

### 3.2 Real-Time Path Adjustment

```gherkin
Given a student is on a learning path
When their performance changes mid-unit
Then the system:
  - Recalculates optimal next steps
  - Adjusts pacing (speed up or slow down)
  - Adds or removes practice exercises
  - Modifies assessment timing
  - Notifies therapist of significant changes

Given a student shows consistent mastery
When the system detects pattern
Then it:
  - Compresses remaining content
  - Introduces challenge problems
  - Unlocks enrichment materials
  - Accelerates to next unit
```

### 3.3 Knowledge Gap Detection

```gherkin
Given a student fails a task on advanced concept
When the system performs diagnostic
Then it:
  - Traces back to prerequisite concepts
  - Identifies specific knowledge gap
  - Creates remediation mini-path
  - Inserts targeted practice
  - Re-assesses after remediation

Given multiple students fail same concept
When the system detects pattern
Then it:
  - Flags content for review
  - Alerts therapist/teacher
  - Suggests alternative teaching approach
  - Generates different explanation versions
```

## 4. Technical Requirements

### 4.1 Database Schema

```typescript
interface LearningPath {
  id: string; // UUID
  studentId: string;
  subject: string;
  startDate: Date;
  estimatedCompletionDate: Date;
  currentNode: string; // Current position in path
  completionPercentage: number;
  difficultyLevel: number; // 1-10 scale
  adaptationCount: number; // Times path adjusted
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
}

interface PathNode {
  id: string; // UUID
  pathId: string;
  sequence: number;
  conceptId: string;
  difficulty: number;
  estimatedDuration: number; // minutes
  prerequisites: string[]; // Node IDs
  status: 'LOCKED' | 'UNLOCKED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
  masteryScore?: number; // 0-100
  attemptsCount: number;
  completedAt?: Date;
}

interface KnowledgeGap {
  id: string; // UUID
  studentId: string;
  conceptId: string;
  identifiedAt: Date;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  remediationPathId?: string;
  resolvedAt?: Date;
}

interface PathAdaptation {
  id: string; // UUID
  pathId: string;
  triggeredBy: string; // 'PERFORMANCE' | 'TIME' | 'ENGAGEMENT'
  changeDescription: string;
  previousDifficulty: number;
  newDifficulty: number;
  createdAt: Date;
}
```

### 4.2 Adaptive Algorithm

**Performance-Based Adjustment:**
- Track rolling average of last 5 tasks
- If avg > 85%: Increase difficulty by 1 level
- If avg < 50%: Decrease difficulty by 1 level
- If 3 consecutive failures: Insert remediation

**Time-Based Adjustment:**
- If task completed in <50% estimated time + correct: Accelerate
- If task takes >150% estimated time: Simplify next task
- If no progress in 7 days: Send reminder + adjust expectations

**Engagement-Based Adjustment:**
- Track interaction patterns (clicks, time on task)
- If disengagement detected: Insert break/gamified content
- If high engagement + low performance: Add scaffolding
- If low engagement + high performance: Add challenges

### 4.3 API Endpoints

```
GET /api/learning-paths/student/:studentId
POST /api/learning-paths/generate
GET /api/learning-paths/:pathId/next-node
POST /api/learning-paths/:pathId/complete-node
GET /api/learning-paths/:pathId/knowledge-gaps
GET /api/learning-paths/:pathId/adaptations
POST /api/learning-paths/:pathId/adjust
```

## 5. Success Metrics

- 60% faster concept mastery vs. fixed paths
- 40% reduction in knowledge gaps
- 80%+ students complete paths
- 70%+ student engagement maintained
- 50% reduction in therapist manual adjustments

## 6. Dependencies

- Student performance data (from task completions)
- Curriculum concept graph (prerequisites defined)
- AI recommendation engine
- Real-time analytics infrastructure

---

**Specification Last Updated:** 2025-11-05
