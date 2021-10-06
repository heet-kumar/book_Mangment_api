const mongoose = require("mongoose");

// Creating a book schema
const BookSchema = mongoose.Schema({
    ISBN: {
        type: String,
        required: true,
        minlength: 8
    },
    Title: {
        type: String,
        required: true
    },
    authors: {
        type: [Number],
        required: true
    },
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