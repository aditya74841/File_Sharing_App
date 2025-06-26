import File from "../models/file.js";
import { uploadFileToDrive } from "../utils/googleDrive.js";
import { google } from "googleapis";
import drive from "../utils/googleDrive.js";
export const uploadImage = async (req, res) => {
  try {
    const { fileId, link } = await uploadFileToDrive(req.file);

    const file = await File.create({
      path: link,
      name: req.file.originalname,
      downloadContent: 0,
    });

    const fileIdStr = file._id.toString();

    // Get backend base URL
    const backendUrl = `${req.protocol}://${req.get("host")}`;
    const fullLink = `${backendUrl}/file/${fileIdStr}`;

    res.status(201).json({ link: fullLink, id: fileIdStr });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// export const uploadImage = async (req, res) => {
//    try {
//      const { fileId, link } = await uploadFileToDrive(req.file);

//      const file = await File.create({
//        path: link,
//        name: req.file.originalname,
//        downloadContent: 0,
//      });

//      res.status(201).json({ link, id: file._id });
//    } catch (error) {
//      console.error(error.message);
//      res.status(500).json({ error: error.message });
//    }
//  };

const extractFileIdFromUrl = (url) => {
  const match = url.match(/\/d\/(.+?)\//) || url.match(/id=([^&]+)/);
  return match ? match[1] : null;
};

// const auth = new google.auth.GoogleAuth({
//   keyFile: "service-account.json",
//   scopes: ["https://www.googleapis.com/auth/drive"],
// });
// const drive = google.drive({ version: "v3", auth });

export const downloadImage = async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    file.downloadContent++;
    await file.save();

    // Redirect for download
    res.redirect(file.path);
    if (file.downloadContent > 5) {
      const driveFileId = extractFileIdFromUrl(file.path); // helper
      await drive.files.delete({ fileId: driveFileId });
      await File.findByIdAndDelete(req.params.fileId);
    }
    // 🔥 Delete file from Google Drive
    //  const driveFileId = extractFileIdFromUrl(file.path); // helper
    //  await drive.files.delete({ fileId: driveFileId });
    //  await File.findByIdAndDelete(req.params.fileId)
    //  console.log("DELETED SUCESSFULL ")
    // 🗂️ Optional: Re-upload to different folder if needed here
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: error.message });
  }
};

export const getFilesFromGoogle = async (req, res) => {
  try {
    const response = await drive.files.list({
      pageSize: 100, // you can increase this or use pageToken for pagination
      fields: "files(id, name, mimeType, webViewLink, createdTime)",
    });

    const files = response.data.files;

    if (!files.length) {
      return res
        .status(200)
        .json({ success: true, message: "No files found", files: [] });
    }

    return res.status(200).json({
      success: true,
      message: "Files fetched successfully",
      files,
    });
  } catch (error) {
    console.error("Error fetching files from Google Drive:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch files from Google Drive",
    });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    // 1. Find the file in MongoDB
    const file = await File.findById(fileId);
    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    // 2. Extract the Google Drive file ID
    const driveFileId = extractFileIdFromUrl(file.path);
    if (!driveFileId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Google Drive file URL" });
    }

    // 3. Delete from Google Drive
    await drive.files.delete({ fileId: driveFileId });

    // 4. Delete from MongoDB
    await File.findByIdAndDelete(fileId);

    return res
      .status(200)
      .json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFileFromGoogle = async (req, res) => {
  try {
    const driveFileId = req.params.driveFileId;

    if (!driveFileId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Google Drive file ID" });
    }

    // 3. Delete from Google Drive
    await drive.files.delete({ fileId: driveFileId });

    return res
      .status(200)
      .json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getFiles = async (req, res) => {
  try {
    const files = await File.find();

    if (!files.length) {
      return res
        .status(200)
        .json({ success: true, message: "No files found", files: [] });
    }

    return res.status(200).json({
      success: true,
      message: "Files fetched successfully",
      files,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch files from Google Drive",
    });
  }
};
