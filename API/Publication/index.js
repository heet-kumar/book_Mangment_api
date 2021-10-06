// Initializing Router
const Router = require("express").Router();

//Publication Model
const PublicationModel = require("../../database/publication");

// Publication api

/*
Route           /publication
Description     to get all publication
Access          PUBLIC
Parameter       NONE
METHOD          GET
*/
Router.get("/",async(req,res) => {
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
Router.get("/:pubid",async(req,res) => {
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
Router.get("/b/:isbn",async(req,res) => {
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
Router.post("/new", async(req,res) => {
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
Router.put("/update/:pubid",async(req,res) => {
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
Router.put("/book/update/:pubid/:isbn",async(req,res) => {
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
Router.delete("/delete/book/:isbn/:pubid",async(req,res)=>{
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
Router.delete("/delete/:pubid",async(req,res) => {
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

// Exporting Publication module
module.exports = Router;