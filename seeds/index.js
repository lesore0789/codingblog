
const mongoose = require('mongoose');
const {titles, paragraphs} = require('./seedHelpers');
const BlogPost = require('../models/blogpost');

mongoose.connect('mongodb://127.0.0.1:27017/codingblog');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected")
});

const seedDB = async() => {
  await BlogPost.deleteMany({});
  for(let i = 0; i < 20; i++) {
    const random20 = Math.floor(Math.random() * 20);
    const blog = new BlogPost({
      title: `${titles[random20]}`,
      body: `${paragraphs[random20]}`
    })
    await blog.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
