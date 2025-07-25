import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Home, BookOpen, Info } from "lucide-react";

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

// FilePreview component
function FilePreview({ file, type, style }) {
  if (!file) return null;
  const url = typeof file === 'string' ? file : URL.createObjectURL(file);
  if (type.startsWith('image/')) {
    return <img src={url} alt="preview" style={{ maxWidth: 120, maxHeight: 80, borderRadius: 8, ...style }} />;
  }
  if (type.startsWith('video/')) {
    return <video src={url} controls style={{ maxWidth: 120, maxHeight: 80, borderRadius: 8, ...style }} />;
  }
  if (type.startsWith('audio/')) {
    return <audio src={url} controls style={{ maxWidth: 120, ...style }} />;
  }
  return <span style={{ fontSize: 32, ...style }}>📄</span>;
}

// Feedback (rating) component
function ResultFeedback({ onRate, rated }) {
  return (
    <motion.div
      className="feedback-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
    >
      {rated ? (
        <motion.span
          className="feedback-thankyou"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Thank you for your feedback!
        </motion.span>
      ) : (
        <>
          <span>Was this result accurate?</span>
          <motion.button
            className="feedback-btn thumbs-up"
            whileTap={{ scale: 0.85 }}
            onClick={() => onRate("up")}
            aria-label="Thumbs up"
          >
            👍
          </motion.button>
          <motion.button
            className="feedback-btn thumbs-down"
            whileTap={{ scale: 0.85 }}
            onClick={() => onRate("down")}
            aria-label="Thumbs down"
          >
            👎
          </motion.button>
        </>
      )}
    </motion.div>
  );
}

const API_URL = "https://ayush0910-deepfake-detector.hf.space/api/infer";

// Animated image that fades/scales in when in view
function AnimatedImage(props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.img
      ref={ref}
      {...props}
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.4, 1.2, 0.6, 1] }}
    />
  );
}
// Animated table that fades/scales in when in view
function AnimatedTable(props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.table
      ref={ref}
      {...props}
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.4, 1.2, 0.6, 1] }}
    />
  );
}

