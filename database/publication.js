const mongoose = require("mongoose");

// Creating publication Schema

const PublicationSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String]
});

// Creating Publicationmodel

const PublicationModel = mongoose.model("publications",PublicationSchema);

// exporting model
module.exports = PublicationModel;