import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { getFilesFromGoogle } from "../../services/api";
import "./GoogleData.css"; // Import CSS

const GoogleData = () => {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const res = await getFilesFromGoogle();
      setFiles(res.data.files);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch files");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="google-container">
      <Toaster position="top-right" />
      <h2 className="google-title">📂 Google Drive Files</h2>
      {files.length === 0 ? (
        <p className="no-files">No files found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="file-table">
            <thead>
              <tr>
                <th>Path</th>
                <th>Name</th>
                <th>Downloads</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file._id}>
                  <td>
                    <a href={file.webViewLink} target="_blank" rel="noreferrer">
                      Open Link
                    </a>
                  </td>
                  <td>{file.name}</td>
                  <td>{file.mimeType}</td>
                  <td>{new Date(file.createdTime).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GoogleData;
