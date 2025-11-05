# 027: Customizable Notification System

**Status:** Draft
**Epic:** Communication & Alerts
**Priority:** P2
**Assigned To:** TBD
**Target Release:** v1.2

## 1. Overview

Flexible notification system with multi-channel delivery (email, SMS, push, in-app) and user-customizable preferences to reduce notification fatigue.

## 2. Notification Types

### For Students
- Task assigned
- Deadline reminder (24hrs, 1hr)
- Badge earned
- Therapist message
- Mood check-in prompt

### For Therapists
- Student at-risk alert
- New family note added
- Task submitted for review
- Parent message
- Weekly summary digest

### For Parents
- Child completed task
- Progress report available
- Upcoming meeting reminder
- Therapist update

## 3. Delivery Channels

- In-app notifications (real-time)
- Email (immediate or digest)
- SMS (critical only)
- Push notifications (mobile app)
- Slack/Teams integration (optional)

## 4. Customization

```typescript
entity NotificationPreferences {
  userId: UUID;
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
    inApp: boolean;
  };
  frequency: 'IMMEDIATE' | 'DAILY_DIGEST' | 'WEEKLY_DIGEST';
  quietHours: { start: string; end: string }; // "22:00" - "08:00"
  categories: {
    alerts: boolean; // Urgent alerts
    updates: boolean; // Progress updates
    reminders: boolean; // Deadlines
    social: boolean; // Badges, achievements
  };
}
```

## 5. Technical Stack

- Server: @nestjs/event-emitter
- Email: SendGrid / AWS SES
- SMS: Twilio
- Push: Firebase Cloud Messaging
- Queue: Bull + Redis

## 6. Smart Features

- Aggregation (multiple notifications → single email)
- Priority-based delivery
- Rate limiting (max 5 per hour)
- A/B testing notification copy
- Delivery analytics (open rate, click rate)

---

**Last Updated:** 2025-11-05
**Status:** Draft
