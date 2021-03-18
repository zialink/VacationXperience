import mongoose from "mongoose";

import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();

    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPosts = async (req, res) => {
  const post = req.body;

  const newPost = new PostMessage({
    ...post,
    creator: req.UserId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");
  try {
    const updatedPost = await PostMessage.findByIdAndUpdate(
      _id,
      { ...post, createdAt: new Date().toISOString(), _id },
      {
        new: true,
      }
    );

    res.json(updatedPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");
  try {
    const deletePost = await PostMessage.findByIdAndRemove(_id);

    res.json("Post deleted Successfully");
  } catch (error) {
    res.status(404).json({ message: error });
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  const { id: _id } = req.params;

  if (!req.UserId) return res.json({ message: "Sign in to like posts" });

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");

  try {
    const post = await PostMessage.findById(_id);
    const index = await post.likes.findIndex((id) => id === String(req.UserId));

    if (index === -1) {
      post.likes.push(req.UserId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.UserId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
      new: true,
    });

    res.json(updatedPost);
  } catch (error) {
    return res.status(409).send(error);
  }
};
