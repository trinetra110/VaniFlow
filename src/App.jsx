import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Slider,
  Alert,
  Snackbar,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";

import { useWebSpeech } from "./hooks/useWebSpeech";
import HighlightedText from "./components/HighlightedText";
import { languageOptions } from "./data/languages";

function App() {
  const { voices, isSpeaking, isPaused, speak, pause, resume, cancel } =
    useWebSpeech();

  // State for UI
  const [selectedLangCode, setSelectedLangCode] = useState("en-IN");
  const [rate, setRate] = useState(1);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [errorMsg, setErrorMsg] = useState("");
  const [customText, setCustomText] = useState("");

  // Get current content based on selection
  const currentContent =
    languageOptions.find((l) => l.code === selectedLangCode) ||
    languageOptions[0];

  const displayText = customText || currentContent.text;

  const handleBoundary = (event) => {
    if (event.name === "word") {
      const charIndex = event.charIndex;
      const textUntilNow = displayText.slice(0, charIndex + 1);
      const wordCount = textUntilNow.trim().split(/\s+/).length - 1;
      setCurrentWordIndex(wordCount);
    }
  };

  const handlePlay = () => {
    if (isPaused) {
      resume();
      return;
    }

    if (!window.speechSynthesis) {
      setErrorMsg("Your browser does not support Text-to-Speech.");
      return;
    }

    const voice = voices.find((v) => v.lang.includes(selectedLangCode));

    if (!voice) {
      const fallbackVoice = voices.find((v) =>
        v.lang.startsWith(selectedLangCode.split("-")[0]),
      );

      if (fallbackVoice) {
        speak(
          displayText,
          fallbackVoice.voiceURI,
          rate,
          handleBoundary,
          () => setCurrentWordIndex(-1),
        );
        setErrorMsg(
          `Exact match not found. Using ${fallbackVoice.name} instead.`,
        );
      } else {
        setErrorMsg(`No voice available for this language on your device.`);
      }
    } else {
      speak(displayText, voice.voiceURI, rate, handleBoundary, () => setCurrentWordIndex(-1));
    }
  };

  const handleStop = () => {
    cancel();
    setCurrentWordIndex(-1);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center" color="primary">
          VaniFlow
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }} alignItems="center">
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={selectedLangCode}
                label="Language"
                onChange={(e) => {
                  handleStop(); // Stop audio if language changes
                  setSelectedLangCode(e.target.value);
                  setCustomText(""); // Reset custom text when language changes
                }}
              >
                {languageOptions.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>Speed: {rate}x</Typography>
            <Slider
              value={rate}
              min={0.5}
              max={2}
              step={0.1}
              onChange={(_, newVal) => setRate(newVal)}
              disabled={isSpeaking}
            />
          </Grid>
        </Grid>

        <HighlightedText
          text={displayText}
          currentWordIndex={currentWordIndex}
          onTextChange={setCustomText}
          disabled={isSpeaking || isPaused}
        />

        <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
          {!isSpeaking || isPaused ? (
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrowIcon />}
              onClick={handlePlay}
            >
              {isPaused ? "Resume" : "Play"}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="warning"
              size="large"
              startIcon={<PauseIcon />}
              onClick={pause}
            >
              Pause
            </Button>
          )}

          <Button
            variant="outlined"
            color="error"
            size="large"
            startIcon={<StopIcon />}
            onClick={handleStop}
            disabled={!isSpeaking && !isPaused}
          >
            Stop
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={!!errorMsg}
        autoHideDuration={6000}
        onClose={() => setErrorMsg("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="warning" onClose={() => setErrorMsg("")}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
