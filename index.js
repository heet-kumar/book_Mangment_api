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

/*
Route           /
Description     to get all books
Access          Public
Parameter       None
METHOD          GET
*/
bookwallet.get("/", async(req,res) => {
    const getAllBooks = await BookModel.find();
    return res.json({ books : getAllBooks});
});

/*
Route           /is
Description     to get specific book based on isbn number
Access          Public
Parameter       isbn
METHOD          GET
*/
bookwallet.get("/is/:isbn", async (req,res) => {
    const getSpecificBooks = await BookModel.findOne({ISBN: req.params.isbn});
    // const getSpecificBooks = database.books.filter(
    //     (book) => book.ISBN === req.params.isbn
    // );

    // if get specific book is empty then it returns null not 0 (zero)
    // value -> null -> false

    if(!getSpecificBooks){
        return res.json({ error : `Book not Found for ISBN of ${req.params.isbn}`});
    }

    return res.json({ book : getSpecificBooks, message: `Book found successfully` });
});

/*
Route           /c/
Description     to get a list of book based on the category
Access          Public
Parameter       category
METHOD          GET
*/
bookwallet.get("/c/:category", async (req,res) => {
    const categoryBook = await BookModel.find({category: req.params.category});

    // const categoryBook = database.books.filter(
    //     (book) => book.category.includes(req.params.category)
    // );

    if(!categoryBook){
        return res.json( {error : `Book not found based on the given ${req.params.category}`});
    }

    return res.json({ CategoryBook : categoryBook });
});

/*
Route           /a/
Description     to get a list of book based on the author
Access          Public
Parameter       authorid
METHOD          GET
*/
bookwallet.get("/a/:authorid",async (req,res) => {
    const AuthorBook = await BookModel.find({authors: parseInt(req.params.authorid)});
    // const AuthorBook = database.books.filter(
    //     (book) => book.authors.includes(parseInt(req.params.authorid))
    // );

    if(!AuthorBook){
        return res.json({error : `No book written by the Authorid ${req.params.authorid}`});
    }
    return res.json({ AuthorBooks : AuthorBook, message: `books writen by the author id ${req.params.authorid} are displayed` });
});

/*
Route           book/new
Description     Enter the New Book in the Book Database
Access          Public
Parameter       None
METHOD          POST
*/
bookwallet.post("/book/new", async (req,res) => {
    
    const addBook = req.body.AddnewBook;
    
    //database.books.push(addBook);
    await BookModel.create(addBook);

    const getAllBooks = await BookModel.find();

    return res.json({ Books : getAllBooks, message : "new Book Successfully added" } );
});

/*
Route           /book/update
Description     update book title
Access          PUBLIC
Parameter       isbn
METHOD          PUT
*/
bookwallet.put("/book/update/:isbn",async(req,res) => {
    
    const updateBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn     // finding the book where
                                      // this condition true and book found
                                      // there will be data updation will be done.
        },
        {
            Title: req.body.bookTitle   // what data should be updated
        },
        {
            new: true   // updation should displayed
                        // new updated data should be assigned to the given costant
        }
    );

    // this all about the above given updateBook

    // first bracket : finding the book where this condition true and book found there will be data updation will be done.
    // second flower brackets : what data should be updated
    // third flower brackets : updation should displayed new updated data should be assigned to the given costant


    // database.books.forEach(
    //     (book) => {
    //         if(book.ISBN === req.params.isbn){
    //             book.Title = req.body.bookTitle;
    //             return;
    //         }
    //     }
    // );

    return res.json({books : updateBook, message : `Book title updated with ISBN no. ${req.params.isbn}`});
});

/* 
Route              book/author/update
Description        update/add new author
Access             PUBLIC
Parameter          isbn
METHOD             PUT
*/
bookwallet.put("/book/author/update/:isbn",async(req,res) => {
    // database.books.forEach(
    //     (book) => {
    //         if(book.ISBN === req.params.isbn){
    //             return book.authors.push(req.body.newAuthor);
    //         }
    //     }
    // );
    const addAuthorToBook = await BookModel.findOneAndUpdate(
        {
            ISBN : req.params.isbn
        },
        {
            $push:{
                authors: req.body.newAuthor
            }
        },
        {
            new: true
        }
    );

    // database.authors.forEach(
    //     (author) => {
    //         if(author.id === req.body.newAuthor){
    //             return author.books.push(req.params.isbn);
    //         }
    //     }
    // );
    const addBookToAuthor = await AuthorModel.findOneAndUpdate(
        {
            id : req.body.newAuthor
        },
        {
            $push: {
                books : req.params.isbn
            }
        },
        {
            new : true
        }
    );

    return res.json({book: addAuthorToBook, author: addBookToAuthor, message: `author updated in books database and author database`});
});

