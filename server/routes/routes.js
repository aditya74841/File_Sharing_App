import express from "express";
import { uploadImage,downloadImage, getFilesFromGoogle, deleteFileFromGoogle, deleteFile, getFiles } from "../controller/image-controller.js";
import upload from '../utils/upload.js'


const router = express.Router();

router.post('/upload',upload.single('file'),  uploadImage);
router.get("/files",getFiles)
router.get('/file/:fileId', downloadImage);
router.get('/get-files-from-google',getFilesFromGoogle)
router.delete('/delete-file/:fileId',deleteFile)

router.delete('/delete-files-from-google/:driveFileId',deleteFileFromGoogle)

export default router;