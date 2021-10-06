// Initialize express Router
const Router = require("express").Router();

//Database Model
const BookModel = require("../../database/book");

// Books api

/*
Route           /
Description     to get all books
Access          Public
Parameter       None
METHOD          GET
*/
Router.get("/", async(req,res) => {
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
Router.get("/is/:isbn", async (req,res) => {
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
Router.get("/c/:category", async (req,res) => {
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
Router.get("/a/:authorid",async (req,res) => {
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
Router.post("/new", async (req,res) => {
    
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
Router.put("/update/:isbn",async(req,res) => {
    
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
Router.put("/author/update/:isbn",async(req,res) => {
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
            $addToSet:{
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
            $addToSet: {
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
Router.delete("/delete/:isbn", async(req,res) => {
    // const updateBookDatabase = database.books.filter(
    //     (book) => book.ISBN !== req.params.isbn
    // );

    // database.books = updateBookDatabase
    const deleteBook = await BookModel.findOneAndDelete(
        {
            ISBN : req.params.isbn
        }
    );


    return res.json({Books : deleteBook, message: `${req.params.isbn} book deleted successfully`});
});

/*
Route           /book/delete/author
Description     delete a author from a book
Access          Public
Parameter       :isbn :authid
Method          delete
*/
Router.delete("/delete/author/:isbn/:authid",async (req,res)=>{
    // deleting from the Book daytabase a author
    
    // database.books.forEach(
    //     (book) => {
    //         if(book.ISBN === req.params.isbn){
    //             const updatedAuthors = book.authors.filter(
    //                 (author)=> author !== parseInt(req.params.authid) 
    //             );
    //             book.authors = updatedAuthors;
    //             return;
    //         }
    //     }
    // );
    const updateBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $pull:{
                authors: req.params.authid
            }
        },
        {
            new: true
        }
    );

    // deleting from the Author database a Book
    
    // database.authors.forEach(
    //     (author) => {
    //         if(author.id === parseInt(req.params.authid)){
    //             const updatedbooks = author.books.filter(
    //                 (books) => books !== req.params.isbn
    //             );
    //             author.books = updatedbooks;
    //             return;
    //         }
    //     }
    // );
    const updateAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(req.params.authid)
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

    return res.json({
        books : updateBook,
        authors : updateAuthor,
        message : `Author ${req.params.authid} successfully deleted from book ${req.params.isbn}`
    });
});

// Exporting module
module.exports = Router;