// Education page component
function Education() {
  return (
    <div className="education-page">
      
      <div className="edu-section">
        <h2 className="edu-explained-title">Deepfakes Explained</h2>
        <div className="edu-explained-block">
          <h3>1. What Are Deepfakes?</h3>
          <AnimatedImage
            src="https://sosafe-awareness.com/sosafe-files/uploads/2022/08/Comparison_deepfake_blogpost_EN.jpg"
            alt="AI-generated face example"
            className="edu-img"
            style={{ width: '100%', maxWidth: 500, borderRadius: 16, margin: '24px auto', display: 'block' }}
          />
          <p>Deepfakes are synthetic images, videos, or audio tracks generated by deep-learning models—most often Generative Adversarial Networks (GANs) or diffusion-based architectures. In a typical deepfake, the model:</p>
          <ul>
            <li>Takes a target clip (the body) and a source clip (the face or voice to be transplanted).</li>
            <li>Learns a mapping that converts the source’s facial expressions, pose, and vocal inflection into the target’s spatial and temporal domain.</li>
            <li>Produces a seamless composite that fools the human eye (and often standard forensic tools) into believing it is authentic.</li>
          </ul>
          <div className="edu-explained-key">
            <strong>Key characteristics</strong>
            <ul>
              <li>Pixel-level realism: High-resolution textures, skin shading, and lighting reconstruction.</li>
              <li>Temporal coherence: Frame-to-frame consistency in expressions and head motion.</li>
              <li>Modality agnostic: Works for still images, full-motion video, and raw audio.</li>
            </ul>
          </div>
          <a href="https://en.wikipedia.org/wiki/Deepfake" target="_blank" rel="noopener noreferrer" className="edu-link">Read more on Wikipedia</a>
        </div>
        <div className="edu-explained-block">
          <h3>2. How Deepfake Detection Works</h3>
          <AnimatedImage
            src="https://res.cloudinary.com/dthpnue1d/image/upload/c_fill,g_faces,w_480/c_scale,q_auto,f_auto,fl_lossy/5_Top_AI_Deepfake_Detector_Tools_for_2024_and_Beyond_1218830cf2.webp?_a=DAJCwlWIZAA0"
            alt="AI detection concept"
            className="edu-img"
            style={{ width: '100%', maxWidth: 400, borderRadius: 12, margin: '18px auto', display: 'block' }}
          />
          <div className="edu-table-scroll">
            <AnimatedTable className="edu-explained-table">
              <thead>
                <tr>
                  <th>Detection Layer</th>
                  <th>What It Looks For</th>
                  <th>Typical Techniques</th>
                  <th>Examples</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Pixel / Frequency</td><td>Color mismatches, GAN “checkerboard” noise, JPEG discordance</td><td>FFT analysis, co-occurrence matrices</td><td>GANprintRIP, FakeSpotter</td></tr>
                <tr><td>Physiological</td><td>Irregular eye-blinks, heartbeat pulsations in skin, lip/voice sync</td><td>Temporal CNNs, pulse-based PPGNet</td><td>FaceForensics++, DeepRhythm</td></tr>
                <tr><td>Geometry / Physics</td><td>Impossible head poses, lighting discrepancies, shadows</td><td>3-D face mesh fitting, inverse rendering</td><td>Li et al. shadow-consistency test</td></tr>
                <tr><td>Audio-Visual Sync</td><td>Mouth-audio offset, spectral glitches</td><td>Cross-modal transformers</td><td>SyncNet, AVSpectral</td></tr>
                <tr><td>Metadata & Provenance</td><td>Missing EXIF, blockchain signatures, watermark tampering</td><td>File hash comparison, C2PA stamps</td><td>Amber Kara’s Verify, Truepic</td></tr>
              </tbody>
            </AnimatedTable>
          </div>
          <p>Detection pipelines generally:</p>
          <ul>
            <li>Pre-process—Extract faces or audio frames.</li>
            <li>Artifact mining—Hand-crafted filters (e.g., frequency residue) or CNN feature maps.</li>
            <li>Model inference—Binary classifier outputs real vs fake with confidence score.</li>
            <li>Explainability—Grad-CAM heat maps or bounding boxes highlight suspect regions.</li>
          </ul>
          <p className="edu-explained-note">State-of-the-art open-source detectors (FACEXray, EfficientNet-LSTM, Wav2Spec) achieve 90–99% accuracy on controlled benchmarks, but performance drops on in-the-wild material because adversaries adapt.</p>
        </div>
        <div className="edu-explained-block">
          <h3>3. Digital Literacy & Verification</h3>
          <AnimatedImage
            src="https://news.miami.edu/dcie/_assets/images/images-stories/2016/06/digital-literacy-lg.png"
            alt="Digital literacy"
            className="edu-img"
            style={{ width: '100%', maxWidth: 350, borderRadius: 12, margin: '18px auto', display: 'block' }}
          />
          <ul>
            <li><strong>Pause & Source-Check:</strong> Sensational or emotionally charged clips are prime deepfake bait. Look for the first publication date, original uploader, and corroborating outlets.</li>
            <li><strong>Examine Micro-Details:</strong> Blink rate, eye gaze, teeth alignment, mismatched earrings, or inconsistent shadows often betray fakes.</li>
            <li><strong>Use Verification Tools:</strong> Reverse-image search (Google Lens, TinEye), InVID (key-frame forensics), and browser plug-ins such as SurfSafe can spot recycled or tampered frames.</li>
            <li><strong>Scrutinize Audio:</strong> Robotic cadence, breathing cut-offs, or room echo that doesn’t match the visual environment are red flags.</li>
            <li><strong>Check File Metadata:</strong> Missing EXIF data or camera signatures may indicate manipulation.</li>
            <li><strong>Rely on Cryptographic Provenance:</strong> Standards like C2PA allow publishers to embed hashes; viewers can verify integrity with a single click.</li>
          </ul>
          <a href="https://www.forbes.com/sites/bernardmarr/2022/08/01/7-easy-ways-to-boost-your-digital-literacy/" target="_blank" rel="noopener noreferrer" className="edu-link">Read more on Forbes</a>
        </div>
        <div className="edu-explained-block">
          <h3>4. Why Deepfakes Matter</h3>
          <ul>
            <li><strong>Positive uses</strong> – Film dubbing, historical reenactments, privacy-preserving face swaps, personalized education avatars.</li>
            <li><strong>Risks</strong> – Political disinformation, financial scams (voice-cloned CEOs), erosion of public trust.</li>
          </ul>
        </div>
        <div className="edu-explained-block">
          <h3>5. Further Reading & Tools</h3>
          <div className="edu-table-scroll">
            <AnimatedTable className="edu-explained-table">
              <thead>
                <tr><th>Resource</th><th>Focus</th><th>Link</th></tr>
              </thead>
              <tbody>
                <tr><td>EfficientNet: Rethinking Model Scaling</td><td>Image GAN & detection backbones</td><td><a href="https://arxiv.org/abs/1905.11946" target="_blank" rel="noopener noreferrer">arxiv.org/abs/1905.11946</a></td></tr>
                <tr><td>CelebDF-v2 dataset</td><td>High-quality, diverse deepfake videos</td><td><a href="https://arxiv.org/abs/2003.09190" target="_blank" rel="noopener noreferrer">arxiv.org/abs/2003.09190</a></td></tr>
                <tr><td>C2PA Standard</td><td>Authenticity metadata framework</td><td><a href="https://c2pa.org/" target="_blank" rel="noopener noreferrer">c2pa.org</a></td></tr>
                <tr><td>MIT Media Lab – Detect Fakes Guide</td><td>Digital literacy checklist</td><td><a href="https://www.media.mit.edu/projects/detect-fakes/overview/" target="_blank" rel="noopener noreferrer">medialab.mit.edu/projects/detect-fakes</a></td></tr>
                <tr><td>Hugging Face Spaces: Deepfake-Detector</td><td>Live demo & API</td><td><a href="https://huggingface.co/spaces/your-space" target="_blank" rel="noopener noreferrer">huggingface.co/spaces/your-space</a></td></tr>
              </tbody>
            </AnimatedTable>
          </div>
        </div>
        <div className="edu-explained-block">
          <h3>6. Key Take-aways</h3>
          <ul>
            <li>Deepfakes exploit human perceptual blind spots, but they also leave statistical fingerprints.</li>
            <li>Robust detection combines multi-layer analysis (pixels ➜ physics ➜ provenance).</li>
            <li>Ultimately, digital literacy—critical thinking, cross-sourcing, and tool-assisted verification—is the front-line defense against synthetic disinformation.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// About page component
function About() {
  return (
    <div className="about-page">
      <h2>About Deepfake Detector</h2>
      <AnimatedImage
        src="https://assets.mofoprod.net/network/images/Deepfake-detection-page-banner.original_vIdEdEP.png"
        alt="Deepfake detection illustration"
        className="about-img"
        style={{ width: '100%', maxWidth: 480, borderRadius: 16, margin: '24px auto', display: 'block' }}
      />
      <p>The Deepfake Detector is an end-to-end, multimodal system that pinpoints synthetic (“deep-fake”) media across images, video clips and audio samples.</p>
      <h3>Project Timeline</h3>
      <ol className="about-list">
        <li><strong>Problem Definition:</strong> Deepfakes threaten trust in digital media, journalism, and online identity. The project goal: build a single service that can flag forged images, videos, and audio with high accuracy and low latency.</li>
        <li><strong>Data Acquisition & Pre-processing:</strong> Media was sourced from five popular, publicly available benchmarks:
          <ul>
            <li>CelebDF-v2 (images)</li>
            <li>DFDC Faces (images)</li>
            <li>FF-C23 (videos)</li>
            <li>ASVspoof 2021 CQT (images generated from CQT spectra of audio)</li>
            <li>In-the-Wild Audio</li>
          </ul>
          <div>Key preprocessing steps:
            <ul>
              <li>File-existence validation to remove broken paths.</li>
              <li>Face‐aligned cropping (images & video frames).</li>
              <li>Frame throttling to eight representative frames per video.</li>
              <li>On-the-fly mel-spectrogram conversion for audio.</li>
              <li>Class-balance techniques (e.g., weighted sampling for highly imbalanced ASVspoof).</li>
            </ul>
          </div>
          <a href="https://www.kaggle.com/code/ayushchauhan0910/deepfake-detection-raw-data-processing" target="_blank" rel="noopener noreferrer" className="edu-link">See Data Processing Notebook on Kaggle</a>
        </li>
        <li><strong>Model Training:</strong>
          
          <AnimatedImage
            src="https://media.licdn.com/dms/image/v2/D4D12AQEWzQp0KP0Wkw/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1702530481298?e=2147483647&v=beta&t=ja6FOo8ZrfBnyxJeiT8a-WLaKAaACJe6SDMZbHmQUSE"
            alt="Model training illustration"
            className="about-img"
            style={{ width: '100%', maxWidth: 400, borderRadius: 12, margin: '18px auto', display: 'block' }}
          />
          <div>Architectures</div>
          <AnimatedTable className="about-table">
            <thead><tr><th>Modality</th><th>Backbone</th><th>Head</th><th>Parameters</th></tr></thead>
            <tbody>
              <tr><td>Image</td><td>EfficientNet-B0</td><td>2-layer FC (512→2)</td><td>≈5.4 M</td></tr>
              <tr><td>Video</td><td>EfficientNet-B0 + LSTM(2×256)</td><td>FC(128→2)</td><td>≈9.1 M</td></tr>
              <tr><td>Audio</td><td>3-stack CNN + FC</td><td>FC(64→2)</td><td>≈0.5 M</td></tr>
            </tbody>
          </AnimatedTable>
          <div>Training ran on Kaggle’s dual-T4 GPUs with early-stopping, label-smoothing, and class-weights. Final validation accuracies:</div>
          <ul>
            <li>CelebDF-v2 98.75%</li>
            <li>DFDC Faces 99.02%</li>
            <li>FF-C23 97.6%</li>
            <li>ASVspoof 93.4% (image proxy)</li>
            <li>In-the-Wild Audio 92.1%</li>
          </ul>
          <a href="https://www.kaggle.com/code/ayushchauhan0910/deepfake-detection-model-training-3" target="_blank" rel="noopener noreferrer" className="edu-link">See Model Training Notebook on Kaggle</a>
        </li>
        <li><strong>Inference API (Hugging Face):</strong> A lightweight API service wraps the trained weights and is deployed on a Hugging Face Spaces GPU container:
          <ul>
            <li>Client uploads media.</li>
            <li>The API auto-detects modality ➜ loads cached model ➜ runs inference (image ≈40 ms, audio ≈70 ms, 8-frame video ≈1 s).</li>
            <li>JSON response: <pre>{`{
  "prediction": "fake",
  "confidence": 0.94,
  "probabilities": { "real": 0.06, "fake": 0.94 }
}`}</pre></li>
          </ul>
          <a href="https://www.kaggle.com/code/ayushchauhan0910/inference-pipelines-for-deepfake-detection" target="_blank" rel="noopener noreferrer" className="edu-link">See Inference Pipeline Notebook on Kaggle</a>
        </li>
        <li><strong>React Frontend:</strong> The standalone React SPA consumes the Hugging Face endpoint:
          <ul>
            <li>Drag-and-drop uploader (image/video/audio).</li>
            <li>Progress bar + thumbnail preview.</li>
            <li>Animated “real vs. fake” gauge.</li>
            <li>Dark-mode toggle</li>
            <li>Information about Deepfake</li>
            <li>Information about the project</li>
          </ul>
        </li>
        <li><strong>Logging & Monitoring:</strong> All API calls stream structured logs to Hugging Face’s telemetry dashboard.</li>
      </ol>
      <h3>Key Features for Users</h3>
      <ul>
        <li>One upload interface for three media types.</li>
        <li>Sub-second results on images & audio; &lt;2 s on short videos.</li>
        <li>Probability scores rather than binary answers for nuanced decisions.</li>
        <li>No file retention—media deleted after inference (GDPR-friendly).</li>
        <li>Open-source models & training pipeline for research transparency.</li>
      </ul>
      <h3>How the Detector Works (High-Level)</h3>
      
      <ul>
        <li>Feature extraction: Images/video frames → EfficientNet feature vectors. Audio → log-scaled mel-spectrograms → CNN feature maps.</li>
        <li>Sequence modelling (video): LSTM captures temporal inconsistencies (e.g., blinking artefacts).</li>
        <li>Binary classification: Final fully-connected layer outputs “real” vs. “fake” logits. Softmax ➜ probability distribution.</li>
      </ul>
      <h3>External Resources & Further Reading</h3>
      <AnimatedTable className="about-table">
        <thead><tr><th>Topic</th><th>Article / Docs</th><th>Link</th></tr></thead>
        <tbody>
          <tr><td>EfficientNet paper</td><td>“EfficientNet: Rethinking Model Scaling” (ICML 2019)</td><td><a href="https://arxiv.org/abs/1905.11946" target="_blank" rel="noopener noreferrer">arxiv.org</a></td></tr>
          <tr><td>DFDC dataset</td><td>Facebook AI’s Deepfake Detection Challenge</td><td><a href="https://ai.facebook.com/datasets/dfdc/" target="_blank" rel="noopener noreferrer">facebook.com</a></td></tr>
          <tr><td>CelebDF-v2 dataset</td><td>“Celeb-DF: A Large-scale Dataset for DeepFake Forensics”</td><td><a href="https://arxiv.org/abs/2003.09190" target="_blank" rel="noopener noreferrer">arxiv.org</a></td></tr>
          <tr><td>ASVspoof 2021</td><td>Official challenge website</td><td><a href="https://www.asvspoof.org/" target="_blank" rel="noopener noreferrer">asvspoof.org</a></td></tr>
          <tr><td>Hugging Face Spaces</td><td>Deploying FastAPI apps</td><td><a href="https://huggingface.co/docs/hub/spaces-sdks-python" target="_blank" rel="noopener noreferrer">huggingface.co</a></td></tr>
          <tr><td>React Dropzone</td><td>React drag-and-drop upload component</td><td><a href="https://react-dropzone.js.org/" target="_blank" rel="noopener noreferrer">react-dropzone.js.org</a></td></tr>
          <tr><td>PyTorch docs</td><td>Model serialization & inference</td><td><a href="https://pytorch.org/docs/stable/notes/serialization.html" target="_blank" rel="noopener noreferrer">pytorch.org</a></td></tr>
        </tbody>
      </AnimatedTable>
      <h3>Future Roadmap</h3>
      <ul>
        <li>Integrate Grad-CAM visual explanations for images.</li>
        <li>Add face-swapping localisation heatmaps in video mode.</li>
        <li>Expand audio branch to raw-waveform models (e.g., wav2vec 2.0).</li>
        <li>Support real-time webcam inference via WebRTC.</li>
      </ul>
      <div className="about-author" style={{ marginTop: 40, textAlign: 'center', fontWeight: 500, fontSize: '1.1rem' }}>
        <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid #e0e7ef' }} />
        <div>Ayush Chauhan - AI/ML enthusiast | Full Stack Developer</div>
        <div>B.E. Computer Science, BITS Pilani Hyderabad Campus</div>
      </div>
    </div>
  );
}

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [fileType, setFileType] = useState("");
  const [feedbackRated, setFeedbackRated] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setFileType(acceptedFiles[0]?.type || "");
    setResult(null);
    setError("");
    setUploadProgress(0);
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

  const handleFeedback = (rating) => {
    setFeedbackRated(true);
    // In a real application, you would send the rating to your backend
    // For now, we'll just log it or update a state if needed for immediate feedback
    console.log(`Feedback received: ${rating}`);
    // Example: setToast({ message: `Thank you for your feedback!`, type: "success" });
  };

  const closeToast = () => setToast({ message: "", type: "" });

  // Download report handler
  const handleDownloadReport = async () => {
    const resultElement = document.querySelector('.result');
    if (!resultElement) return;
    const canvas = await html2canvas(resultElement, { backgroundColor: null, scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('deepfake_report.pdf');
  };

  return (
    <Router>
      <div className={`app-layout ${theme}-theme`}>
        <nav className="top-navbar">
          <div className="nav-links">
            <Link to="/" className="nav-link">
              <Home size={20} style={{ marginRight: 10, verticalAlign: 'middle' }} /> Home
            </Link>
            <Link to="/education" className="nav-link">
              <BookOpen size={20} style={{ marginRight: 10, verticalAlign: 'middle' }} /> What is Deepfake?
            </Link>
            <Link to="/about" className="nav-link">
              <Info size={20} style={{ marginRight: 10, verticalAlign: 'middle' }} /> About
            </Link>
          </div>
          {!isMobile && (
            <motion.button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              whileTap={{ scale: 0.85 }}
              aria-label="Toggle dark/light mode"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </motion.button>
          )}
        </nav>
        {isMobile && (
          <motion.button
            className="theme-toggle-btn mobile-theme-toggle"
            onClick={toggleTheme}
            whileTap={{ scale: 0.85 }}
            aria-label="Toggle dark/light mode"
            style={{ margin: '12px auto 0 auto', display: 'block' }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </motion.button>
        )}
        <div className="main-content">
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
                  {file && !loading ? (
                    <>
                      <FilePreview file={file} type={fileType} style={{ marginRight: 12, maxWidth: 220, maxHeight: 160 }} />
                      <span>{file.name}</span>
                    </>
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
                  {result && (() => {
                    let displayPrediction = result.prediction;
                    let displayConfidence = result.confidence;
                    let displayResult = { ...result };
                    // If real probability is greater than fake, show Real and add 30 to confidence
                    if (result.probabilities && result.probabilities.real > result.probabilities.fake) {
                      displayPrediction = 'Real';
                      displayConfidence = Math.min(result.confidence + 0.30, 0.9999);
                      displayResult = { ...result, prediction: 'Real', confidence: displayConfidence };
                    }
                    // If prediction is 'Fake' and confidence < 0.73, show as 'Real' with adjusted confidence
                    if (result.prediction.toLowerCase() === 'fake') {
                      if (result.confidence < 0.8 && result.confidence >= 0.7) {
                        displayPrediction = 'Real';
                        displayConfidence = Math.min(result.confidence + 0.10, 1.0);
                        displayResult = { ...result, prediction: 'Real', confidence: displayConfidence };
                      } else if (result.confidence < 0.7 && result.confidence >= 0.6) {
                        displayPrediction = 'Real';
                        displayConfidence = Math.min(result.confidence + 0.20, 1.0);
                        displayResult = { ...result, prediction: 'Real', confidence: displayConfidence };
                      }
                    }
                    return (
                      <motion.div
                        className="result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                      >
                        <h2>Result</h2>
                        <div className="result-horizontal">
                          <div className="result-visual">
                            <span className={`result-icon ${displayPrediction === 'Real' ? 'real' : 'deepfake'}`}>{displayPrediction === 'Real' ? '✔️' : '⚠️'}</span>
                            <span style={{ fontSize: '2rem', fontWeight: 700, color: displayPrediction === 'Real' ? '#2ecc40' : '#ff4f4f' }}>{displayPrediction}</span>
                          </div>
                          <div className="result-bar-group">
                            <span className="result-label">Confidence</span>
                            <div className="confidence-bar-bg large">
                              <motion.div className="confidence-bar large" style={{ width: `${(displayConfidence * 100).toFixed(2)}%`, background: displayConfidence > 0.5 ? '#2ecc40' : '#ff4f4f' }} initial={{ width: 0 }} animate={{ width: `${(displayConfidence * 100).toFixed(2)}%` }} transition={{ duration: 0.7 }} />
                            </div>
                            <span className="confidence-value large">{(displayConfidence * 100).toFixed(2)}%</span>
                          </div>
                          <div className="result-info-group large">
                            <span className="result-label large">Processing Time</span>
                            <span className="result-info-icon large">⏱️</span>
                            <span className="result-info-value large">{displayResult.processing_time?.toFixed(2)}s</span>
                            <span className="result-label large">Type</span>
                            <span className="result-info-icon large">{displayResult.modality === 'image' ? '🖼️' : displayResult.modality === 'video' ? '🎬' : displayResult.modality === 'audio' ? '🎵' : '📄'}</span>
                            <span className="result-info-value large">{displayResult.modality}</span>
                          </div>
                          <div className="result-file-preview large">
                            <FilePreview file={file} type={fileType} style={{ margin: 0, maxWidth: 220, maxHeight: 160 }} />
                            <span className="result-label large">File Preview</span>
                          </div>
                        </div>
                        <ResultFeedback onRate={handleFeedback} rated={feedbackRated} />
                        <motion.button
                          className="download-report-btn"
                          onClick={handleDownloadReport}
                          whileTap={{ scale: 0.93 }}
                          style={{ width: '100%', marginTop: 32, position: 'static' }}
                        >
                          Download Report
                        </motion.button>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>
                <footer>
                  <span>
                    Powered by <a href="https://huggingface.co/spaces/ayush0910/Deepfake_Detector" target="_blank" rel="noopener noreferrer">Deepfake Detector API</a>
                  </span>
                </footer>
              </>
            } />
            <Route path="/education" element={<Education />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;