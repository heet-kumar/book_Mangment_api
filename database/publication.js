const mongoose = require("mongoose");

// Creating publication Schema

const PublicationSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    books: [String]
});

// Creating Publicationmodel

const PublicationModel = mongoose.model("publications",PublicationSchema);

// exporting model
module.exports = PublicationModel;