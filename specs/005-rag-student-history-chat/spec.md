# 005: RAG-based Student History Chat

**Status:** Draft
**Epic:** Core AI Functionality
**Priority:** P1
**Assigned To:** TBD
**Target Release:** v1.0 (MVP)

## 1. Overview

The RAG (Retrieval-Augmented Generation) Student History Chat enables users to ask natural language questions about a student's history. The system retrieves relevant notes, adaptations, and grades, then generates synthesized answers grounded in the student's actual data.

## 2. Problem Statement

**Current State:** As student histories grow to hundreds of entries, manually finding patterns, trends, or specific information becomes time-consuming and error-prone.

**Desired State:** An AI chat interface that can answer questions like:
- "What are the common themes in teacher observations over the last 3 months?"
- "Which adaptation strategies have been most successful for math tasks?"
- "How has the student's reading performance changed since September?"

## 3. Core Behaviors

### Chat Interface

```gherkin
Given a Therapist is on a student's profile
When they open the "History Chat" tab
Then they see a chat interface with:
  - Welcome message explaining the feature
  - Example questions
  - Chat input box
  - Previous chat history (session-based)

Given a user asks "What are common themes in teacher notes?"
When the RAG system processes the query
Then it:
  1. Converts the query to embeddings
  2. Retrieves top 10 most relevant notes (vector similarity search)
  3. Filters by user's RBAC (Therapist sees all, Teacher sees Academic+Family only)
  4. Passes notes to LLM with the original query
  5. LLM generates a synthesized answer
  6. Answer is displayed with citations (links to source notes)
```

### RBAC in RAG Retrieval

```gherkin
Given a Parent asks "What did the therapist say about reading?"
When the system retrieves notes
Then it filters out THERAPEUTIC notes (which Parents cannot access)
And only searches ACADEMIC and FAMILY notes
And returns "I don't have access to therapeutic notes. Here's what I found in academic notes..."
```

## 4. Technical Architecture

### Vector Database
- Use PostgreSQL with pgvector extension or Pinecone/Qdrant
- Store embeddings for all notes and adaptations
- Index by studentId for fast filtering

### Embedding Generation
- Use OpenAI `text-embedding-3-small` or similar
- Generate embeddings on note creation
- Re-embed on note update

### RAG Chain (LangChain)
```typescript
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { VectorStore } from "@langchain/vectorstores";

const vectorStore = new VectorStore(/* config */);

async function ragQuery(query: string, studentId: string, userId: string) {
  // 1. Retrieve relevant documents
  const relevantDocs = await vectorStore.similaritySearch(query, 10, {
    studentId,
    // RBAC filter based on userId role
  });

  // 2. Build prompt with context
  const context = relevantDocs.map(doc => doc.pageContent).join("\n\n");

  const prompt = PromptTemplate.fromTemplate(`
    You are an AI assistant helping analyze a student's educational history.

    Context (relevant notes and adaptations):
    {context}

    User question: {query}

    Provide a synthesized answer based ONLY on the context above. Include citations.
  `);

  // 3. Generate answer
  const llm = new ChatOpenAI({ model: "gpt-4o" });
  const chain = prompt.pipe(llm);

  const answer = await chain.invoke({ context, query });

  return {
    answer,
    sources: relevantDocs,
  };
}
```

## 5. API Specifications

### POST /api/students/:studentId/history-chat
Query student history with RAG.

**Request:**
```json
{
  "query": "What are common themes in teacher observations over the last 3 months?"
}
```

**Response:**
```json
{
  "answer": "Based on teacher observations, three common themes emerge: 1) Juan excels in hands-on activities...",
  "sources": [
    {
      "id": "uuid",
      "type": "note",
      "excerpt": "Juan showed great engagement during the science experiment...",
      "date": "2025-10-15T10:00:00Z",
      "author": "Prof. María García"
    }
  ],
  "timestamp": "2025-11-05T16:30:00Z"
}
```

## 6. Non-Functional Requirements

### Performance
- Embedding generation: < 1 second
- Vector search: < 500ms for 1000 notes
- LLM response: < 5 seconds
- Total query time: < 7 seconds

### Security
- RBAC enforced at vector search level
- No cross-student data leakage (strict filtering by studentId)
- Audit log for all queries

### Data Privacy
- Student names anonymized in LLM prompts (use "the student")
- No sensitive PHI sent to external APIs beyond necessary context

## 7. Success Metrics

- 70% of users try History Chat within first month
- Average 5 queries per user per week
- 80% of answers rated as "Helpful" or "Very helpful"
- Query response time < 7 seconds (95th percentile)

## 8. Future Enhancements

- Proactive insights (AI suggests questions based on recent patterns)
- Multi-turn conversations (maintain context across queries)
- Export chat transcript as PDF
- Comparison queries (compare two students' patterns)

---

**Specification Last Updated:** 2025-11-05
