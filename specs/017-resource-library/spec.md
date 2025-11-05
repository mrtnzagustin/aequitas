# 017: Resource Library & Best Practices

**Status:** Draft
**Epic:** Knowledge Management
**Priority:** P2
**Target Release:** v1.2

## 1. Overview

Curated library of educational resources, adaptation strategies, and best practices for therapists and teachers. Searchable, taggable, and shareable.

## 2. Key Features

- Resource categories (Articles, Videos, Templates, Strategies)
- Search by condition (Dyslexia, ADHD, Autism)
- User-contributed resources (moderated)
- Favorites and collections
- Usage analytics (most helpful resources)

## 3. Resource Types

- Adaptation templates (Math, Reading, Writing)
- Therapeutic intervention guides
- Parent communication templates
- IEP goal examples
- Video tutorials
- Research papers and studies

## 4. Technical Requirements

```typescript
entity Resource {
  id: UUID;
  title: string;
  description: string;
  type: 'ARTICLE' | 'VIDEO' | 'TEMPLATE' | 'GUIDE';
  conditions: string[]; // ADHD, Dyslexia, etc.
  tags: string[];
  url: string;
  uploadedBy: UUID;
  verified: boolean; // moderated
  views: number;
  favorites: number;
}
```

---

**Last Updated:** 2025-11-05
**Status:** Draft
