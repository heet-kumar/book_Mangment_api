const mongoose = require("mongoose");

// Constructing Author schema
const AuthorSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    books: [String]
});

// Creating model
const AuthorModel = mongoose.model("authors",AuthorSchema);

// exporting model
module.exports = AuthorModel;