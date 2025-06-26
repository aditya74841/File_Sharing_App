import axios from "axios";

// const API_URL = `http://localhost:8000`;
const API_URL = `https://file-sharing-app-yr1c.onrender.com`;

export const uploadFile = async (data) => {
  try {
    let response = await axios.post(`${API_URL}/upload`, data);
    return response.data;
  } catch (error) {
    console.error("Error while calling the api", error.message);
  }
};


export const getFiles = async (data) => {
    try {
      let response = await axios.get(`${API_URL}/files`);
      return response;
    } catch (error) {
      console.error("Error while calling the api", error.message);
    }
  };
  


  export const getFilesFromGoogle = async (data) => {
    try {
      let response = await axios.get(`${API_URL}/get-files-from-google`);
      return response;
    } catch (error) {
      console.error("Error while calling the api", error.message);
    }
  };
  





export const deleteFile = async (fileId) => {
  try {
    await axios.delete(`${API_URL}/delete-file/${fileId}`);
    return;
  } catch (error) {
    console.error("Error while calling the api", error.message);
  }
};
