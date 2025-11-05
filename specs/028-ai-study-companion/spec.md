# 028: AI-Powered Study Companion (24/7 Chatbot)

**Status:** Draft
**Epic:** AI-Powered Learning Support
**Priority:** P1
**Assigned To:** TBD
**Target Release:** v1.2

## 1. Overview

An AI-powered study companion chatbot available 24/7 to assist students with homework help, concept explanations, study techniques, and emotional support. Integrates with student profiles to provide personalized, context-aware assistance using LangChain and GPT-4o.

## 2. Problem Statement

**Current State:**
- Students struggle with homework outside school hours
- No immediate help available when stuck on concepts
- Parents may not understand specialized learning conditions
- Students feel isolated when facing academic challenges
- Therapists and teachers unavailable after hours

**Desired State:**
- 24/7 AI companion accessible from any device
- Instant explanations adapted to student's learning style
- Homework help that guides without giving direct answers
- Emotional encouragement during frustration
- Conversation history available to therapists
- Multi-modal support (text, voice, image uploads)

**Impact if Not Addressed:**
- Increased homework stress and anxiety
- Lower task completion rates
- Students giving up when stuck
- Reduced learning independence

## 3. User Personas

### Student
- **Needs:** Quick help with homework, concept clarification, study strategies, emotional support
- **Workflow:** Student stuck on problem → Opens chatbot → Asks question → Receives guided explanation → Completes work

### Therapist
- **Needs:** Monitor student questions, identify knowledge gaps, understand emotional state
- **Workflow:** Reviews chat summaries → Identifies patterns → Adjusts learning strategies

### Parent
- **Needs:** Understand how to help their child, monitor progress
- **Workflow:** Checks chat history → Sees areas where child needed help → Discusses with therapist

## 4. Functional Requirements

### 4.1 Core Behaviors

#### Chatbot Interactions

```gherkin
Given a student opens the study companion
When they type or speak a question
Then the AI responds within 3 seconds
And adapts language to student's grade level
And references student's learning condition

Given a student uploads an image of a homework problem
When the OCR extracts the text
Then the AI analyzes the problem
And provides step-by-step guided hints
But does not provide direct answers

Given a student asks for help with a concept
When the AI identifies the topic
Then it provides an explanation using:
  - Student's interests as examples
  - Visual aids and analogies
  - Multi-modal content (text + images)
  - Simplified language for learning conditions

Given a student expresses frustration
When the AI detects emotional keywords
Then it provides encouragement
And suggests a short break or breathing exercise
And offers to simplify the problem
And alerts the therapist if pattern continues
```

#### Safeguards & Educational Guidelines

```gherkin
Given a student asks for direct answers
When the AI detects answer-seeking behavior
Then it responds with guided questions instead
And explains why learning the process matters
And breaks down the problem into smaller steps

Given a student asks off-topic or inappropriate questions
When the AI detects this
Then it gently redirects to educational topics
And logs the attempt for therapist review
And provides age-appropriate boundaries
```

#### Conversation History & Insights

```gherkin
Given a therapist views student's profile
When they open "Study Companion" tab
Then they see:
  - Chat summary by week
  - Most asked topics
  - Frustration indicators
  - Time spent per subject
  - Recommended intervention areas

Given a parent views their child's dashboard
When they access "Study Help" section
Then they see:
  - General topics child asked about
  - Time spent with companion
  - Progress indicators
But not verbatim conversations (privacy)
```

### 4.2 User Interface

#### Student Chat Interface
- Chat window with message bubbles
- Voice input button with visual feedback
- Image upload button for homework photos
- Suggested prompts: "Explain...", "Help me with...", "I don't understand..."
- Emoji reactions to rate responses
- "Start new topic" button
- Quick actions: "Break time", "Get hint", "See example"

#### Therapist Insights Dashboard
- Weekly chat activity chart
- Topic cloud (most discussed subjects)
- Frustration timeline (detected emotional distress)
- Conversation snippets with context
- Export button for detailed report
- Alert notifications for concerning patterns

### 4.3 Data Model

```typescript
interface ChatMessage {
  id: string; // UUID
  studentId: string;
  role: 'student' | 'assistant';
  content: string;
  contentType: 'text' | 'voice' | 'image';
  imageUrl?: string; // If uploaded image
  sentiment?: 'positive' | 'neutral' | 'frustrated' | 'confused';
  topic?: string; // Auto-detected topic
  createdAt: Date;
}

interface ChatSession {
  id: string; // UUID
  studentId: string;
  startedAt: Date;
  endedAt?: Date;
  messageCount: number;
  topics: string[]; // Array of discussed topics
  averageSentiment: number; // -1 to 1 scale
  flaggedForReview: boolean;
}

interface ChatInsight {
  id: string; // UUID
  studentId: string;
  weekOf: Date;
  topTopics: { topic: string; count: number }[];
  frustrationEvents: number;
  totalMessages: number;
  averageResponseTime: number; // in seconds
  recommendedInterventions: string[];
  generatedAt: Date;
}
```

