const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const Post = require("../../model");
const { Op } = require("sequelize");
dotenv.config();
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Controller to handle image upload to Cloudinary
const uploadImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

// Endpoint to get all posts with sorting, pagination, keyword filtering, and tag filtering
const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy, sortOrder, keyword, tag } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (keyword) {
      whereClause = {
        [Op.or]: [
          { title: { [Op.iLike]: `%${keyword}%` } },
          { description: { [Op.iLike]: `%${keyword}%` } },
        ],
      };
    }
    if (tag) {
      whereClause.tag = tag;
    }

    const order =
      sortBy && sortOrder ? [[sortBy, sortOrder.toUpperCase()]] : [];

    const posts = await Post.findAll({
      where: whereClause,
      order: order,
      limit: limit,
      offset: offset,
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching posts." });
  }
};

// Endpoint to insert a new post
const createPost = async (req, res) => {
  const { title, description, tag } = req.body;
  const file = req.file;

  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(file.path);
    const image_url = cloudinaryResponse.secure_url;

    const newPost = await Post.create({ title, description, tag, image_url });
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the post." });
  }
};

// Endpoint to delete a post
const deletePost = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    await post.destroy();
    res.status(204).json("deleted Post successfully");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the post." });
  }
};

// Endpoint to update a post
const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { title, description, tag } = req.body;

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    console.log("Before updating post:", post.toJSON()); // Log the current state of the post object

    post.title = title;
    post.description = description;
    post.tag = tag;
    await post.save();
    console.log("After updating post:", post.toJSON()); // Log the updated state of the post object
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the post." });
  }
};

module.exports = { uploadImage, deletePost, updatePost, createPost, getPosts };
