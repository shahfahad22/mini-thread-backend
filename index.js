const express = require("express");
const app = express();
let port = process.env.PORT || 9080;
let path = require("path");
const { v4: uuidv4 } = require("uuid");
let methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

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
  let { username, content } = req.body;

  if (!username.trim() || !content.trim()) {
    return res.send(" Post cannot be empty!");
  }

  let id = uuidv4();
  posts.push({ id, username, content });

  res.redirect("/posts");
});

// Show Post
app.get("/posts/:id", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => p.id === id);
  res.render("showPost.ejs", { post });
});

// Edit Page
app.get("/posts/:id/edit", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => p.id === id);
  res.render("editPost.ejs", { post });
});

// Update Post
app.patch("/posts/:id", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => p.id === id);
  post.content = req.body.content;
  res.redirect("/posts");
});

// DELETE Post 
app.delete("/posts/:id", (req, res) => {
  let { id } = req.params;
  posts = posts.filter((p) => p.id !== id);
  res.redirect("/posts");
});

app.listen(port, () => {
  console.log("Server running on port", port);
});
