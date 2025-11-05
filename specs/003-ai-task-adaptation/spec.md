# 003: AI-Powered Task Adaptation

**Status:** Draft
**Epic:** Core AI Functionality
**Priority:** P0
**Assigned To:** TBD
**Target Release:** v1.0 (MVP)

## 1. Overview

The AI-Powered Task Adaptation feature is the core value proposition of the Aequitas platform. It uses AI (via LangChain and LangGraph) to automatically adapt educational tasks for students with specific learning conditions. The system ingests a task (text, image, or PDF), extracts the content, and generates a tailored adaptation based on the student's comprehensive profile, interests, and learning preferences.

This feature transforms what would take a teacher or therapist 30-60 minutes into a 10-second AI-assisted process, with human review and refinement capabilities.

## 2. Problem Statement

**Current State:**
Teachers and therapists manually adapt every task for students with specific conditions:
- Time-consuming (30-60 minutes per task)
- Requires specialized pedagogical knowledge
- Inconsistent quality and approach
- Difficult to scale across multiple students
- Previous adaptations are forgotten or lost

**Desired State:**
An AI system that:
- Generates contextual adaptations in <10 seconds
- Uses the student's full profile for personalization
- Maintains consistency across adaptations
- Learns from approved adaptations
- Preserves adaptation history for analysis

**Impact if Not Addressed:**
Without AI-powered adaptation, teachers cannot realistically adapt all tasks for all students, leading to gaps in inclusive education and perpetuating inequalities in learning opportunities.

## 3. User Personas

### Teacher
- **Needs:** Quick task adaptation, ability to upload various formats, simple review process
- **Workflow:** Uploads task → Reviews AI adaptation → Refines if needed → Confirms → Assigns to student

### Therapist (Psycho-pedagogue)
- **Needs:** Deep personalization based on therapeutic insights, ability to set adaptation preferences
- **Workflow:** Reviews teacher's task → Provides therapeutic context → Requests adaptation → Reviews with clinical lens → Approves

### Parent
- **Needs:** Access to confirmed adaptations for homework support
- **Workflow:** Views assigned adaptations → Understands how to help child → Provides feedback

## 4. Functional Requirements

### 4.1 Core Behaviors

#### Task Upload

```gherkin
Given a Teacher is on a student's profile
When they click "Adapt New Task"
Then they see an upload modal with options:
  - "Upload Image" (JPG, PNG, HEIC)
  - "Upload PDF"
  - "Paste Text"
  - "Take Photo" (mobile only)

Given a Teacher uploads an image file
When the upload completes
Then the system displays a preview
And extracts text via OCR
And shows extracted text for review/editing

Given a Teacher uploads a PDF file
When the upload completes
Then the system extracts text from all pages
And shows extracted text with page numbers
And allows editing before proceeding

Given a Teacher pastes text directly
When they click "Continue"
Then the system skips OCR
And proceeds directly to adaptation generation
```

#### OCR Text Extraction

```gherkin
Given an image contains printed or handwritten text
When OCR processing runs
Then the system extracts all readable text
And preserves formatting where possible (line breaks, bullets)
And flags low-confidence extractions for user review

Given OCR extracts text with low confidence (<70%)
When the extraction completes
Then the system highlights uncertain sections
And allows the user to correct before proceeding

Given an image has no detectable text
When OCR processing completes
Then the system shows "No text detected. Please upload a different image or paste text manually."
And provides option to retry or enter text manually
```

#### Adaptation Generation (AI Core)

```gherkin
Given a Teacher confirms the extracted task content
When they click "Generate Adaptation"
Then the system:
  1. Fetches the student's full profile (condition, interests, learning preferences)
  2. Fetches recent therapeutic and academic notes for context
  3. Constructs a prompt including all context
  4. Calls the LLM (via LangChain) with the prompt
  5. Streams the adaptation back to the user
  6. Displays the adaptation in a "Review Chat" interface

Given the AI generates an adaptation
When the adaptation is displayed
Then it includes:
  - Original task (side-by-side with adaptation)
  - Adapted task content
  - Explanation of changes (e.g., "I simplified the instructions into 3 steps...")
  - Estimated difficulty level
  - "Confirm", "Refine", or "Regenerate" buttons
```

#### Prompt Construction

The system must construct a comprehensive prompt:

