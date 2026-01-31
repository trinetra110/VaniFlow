import React, { useMemo } from "react";
import { TextField, Box, Typography } from "@mui/material";

const HighlightedText = ({ text, currentWordIndex, onTextChange, disabled }) => {
  const words = useMemo(() => text.split(/(\s+)/), [text]);

  if (disabled) {
    return (
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          lineHeight: 1.8,
          fontSize: { xs: "1rem", md: "1.2rem" },
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          backgroundColor: "#f9f9f9",
          minHeight: { xs: "200px", md: "150px" },
          maxHeight: "60vh",
          overflowY: "auto",
          wordWrap: "break-word",
          overflowWrap: "break-word",
        }}
      >
        <Typography
          variant="body1"
          component="div"
          sx={{ 
            fontSize: "inherit", 
            lineHeight: "inherit",
            whiteSpace: "pre-wrap",
          }}
        >
          {words.map((segment, index) => {
            if (/^\s+$/.test(segment)) {
              return <span key={index}>{segment}</span>;
            }
            
            const wordIndex = words.slice(0, index).filter(s => !/^\s+$/.test(s)).length;
            
            return (
              <span
                key={index}
                style={{
                  backgroundColor:
                    wordIndex === currentWordIndex ? "#ffeb3b" : "transparent",
                  padding: wordIndex === currentWordIndex ? "2px 4px" : "0",
                  borderRadius: "4px",
                  transition: "background-color 0.2s ease",
                }}
              >
                {segment}
              </span>
            );
          })}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        "& .MuiInputBase-root": {
          backgroundColor: "#f9f9f9",
        },
      }}
    >
      <TextField
        multiline
        fullWidth
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        minRows={6}
        maxRows={15}
        sx={{
          "& .MuiInputBase-input": {
            fontSize: { xs: "1rem", md: "1.2rem" },
            lineHeight: 1.8,
            fontFamily: "inherit",
          },
        }}
        placeholder="Enter text to speak..."
      />
    </Box>
  );
};

export default HighlightedText;
