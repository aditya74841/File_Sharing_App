import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { deleteFile, getFiles } from "../services/api";
import "./Google.css"; // Import CSS

const Google = () => {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const res = await getFiles();
      setFiles(res.data.files);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch files");
    }
  };

  const handleDelete = async (fileId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this file?");
    if (!confirmDelete) return;

    try {
      await deleteFile(fileId);
      toast.success("File deleted successfully");
      setFiles((prev) => prev.filter((file) => file._id !== fileId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete file");
    }
  };

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file._id}>
                  <td><a href={file.path} target="_blank" rel="noreferrer">Open Link</a></td>
                  <td>{file.name}</td>
                  <td>{file.downloadContent}</td>
                  <td>{new Date(file.createdAt).toLocaleString()}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(file._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Google;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import { deleteFile } from "../services/api";

// const Google = () => {
//   const [files, setFiles] = useState([]);

//   const fetchFiles = async () => {
//     try {
//       const res = await axios.get("http://localhost:8000/files");
//       setFiles(res.data.files);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch files");
//     }
//   };

//   const handleDelete = async (fileId) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this file?");
//     if (!confirmDelete) return;

//     try {
//         await deleteFile(fileId);
//       toast.success("File deleted successfully");
//       setFiles((prev) => prev.filter((file) => file.id !== fileId));
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete file");
//     }
//   };

//   useEffect(() => {
//     fetchFiles();
//   }, [files]);

//   return (
//     <div className="p-4">
//       <Toaster position="top-right" />
//       <h2 className="text-2xl font-semibold mb-4">📂 Google Drive Files</h2>
//       {files.length === 0 ? (
//         <p>No files found.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full table-auto border border-gray-300">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border px-4 py-2 text-left">Name</th>
//                 <th className="border px-4 py-2 text-left">View Link</th>
//                 <th className="border px-4 py-2">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {files.map((file) => (
//                 <tr key={file.id}>
//                   <td className="border px-4 py-2">{file.path}</td>
//                   <td className="border px-4 py-2">{file.name}</td>
//                   <td className="border px-4 py-2">{file.downloadContent}</td>
//                   <td className="border px-4 py-2">{file.createdAt}</td>
                 
//                   <td className="border px-4 py-2 text-center">
//                     <button
//                       onClick={() => handleDelete(file._id)}
//                       className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Google;
