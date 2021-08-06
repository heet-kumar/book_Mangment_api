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



bookwallet.listen(3000, () => console.log("Server is Running !!"));