// Initialize the Router
const Router = require("express").Router();

// Author Model
const AuthorModel = require("../../database/author");

// Authors

/*
Route           /author
Description     to get all author details
Access          PUBLIC
Parameter       None
METHOD          GET
*/
Router.get("/",async (req,res)=>{
    try{
        const getAllAuthors = await AuthorModel.find();
        return res.json({Author: getAllAuthors, message: "Author list displayed"});
    }catch(error){
        return res.json({Error: error.message});
    }
});

/*
Route           /author
Description     to get specific author
Access          PUBLIC
Parameter       authid
METHOD          GET
*/
Router.get("/:authid",async(req,res)=>{

    try{
        // const authordetails = database.authors.filter(
        //     (author) => author.id === parseInt(req.params.authid)
        // );
        const authordetails = await AuthorModel.findOne({id: parseInt(req.params.authid)});

        //console.log(authordetails);

        if(!authordetails){
            return res.json({error : `Author not found of the particular id ${req.params.authid}`});
        }

        return res.json({Author : authordetails, message: `Author found Successfully`});

    } catch(error){
        return res.json({error: error.message});
    }

});

/*
Route           /author/b
Description     to get a list of authors based on a book
Access          PUBLIC
Parameter       bookid
METHOD          GET
*/
Router.get("/b/:isbn",async (req,res)=>{

    try{
            // const bookAuthor = database.authors.filter(
        //     (author) => author.books.includes(req.params.isbn)
        // );
        const bookAuthor = await AuthorModel.find({books: req.params.isbn});

        if(!bookAuthor){
            return res.json({error: `Author not found of the given book id ${req.params.isbn}`});
        }

        return res.json({BooksAuthors : bookAuthor, message : `Authors found`});
    } catch(error){
        return res.json({error: erro.message});
    }

});

/*
Route           /author/new
Description     to add new Author
Access          PUBLIC
Parameter       NONE
METHOD          POST
*/
Router.post("/new",async (req,res)=>{

   try{
        const { newAuthor } = req.body;
        //console.log(newAuthor);

        //database.authors.push(newAuthor);
        await AuthorModel.create(newAuthor);

        const getAllAuthor = await AuthorModel.find();

        return res.json({ Authors : getAllAuthor, message : "Author successfully Added"});
   } catch (error) {
       return res.json({error: error.message});
   }
});

/*
Route              /author/update
Description        update author name using id
Access             PUBLIC
Parameter          :authid
METHOD             PUT
*/
Router.put("/update/:authid",async(req,res)=>{
    try{
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
    
    } catch(error){
        return res.json({error: error.message});
    }
});

/*
Route               /author/delete
Description         Delete an Author
Access              Public
Parameter           :authid
Method              DELETE
*/
Router.delete("/delete/:authid",async(req,res) => {
    
    try{
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
    
    } catch(error){
        return res.json({error: error.message});
    }

});

// Exporting module
module.exports = Router;