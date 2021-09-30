// Frame work
const express = require("express");

// Database
const database = require("./database/index");

// Initializing
const bookwallet = express();

// configration
bookwallet.use(express.json());

// Books api

/*
Route           /
Description     to get all books
Access          Public
Parameter       None
METHOD          GET
*/
bookwallet.get("/",(req,res) => {
    return res.json({ books : database.books});
});

/*
Route           /is
Description     to get specific book based on isbn number
Access          Public
Parameter       isbn
METHOD          GET
*/
bookwallet.get("/is/:isbn",(req,res) => {
    const getSpecificBooks = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );

    if(getSpecificBooks.length === 0){
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
bookwallet.get("/c/:category", (req,res) => {
    const categoryBook = database.books.filter(
        (book) => book.category.includes(req.params.category)
    );

    if(categoryBook.length === 0){
        return res.json( {error : `Book not found based on the given ${req.body.category}`});
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
bookwallet.get("/a/:authorid",(req,res) => {
    const AuthorBook = database.books.filter(
        (book) => book.authors.includes(parseInt(req.params.authorid))
    );
    if(AuthorBook.length === 0){
        return res.json({error : `No book written by the Authorid ${req.params.authorid}`});
    }
    return res.json({ AuthorBooks : AuthorBook });
});

/*
Route           /new
Description     Enter the New Book in the Book Database
Access          Public
Parameter       None
METHOD          POST
*/
bookwallet.post("/book/new",(req,res) => {
    
    const addBook = req.body.AddnewBook;
    database.books.push(addBook);

    return res.json({ Books : database.books, message : "new Book Successfully added" } );
});

/*
Route           /book/update
Description     update book title
Access          PUBLIC
Parameter       isbn
METHOD          PUT
*/
bookwallet.put("/book/update/:isbn",(req,res) => {
    database.books.forEach(
        (book) => {
            if(book.ISBN === req.params.isbn){
                book.Title = req.body.bookTitle;
                return;
            }
        }
    );

    return res.json({books : database.books, message : `Book title updated with ISBN no. ${req.params.isbn}`});
});

/* 
Route              book/author/update
Description        update/add new author
Access             PUBLIC
Parameter          isbn
METHOD             PUT
*/
bookwallet.put("/book/author/update/:isbn",(req,res) => {
    database.books.forEach(
        (book) => {
            if(book.ISBN === req.params.isbn){
                return book.authors.push(req.body.newAuthor);
            }
        }
    );
    database.authors.forEach(
        (author) => {
            if(author.id === req.body.newAuthor){
                return author.books.push(req.params.isbn);
            }
        }
    );

    return res.json({book: database.books, author: database.authors, message: `author updated in books database and author database`});
});


// Authors

/*
Route           /author
Description     to get all author details
Access          PUBLIC
Parameter       None
METHOD          GET
*/
bookwallet.get("/author",(req,res)=>{
    return res.json({Author: database.authors, message: "Author list displayed"});
});

/*
Route           /author
Description     to get specific author
Access          PUBLIC
Parameter       authid
METHOD          GET
*/
bookwallet.get("/author/:authid",(req,res)=>{
    const authordetails = database.authors.filter(
        (author) => author.id === parseInt(req.params.authid)
    );

    //console.log(authordetails);

    if(authordetails.length === 0){
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
bookwallet.get("/author/b/:isbn",(req,res)=>{
    const bookAuthor = database.authors.filter(
        (author) => author.books.includes(req.params.isbn)
    );

    if(bookAuthor.length === 0){
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
bookwallet.post("/author/new",(req,res)=>{

    const { newAuthor } = req.body;
    //console.log(newAuthor);

    database.authors.push(newAuthor);

    return res.json({ Authors : database.authors, message : "Author successfully Added"});
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

// publication 

/*
Route           /publication
Description     to get all publication
Access          PUBLIC
Parameter       NONE
METHOD          GET
*/
bookwallet.get("/publication",(req,res) => {
    return res.json({ Publication : database.publications, message: `publication details are displayed successfully`});
});

/*
Route           /publication
Description     to get specific publication
Access          PUBLIC
Parameter       pubid
METHOD          GET
*/
bookwallet.get("/publication/:pubid",(req,res) => {
    const specificpublication = database.publications.filter(
        (pub) => pub.id === parseInt(req.params.pubid)
    );

    if(specificpublication.length === 0){
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
bookwallet.get("/publication/b/:isbn",(req,res) => {
    const bookPublication = database.publications.filter(
        (pub) => pub.books.includes(req.params.isbn)
    );

    if(bookPublication.length === 0){
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
bookwallet.post("/publication/new",(req,res) => {
    const { newPublication } = req.body;
    database.publications.push(newPublication);

    return res.json({Publication : database.publications, message: "New Publication added"});
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
            book.publication = req.params.pubid;
            return;
        }
    });

    return res.json({books : database.books,publication: database.publications, message: `new book added into the publication`});
});

bookwallet.listen(3001, () => console.log("Server is Running !!"));