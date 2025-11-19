const express = require("express");
const serverless = require("serverless-http");
const app = express();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

let posts = [
  { id: uuidv4(), username: "Shah Fahad", content: "This is my first custom thread post!" }
];

// Home Page
app.get("/posts", (req, res) => res.render("index.ejs", { posts }));
app.get("/posts/new", (req, res) => res.render("newPost.ejs"));
app.post("/posts", (req, res) => {
  const { username, content } = req.body;
  if (!username.trim() || !content.trim()) return res.send("Post cannot be empty!");
  posts.push({ id: uuidv4(), username, content });
  res.redirect("/posts");
});
app.get("/posts/:id", (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  res.render("showPost.ejs", { post });
});
app.get("/posts/:id/edit", (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  res.render("editPost.ejs", { post });
});
app.patch("/posts/:id", (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  post.content = req.body.content;
  res.redirect("/posts");
});
app.delete("/posts/:id", (req, res) => {
  posts = posts.filter(p => p.id !== req.params.id);
  res.redirect("/posts");
});

// Export serverless handler
module.exports = app;
module.exports.handler = serverless(app);
