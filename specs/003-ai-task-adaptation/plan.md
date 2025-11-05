# Implementation Plan: AI-Powered Task Adaptation

## Feature Summary
Core AI feature that uses LangChain/LangGraph to automatically adapt educational tasks for students based on their comprehensive profile, interests, and learning preferences. Reduces task adaptation time from 30-60 minutes to <10 seconds.

## Technical Approach

### Architecture
- **AI Framework**: LangChain for LLM orchestration, LangGraph for stateful refinement workflow
- **LLM**: OpenAI GPT-4o or Anthropic Claude 3.5 Sonnet
- **OCR**: Tesseract.js for text extraction from images/PDFs
- **Storage**: S3 for uploaded task files
- **Queue**: BullMQ for async LLM request processing

### Key Components
1. **OCR Module**: Extract text from images and PDFs
2. **Prompt Builder**: Construct context-rich prompts with student profile
3. **LangChain Integration**: LLM chain for adaptation generation
4. **LangGraph Workflow**: Stateful refinement loop
5. **Adaptation Storage**: Save adaptations and refinement history

## Implementation Phases

### Phase 1: OCR Service (Days 1-3)
- Integrate Tesseract.js
- Build text extraction from images
- Build text extraction from PDFs
- Implement confidence scoring
- Handle low-confidence text review

### Phase 2: LangChain Setup (Days 4-6)
- Configure OpenAI/Anthropic client
- Build prompt templates (system + user)
- Create adaptation chain
- Implement streaming responses
- Add error handling and retries

### Phase 3: Prompt Engineering (Days 7-9)
- Design comprehensive system prompt
- Include student profile context
- Add recent notes summarization
- Test with diverse task types
- A/B test prompt variations

### Phase 4: Task Adaptation Entity & Service (Days 10-12)
- Create TaskAdaptation entity
- Create RefinementHistory entity
- Build adaptation CRUD service
- Implement context retrieval logic
- Add subject auto-detection

### Phase 5: LangGraph Refinement Workflow (Days 13-15)
- Design state graph for refinement
- Implement generate node
- Implement refine node
- Add conditional edges
- Test refinement loop

### Phase 6: API Endpoints (Days 16-18)
- POST /api/adaptations (create)
- PATCH /api/adaptations/:id/refine
- GET /api/students/:studentId/adaptations
- Add rate limiting (50/day per user)
- WebSocket/SSE for streaming

### Phase 7: Frontend - Upload & Generation (Days 19-24)
- Build Adapt Task modal
- Implement file upload (image, PDF, text)
- Add OCR review screen
- Create adaptation generation UI
- Add loading states and animations

### Phase 8: Frontend - Review Chat Interface (Days 25-28)
- Build split-view (original vs adapted)
- Implement chat interface for refinements
- Add streaming response display
- Create action buttons (Confirm, Regenerate)
- Handle error states

### Phase 9: Testing & Optimization (Days 29-33)
- Unit tests for all services
- Integration tests for API endpoints
- E2E tests for adaptation flow
- AI prompt evaluation (20+ task types)
- Performance testing and optimization

## Dependencies

### External Dependencies
- `@langchain/core`, `@langchain/openai`, `@langchain/langgraph`
- `tesseract.js` or `@aws-sdk/client-textract`
- `bullmq` - Job queue
- `@aws-sdk/client-s3` - File storage
- `socket.io` or Server-Sent Events for streaming

### Internal Dependencies
- Spec 001: User & Role Management
- Spec 002: Holistic Student Profile
- OpenAI or Anthropic API key

## Risks & Mitigations

### Risk 1: LLM Response Quality Variability
- **Mitigation**: Extensive prompt engineering, few-shot examples, A/B testing, user feedback loop

### Risk 2: LLM API Costs
- **Mitigation**: Rate limiting (50/day), efficient prompts, summarize context, cache student profiles

### Risk 3: OCR Accuracy for Handwritten Text
- **Mitigation**: User review screen, manual text correction, upgrade to AWS Textract if needed

### Risk 4: Streaming Failures
- **Mitigation**: Fallback to batch responses, implement retry logic, clear error messages

### Risk 5: Token Limit Exceeded
- **Mitigation**: Summarize notes aggressively, truncate oldest context, warn user upfront

## Success Criteria

- [ ] 80% of adaptations approved on first generation
- [ ] Average generation time < 10 seconds
- [ ] OCR accuracy >85% for printed text
- [ ] 90% user satisfaction rating
- [ ] <2% rate limit violations
- [ ] Streaming works smoothly without lag
- [ ] Teachers save 25+ minutes per adaptation

## Estimated Timeline
**Total: 33 days (6-7 weeks)**