### 4.4 Business Logic

#### AI Prompt Engineering

**System Prompt Template:**
```
You are a supportive study companion for {studentName}, a {grade}-grade student with {condition}.
Their interests include: {interests}.
Their learning preferences: {learningPreferences}.

Your role:
- Provide guided help, not direct answers
- Use their interests to explain concepts
- Keep language simple and encouraging
- Detect frustration and offer breaks
- Never do their homework for them
- Celebrate small wins

Current subject: {currentSubject}
Recent context: {recentNotes}
```

#### Sentiment Analysis
- Analyze each message for emotional indicators
- Keywords: "I can't", "I hate", "This is stupid" = frustrated
- Keywords: "I get it!", "Thanks!", "This helps" = positive
- Track sentiment trends over conversation
- Alert therapist if 3+ frustrated messages in one session

#### Topic Detection
- Use NLP to extract main subject from questions
- Map to curriculum topics (Math: Fractions, Algebra; Reading: Comprehension, etc.)
- Track frequency by topic to identify weak areas
- Suggest targeted resources based on topic patterns

## 5. Non-Functional Requirements

### 5.1 Performance

- Message response time: < 3 seconds (95th percentile)
- Voice transcription: < 2 seconds
- Image OCR processing: < 5 seconds
- Chat history load: < 1 second
- Support 100+ concurrent conversations

### 5.2 Security & Privacy

- All conversations encrypted at rest and in transit
- Student data never used to train OpenAI models (opt-out enabled)
- Parent access filtered (no verbatim conversations of sensitive topics)
- Inappropriate content detection and logging
- COPPA compliance for children under 13

### 5.3 Accessibility

- Voice input for students with dysgraphia
- Text-to-speech for responses (for dyslexia)
- Simple, distraction-free interface
- High contrast mode support
- Keyboard navigation for all features
- Screen reader compatible

### 5.4 Internationalization

- Support Spanish (es-AR) and English (en)
- Detect student's preferred language from profile
- Translate uploaded image text if needed
- Culturally appropriate examples and analogies

## 6. API Specifications

### 6.1 Chat Endpoints

#### POST /api/chat/message
Send a message to the AI study companion.

**Auth:** Required (Student, Therapist, Parent)

**Request:**
```json
{
  "studentId": "uuid",
  "message": "I don't understand how to solve 3x + 5 = 14",
  "contentType": "text",
  "imageUrl": null
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "role": "assistant",
  "content": "Great question! Let's solve this step by step. First, what do you think we should do to get 'x' by itself?",
  "sentiment": "neutral",
  "topic": "Algebra",
  "createdAt": "2025-11-05T15:30:00Z",
  "suggestedActions": ["Get hint", "See example"]
}
```

#### GET /api/chat/sessions/:studentId
Get chat sessions for a student.

**Auth:** Required (Therapist, Student, Parent - filtered)

**Query Params:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `startDate` (ISO date, optional)
- `endDate` (ISO date, optional)

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "startedAt": "2025-11-05T14:00:00Z",
      "endedAt": "2025-11-05T14:45:00Z",
      "messageCount": 12,
      "topics": ["Algebra", "Word Problems"],
      "averageSentiment": 0.6,
      "flaggedForReview": false
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

#### GET /api/chat/insights/:studentId
Get weekly insights for therapist.

**Auth:** Required (Therapist only)

**Response (200):**
```json
{
  "weekOf": "2025-11-04",
  "topTopics": [
    { "topic": "Algebra", "count": 15 },
    { "topic": "Reading Comprehension", "count": 8 }
  ],
  "frustrationEvents": 3,
  "totalMessages": 87,
  "averageResponseTime": 2.4,
  "recommendedInterventions": [
    "Review algebra basics in next session",
    "Consider visual aids for word problems"
  ]
}
```

### 6.2 Voice & Image Upload

#### POST /api/chat/voice
Transcribe voice message to text.

**Request:** multipart/form-data with audio file

**Response (200):**
```json
{
  "transcript": "How do I solve three x plus five equals fourteen",
  "confidence": 0.95
}
```

#### POST /api/chat/image
Upload image and extract text (OCR).

**Request:** multipart/form-data with image file

**Response (200):**
```json
{
  "imageUrl": "https://s3.../homework-image.jpg",
  "extractedText": "Solve: 3x + 5 = 14",
  "detectedLanguage": "en"
}
```

## 7. Edge Cases & Error Handling

