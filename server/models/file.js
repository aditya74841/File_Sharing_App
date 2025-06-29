import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    // path:{
    //     type:String,
    //     required:true
    // },
    // name:{
    //     type:String,
    //     required:true
    // },
    // downloadContent:{
    //     type:Number,
    //     required:true,
    //     default:0
    // }

    path: String, // Google Drive direct download link
    name: String,
    downloadContent: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const File = mongoose.model("file", fileSchema);

export default File;