**System Prompt Template:**
```
You are an expert pedagogical assistant specializing in adapting educational tasks for students with learning differences.

Student Profile:
- Name: {studentName}
- Condition: {condition}
- Interests: {interests}
- Learning Preferences: {learningPreferences}

Recent Context:
{recentNoteSummary}

Your task is to adapt the provided educational task to suit this student's needs. Follow these guidelines:

1. **Simplify language** if the student has reading difficulties
2. **Break down multi-step instructions** into clear, numbered steps
3. **Incorporate the student's interests** where possible to increase engagement
4. **Add visual cues** if the student is a visual learner
5. **Provide scaffolding** for complex concepts
6. **Maintain the core learning objective** of the original task
7. **Respond in {language}** (e.g., Spanish, English)

Do not patronize or oversimplify unnecessarily. Aim for age-appropriate language tailored to the student's specific needs.

After providing the adapted task, briefly explain the key changes you made and why.
```

**User Prompt Template:**
```
Original Task:
{taskContent}

Please generate an adapted version of this task suitable for the student described above.
```

#### Adaptation Review & Refinement

```gherkin
Given a Teacher views the initial adaptation
When they see areas for improvement
Then they can type refinement requests in the chat interface
And the AI generates an updated adaptation

Given a Teacher types "Make the instructions even simpler and use bullet points"
When the AI processes the request
Then it generates a new adaptation incorporating the feedback
And maintains context from the original task and student profile

Given a Teacher is satisfied with an adaptation
When they click "Confirm and Save"
Then the adaptation is saved to the student's history
And marked as "CONFIRMED"
And the original task is preserved alongside the adaptation
And an audit log entry is created
```

#### Adaptation History

```gherkin
Given a student has multiple confirmed adaptations
When a user views the "Adaptations" tab on the profile
Then they see a list of all adaptations sorted by date (newest first)
And each entry shows:
  - Task title or first line
  - Date created
  - Created by (user name)
  - Status badge (DRAFT, CONFIRMED)
  - Subject tag (if applicable)

Given a user clicks on an adaptation
When the detail view opens
Then they see:
  - Original task (collapsible panel)
  - Final adapted version
  - Explanation of changes
  - Metadata (created by, date, status)
  - Refinement history (if applicable)
  - Option to "Use as Template" for future adaptations
```

### 4.2 User Interface

#### Adapt Task Modal (Step 1: Upload)

**Layout:**
- Title: "Adapt Task for [Student Name]"
- Upload options (buttons):
  - "Upload Image" (icon + label)
  - "Upload PDF" (icon + label)
  - "Paste Text" (icon + label)
- Drag-and-drop zone: "Drag and drop a file here"
- "Cancel" button

#### OCR Review Screen (Step 2)

**Layout:**
- Title: "Review Extracted Text"
- Left panel: Image preview (zoomable)
- Right panel: Extracted text (editable textarea)
- Confidence indicators (highlight low-confidence words in yellow)
- "Edit Text" button (enables editing mode)
- "Continue to Adaptation" button (primary)
- "Cancel" button

#### Adaptation Generation (Step 3)

**Loading State:**
- Animated spinner
- "Generating adaptation... This may take up to 10 seconds"
- Progress indicator (if streaming is not available)

**Review Chat Interface:**
- Split view:
  - Left: Original task (read-only, collapsible)
  - Right: Adapted task (read-only, but can be refined via chat)
- Below: Chat input box
  - Placeholder: "Request refinements (e.g., 'Make it simpler' or 'Add visual cues')"
  - Send button
- Floating action buttons (top-right):
  - "Regenerate" (restart with a different approach)
  - "Confirm and Save" (primary action)
  - "Cancel"

**Chat Message Format:**
- User messages: Right-aligned, blue background
- AI messages: Left-aligned, gray background
- Each AI message shows the updated adaptation
- Timestamp on each message

#### Adaptations Tab (Student Profile)

**List View:**
- Table or card grid:
  - Each adaptation:
    - Title (first 50 chars of original task)
    - Subject tag (icon + label)
    - Status badge
    - Created by (user name + avatar)
    - Date (relative: "2 days ago")
    - "View" button

**Detail View (Modal or Side Panel):**
- Header: Task title (editable by Therapist/Admin)
- Section 1: Original Task
  - Collapsible panel
  - Full original text
  - "Show less / Show more" toggle
- Section 2: Adapted Task
  - Full adapted content
  - Rich text formatting
  - "Copy to Clipboard" button
