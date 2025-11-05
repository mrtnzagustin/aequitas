# 031: Biometric Focus Tracker

**Status:** Draft
**Epic:** AI-Powered Learning Support
**Priority:** P2
**Assigned To:** TBD
**Target Release:** v1.3

## 1. Overview

A biometric focus tracking system that uses webcam analysis to detect student attention, fatigue, and emotional state during learning sessions. Provides real-time interventions and insights to optimize learning effectiveness, particularly valuable for students with ADHD.

## 2. Problem Statement

**Current State:**
- No visibility into student attention during remote learning
- Fatigue and disengagement go unnoticed
- Optimal break timing is guesswork
- No objective data on focus patterns
- Students push through ineffective study sessions

**Desired State:**
- Real-time attention monitoring (with consent)
- Automatic break suggestions when fatigue detected
- Optimal session length recommendations
- Focus pattern insights for therapists
- Privacy-preserving analysis

**Impact if Not Addressed:**
- Wasted study time due to poor focus
- Burnout from overwork without breaks
- No data-driven session optimization
- Missed opportunities for intervention

## 3. Functional Requirements

### 3.1 Focus Detection

```gherkin
Given a student enables focus tracking
When they start a learning session
Then the system (with camera permission):
  - Detects face presence (not identity)
  - Tracks gaze direction
  - Monitors blink rate (fatigue indicator)
  - Detects head position (slouching/posture)
  - Analyzes facial expressions (engagement)

Given focus score drops below 40%
When the system detects for >2 minutes
Then it:
  - Suggests a 5-minute break
  - Offers a quick energizer activity
  - Logs low-focus period
  - Adjusts content difficulty
```

### 3.2 Break Optimization

```gherkin
Given a student has been focused for 25 minutes
When the system detects optimal break point
Then it:
  - Shows gentle break reminder
  - Suggests movement activity
  - Starts 5-minute timer
  - Dims screen gradually
  - Plays calming music (optional)

Given a student returns from break
When they resume session
Then the system:
  - Welcomes them back
  - Shows progress made
  - Resumes at appropriate difficulty
  - Tracks break effectiveness
```

### 3.3 Privacy & Consent

```gherkin
Given a student first accesses focus tracking
When they see the feature
Then they must:
  - Read privacy explanation
  - Grant camera permission
  - Consent to data collection
  - Understand they can disable anytime

Given focus tracking is enabled
When the system processes video
Then it:
  - Never stores raw video
  - Only saves anonymized metrics
  - Processes locally when possible
  - Deletes processed frames immediately
  - Never shares video with third parties
```

## 4. Technical Requirements

### 4.1 Database Schema

```typescript
interface FocusSession {
  id: string; // UUID
  studentId: string;
  startedAt: Date;
  endedAt?: Date;
  averageFocusScore: number; // 0-100
  peakFocusTime: string; // Time of day
  lowFocusPeriods: number;
  breaksCount: number;
  totalDuration: number; // seconds
  taskId?: string;
}

interface FocusMetric {
  id: string; // UUID
  sessionId: string;
  timestamp: Date;
  focusScore: number; // 0-100
  gazeDirection: string; // 'ON_SCREEN' | 'AWAY'
  blinkRate: number; // blinks per minute
  headPose: string; // 'UPRIGHT' | 'SLOUCHED'
  emotionDetected: string; // 'ENGAGED' | 'CONFUSED' | 'FRUSTRATED'
}

interface StudentFocusPattern {
  id: string; // UUID
  studentId: string;
  optimalSessionLength: number; // minutes
  bestTimeOfDay: string;
  averageFocusDuration: number; // minutes
  recommendedBreakFrequency: number; // minutes
  focusTriggers: string[]; // What helps focus
  distractionTriggers: string[]; // What hurts focus
  updatedAt: Date;
}
```

### 4.2 Computer Vision Processing

**Face Detection & Tracking:**
- TensorFlow.js Face Landmarks Detection
- Runs in browser (privacy-preserving)
- Detects: face presence, gaze direction, head pose
- No facial recognition (GDPR/privacy compliant)

**Emotion Recognition:**
- Lightweight emotion classification model
- Categories: Engaged, Confused, Frustrated, Bored
- Confidence threshold: >70% to log
- Combines multiple facial cues

**Fatigue Detection:**
- Blink rate analysis (normal: 15-20/min, fatigued: <10 or >30)
- Eye openness measurement
- Head droop detection
- Yawn detection (mouth aspect ratio)

### 4.3 API Endpoints

```
POST /api/focus/start-session
POST /api/focus/end-session
POST /api/focus/record-metric
GET /api/focus/student/:studentId/patterns
GET /api/focus/student/:studentId/sessions
POST /api/focus/consent
```

## 5. Success Metrics

- 50%+ students opt-in to focus tracking
- 30% increase in effective study time
- 25% reduction in burnout reports
- 80%+ accuracy in fatigue detection
- 0 privacy complaints or violations

## 6. Privacy & Compliance

- GDPR Article 9 compliance (biometric data)
- Explicit opt-in required (no default enable)
- Right to deletion (erase all data)
- Transparent data usage explanation
- Parent consent for students <13
- Never sell or share biometric data

---

**Specification Last Updated:** 2025-11-05
