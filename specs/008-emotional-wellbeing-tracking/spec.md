# 008: Student Emotional Wellbeing Tracking (SEL)

**Status:** Draft
**Epic:** Social-Emotional Learning
**Priority:** P1
**Assigned To:** TBD
**Target Release:** v1.1

## 1. Overview

Social-Emotional Learning (SEL) integration that tracks student emotional wellbeing, mood patterns, and engagement levels. This feature helps identify emotional challenges early and provides counseling resources, essential for students with ADHD, anxiety, and learning disabilities.

## 2. Problem Statement

**Current State:**
- No visibility into student emotional state
- Mental health issues detected too late
- No data-driven interventions for emotional support
- Therapists lack emotional trend data

**Desired State:**
- Daily mood tracking with simple UI
- Pattern recognition for emotional challenges
- Early alerts for concerning trends
- Integration with therapeutic notes
- Mood correlation with academic performance

**Impact if Not Addressed:**
- Missed opportunities for early intervention
- Student disengagement going unnoticed
- Incomplete therapeutic profiles

## 3. Functional Requirements

### 3.1 Mood Check-ins

```gherkin
Given a student logs into the platform
When they see their dashboard
Then they should see a "How are you feeling today?" widget
And can select from: Happy, Okay, Sad, Anxious, Frustrated, Energetic

Given a student selects a mood
When they submit
Then the system saves mood with timestamp
And optionally prompts "Want to tell us more?" for text input
And shows motivational message based on mood

Given a student hasn't checked in today
When a therapist views their profile
Then they see "No check-in today" status
```

### 3.2 Mood Trends & Analytics

```gherkin
Given a therapist views a student's profile
When they navigate to "Wellbeing" tab
Then they see:
  - 7-day mood chart (line graph)
  - 30-day mood distribution (pie chart)
  - Mood patterns by day of week
  - Correlation with task performance

Given mood data shows concerning pattern (3+ sad/anxious days)
When the system detects this
Then it sends alert to assigned therapist
And suggests check-in session
```

### 3.3 Wellbeing Resources

```gherkin
Given a student selects "Anxious" or "Sad"
When they submit mood
Then the system shows:
  - Breathing exercise widget
  - Link to calming activities
  - Option to request therapist check-in
  - Supportive message in their locale
```

## 4. Technical Requirements

### 4.1 Database Schema

```typescript
entity MoodCheckIn {
  id: UUID;
  studentId: UUID;
  mood: MoodType; // HAPPY, OKAY, SAD, ANXIOUS, FRUSTRATED, ENERGETIC
  intensity: 1-5; // Optional intensity rating
  note: string; // Optional text
  triggers: string[]; // Tags: homework, social, family, test
  createdAt: Date;
}

enum MoodType {
  HAPPY = 'HAPPY',
  OKAY = 'OKAY',
  SAD = 'SAD',
  ANXIOUS = 'ANXIOUS',
  FRUSTRATED = 'FRUSTRATED',
  ENERGETIC = 'ENERGETIC'
}
```

### 4.2 API Endpoints

```
POST /api/mood-checkins
GET /api/mood-checkins/student/:studentId
GET /api/mood-checkins/student/:studentId/trends
GET /api/mood-checkins/student/:studentId/alerts
```

### 4.3 Frontend Components

- `MoodCheckInWidget.tsx` - Daily check-in UI
- `MoodTrendsChart.tsx` - 7/30 day visualization
- `WellbeingDashboard.tsx` - Therapist view
- `MoodAlerts.tsx` - Alert notifications

## 5. Success Metrics

- 70%+ daily check-in completion rate
- Therapist intervention within 24hrs of alert
- 30% reduction in unaddressed emotional issues
- Positive student feedback on check-in experience

## 6. References

- Research: AI-driven SEL integration in 2025
- WCAG 2.1 AA compliance for mood selection UI
- Constitution: Student-centric design principles

---

**Last Updated:** 2025-11-05
**Status:** Draft - Ready for implementation
