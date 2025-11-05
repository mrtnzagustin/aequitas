# 015: Learning Analytics Dashboard

**Status:** Draft
**Epic:** Analytics & Reporting
**Priority:** P1
**Assigned To:** TBD
**Target Release:** v1.1

## 1. Overview

Comprehensive analytics dashboard for therapists showing class-wide and individual student metrics, trends, and insights. Data-driven decision support for therapeutic interventions.

## 2. Key Features

### Student-Level Analytics
- Task completion trends (7/30/90 days)
- Adaptation success rates
- Time spent per difficulty level
- Mood correlation with performance
- Engagement heatmap (days/hours)

### Class-Level Analytics
- Average completion rate
- Most challenging subjects
- Adaptation usage by condition
- Therapist workload distribution
- Parent engagement metrics

### Insights & Recommendations
- "50% of students struggling with Math - consider workshop"
- "Student X showing improvement - celebrate success"
- "Adaptation strategy Y working well for ADHD group"

## 3. Visualizations

- Line charts (performance over time)
- Heat maps (engagement patterns)
- Bar charts (subject distribution)
- Pie charts (task status breakdown)
- Scatter plots (difficulty vs performance)

## 4. Technical Requirements

```typescript
interface Analytics {
  studentId: string;
  period: '7d' | '30d' | '90d';
  metrics: {
    tasksCompleted: number;
    avgCompletionTime: number; // minutes
    adaptationSuccessRate: number; // 0-100%
    moodAverage: number; // 1-5
    engagementScore: number; // 0-100
  };
  trends: {
    performance: 'IMPROVING' | 'STABLE' | 'DECLINING';
    engagement: 'INCREASING' | 'STABLE' | 'DECREASING';
  };
}
```

## 5. Export Options

- PDF report generation
- CSV data export
- Google Sheets integration
- Scheduled email reports (weekly/monthly)

---

**Last Updated:** 2025-11-05
**Status:** Draft
