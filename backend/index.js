import express from "express";
import cors from "cors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET all folders
app.get("/folders", async (req, res) => {
  try {
    const result = await cloudinary.api.root_folders();
    res.json(result.folders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET images of a folder
app.get("/images/:folder", async (req, res) => {
  try {
    const folder = req.params.folder;
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: `${folder}/`,
      max_results: 200,
    });
    res.json(result.resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPLOAD inside selected folder
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const folder = req.body.folder;

    if (!file || !folder)
      return res.status(400).json({ error: "File and folder required" });

    const uploaded = await cloudinary.uploader.upload(file.path, {
      folder: folder,
    });

    res.json(uploaded);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a specific image
app.delete("/delete", async (req, res) => {
  try {
    const id = req.query.public_id; // includes folder path
    if (!id) return res.status(400).json({ error: "Missing public_id" });

    const result = await cloudinary.uploader.destroy(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});


app.listen(5000, () => console.log("Server running on port 5000"));
