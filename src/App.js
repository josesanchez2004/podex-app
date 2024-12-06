import React, { useState } from "react";
import "./App.css"; // Updated CSS file

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [summary, setSummary] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [sentiment, setSentiment] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [speechSettings, setSpeechSettings] = useState({ pitch: 1, rate: 1 });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false); // Step 3: Loading indicator
  const [darkMode, setDarkMode] = useState(false); // Step 9: Dark mode

  const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");
    setDarkMode(!darkMode);
  };

  const handleUpload = async () => {
    if (!audioFile) return alert("Please upload an audio file");

    setLoading(true);
    const formData = new FormData();
    formData.append("audio", audioFile);

    try {
      const response = await fetch("http://localhost:3001/api/transcribe", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setTranscription(data.transcription || "");
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!transcription) return alert("Please transcribe the audio first");

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcription }),
      });
      const data = await response.json();
      setSummary(data.summary || "");
    } catch (error) {
      console.error("Error summarizing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeywords = async () => {
    if (!transcription) return alert("Please transcribe the audio first");

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcription }),
      });
      const data = await response.json();
      setKeywords(data.keywords || []);
    } catch (error) {
      console.error("Error extracting keywords:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSentiment = async () => {
    if (!transcription) return alert("Please transcribe the audio first");

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcription }),
      });
      const data = await response.json();
      setSentiment(data);
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQnA = async () => {
    if (!question || !transcription) return alert("Please provide a question and transcription");

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, transcription }),
      });
      const data = await response.json();
      setAnswer(data.answer || "No answer found");
    } catch (error) {
      console.error("Error performing Q&A:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeech = () => {
    if (!transcription) return alert("No transcription available for playback");

    const utterance = new SpeechSynthesisUtterance(transcription);
    utterance.pitch = speechSettings.pitch;
    utterance.rate = speechSettings.rate;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);

    utterance.onend = () => setIsSpeaking(false);
  };

  const handleStopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>PodEx Application</h1>
        <button className="btn-primary" onClick={toggleDarkMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>
      <main className="content">
        <div className="feature-container">
          <h2>Upload Audio</h2>
          <label htmlFor="audioUpload" className="upload-label">
            Upload an audio file to get started:
          </label>
          <input
            id="audioUpload"
            type="file"
            onChange={(e) => setAudioFile(e.target.files[0])}
            className="file-input"
          />
          <button
            onClick={handleUpload}
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Processing..." : "Transcribe"}
          </button>
        </div>

        {transcription && (
          <>
            <div className="feature-container">
              <h2>Transcription</h2>
              <p className="transcription-text">{transcription}</p>
              <div className="playback-options">
                <h3>Playback Options</h3>
                <label>
                  Pitch:
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speechSettings.pitch}
                    onChange={(e) =>
                      setSpeechSettings({ ...speechSettings, pitch: e.target.value })
                    }
                    className="slider"
                  />
                </label>
                <label>
                  Rate:
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speechSettings.rate}
                    onChange={(e) =>
                      setSpeechSettings({ ...speechSettings, rate: e.target.value })
                    }
                    className="slider"
                  />
                </label>
                <button onClick={handleSpeech} disabled={isSpeaking} className="btn-secondary">
                  Play
                </button>
                <button onClick={handleStopSpeech} className="btn-secondary">
                  Stop
                </button>
              </div>
            </div>

            <div className="feature-container">
              <button onClick={handleSummarize} className="btn-primary">
                Summarize
              </button>
              {summary && (
                <>
                  <h2>Summary</h2>
                  <p>{summary}</p>
                </>
              )}
            </div>

            <div className="feature-container">
              <button onClick={handleKeywords} className="btn-primary">
                Extract Keywords
              </button>
              {keywords.length > 0 && (
                <>
                  <h2>Keywords</h2>
                  <ul>
                    {keywords.map((keyword, index) => (
                      <li key={index}>{keyword}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="feature-container">
              <button onClick={handleSentiment} className="btn-primary">
                Analyze Sentiment
              </button>
              {sentiment && (
                <>
                  <h2>Sentiment Analysis</h2>
                  <p>Score: {sentiment.score}</p>
                  <p>Comparative: {sentiment.comparative}</p>
                  <p>Positive Words: {sentiment.positive.join(", ")}</p>
                  <p>Negative Words: {sentiment.negative.join(", ")}</p>
                </>
              )}
            </div>

            <div className="feature-container">
              <h3>Ask a Question</h3>
              <input
                type="text"
                placeholder="Enter your question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="text-input"
              />
              <button onClick={handleQnA} className="btn-primary">
                Get Answer
              </button>
              {answer && (
                <>
                  <h2>Answer</h2>
                  <p>{answer}</p>
                </>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
















