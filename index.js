// Frame work
const express = require("express");

// Database
const database = require("./database/index");

// Initializing
const bookwallet = express();

// configration
bookwallet.use(express.json());

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
Route           /
Description     to get specific book based on isbn number
Access          Public
Parameter       isbn
METHOD          GET
*/
bookwallet.get("/:isbn",(req,res) => {
    const getSpecificBooks = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );

    if(getSpecificBooks.length === 0){
        return res.json({ error : `Book not Found for ISBN of ${req.params.isbn}`});
    }

    return res.json({ book : getSpecificBooks });
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
        return res.json({error : `No book return by the Authorid ${req.params.authorid}`});
    }
    return res.json({ AuthorBooks : AuthorBook });
});

bookwallet.listen(3000, () => console.log("Server is Running !!"));