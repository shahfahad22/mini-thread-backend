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

// Routes
app.get("/posts", (req, res) => {
  res.render("index", { posts });
});

app.get("/posts/new", (req, res) => {
  res.render("newPost");
});

app.post("/posts", (req, res) => {
  const { username, content } = req.body;
  if (!username.trim() || !content.trim()) return res.send("❌ Post cannot be empty!");
  posts.push({ id: uuidv4(), username, content });
  res.redirect("/posts");
});

app.get("/posts/:id", (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  res.render("showPost", { post });
});

app.get("/posts/:id/edit", (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  res.render("editPost", { post });
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

// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);

// Local development port
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 9080;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
