# VaniFlow

A frontend-only web application that synchronizes Text-to-Speech audio playback with real-time text highlighting. Built with React and the Web Speech API.

## Features

- Text-to-Speech synthesis with real-time word highlighting
- Support for multiple Indian languages: English, Hindi, Gujarati, Marathi, Tamil, Telugu
- Editable text input for custom speech content
- Adjustable speech rate (0.5x to 2x)
- Playback controls: Play, Pause, Resume, Stop
- Responsive design for desktop and mobile devices
- Automatic voice fallback when exact language match is unavailable

## Tech Stack

- React 19.2.0
- Material-UI (MUI) 7.3.7
- Vite 7.2.4
- Web Speech API (SpeechSynthesis)

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Project Architecture

```
src/
├── components/
│   └── HighlightedText.jsx    # Text display with highlighting
├── hooks/
│   └── useWebSpeech.js         # Web Speech API wrapper
├── data/
│   └── languages.js            # Language configurations
├── App.jsx                      # Main application component
└── main.jsx                     # Application entry point
```

## Development Stages

### Stage 1: Core Text-to-Speech Implementation
- Integrated Web Speech API for browser-based TTS
- Implemented voice selection and speech rate control
- Created custom React hook for speech synthesis management

### Stage 2: Word-Level Synchronization
- Utilized SpeechSynthesisUtterance boundary events for word tracking
- Implemented character-to-word index mapping for accurate highlighting
- Added real-time state management for current word position

### Stage 3: Multi-Language Support
- Added support for six Indian languages with native scripts
- Implemented voice fallback mechanism for unavailable languages
- Created language-specific sample texts for testing

### Stage 4: Editable Text Feature
- Implemented dual-mode text display (editable vs. highlighted)
- Added state management for custom text input
- Ensured text persistence during language switching

### Stage 5: Mobile Optimization
- Fixed highlighting issues on mobile browsers
- Optimized text rendering for smaller screens
- Improved touch interaction and responsiveness

## Problems Faced and Solutions

### Problem 1: Highlighting Not Visible on Mobile
**Issue:** The initial implementation using `display: inline-block` caused text wrapping issues and highlighting problems on mobile browsers.

**Solution:** Switched to a dual-mode approach - editable TextField when not speaking, and span-based highlighting during speech. This ensures proper text flow and visible highlighting across all devices.

### Problem 2: Last Word Remaining Highlighted
**Issue:** After speech completion, the last word remained highlighted, causing visual confusion.

**Solution:** Added an `onEnd` callback to the speak function that resets the `currentWordIndex` to -1 when speech synthesis completes, ensuring all highlights are cleared.

### Problem 4: Voice Availability Across Devices
**Issue:** Different devices have different sets of available voices, causing failures when exact language matches aren't found.

**Solution:** Implemented a graceful fallback mechanism that first tries exact language code match, then falls back to language family (e.g., 'hi' instead of 'hi-IN'), and displays appropriate error messages when no voice is available.

## Known Limitations

### Browser Compatibility
- **Android:** The Web Speech API is not fully supported, and the application may/may not function correctly (ex: the pause button may work as stop button or not work at all, etc).
- **Chrome/Chromium Browsers:** The `onboundary` event is not consistently fired for all languages and voices, which may result in missing or delayed word highlighting.
- **Safari/iOS:** Some Indian language voices may not be pre-installed and require device language settings configuration.

### Highlighting Accuracy
- Word highlighting depends on browser implementation of the boundary event. In browsers with limited support, highlighting may be:
  - Delayed or skipped for certain words
  - Completely absent for some languages
  - Inconsistent across different voice selections

### Performance
- Large text blocks may experience slight delays in highlighting updates
- Speech synthesis voice loading is asynchronous and may cause initial delays

### Language Support
- Availability of specific language voices depends on the user's device and operating system
- Voice quality and naturalness vary significantly across languages and platforms

## License

MIT
