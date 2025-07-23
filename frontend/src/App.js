import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

// Spinner component
function Spinner() {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
    </div>
  );
}

const API_URL = "https://ayush0910-deepfake-detector.hf.space/api/infer";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setResult(null);
    setError("");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
      "audio/*": []
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Failed to analyze file.");
    }
    setLoading(false);
  };

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={
            <>
              <motion.h1
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="title"
              >
                Deepfake Detector
              </motion.h1>
              <motion.div
                {...getRootProps()}
                className={`dropzone${isDragActive ? " active" : ""}`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <input {...getInputProps()} />
                {file ? (
                  <span>{file.name}</span>
                ) : isDragActive ? (
                  <span>Drop your file here...</span>
                ) : (
                  <span>Drag & drop or click to select an image, video, or audio file</span>
                )}
              </motion.div>
              {loading && <Spinner />}
              <motion.button
                className="analyze-btn"
                onClick={handleUpload}
                disabled={!file || loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? "Analyzing..." : "Analyze"}
              </motion.button>
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="error"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    {error}
                  </motion.div>
                )}
                {result && (
                  <motion.div
                    className="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <h2>Result</h2>
                    <div>
                      <strong>Prediction:</strong> {result.prediction}
                    </div>
                    <div>
                      <strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%
                    </div>
                    <div>
                      <strong>Type:</strong> {result.modality}
                    </div>
                    <div>
                      <strong>Processing Time:</strong> {result.processing_time?.toFixed(2)}s
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <footer>
                <span>
                  Powered by <a href="https://huggingface.co/spaces/ayush0910/Deepfake_Detector" target="_blank" rel="noopener noreferrer">Deepfake Detector API</a>
                </span>
              </footer>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;