const mongoose = require("mongoose");

// Creating a book schema
const BookSchema = mongoose.Schema({
    ISBN: String,
    Title: String,
    authors: [Number],
    language: String,
    pubDate: String,
    numOfPage: Number,
    category: [String],
    publication: Number
});

// Create a book model
const BookModel = mongoose.model("books",BookSchema);

// exporting model
module.exports = BookModel;