- Section 3: Adaptation Metadata
  - Created by: [User name]
  - Created at: [Date]
  - Status: [Badge]
  - Subject: [Tag]
  - Explanation: [AI's explanation of changes]
- Section 4: Refinement History (if applicable)
  - Chronological list of refinement requests
  - Each request shows: User input → AI response
- Actions:
  - "Use as Template" button
  - "Edit" button (Therapist/Admin only)
  - "Delete" button (Admin only)

### 4.3 Data Model

#### TaskAdaptation Entity
```typescript
interface TaskAdaptation {
  id: string; // UUID
  studentId: string; // Student ID
  originalTask: string; // Original task content (plain text or HTML)
  originalTaskSource: TaskSource; // IMAGE, PDF, TEXT, PHOTO
  originalTaskUrl: string | null; // S3 URL if image/PDF was uploaded
  adaptedTask: string; // Final adapted task content (HTML)
  explanation: string; // AI's explanation of changes
  status: AdaptationStatus; // DRAFT, CONFIRMED, ARCHIVED
  subject: string | null; // e.g., "Math", "Reading"
  difficulty: string | null; // e.g., "Easy", "Medium", "Hard"
  createdBy: string; // User ID
  confirmedBy: string | null; // User ID (if different from creator)
  confirmedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

enum TaskSource {
  IMAGE = 'IMAGE',
  PDF = 'PDF',
  TEXT = 'TEXT',
  PHOTO = 'PHOTO',
}

enum AdaptationStatus {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  ARCHIVED = 'ARCHIVED',
}
```

#### RefinementHistory Entity
```typescript
interface RefinementHistory {
  id: string; // UUID
  adaptationId: string; // TaskAdaptation ID
  userMessage: string; // User's refinement request
  aiResponse: string; // AI's updated adaptation
  version: number; // Incremental version (1, 2, 3...)
  createdAt: Date;
}
```

#### Relationships
- TaskAdaptation → Student: Many-to-one
- TaskAdaptation → User (createdBy): Many-to-one
- TaskAdaptation → RefinementHistory: One-to-many

### 4.4 Business Logic

#### OCR Service
- Use Tesseract.js (open-source) or AWS Textract (cloud-based)
- Supported languages: Spanish, English (configurable)
- Confidence threshold: Flag words with <70% confidence
- Max processing time: 30 seconds (timeout)

#### LLM Integration (LangChain)
- Model: OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, or equivalent
- Max tokens: 2048 for response
- Temperature: 0.7 (creative but consistent)
- Streaming: Enable for real-time updates
- Timeout: 30 seconds
- Retry logic: 3 retries with exponential backoff on failures

#### Context Retrieval for Prompt
- Fetch student profile (condition, interests, learning preferences)
- Fetch last 5 notes (Therapeutic + Academic) for recent context
- Summarize notes into 2-3 sentences (use a smaller LLM for summarization)
- Include user's locale for language preference

#### Adaptation Versioning
- Each refinement creates a new version
- Only the latest version is displayed by default
- Previous versions accessible via "View History"
- Confirmed adaptation locks the version (further refinements create a new adaptation)

#### Subject Tagging
- Auto-detect subject from task content (use keyword matching or LLM classification)
- Common subjects: Math, Reading, Writing, Science, Social Studies, Art, PE
- Allow manual override by user

## 5. Non-Functional Requirements

### 5.1 Security & Privacy

#### Data Privacy
- Original task images/PDFs stored in private S3 bucket
- Signed URLs with 1-hour expiration
- No student PII sent to external LLM APIs
- Prompts anonymize student names (use "the student" instead of actual names)

#### RBAC
- Only assigned Teachers, Therapists, and Admins can create adaptations
- Parents can view confirmed adaptations (read-only)
- Audit log for all adaptation creations and confirmations

#### Rate Limiting
- Max 50 adaptation generations per user per day (prevent abuse)
- Max 10 refinement requests per adaptation (prevent infinite loops)
- Display remaining quota to user

### 5.2 Performance

- OCR processing: < 10 seconds for typical image
- LLM adaptation generation: < 10 seconds (streaming preferred)
- Refinement request: < 10 seconds
- Adaptation detail view load: < 1 second
- File upload: < 5 seconds for 10MB file

#### Scalability
- Queue LLM requests (BullMQ or similar) to handle spikes
- Cache student profiles for 5 minutes to reduce DB queries
- Use CDN for uploaded images/PDFs

### 5.3 Internationalization

#### AI Response Language
- Prompt must specify target language: "Respond in Spanish (es-AR)"
- AI responses must be in the user's selected locale
- Fallback to English if unsupported language

#### UI Strings
```json
// i18n/locales/es/adaptation.json
{
  "adapt": {
    "title": "Adaptar Tarea para {studentName}",
    "uploadImage": "Subir Imagen",
    "uploadPDF": "Subir PDF",
    "pasteText": "Pegar Texto",
    "dragDrop": "Arrastra y suelta un archivo aquí",
    "processing": "Procesando...",
    "generating": "Generando adaptación... Esto puede tomar hasta 10 segundos",
    "reviewText": "Revisar Texto Extraído",
    "continueToAdaptation": "Continuar con Adaptación",
    "requestRefinements": "Solicitar refinamientos (ej: 'Hacerlo más simple' o 'Agregar ayudas visuales')",
    "confirmAndSave": "Confirmar y Guardar",
    "regenerate": "Regenerar",
    "cancel": "Cancelar"
  },
  "status": {
    "DRAFT": "Borrador",
    "CONFIRMED": "Confirmado",
    "ARCHIVED": "Archivado"
  },
  "errors": {
    "ocrFailed": "No se pudo extraer texto de la imagen. Por favor, intenta con otra imagen o pega el texto manualmente.",
    "llmFailed": "Error al generar la adaptación. Por favor, intenta nuevamente.",
    "quotaExceeded": "Has alcanzado el límite diario de adaptaciones. Intenta mañana o contacta al administrador."
  }
}
```

### 5.4 Accessibility

- File upload: Keyboard accessible (Enter to open file picker)
- OCR review: Text area fully keyboard navigable
- Chat interface: Keyboard accessible (Enter to send, Shift+Enter for new line)
- Screen reader: Announce when adaptation is generated
- Color contrast: Status badges use color + icon

## 6. AI/ML Specifications

### 6.1 LangChain Implementation

#### Chain Architecture
```typescript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.7,
  maxTokens: 2048,
  streaming: true,
});

const SYSTEM_PROMPT = `You are an expert pedagogical assistant...`;

const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", SYSTEM_PROMPT],
  ["user", "Original Task:\n{task}\n\nPlease generate an adapted version."],
]);

const adaptationChain = promptTemplate
  .pipe(llm)
  .pipe(new StringOutputParser());

// Usage
const result = await adaptationChain.invoke({
  studentName: "the student", // Anonymized
  condition: student.condition,
  interests: student.interests.join(", "),
  learningPreferences: student.learningPreferences.join(", "),
  recentNoteSummary: noteSummary,
  language: user.locale,
  task: originalTask,
});
```

#### Streaming Implementation
```typescript
const stream = await adaptationChain.stream({
  // ... same params
});

for await (const chunk of stream) {
  // Send chunk to frontend via WebSocket or SSE
  sendChunkToClient(chunk);
}
```

### 6.2 LangGraph Workflow (Refinement Loop)

#### State Graph Definition
```typescript
import { StateGraph, END } from "@langchain/langgraph";

interface AdaptationState {
  originalTask: string;
  studentProfile: StudentProfile;
  currentAdaptation: string;
  refinementRequests: string[];
  version: number;
}

const workflow = new StateGraph<AdaptationState>({
  channels: {
    originalTask: { value: (x, y) => y },
    studentProfile: { value: (x, y) => y },
    currentAdaptation: { value: (x, y) => y },
    refinementRequests: { value: (x, y) => [...x, y] },
    version: { value: (x, y) => y + 1 },
  },
});

workflow.addNode("generate", async (state) => {
  const adaptation = await generateAdaptation(state.originalTask, state.studentProfile);
  return { ...state, currentAdaptation: adaptation, version: 1 };
});

workflow.addNode("refine", async (state) => {
  const latestRequest = state.refinementRequests[state.refinementRequests.length - 1];
  const refinedAdaptation = await refineAdaptation(
    state.currentAdaptation,
    latestRequest,
    state.studentProfile
  );
  return { ...state, currentAdaptation: refinedAdaptation, version: state.version + 1 };
});

workflow.addConditionalEdges("generate", shouldRefine, {
  refine: "refine",
  done: END,
});

workflow.addConditionalEdges("refine", shouldRefine, {
  refine: "refine",
  done: END,
});

workflow.setEntryPoint("generate");

const app = workflow.compile();
```

#### Node Implementations
```typescript
async function generateAdaptation(task: string, profile: StudentProfile): Promise<string> {
  // Call LLM with initial prompt
  return await adaptationChain.invoke({ task, ...profile });
}

async function refineAdaptation(
  currentAdaptation: string,
  refinementRequest: string,
  profile: StudentProfile
): Promise<string> {
  const refinementPrompt = ChatPromptTemplate.fromMessages([
    ["system", SYSTEM_PROMPT],
    ["assistant", currentAdaptation],
    ["user", "Please refine the adaptation based on this feedback: {refinementRequest}"],
  ]);

  const refinementChain = refinementPrompt.pipe(llm).pipe(new StringOutputParser());

  return await refinementChain.invoke({ refinementRequest, ...profile });
}

function shouldRefine(state: AdaptationState): "refine" | "done" {
  // Check if user requested more refinements
  // This would be controlled by user input from frontend
  return state.version < 10 ? "refine" : "done"; // Max 10 versions
}
```

### 6.3 Prompt Engineering Guidelines

#### Effective Prompts
- **Be specific:** "Simplify to 5th-grade reading level" vs "Make it simpler"
- **Use examples:** Include a few-shot example of good adaptations
- **Constrain output:** "Respond in Spanish. Use bullet points for instructions."
- **Provide context:** Include student's interests, condition, and recent notes

#### Prompt Evaluation
- Test prompts with 10+ diverse task types (math, reading, writing, science)
- Measure quality: Clarity, age-appropriateness, engagement, learning objective preservation
- A/B test different prompt versions
- Collect user feedback: "Was this adaptation helpful? (Yes/No/Needs improvement)"

### 6.4 Fallback Behaviors

#### LLM Unavailable
- **Detection:** API timeout or 5xx error
- **Fallback:** Show error message + offer to retry
- **Recovery:** Queue request for retry (3 attempts with exponential backoff)

#### Low-Quality Adaptation
- **Detection:** User regenerates multiple times or provides negative feedback
- **Fallback:** Offer "Manual Mode" where user can write adaptation with AI suggestions
- **Recovery:** Log issue for prompt engineering review

#### Context Too Large
- **Detection:** Token limit exceeded (>8K tokens)
- **Fallback:** Truncate oldest notes, keep student profile + task
- **Recovery:** Summarize notes more aggressively

## 7. Edge Cases & Error Handling

### OCR Fails to Extract Text
- **Scenario:** Image is too blurry or handwriting is illegible
- **Detection:** OCR confidence <50% for entire image
- **Error Message:** "No text detected. Please upload a clearer image or paste text manually."
- **Recovery:** Offer manual text entry

### LLM Returns Incomplete Response
- **Scenario:** LLM stops mid-sentence due to token limit
- **Detection:** Response ends without proper conclusion
- **Error Message:** "Adaptation incomplete. Regenerating..."
- **Recovery:** Automatically retry with higher token limit

### User Uploads Non-Task Content
- **Scenario:** User uploads a photo of a cat instead of a task
- **Detection:** LLM recognizes irrelevant content
- **Error Message:** "This doesn't appear to be an educational task. Please upload a task or worksheet."
- **Recovery:** User can retry or cancel

### Simultaneous Refinement Requests
- **Scenario:** User clicks "Send" multiple times quickly
- **Detection:** Frontend debounces requests (500ms delay)
- **Error Message:** None (handled gracefully)
- **Recovery:** Only the last request is sent

### Quota Exceeded
- **Scenario:** User generates 50 adaptations in one day
- **Detection:** Check counter in Redis
- **Error Message:** "You've reached the daily limit of 50 adaptations. Please try again tomorrow or contact your administrator."
- **Recovery:** Admin can increase quota for specific users

## 8. Testing Strategy

### 8.1 Unit Tests

**Services:**
- `AdaptationService.generateAdaptation()` - valid task, empty task, very long task
- `AdaptationService.refineAdaptation()` - various refinement requests
- `OcrService.extractText()` - clear image, blurry image, no text
- `PromptBuilder.buildPrompt()` - with full profile, with minimal profile
- `StudentProfileSummarizer.summarize()` - various note types

**Utilities:**
- `sanitizeHtml()` - malicious input in adaptation
- `detectSubject()` - various task types

### 8.2 Integration Tests

**API Endpoints:**
- `POST /api/adaptations` - create with text, create with image, create with PDF
- `PATCH /api/adaptations/:id/refine` - valid refinement, quota exceeded
- `GET /api/students/:studentId/adaptations` - pagination, filtering by status

**LangChain Integration:**
- Mock LLM responses for consistent testing
- Test prompt construction with various profiles
- Test streaming vs non-streaming

### 8.3 E2E Tests

**Critical Flows:**
1. **Teacher uploads image and generates adaptation:**
   - Teacher logs in
   - Opens student profile
   - Clicks "Adapt Task"
   - Uploads image of a worksheet
   - Reviews OCR extraction
   - Clicks "Generate Adaptation"
   - Waits for adaptation (with loading indicator)
   - Reviews adaptation
   - Clicks "Confirm and Save"
   - Verifies adaptation appears in student's timeline

2. **Teacher refines adaptation:**
   - Teacher generates adaptation
   - Types "Make the instructions simpler and use bullet points"
   - Waits for refined adaptation
   - Reviews changes
   - Clicks "Confirm and Save"
   - Verifies refinement history is preserved

3. **Parent views confirmed adaptation:**
   - Parent logs in
   - Opens child's profile
   - Navigates to "Adaptations" tab
   - Clicks on a confirmed adaptation
   - Verifies can see original and adapted tasks
   - Cannot edit or delete

### 8.4 AI Testing

**Prompt Evaluation Suite:**
- Test with 20 diverse tasks (math word problems, reading comprehension, writing prompts, science labs)
- Test with 5 different conditions (Dyslexia, ADHD, Autism, Visual Impairment, Hearing Impairment)
- Test in both Spanish and English
- Manual review by Therapists for quality

**Refinement Testing:**
- Test 10 common refinement requests (e.g., "Simpler", "Add visuals", "Shorter", "More engaging")
- Verify AI incorporates feedback
- Verify AI doesn't lose context after multiple refinements

## 9. Success Metrics

### Quantitative
- 80% of adaptations approved on first generation (low refinement rate)
- Average generation time < 10 seconds
- 90% of users rate adaptations as "Helpful" or "Very helpful"
- Teachers save 25+ minutes per adaptation compared to manual process

### Qualitative
- Teachers report: "The AI understands my students' needs"
- "Adaptations are high-quality and save me so much time"
- "I rarely need to refine more than once"

### AI Performance
- Average prompt tokens: <2000
- Average response tokens: <1500
- Streaming latency: <500ms for first token
- LLM API success rate: >98%

## 10. Dependencies

### Required Features
- Spec 001: User & Role Management
- Spec 002: Holistic Student Profile

### Required Infrastructure
- LLM API (OpenAI, Anthropic, or similar)
- OCR service (Tesseract.js or AWS Textract)
- S3 for file storage
- Redis for rate limiting
- Message queue (BullMQ) for async processing

### Required Libraries
- LangChain: `@langchain/core`, `@langchain/openai`, `@langchain/langgraph`
- OCR: `tesseract.js` or AWS SDK
- File upload: `multer` (NestJS)
- WebSockets or SSE for streaming

## 11. Open Questions

1. **LLM Provider:** OpenAI vs Anthropic vs open-source (Llama 3)?
   - **Decision needed by:** Pre-implementation
   - **Assumption:** OpenAI GPT-4o for MVP (best balance of quality and cost)

2. **OCR Provider:** Open-source (Tesseract) vs cloud (AWS Textract)?
   - **Decision needed by:** Pre-implementation
   - **Assumption:** Tesseract.js for MVP (cost-effective), upgrade to Textract if accuracy insufficient

3. **Streaming:** Real-time streaming vs batch response?
   - **Decision needed by:** Pre-implementation
   - **Assumption:** Real-time streaming for better UX

4. **Context Length:** How many notes to include in prompt?
   - **Decision needed by:** Based on testing
   - **Assumption:** Last 5 notes (summarized) to stay under token limits

## 12. Future Enhancements

### Phase 2
- Voice-to-text for task upload (speak the task aloud)
- Multi-language adaptation (translate task to different language)
- Adaptation templates (pre-defined adaptation strategies)
- Batch adaptation (adapt multiple tasks at once)
- AI-suggested accommodations (proactive suggestions)

### Phase 3
- Visual adaptation (generate visual aids or diagrams)
- Difficulty slider (adjust adaptation difficulty level dynamically)
- Learning objective extraction (AI identifies learning goals)
- Adaptation analytics (which adaptation strategies work best?)
- Collaborative adaptation (multiple users refine together)

---

**Specification Last Updated:** 2025-11-05
**Next Review:** 2025-12-05
