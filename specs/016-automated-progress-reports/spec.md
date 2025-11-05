# 016: Automated Progress Reports

**Status:** Draft
**Epic:** Reporting & Documentation
**Priority:** P2
**Target Release:** v1.2

## 1. Overview

AI-generated progress reports summarizing student achievements, challenges, and recommendations. Saves therapists hours of manual report writing.

## 2. Key Features

- Weekly/monthly/quarterly report generation
- Customizable templates per institution
- Multi-language support (Spanish/English)
- PDF export with charts and insights
- Email delivery to parents/schools

## 3. Report Sections

- Executive summary (AI-generated)
- Task completion metrics
- Mood and engagement trends
- Adaptation effectiveness analysis
- Goals progress
- Therapist recommendations
- Next steps

## 4. Technical Requirements

```typescript
entity ProgressReport {
  id: UUID;
  studentId: UUID;
  period: { start: Date; end: Date };
  generatedBy: 'AI' | 'THERAPIST' | 'HYBRID';
  sections: ReportSection[];
  status: 'DRAFT' | 'REVIEWED' | 'SENT';
  sentAt?: Date;
}
```

---

**Last Updated:** 2025-11-05
**Status:** Draft
