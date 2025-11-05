import express from "express";
import {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog
} from "../controllers/blogController.js";

import { upload } from "../middleware/upload.js";

const router = express.Router();

// ✅ File upload with slug based routes
router.post("/upload", upload.single("cover_image"), createBlog);
router.get("/", getBlogs);
router.get("/get/:id", getBlog);
router.put("/:id", upload.single("coverImage"), updateBlog);
router.delete("/:id", deleteBlog);

export default router;
