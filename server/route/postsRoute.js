const express = require("express");
const router = express.Router();
const postsService = require("../service/postService");

router.get("/posts", async function (req, res) {
  const posts = await postsService.getPosts();
  res.json(posts);
});

// router.get("/posts/:id", async function (req, res) {

// });

router.post("/posts", async function (req, res) {
  const post = req.body;
  const newPost = await postsService.savePost(post);
  res.json(newPost);
});

router.put("/posts/:id", async function (req, res){
  const post = req.body
  await postsService.updatePost(req.params.id, post)
  res.end()

});

router.delete("/posts/:id", async function (req, res) {
  await postsService.deletePost(req.params.id)
  res.end()

});

module.exports = router;
