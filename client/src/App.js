import { useRef, useState, useEffect } from "react";
import "./App.css";
import { uploadFile, deleteFile } from "./services/api";
import toast from "react-hot-toast";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [fileId, setFileId] = useState("");
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef();

  const bannerUrl =
    "https://i.pinimg.com/originals/16/46/24/1646243661201a0892cc4b1a64fcbacf.jpg";

  // ✅ Load saved state on refresh
  useEffect(() => {
    const savedLink = localStorage.getItem("uploadedLink");
    const savedId = localStorage.getItem("uploadedFileId");
    if (savedLink && savedId) {
      setResult(savedLink);
      setFileId(savedId);
    }
  }, []);

  useEffect(() => {
    const getImage = async () => {
      if (file) {
        const data = new FormData();
        data.append("name", file.name);
        data.append("file", file);
        const toastId = toast.loading("Uploading...");
        try {
          const response = await uploadFile(data);
          setResult(response.link);
          setFileId(response.id);

          localStorage.setItem("uploadedLink", response.link);
          localStorage.setItem("uploadedFileId", response.id);

          toast.success("File uploaded!", { id: toastId });
        } catch (err) {
          toast.error("Upload failed", { id: toastId });
        }
      }
    };
    getImage();
  }, [file]);

  const onUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Ensure input resets every time
    }
    fileInputRef.current.click();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDelete = async () => {
    if (!fileId) return;
    const toastId = toast.loading("Deleting...");
    try {
      await deleteFile(fileId);
      setResult("");
      setFileId("");
      setFile(null);
      localStorage.removeItem("uploadedLink");
      localStorage.removeItem("uploadedFileId");
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      toast.success("File deleted!", { id: toastId });
    } catch (error) {
      toast.error("Failed to delete file", { id: toastId });
    }
  };

  return (
    <div className="container" style={styles.container}>
      <img src={bannerUrl} alt="banner" style={styles.banner} />

      <div style={styles.wrapper}>
        <h1 style={styles.heading}>📤 File Sharing</h1>
        <p>Upload and share the download link.</p>

        <button style={styles.button} onClick={onUploadClick}>
          Upload File
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0])}
        />

        {result && (
          <div style={styles.linkBox}>
            <p style={styles.linkNote}>Copy and paste the link in browser:</p>
            <div style={styles.resultBox}>
              <input
                readOnly
                value={result}
                style={styles.resultInput}
                onClick={(e) => e.target.select()}
              />
              <div style={styles.buttonGroup}>
                <button onClick={handleCopy} style={styles.secondaryButton}>
                  {copied ? "✅ Copied" : "📋 Copy Link"}
                </button>
                <button onClick={handleDelete} style={styles.deleteButton}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

const styles = {
  container: {
    textAlign: "center",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "2rem",
    backgroundColor: "#f7f9fc",
    minHeight: "100vh",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  },
  banner: {
    width: "100%",
    maxHeight: "250px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "2rem",
    backgroundColor: "red",
  },

  wrapper: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    maxWidth: "800px",
    margin: "auto",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  heading: {
    marginBottom: "0.5rem",
    fontSize: "2.2rem",
    color: "#333",
  },
  button: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "1rem",
  },
  linkBox: {
    marginTop: "2rem",
  },
  linkNote: {
    fontWeight: "500",
    marginBottom: "0.5rem",
    color: "#333",
  },
  resultBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.75rem",
    width: "100%",
  },
  resultInput: {
    padding: "0.7rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    width: "100%",
    maxWidth: "100%",
    fontSize: "0.95rem",
    wordBreak: "break-all",
    boxSizing: "border-box",
  },
  buttonGroup: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "0.75rem",
    marginTop: "0.5rem",
  },
  secondaryButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  deleteButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
};

// import { useRef, useState, useEffect } from "react";
// import "./App.css";
// import { uploadFile } from "./services/api";
// function App() {
//   const [file, setFile] = useState("");
//   const [result, setResult] = useState("");

//   const fileInputRef = useRef();
//   const url =
//     "https://i.pinimg.com/originals/16/46/24/1646243661201a0892cc4b1a64fcbacf.jpg";
//   useEffect(() => {
//     const getImage = async () => {
//       if (file) {
//         const data = new FormData();
//         data.append("name", file.name);
//         data.append("file", file);

//         let response = await uploadFile(data);
//         console.log("The response is ", response);
//         setResult(response.link);
//       }
//     };
//     getImage();
//   }, [file]);
//   const onUploadClick = () => {
//     fileInputRef.current.click();
//   };

//   return (
//     <div className="container">
//       <img src={url} alt="banner" />
//       <div className="wrapper">
//         <h1>File Sharing!</h1>
//         <p>Upload and share the download link.</p>
//         <button onClick={() => onUploadClick()}>Upload</button>
//         <input
//           type="file"
//           ref={fileInputRef}
//           style={{ display: "none" }}
//           onChange={(e) => setFile(e.target.files[0])}
//         />
//         <a href={result}>{result}</a>
//       </div>
//     </div>
//   );
// }

// export default App;
