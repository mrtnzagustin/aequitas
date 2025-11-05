# 014: Real-time Collaboration & Shared Goals

**Status:** Draft
**Epic:** Collaboration
**Priority:** P2
**Assigned To:** TBD
**Target Release:** v1.2

## 1. Overview

Real-time collaboration features enabling therapists, teachers, and parents to co-create goals, share insights, and update student plans simultaneously using WebSockets.

## 2. Key Features

- Collaborative goal setting with live updates
- Shared student workspace (all stakeholders see changes)
- Real-time commenting on adaptations
- Presence indicators ("Teacher viewing profile")
- Conflict resolution (concurrent edits)

## 3. Technical Requirements

```typescript
// WebSocket events
event 'goal:updated' { studentId, goalId, updatedBy }
event 'note:added' { studentId, noteType, author }
event 'user:viewing' { studentId, userId, role }

// Collaborative editing
entity CollaborativeGoal {
  id: UUID;
  studentId: UUID;
  title: string;
  description: string;
  targetDate: Date;
  collaborators: UUID[]; // therapist, teacher, parent
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED';
  lastEditedBy: UUID;
  lastEditedAt: Date;
}
```

## 4. Technology Stack

- Socket.io for WebSockets
- Redis for presence tracking
- Operational Transform for conflict resolution

---

**Last Updated:** 2025-11-05
**Status:** Draft
