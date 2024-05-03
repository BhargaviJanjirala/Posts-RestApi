const express = require("express");
const {
  getPosts,
  createPost,
  updatePost,
  deletePost,
} = require("./controllers");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Adjust destination folder as needed

// Endpoint to get all posts with options
router.get("/posts", getPosts);

// Endpoint to insert a new post with image upload
router.post("/posts/create", upload.single("image_url"), createPost);

// Endpoint to update a post
router.put("/posts/update/:id", upload.single("image_url"), updatePost);

// Endpoint to delete a post
router.delete("/posts/delete/:id", deletePost);

module.exports = router;
