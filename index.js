const express = require("express");
const serverless = require("serverless-http");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// In-memory posts
let posts = [
  {
    id: uuidv4(),
    username: "Shah Fahad",
    content: "This is my first custom thread post!"
  }
];

// Home Page
app.get("/posts", (req, res) => {
  res.render("index.ejs", { posts });
});

// Create Page
app.get("/posts/new", (req, res) => {
  res.render("newPost.ejs");
});

// Create Post
app.post("/posts", (req, res) => {
  const { username, content } = req.body;
  if (!username.trim() || !content.trim()) {
    return res.send("❌ Post cannot be empty!");
  }
  posts.push({ id: uuidv4(), username, content });
  res.redirect("/posts");
});

// Show Post
app.get("/posts/:id", (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).send("Post not found");
  res.render("showPost.ejs", { post });
});

// Edit Post
app.get("/posts/:id/edit", (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).send("Post not found");
  res.render("editPost.ejs", { post });
});

// Update Post
app.patch("/posts/:id", (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).send("Post not found");
  post.content = req.body.content;
  res.redirect("/posts");
});

// Delete Post
app.delete("/posts/:id", (req, res) => {
  const postExists = posts.some(p => p.id === req.params.id);
  if (!postExists) return res.status(404).send("Post not found");
  posts = posts.filter(p => p.id !== req.params.id);
  res.redirect("/posts");
});

// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);
