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

// ProgressBar component
function ProgressBar({ progress }) {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
}

// Toast component
function Toast({ message, type, onClose }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className={`toast ${type}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4 }}
        >
          <span>{message}</span>
          <button className="toast-close" onClick={onClose}>&times;</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const API_URL = "https://ayush0910-deepfake-detector.hf.space/api/infer";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toast, setToast] = useState({ message: "", type: "" });

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
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", API_URL);
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percent);
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            if (data.error) {
              setError(data.error);
              setToast({ message: data.error, type: "error" });
            } else {
              setResult(data);
              setToast({ message: "Analysis complete!", type: "success" });
            }
            resolve();
          } else {
            setError("Failed to analyze file.");
            setToast({ message: "Failed to analyze file.", type: "error" });
            reject();
          }
        };
        xhr.onerror = () => {
          setError("Failed to analyze file.");
          setToast({ message: "Failed to analyze file.", type: "error" });
          reject();
        };
        xhr.send(formData);
      });
    } catch (err) {
      // error already set
    }
    setLoading(false);
    setUploadProgress(0);
  };

  const closeToast = () => setToast({ message: "", type: "" });

  return (
    <Router>
      <div className="container">
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
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
              {uploadProgress > 0 && uploadProgress < 100 && (
                <ProgressBar progress={uploadProgress} />
              )}
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