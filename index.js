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

// Authors

/*
Route           /author
Description     to get all author details
Access          PUBLIC
Parameter       None
METHOD          GET
*/
bookwallet.get("/author",async (req,res)=>{
    const getAllAuthors = await AuthorModel.find();
    return res.json({Author: getAllAuthors, message: "Author list displayed"});
});

/*
Route           /author
Description     to get specific author
Access          PUBLIC
Parameter       authid
METHOD          GET
*/
bookwallet.get("/author/:authid",async(req,res)=>{

    // const authordetails = database.authors.filter(
    //     (author) => author.id === parseInt(req.params.authid)
    // );
    const authordetails = await AuthorModel.findOne({id: parseInt(req.params.authid)});

    //console.log(authordetails);

    if(!authordetails){
        return res.json({error : `Author not found of the particular id ${req.params.authid}`});
    }

    return res.json({Author : authordetails, message: `Author found Successfully`});
});

/*
Route           /author/b
Description     to get a list of authors based on a book
Access          PUBLIC
Parameter       bookid
METHOD          GET
*/
bookwallet.get("/author/b/:isbn",async (req,res)=>{
    // const bookAuthor = database.authors.filter(
    //     (author) => author.books.includes(req.params.isbn)
    // );
    const bookAuthor = await AuthorModel.find({books: req.params.isbn});

    if(!bookAuthor){
        return res.json({error: `Author not found of the given book id ${req.params.isbn}`});
    }

    return res.json({BooksAuthors : bookAuthor, message : `Authors found`});
});

/*
Route           /author/new
Description     to add new Author
Access          PUBLIC
Parameter       NONE
METHOD          POST
*/
bookwallet.post("/author/new",async (req,res)=>{

    const { newAuthor } = req.body;
    //console.log(newAuthor);

    //database.authors.push(newAuthor);
    await AuthorModel.create(newAuthor);

    const getAllAuthor = await AuthorModel.find();

    return res.json({ Authors : getAllAuthor, message : "Author successfully Added"});
});

/*
Route              /author/update
Description        update author name using id
Access             PUBLIC
Parameter          :authid
METHOD             PUT
*/
bookwallet.put("/author/update/:authid",async(req,res)=>{
    // database.authors.forEach((author) => {
    //     if(author.id === parseInt(req.params.authid)){
    //         author.name = req.body.newAuthName;
    //         return;
    //     }
    // });
    const updateAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(req.params.authid)
        },
        {
            name : req.body.newAuthName
        },
        {
            new: true
        }
    );

    return res.json({authors: updateAuthor, message: `author name updated of author id ${req.params.authid}`});
});

/*
Route               /author/delete
Description         Delete an Author
Access              Public
Parameter           :authid
Method              DELETE
*/
bookwallet.delete("/author/delete/:authid",async(req,res) => {
    // const updatedAuthor = database.authors.filter(
    //     (author) => author.id !== parseInt(req.params.authid)
    // );
    // database.authors = updatedAuthor;
    const updatedAuthor = await AuthorModel.findOneAndDelete(
        {
            id: parseInt(req.params.authid)
        }
    );

    return res.json({Author : updatedAuthor, message : `author id ${req.params.authid} deleted successfully`});
});

// publication 

/*
Route           /publication
Description     to get all publication
Access          PUBLIC
Parameter       NONE
METHOD          GET
*/
bookwallet.get("/publication",async(req,res) => {
    const getAllPublication = await PublicationModel.find();
    return res.json({ Publication : getAllPublication, message: `publication details are displayed successfully`});
});

/*
Route           /publication
Description     to get specific publication
Access          PUBLIC
Parameter       pubid
METHOD          GET
*/
bookwallet.get("/publication/:pubid",async(req,res) => {
    // const specificpublication = database.publications.filter(
    //     (pub) => pub.id === parseInt(req.params.pubid)
    // );
    const specificpublication = await PublicationModel.findOne({id: parseInt(req.params.pubid)});

    if(!specificpublication){
        return res.json({error : "publication not found"});
    }
    
    return res.json({ Publication: specificpublication, message: "publication found successfully"});
});

/*
Route           /publication/b
Description     to get a list of publication based on book
Access          PUBLIC
Parameter       :isbn
METHOD          GET
*/
bookwallet.get("/publication/b/:isbn",async(req,res) => {
    // const bookPublication = database.publications.filter(
    //     (pub) => pub.books.includes(req.params.isbn)
    // );
    const bookPublication = await PublicationModel.findOne({books: req.params.isbn});

    if(!bookPublication){
        return res.json({error: `Publication not found of the book isbn ${req.params.isbn}`});
    }

    return res.json({ BookPublications : bookPublication, message: "Book Publication found successfully"});
});

