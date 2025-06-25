import multer from "multer";

const upload = multer({
    dest: "uploads/",
    limits: {
      fileSize: 30 * 1024 * 1024, // 30MB in bytes
    },
  });
export default upload;