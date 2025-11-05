# 010: Gamification & Progress Rewards System

**Status:** Draft
**Epic:** Student Engagement
**Priority:** P1
**Assigned To:** TBD
**Target Release:** v1.1

## 1. Overview

Gamification system with points, badges, streaks, and rewards to increase student motivation and engagement. Especially effective for students with ADHD who benefit from immediate feedback and short-term goals.

## 2. Problem Statement

**Current State:**
- No visible progress indicators for students
- Lack of immediate positive reinforcement
- Students with ADHD struggle with long-term motivation
- No celebration of small wins
- Engagement drops over time

**Desired State:**
- Points earned for completing tasks
- Badges for achievements and milestones
- Daily streaks for consistent check-ins
- Leaderboard (optional, per-therapist setting)
- Redeemable rewards (therapist-defined)
- Visual progress indicators everywhere

**Impact if Not Addressed:**
- Low student engagement
- Reduced platform usage
- Poor task completion rates

## 3. Functional Requirements

### 3.1 Points System

```gherkin
Given a student completes a task
When they submit it
Then they earn points based on:
  - Task difficulty (Easy: 10, Medium: 20, Hard: 30)
  - First attempt success (+bonus 5)
  - Speed (under estimated time: +bonus 5)
And they see "+20 points!" animation

Given a student checks in mood
When they submit
Then they earn 5 points
And see "🔥 3-day streak!" if consecutive

Given a student views their profile
When they load dashboard
Then they see:
  - Total points lifetime
  - Points this week
  - Points to next level
  - Progress bar to next badge
```

### 3.2 Badges & Achievements

```gherkin
Given a student reaches milestone
When condition is met
Then they unlock badge:
  - "First Steps" - Complete first task
  - "Consistency King" - 7-day streak
  - "Challenge Accepted" - 5 hard tasks
  - "Mood Master" - 30 mood check-ins
  - "Speedster" - Complete task in <50% time
  - "Perfectionist" - 10 tasks, 100% accuracy
  - Custom badges (therapist-created)

Given a student unlocks badge
When achievement triggers
Then they see:
  - Celebration animation
  - Badge details modal
  - Share option (to parent)
```

### 3.3 Rewards Store

```gherkin
Given a therapist configures rewards
When they access "Rewards" settings
Then they can create:
  - Virtual rewards (avatars, themes: 50-200 points)
  - Real rewards (extra recess, pick activity: 500+ points)
  - Privileges (skip homework, choose seat: 1000 points)

Given a student has enough points
When they visit "Rewards Store"
Then they see available rewards
And can "purchase" with points
And therapist gets notification to approve/fulfill
```

### 3.4 Leaderboard (Optional)

```gherkin
Given a therapist enables leaderboard
When students view it
Then they see:
  - Top 10 students this week
  - Only first names + avatar
  - Points earned this period
  - Anonymized option (Student A, B, C)

Given a therapist disables leaderboard
When students view dashboard
Then leaderboard section is hidden
And competition focus shifts to personal goals
```

## 4. Technical Requirements

### 4.1 Database Schema

```typescript
entity StudentPoints {
  id: UUID;
  studentId: UUID;
  totalPoints: number;
  weeklyPoints: number;
  level: number; // 1-100
  createdAt: Date;
  updatedAt: Date;
}

entity PointTransaction {
  id: UUID;
  studentId: UUID;
  points: number; // positive or negative
  reason: string; // "Task completed", "Mood check-in"
  relatedEntity: string; // taskId, moodCheckInId
  createdAt: Date;
}

entity Badge {
  id: UUID;
  name: string;
  description: string;
  icon: string;
  criteria: JSON; // { type: 'streak', count: 7 }
  pointValue: number;
}

entity StudentBadge {
  id: UUID;
  studentId: UUID;
  badgeId: UUID;
  earnedAt: Date;
}

entity Reward {
  id: UUID;
  therapistId: UUID;
  name: string;
  description: string;
  pointCost: number;
  type: 'VIRTUAL' | 'REAL' | 'PRIVILEGE';
  quantityAvailable: number;
  active: boolean;
}

entity RewardRedemption {
  id: UUID;
  studentId: UUID;
  rewardId: UUID;
  pointsSpent: number;
  status: 'PENDING' | 'APPROVED' | 'FULFILLED' | 'DENIED';
  redeemedAt: Date;
}
```

### 4.2 API Endpoints

```
GET /api/gamification/student/:studentId/points
GET /api/gamification/student/:studentId/badges
POST /api/gamification/award-points
GET /api/gamification/leaderboard
GET /api/gamification/rewards
POST /api/gamification/redeem-reward
GET /api/gamification/badges/available
```

### 4.3 Frontend Components

- `PointsWidget.tsx` - Shows current points
- `BadgeGallery.tsx` - Earned + available badges
- `RewardsStore.tsx` - Browse and redeem
- `Leaderboard.tsx` - Competition view
- `CelebrationAnimation.tsx` - Badge unlock animation

## 5. Success Metrics

- 50% increase in task completion rate
- 70%+ daily active users
- Student satisfaction score >4.5/5
- Average session time +40%

## 6. References

- Research: Gamification for ADHD students
- Design: Duolingo, Kahoot gamification patterns
- Constitution: Student-centric design

---

**Last Updated:** 2025-11-05
**Status:** Draft - Ready for implementation