### AI Service Outage
- **Scenario:** OpenAI API is down
- **Detection:** API returns 503 or timeout
- **Error Message:** "I'm having trouble connecting right now. Please try again in a minute!"
- **Recovery:** Retry with exponential backoff, show offline message after 3 attempts

### Inappropriate Content
- **Scenario:** Student types inappropriate or harmful message
- **Detection:** Content moderation API flags message
- **Error Message:** "Let's keep our conversations focused on learning. How can I help with your studies?"
- **Recovery:** Log incident, notify therapist, continue conversation

### Image Upload Failure
- **Scenario:** Image too large or corrupted
- **Detection:** File size > 10MB or OCR fails
- **Error Message:** "I couldn't read that image. Try a clearer photo or smaller file size."
- **Recovery:** Prompt to re-upload or type question instead

### Excessive Usage
- **Scenario:** Student sends 50+ messages in one hour
- **Detection:** Rate limiting triggered
- **Error Message:** "You've been working hard! Let's take a break. I'll be here when you're ready."
- **Recovery:** 15-minute cooldown, notify therapist

## 8. Testing Strategy

### 8.1 Unit Tests

**Services:**
- `ChatService.sendMessage()` - valid message, image upload, voice input
- `SentimentAnalyzer.analyze()` - positive, negative, neutral sentiments
- `TopicDetector.extract()` - various subjects and topics
- `ChatInsightGenerator.generate()` - weekly insights calculation

### 8.2 Integration Tests

**API Endpoints:**
- `POST /api/chat/message` - text, voice, image messages
- `GET /api/chat/sessions/:studentId` - pagination, date filtering
- `GET /api/chat/insights/:studentId` - insight generation
- Content moderation triggers and logging

### 8.3 E2E Tests

**Critical Flows:**
1. **Student asks homework question:**
   - Student logs in
   - Opens study companion
   - Types algebra question
   - Receives guided response (not direct answer)
   - Rates response positively
   - Continues conversation

2. **Student uploads homework image:**
   - Student clicks image upload
   - Selects photo from device
   - OCR extracts problem
   - AI provides step-by-step guidance
   - Student completes problem

3. **Therapist reviews insights:**
   - Therapist logs in
   - Navigates to student profile
   - Opens "Study Companion" tab
   - Views weekly insights
   - Identifies algebra as weak area
   - Plans intervention for next session

### 8.4 AI Quality Tests

- Verify AI never provides direct homework answers
- Ensure responses adapted to student's learning condition
- Check sentiment detection accuracy (>85%)
- Validate topic extraction (>80% accuracy)
- Test multi-language support

## 9. Success Metrics

### Quantitative
- 60%+ of students use companion weekly
- Average session length: 15-25 minutes
- 70%+ positive sentiment rating
- <5% flagged conversations
- 30% reduction in "stuck on homework" reports

### Qualitative
- Student feedback: "Feels like having a patient tutor"
- Therapist feedback: "Insights reveal knowledge gaps"
- Parent feedback: "Child more independent with homework"
- No privacy concerns or complaints

## 10. Dependencies

### Required Infrastructure
- OpenAI API access (GPT-4o)
- LangChain for conversation management
- Speech-to-text service (OpenAI Whisper or Google Cloud)
- OCR service (Tesseract.js or Google Vision)
- AWS S3 for image storage
- Redis for rate limiting

### Required Libraries
- `@langchain/openai` - AI orchestration
- `openai` - Direct API access for Whisper
- `tesseract.js` - OCR processing
- `compromise` or `natural` - NLP for topic extraction
- `sentiment` - Sentiment analysis

## 11. Open Questions

1. **Homework Answer Prevention:** How strict should we be about preventing answer-giving?
   - **Decision needed by:** Pre-implementation
   - **Assumption:** Use prompt engineering + post-response filtering

2. **Parent Privacy:** Should parents see verbatim conversations?
   - **Decision needed by:** Pre-implementation
   - **Assumption:** No verbatim, only summaries and topics

3. **Voice Chat:** Should we support real-time voice conversations?
   - **Decision needed by:** Post-MVP (Phase 2)
   - **Assumption:** Text + voice-to-text for MVP

4. **Data Retention:** How long should we keep chat history?
   - **Decision needed by:** Pre-implementation
   - **Assumption:** Keep for academic year, archive after

## 12. Future Enhancements

### Phase 2
- Real-time voice conversations (like ChatGPT voice mode)
- AI-generated practice problems based on weak areas
- Collaborative study sessions with multiple students
- Integration with external educational resources
- Smart homework planner (AI suggests study schedule)

### Phase 3
- AR mode for visualizing 3D concepts
- Gamified learning challenges
- Peer learning matching (connect students with similar questions)
- Parent coaching mode (help parents help their kids)
- Multi-student group study rooms

---

**Specification Last Updated:** 2025-11-05
**Next Review:** 2025-12-05
