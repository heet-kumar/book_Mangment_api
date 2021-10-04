const mongoose = require("mongoose");

// Constructing Author schema
const AuthorSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String]
});

// Creating model
const AuthorModel = mongoose.model(AuthorSchema);

// exporting model
module.exports = AuthorModel;