/*
Route           /publication/new
Description     add new Publication
Access          PUBLIC
Parameter       NONE
METHOD          POST
*/
bookwallet.post("/publication/new", async(req,res) => {
    const { newPublication } = req.body;
    //database.publications.push(newPublication);
    await PublicationModel.create(newPublication);

    const getAllPublication = await PublicationModel.find();

    return res.json({Publication : getAllPublication, message: "New Publication added"});
});

/*
Route           /publication/update
Description     updating publication name using id
Access          PUBLIC
Parameter       :pubid
METHOD          PUT
*/
bookwallet.put("/publication/update/:pubid",async(req,res) => {
    // database.publications.forEach((pub)=>{
    //     if(pub.id === parseInt(req.params.pubid)){
    //         pub.name = req.body.newPublicationName;
    //         return;
    //     }
    // });
    const updatePublication = await PublicationModel.findOneAndUpdate(
        {
            id: parseInt(req.params.pubid)
        },
        {
            name : req.body.newPublicationName
        },
        {
            new: true
        }
    );

    return res.json({Publication : updatePublication, message : `publication ${req.params.pubid} updated successfully`})
});

/*
Route              /publication/book/update
Description        update/add new book to a publication
Access             Public
Parameter          :pubid
Method             PUT
*/
bookwallet.put("/publication/book/update/:pubid/:isbn",async(req,res) => {
    // database.publications.forEach((pub) => {
    //     if(pub.id === parseInt(req.params.pubid)){
    //         pub.books.push(req.params.isbn);
    //         return;
    //     }
    // });
    const addBookToPublication = await PublicationModel.findOneAndUpdate(
        {
            id: parseInt(req.params.pubid)
        },
        {
            $addToSet:{
                books: req.params.isbn
            }
        },
        {
            new: true
        }
    );

    // database.books.forEach((book)=>{
    //     if(book.ISBN === req.params.isbn){
    //         book.publication = parseInt(req.params.pubid);
    //         return;
    //     }
    // });
    const addPublicationToBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            publication: parseInt(req.params.pubid)
        },
        {
            new: true
        }
    );

    return res.json({books : addPublicationToBook,publication: addBookToPublication, message: `new book added into the publication`});
});

/*
Route               /publication/delete/book
Description         delete a book from publication
Access              Public
Parameter           :isbn :pubid
Method              DELETE
*/
bookwallet.delete("/publication/delete/book/:isbn/:pubid",async(req,res)=>{
    // database.publications.forEach(
    //     (pub) =>{
    //         if(pub.id === parseInt(req.params.pubid)){
    //             const updatedBooks = pub.books.filter(
    //                 (book) => book !== req.params.isbn
    //             );
    //             pub.books = updatedBooks;
    //             return;
    //         }
    //     }
    // );
    const updatePublication = await PublicationModel.findOneAndUpdate(
        {
            id: parseInt(req.params.pubid)
        },
        {
            $pull:{
                books: req.params.isbn
            }
        },
        {
            new: true
        }
    );
    
    // database.books.forEach(
    //     (book) => {
    //         if(book.publication === parseInt(req.params.pubid)){
    //             book.publication = 0;
    //             return;
    //         }
    //     }
    // );
    const updateBook = await BookModel.findOneAndUpdate(
        {
            publication: parseInt(req.params.pubid)
        },
        {
            publication: 0
        },
        {
            new: true
        }
    );

    return res.json({
        publication : updatePublication,
        Books : updateBook,
        message : `Book of isbn ${req.params.isbn} deleted successfully from Publication id ${req.params.pubid}`
    });

});

/*
Route           /publication/delete
Description     delete a publication
Access          Public
Parameter       :pubid
Method          delete
*/
bookwallet.delete("/publication/delete/:pubid",async(req,res) => {
    // const updatedPublication = database.publications.filter(
    //     (pub) => pub.id !== parseInt(req.params.pubid)
    // );
    // database.publications = updatedPublication;
    const updatePublication = await PublicationModel.findOneAndDelete(
        {
            id: parseInt(req.params.pubid)
        }
    );

    // database.books.forEach(
    //     (books) => {
    //         if(books.publication === parseInt(req.params.pubid)){
    //             books.publication = 0;
    //             return;
    //         }
    //     }
    // );
    const updateBook = await BookModel.findOneAndUpdate(
        {
            publication: parseInt(req.params.pubid)
        },
        {
            publication: 0
        },
        {
            new: true
        }
    );

    return res.json({
        Publication : updatePublication,
        Books: updateBook,
        message : `Publication id ${req.params.pubid} successfully deleted`
    });
});

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