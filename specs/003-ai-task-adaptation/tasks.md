# Implementation Tasks: AI-Powered Task Adaptation

## Phase 1: OCR Service

### Task 1.1: Tesseract.js Integration
- [ ] Install and configure Tesseract.js
- [ ] Set up language data (Spanish + English)
- [ ] Create OCRService class
- [ ] Write basic text extraction method
- **Estimate**: 3 hours

### Task 1.2: Image Text Extraction
- [ ] Implement extractFromImage()
- [ ] Add confidence scoring per word
- [ ] Preserve formatting (line breaks, bullets)
- [ ] Write unit tests
- **Estimate**: 4 hours

### Task 1.3: PDF Text Extraction
- [ ] Install PDF parsing library (pdf-parse)
- [ ] Implement extractFromPDF()
- [ ] Handle multi-page PDFs
- [ ] Write unit tests
- **Estimate**: 3 hours

### Task 1.4: Low-Confidence Handling
- [ ] Flag words with <70% confidence
- [ ] Create review interface data structure
- [ ] Write unit tests
- **Estimate**: 2 hours

## Phase 2: LangChain Setup

### Task 2.1: LLM Client Configuration
- [ ] Install LangChain packages
- [ ] Configure OpenAI client with API key
- [ ] Set up environment variables
- [ ] Test basic LLM call
- **Estimate**: 2 hours

### Task 2.2: Prompt Templates
- [ ] Design system prompt template
- [ ] Design user prompt template
- [ ] Create ChatPromptTemplate
- [ ] Add variable interpolation
- **Estimate**: 3 hours

### Task 2.3: Adaptation Chain
- [ ] Build LLM chain (prompt → llm → parser)
- [ ] Configure model parameters (temp=0.7, max_tokens=2048)
- [ ] Add output parser
- [ ] Write unit tests with mocked LLM
- **Estimate**: 3 hours

### Task 2.4: Streaming Implementation
- [ ] Enable streaming in LLM config
- [ ] Implement stream() method
- [ ] Test chunk-by-chunk delivery
- [ ] Write tests
- **Estimate**: 3 hours

### Task 2.5: Error Handling & Retries
- [ ] Add try-catch for LLM errors
- [ ] Implement exponential backoff (3 retries)
- [ ] Handle timeout (30s)
- [ ] Write error handling tests
- **Estimate**: 2 hours

## Phase 3: Prompt Engineering

### Task 3.1: System Prompt Design
- [ ] Write comprehensive system prompt
- [ ] Include persona ("expert pedagogical assistant")
- [ ] Add adaptation guidelines (7 rules)
- [ ] Add language specification
- **Estimate**: 3 hours

### Task 3.2: Context Integration
- [ ] Add student profile variables
- [ ] Add recent notes summary
- [ ] Format context clearly
- [ ] Test with sample data
- **Estimate**: 2 hours

### Task 3.3: Note Summarization
- [ ] Build summarizeNotes() utility
- [ ] Use smaller LLM for summarization
- [ ] Limit to 2-3 sentences
- [ ] Write unit tests
- **Estimate**: 3 hours

### Task 3.4: Prompt Testing
- [ ] Test with 10+ diverse task types
- [ ] Test with 5 different conditions
- [ ] Test in Spanish and English
- [ ] Collect quality metrics
- **Estimate**: 6 hours

### Task 3.5: Prompt Optimization
- [ ] A/B test prompt variations
- [ ] Refine based on test results
- [ ] Document final prompt version
- **Estimate**: 4 hours

## Phase 4: Task Adaptation Entity & Service

### Task 4.1: Create Entities
- [ ] Define TaskAdaptation interface
- [ ] Create TaskAdaptation entity with TypeORM
- [ ] Define RefinementHistory interface
- [ ] Create RefinementHistory entity
- [ ] Create migrations
- **Estimate**: 3 hours

### Task 4.2: Adaptation Service
- [ ] Create AdaptationService
- [ ] Implement create() method
- [ ] Implement findByStudent() with pagination
- [ ] Implement findOne() with RBAC
- [ ] Write unit tests
- **Estimate**: 4 hours

### Task 4.3: Context Retrieval
- [ ] Implement getStudentContext()
- [ ] Fetch student profile
- [ ] Fetch last 5 notes
- [ ] Summarize notes
- [ ] Cache context for 5 minutes
- [ ] Write unit tests
- **Estimate**: 4 hours

### Task 4.4: Subject Auto-Detection
- [ ] Build detectSubject() utility
- [ ] Use keyword matching or LLM classification
- [ ] Map to common subjects
- [ ] Write unit tests
- **Estimate**: 2 hours

## Phase 5: LangGraph Refinement Workflow

### Task 5.1: State Graph Design
- [ ] Define AdaptationState interface
- [ ] Create StateGraph with channels
- [ ] Design workflow diagram
- **Estimate**: 2 hours

### Task 5.2: Generate Node
- [ ] Implement generate node function
- [ ] Call adaptation chain
- [ ] Update state with result
- [ ] Write unit tests
- **Estimate**: 3 hours

### Task 5.3: Refine Node
- [ ] Implement refine node function
- [ ] Build refinement prompt
- [ ] Call LLM with refinement request
- [ ] Update state with new version
- [ ] Write unit tests
- **Estimate**: 3 hours

### Task 5.4: Conditional Edges
- [ ] Implement shouldRefine() function
- [ ] Add max version limit (10)
- [ ] Wire up conditional logic
- [ ] Write tests
- **Estimate**: 2 hours

### Task 5.5: Compile and Test Workflow
- [ ] Compile workflow
- [ ] Test full refinement loop
- [ ] Test with multiple refinements
- [ ] Write integration tests
- **Estimate**: 3 hours

