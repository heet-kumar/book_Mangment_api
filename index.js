require("dotenv").config();

// Frame work
const express = require("express");
const mongoose = require("mongoose");

// Database
const database = require("./database/index");

// Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

// Microservises Routes
const Books = require("./API/Books");
const Author = require("./API/Author");
const Publication = require("./API/Publication/index");

// Initializing
const bookwallet = express();

// configration
bookwallet.use(express.json());

//Establish Database Connection
mongoose.connect(
    process.env.MONGO_URL,
    // {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //     useFindAndModify: false,
    //     useCreateIndex: true,
    // }
).then(() => console.log("Connection established!!!!!!"));


// Books api

// Initailizing Microservices of Book
bookwallet.use("/book",Books);

// Author api

// Initializing Microservises of Author
bookwallet.use("/author",Author);

// publication 

bookwallet.use("/publication", Publication);

bookwallet.listen(3001, () => console.log("Server is Running !!"));

// talk to mongodb in which language mongodb understand
// talk to us in which way we understand is "JavaScript"

// that can be done with "mongoose"

// why schema ?

// MongoDB is schemaless

//mongoose help you with validation, relationship with other data -> mongodb

// mongoose model

// model -> document model of mongoDB

// Schema -> model -> use them