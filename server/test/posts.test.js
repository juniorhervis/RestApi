const axios = require("axios");
const crypto = require("crypto");
const postService = require("../service/postService");

const generate = function () {
  return crypto.randomBytes(20).toString("hex");
};

const request = function (url, method, data) {
  return axios({
    url,
    method,
    data,
    validateStatus: false,
  });
};

//get posts
test("Should get posts", async function () {
  const post1 = await postService.savePost({
    title: generate(),
    content: generate(),
  });
  const post2 = await postService.savePost({
    title: generate(),
    content: generate(),
  });
  const post3 = await postService.savePost({
    title: generate(),
    content: generate(),
  });
  const response = await request("http://localhost:3000/posts", "get");
  expect(response.status).toBe(200);
  const posts = response.data;
  expect(posts).toHaveLength(3);
  await postService.deletePost(post1.id);
  await postService.deletePost(post2.id);
  await postService.deletePost(post3.id);
});

//create posts
test("Should save posts", async function () {
  const data = {
    title: generate(),
    content: generate(),
  };

  const response = await request("http://localhost:3000/posts", "post", data);
  expect(response.status).toBe(201);
  const posts = response.data;
  expect(posts.title).toBe(data.title);
  expect(posts.content).toBe(data.content);
  await postService.deletePost(posts.id);
});

//409
test("Should not save posts", async function () {
  const data = {
    title: generate(),
    content: generate(),
  };

  const response1 = await request("http://localhost:3000/posts", "post", data);
  const response2 = await request("http://localhost:3000/posts", "post", data);
  expect(response2.status).toBe(409);
  const posts = response1.data;
  await postService.deletePost(posts.id);
});

//update posts
test("Should update a post", async function () {
  const post = await postService.savePost({
    title: generate(),
    content: generate(),
  });
  post.title = generate();
  post.content = generate();
  const response = await request(
    `http://localhost:3000/posts/${post.id}`,
    "put",
    post
  );
  expect(response.status).toBe(204);
  const updatePost = await postService.getPost(post.id);
  expect(updatePost.title).toBe(post.title);
  expect(updatePost.content).toBe(post.content);
  await postService.deletePost(post.id);
});

///404
test("Should not update a post", async function () {
  const post = {
    id: 1,
  };
  const response = await request(
    `http://localhost:3000/posts/${post.id}`,
    "put",
    post
  );
  expect(response.status).toBe(404);
});

//delete posts
test("Should delete post", async function () {
  const post = await postService.savePost({
    title: generate(),
    content: generate(),
  });
  const response = await request(
    `http://localhost:3000/posts/${post.id}`,
    "delete"
  );
  expect(response.status).toBe(204);
  const posts = await postService.getPosts();
  expect(posts).toHaveLength(0);
});