## Phase 6: API Endpoints

### Task 6.1: Create Adaptation Endpoint
- [ ] POST /api/adaptations
- [ ] Handle file upload (image, PDF)
- [ ] Call OCR if needed
- [ ] Generate adaptation
- [ ] Return result
- [ ] Write integration tests
- **Estimate**: 5 hours

### Task 6.2: Refine Adaptation Endpoint
- [ ] PATCH /api/adaptations/:id/refine
- [ ] Load current adaptation
- [ ] Run refinement workflow
- [ ] Save refinement history
- [ ] Write integration tests
- **Estimate**: 4 hours

### Task 6.3: List Adaptations Endpoint
- [ ] GET /api/students/:studentId/adaptations
- [ ] Add pagination
- [ ] Filter by status
- [ ] Apply RBAC
- [ ] Write integration tests
- **Estimate**: 3 hours

### Task 6.4: Rate Limiting
- [ ] Set up Redis rate limiter
- [ ] Limit to 50/day per user
- [ ] Limit to 10 refinements per adaptation
- [ ] Return remaining quota in response
- [ ] Write tests
- **Estimate**: 3 hours

### Task 6.5: Streaming Setup
- [ ] Choose WebSocket or SSE
- [ ] Set up Socket.IO (if WS)
- [ ] Implement streaming endpoint
- [ ] Test chunk delivery
- [ ] Write integration tests
- **Estimate**: 4 hours

## Phase 7: Frontend - Upload & Generation

### Task 7.1: Adapt Task Modal
- [ ] Create AdaptTaskModal component
- [ ] Add upload options (Image, PDF, Text)
- [ ] Implement drag-and-drop
- [ ] Add file type validation
- [ ] Write component tests
- **Estimate**: 5 hours

### Task 7.2: File Upload Handler
- [ ] Implement file upload logic
- [ ] Show upload progress
- [ ] Handle upload errors
- [ ] Preview uploaded file
- [ ] Write tests
- **Estimate**: 3 hours

### Task 7.3: OCR Review Screen
- [ ] Create OCRReviewScreen component
- [ ] Display image preview (zoomable)
- [ ] Show extracted text (editable)
- [ ] Highlight low-confidence words
- [ ] Write component tests
- **Estimate**: 5 hours

### Task 7.4: Adaptation Generation UI
- [ ] Create loading state with spinner
- [ ] Show progress message
- [ ] Handle generation errors
- [ ] Write component tests
- **Estimate**: 3 hours

### Task 7.5: Modal Flow Integration
- [ ] Connect upload → OCR → generation steps
- [ ] Handle navigation between steps
- [ ] Add Cancel button logic
- [ ] Write E2E tests
- **Estimate**: 4 hours

## Phase 8: Frontend - Review Chat Interface

### Task 8.1: Split-View Layout
- [ ] Create split-view component
- [ ] Left panel: Original task (collapsible)
- [ ] Right panel: Adapted task
- [ ] Make responsive
- [ ] Write component tests
- **Estimate**: 4 hours

### Task 8.2: Chat Interface
- [ ] Create chat messages list
- [ ] Style user vs AI messages
- [ ] Add chat input box
- [ ] Implement send button
- [ ] Write component tests
- **Estimate**: 4 hours

### Task 8.3: Streaming Display
- [ ] Connect to WebSocket/SSE
- [ ] Display chunks as they arrive
- [ ] Update adapted task in real-time
- [ ] Handle stream errors
- [ ] Write tests
- **Estimate**: 5 hours

### Task 8.4: Action Buttons
- [ ] Add "Confirm and Save" button
- [ ] Add "Regenerate" button
- [ ] Add "Cancel" button
- [ ] Handle button actions
- [ ] Write tests
- **Estimate**: 3 hours

### Task 8.5: Error Handling
- [ ] Display error messages
- [ ] Handle quota exceeded
- [ ] Handle LLM failures
- [ ] Provide recovery options
- [ ] Write tests
- **Estimate**: 3 hours

## Phase 9: Testing & Optimization

### Task 9.1: Unit Tests
- [ ] Test OCRService methods
- [ ] Test AdaptationService methods
- [ ] Test prompt builder
- [ ] Test LangGraph workflow
- [ ] Achieve >90% coverage
- **Estimate**: 8 hours

### Task 9.2: Integration Tests
- [ ] Test POST /api/adaptations
- [ ] Test PATCH /api/adaptations/:id/refine
- [ ] Test rate limiting
- [ ] Test streaming
- [ ] Test file uploads
- **Estimate**: 6 hours

### Task 9.3: E2E Tests
- [ ] Test full upload → generate → confirm flow
- [ ] Test refinement flow
- [ ] Test parent views adaptation
- [ ] Test quota exceeded scenario
- **Estimate**: 6 hours

### Task 9.4: AI Prompt Evaluation
- [ ] Test with 20+ task types
- [ ] Test with 5 conditions
- [ ] Test in both languages
- [ ] Collect quality metrics
- [ ] Refine prompts based on results
- **Estimate**: 12 hours

### Task 9.5: Performance Testing
- [ ] Test OCR speed with various images
- [ ] Test LLM generation time
- [ ] Test concurrent requests
- [ ] Test streaming latency
- [ ] Optimize if needed
- **Estimate**: 6 hours

## Summary
**Total Estimated Hours**: ~165 hours
**Total Estimated Days**: ~33 days

## Dependencies
- LLM API key (OpenAI or Anthropic)
- S3 bucket configured
- Redis for rate limiting
- Spec 001 and 002 completed

## Notes
- Prompt engineering is iterative - budget extra time
- LLM costs should be monitored closely
- User feedback is critical for improving quality