/*
Route           /book/delete
Description     delete a book
Access          Public
Parameter       :isbn
Method          DELETE
*/
bookwallet.delete("/book/delete/:isbn",(req,res) => {
    const updateBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    );

    database.books = updateBookDatabase

    return res.json({Books : database.books, message: `${req.params.isbn} book deleted successfully`});
});

/*
Route           /book/delete/author
Description     delete a author from a book
Access          Public
Parameter       :isbn :authid
Method          delete
*/
bookwallet.delete("/book/delete/author/:isbn/:authid",(req,res)=>{
    database.books.forEach(
        (book) => {
            if(book.ISBN === req.params.isbn){
                const updatedAuthors = book.authors.filter(
                    (author)=> author !== parseInt(req.params.authid) 
                );
                book.authors = updatedAuthors;
                return;
            }
        }
    );

    database.authors.forEach(
        (author) => {
            if(author.id === parseInt(req.params.authid)){
                const updatedbooks = author.books.filter(
                    (books) => books !== req.params.isbn
                );
                author.books = updatedbooks;
                return;
            }
        }
    );

    return res.json({
        books : database.books,
        authors : database.authors,
        message : `Author ${req.params.authid} successfully deleted from book ${req.params.isbn}`
    });
});

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
bookwallet.put("/author/update/:authid",(req,res)=>{
    database.authors.forEach((author) => {
        if(author.id === parseInt(req.params.authid)){
            author.name = req.body.newAuthName;
            return;
        }
    });

    return res.json({authors: database.authors, message: `author name updated of author id ${req.params.authid}`});
});

/*
Route               /author/delete
Description         Delete an Author
Access              Public
Parameter           :authid
Method              DELETE
*/
bookwallet.delete("/author/delete/:authid",(req,res) => {
    const updatedAuthor = database.authors.filter(
        (author) => author.id !== parseInt(req.params.authid)
    );
    database.authors = updatedAuthor;

    return res.json({Author : database.authors, message : `author id ${req.params.authid} deleted successfully`});
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
bookwallet.put("/publication/update/:pubid",(req,res) => {
    database.publications.forEach((pub)=>{
        if(pub.id === parseInt(req.params.pubid)){
            pub.name = req.body.newPublicationName;
            return;
        }
    });

    return res.json({Publication : database.publications, message : `publication ${req.params.pubid} updated successfully`})
});

/*
Route              /publication/book/update
Description        update/add new book to a publication
Access             Public
Parameter          :pubid
Method             PUT
*/
bookwallet.put("/publication/book/update/:pubid/:isbn",(req,res) => {
    database.publications.forEach((pub) => {
        if(pub.id === parseInt(req.params.pubid)){
            pub.books.push(req.params.isbn);
            return;
        }
    });

    database.books.forEach((book)=>{
        if(book.ISBN === req.params.isbn){
            book.publication = parseInt(req.params.pubid);
            return;
        }
    });

    return res.json({books : database.books,publication: database.publications, message: `new book added into the publication`});
});

/*
Route               /publication/delete/book
Description         delete a book from publication
Access              Public
Parameter           :isbn :pubid
Method              DELETE
*/
bookwallet.delete("/publication/delete/book/:isbn/:pubid",(req,res)=>{
    database.publications.forEach(
        (pub) =>{
            if(pub.id === parseInt(req.params.pubid)){
                const updatedBooks = pub.books.filter(
                    (book) => book !== req.params.isbn
                );
                pub.books = updatedBooks;
                return;
            }
        }
    );
    
    database.books.forEach(
        (book) => {
            if(book.publication === parseInt(req.params.pubid)){
                book.publication = 0;
                return;
            }
        }
    );

    return res.json({
        publication : database.publications,
        Books : database.books,
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
bookwallet.delete("/publication/delete/:pubid",(req,res) => {
    const updatedPublication = database.publications.filter(
        (pub) => pub.id !== parseInt(req.params.pubid)
    );
    database.publications = updatedPublication;

    database.books.forEach(
        (books) => {
            if(books.publication === parseInt(req.params.pubid)){
                books.publication = 0;
                return;
            }
        }
    );

    return res.json({
        Publication : database.publications,
        Books: database.books,
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