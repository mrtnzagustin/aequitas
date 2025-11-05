# 006: Speech-to-Text Data Entry

**Status:** Draft
**Epic:** Platform Usability
**Priority:** P2
**Assigned To:** TBD
**Target Release:** v1.0 (MVP)

## 1. Overview

Speech-to-Text (STT) enables users to dictate notes, task descriptions, and other text entries hands-free. This feature dramatically speeds up data entry for busy teachers and therapists who need to quickly document observations.

## 2. Problem Statement

**Current State:** Users must type notes manually, which is slow and interrupts workflow (e.g., teacher observing a student in class can't easily take notes).

**Desired State:** Users can click a microphone button, speak their thoughts, and have them transcribed in real-time into the text field.

## 3. Core Behaviors

### Microphone Button

```gherkin
Given a user is on any text entry field (note content, task description, etc.)
When they see a microphone icon in the text area
And they click the microphone button
Then the browser's SpeechRecognition API starts listening
And the button changes to indicate "Recording" (red pulse animation)

Given the user is speaking
When their speech is transcribed
Then the text appears in real-time in the text area
And punctuation is automatically added (if supported by browser)

Given the user clicks the microphone button again
When recording stops
Then the text remains in the field
And the user can edit it before saving
```

### Language Detection

```gherkin
Given a user's locale is set to Spanish (es-AR)
When they start speech recognition
Then the SpeechRecognition API is initialized with lang: 'es-AR'
And transcription is optimized for Spanish

Given a user's locale is English (en-US)
When they start speech recognition
Then the SpeechRecognition API is initialized with lang: 'en-US'
```

## 4. Technical Implementation

### Browser API (Web Speech API)
```typescript
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = userLocale; // e.g., 'es-AR'
recognition.interimResults = true; // Real-time transcription
recognition.continuous = true; // Keep listening until stopped

recognition.onresult = (event) => {
  const transcript = Array.from(event.results)
    .map(result => result[0].transcript)
    .join('');

  setTextAreaValue(transcript);
};

recognition.onerror = (event) => {
  console.error('Speech recognition error:', event.error);
  showErrorMessage('Speech recognition failed. Please try again.');
};

recognition.start();
```

### React Component (Example)
```typescript
import { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

export function SpeechToTextButton({ onTranscript, locale }) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = locale;
    recognitionInstance.interimResults = true;
    recognitionInstance.continuous = true;

    recognitionInstance.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      onTranscript(transcript);
    };

    recognitionInstance.start();
    setRecognition(recognitionInstance);
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <button
      onClick={isListening ? stopListening : startListening}
      className={isListening ? 'recording' : ''}
    >
      {isListening ? <MicOff /> : <Mic />}
    </button>
  );
}
```

## 5. UI/UX Considerations

### Microphone Button Placement
- Positioned inside text area (top-right corner)
- Always visible (sticky position on scroll)
- Tooltip: "Click to dictate" / "Click to stop recording"

### Recording Indicator
- Button pulses red while recording
- Optional: Display live waveform or transcript preview
- "Listening..." text below button

### Error Handling
- Browser doesn't support STT: Hide button + show fallback message
- Microphone permission denied: Show "Please allow microphone access"
- Network error: Show "Speech recognition unavailable. Please type manually."

## 6. Accessibility

**Enhancement for Accessibility:**
- Reduces typing burden for users with motor impairments
- Keyboard shortcut: `Ctrl + Shift + M` to toggle microphone
- ARIA label: "Dictate text"
- Focus indicator on microphone button

## 7. Browser Compatibility

### Supported Browsers
- Chrome/Edge: Full support (Web Speech API)
- Safari: Partial support (requires webkit prefix)
- Firefox: Limited support (may require flag enabled)

### Fallback
- If Web Speech API not available, hide microphone button
- Display tooltip: "Speech-to-text not supported in this browser. Try Chrome."

## 8. Non-Functional Requirements

### Performance
- Recognition starts within 500ms of button click
- Real-time transcription (< 100ms latency)
- No impact on page performance

### Privacy
- All speech processing happens in the browser (no data sent to server)
- User must grant microphone permission (browser prompt)
- Permission can be revoked at any time

### i18n
- Supported languages: Spanish (es-AR), English (en-US)
- Future: Auto-detect language based on user speech

## 9. Success Metrics

- 40% of users try speech-to-text within first month
- 20% of notes created using STT (at least partially)
- Average time to create note reduced by 30% (when using STT)
- User feedback: "STT is fast and accurate"

## 10. Future Enhancements

- Offline STT (using on-device models)
- Custom vocabulary (medical/therapeutic terms)
- Multi-language support (auto-detect)
- Voice commands ("New paragraph", "Delete last sentence")
- Integration with mobile app (better microphone quality)

---

**Specification Last Updated:** 2025-11-05
