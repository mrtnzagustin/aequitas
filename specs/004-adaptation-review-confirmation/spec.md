# 004: Adaptation Review & Confirmation

**Status:** Draft
**Epic:** Core AI Functionality
**Priority:** P0
**Assigned To:** TBD
**Target Release:** v1.0 (MVP)

## 1. Overview

This feature provides the human-in-the-loop review workflow for AI-generated task adaptations. Users can review, refine through conversational chat, and confirm adaptations before they become part of the student's permanent record.

**Note:** This spec is closely integrated with Spec 003 (AI-Powered Task Adaptation) and extends the refinement capabilities.

## 2. Problem Statement

AI-generated adaptations may not be perfect on the first try. This feature ensures quality through human review and iterative refinement.

## 3. Core Behaviors

### Review Interface
- Side-by-side view: Original vs Adapted task
- Chat interface for refinement requests
- Version history tracking
- Explanation of AI's changes

### Refinement Chat
- Natural language refinement requests
- Conversational context maintained
- Maximum 10 refinements per adaptation
- AI incorporates feedback iteratively

### Confirmation
- "Confirm and Save" locks the adaptation
- Status changes from DRAFT to CONFIRMED
- Saved to student's timeline
- Notification sent to relevant users

### Regeneration
- "Regenerate" button starts fresh
- Preserves original task
- Creates new adaptation with different approach

## 4. API Specifications

### POST /api/adaptations/:id/refine
Refine an existing adaptation.

**Request:**
```json
{
  "refinementRequest": "Make the instructions simpler and use bullet points"
}
```

**Response:**
```json
{
  "adaptationId": "uuid",
  "version": 2,
  "refinedContent": "<p>...</p>",
  "explanation": "I simplified the instructions into 3 bullet points..."
}
```

### POST /api/adaptations/:id/confirm
Confirm and save an adaptation.

**Response:**
```json
{
  "id": "uuid",
  "status": "CONFIRMED",
  "confirmedBy": "uuid",
  "confirmedAt": "2025-11-05T16:00:00Z"
}
```

## 5. Success Metrics

- 80% of adaptations approved within 2 refinements
- Average time to confirm: < 3 minutes
- User satisfaction: >85% rate as "Easy to use"

---

**Specification Last Updated:** 2025-11-05
