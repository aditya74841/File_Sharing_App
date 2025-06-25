import dotenv from "dotenv";
dotenv.config(); // ✅ ensure .env is loaded here as well


import { google } from "googleapis";
import fs from "fs";
import path from "path";

// Decode service account from environment variable and save temporarily
console.log(process.env.PORT)
const keyPath = path.join(process.cwd(), "temp-service-account.json");
if (!fs.existsSync(keyPath)) {
  const serviceAccountString = process.env.GOOGLE_SERVICE_ACCOUNT;
  if (!serviceAccountString) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT env variable not found.");
  }

  const jsonString = Buffer.from(serviceAccountString, "base64").toString("utf-8");
  fs.writeFileSync(keyPath, jsonString);
}

const auth = new google.auth.GoogleAuth({
  keyFile: keyPath,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

export const uploadFileToDrive = async (file) => {
  const fileMetadata = {
    name: file.originalname,
  };

  const media = {
    mimeType: file.mimetype,
    body: fs.createReadStream(file.path),
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: "id, webContentLink, webViewLink",
  });

  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  fs.unlinkSync(file.path);

  return {
    fileId: response.data.id,
    link: response.data.webContentLink,
    preview: response.data.webViewLink,
  };
};

export default drive;





// // utils/googleDrive.js
// import { google } from "googleapis";
// import fs from "fs";

// const auth = new google.auth.GoogleAuth({
//   keyFile: "service-account.json",
//   scopes: ["https://www.googleapis.com/auth/drive"],
// });

// const drive = google.drive({ version: "v3", auth });

// export const uploadFileToDrive = async (file) => {
//   const fileMetadata = {
//     name: file.originalname,
//   };

//   const media = {
//     mimeType: file.mimetype,
//     body: fs.createReadStream(file.path),
//   };

//   const response = await drive.files.create({
//     resource: fileMetadata,
//     media,
//     fields: "id, webContentLink",
//   });

//   // Make the file public
//   await drive.permissions.create({
//     fileId: response.data.id,
//     requestBody: {
//       role: "reader",
//       type: "anyone",
//     },
//   });
//   await fs.unlinkSync(file.path);

//   return {
//     fileId: response.data.id,
//     link: response.data.webContentLink,
//   };
// };

