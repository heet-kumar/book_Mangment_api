let books = [
    {
        ISBN: "12345ONE",
        Title: "Getting started with Mern",
        authors: [1,2,3],
        language: "en",
        pubDate: "2021-07-07",
        numOfPage: 225,
        category: ["fiction","programming","tech","web dev"],
        publication: 1      
    },
    {
        ISBN: "12345TWO",
        Title: "Getting started with DevOps",
        authors: [2],
        language: "en",
        pubDate: "2021-07-07",
        numOfPage: 225,
        category: ["dev ops","tech","web dev"],
        publication: 2      
    }
];

let authors = [
    {
        id: 1,
        name: "Heet kumar Kothadiya",
        books: ["12345ONE"]
    },
    {
        id: 2,
        name: "Saloni Gupta",
        books:["12345ONE","12345TWO"]
    },
    {
        id: 3,
        name: "Heet Kothadiya",
        books: ["12345ONE"]
    }
];

let publications = [
    {
        id: 1,
        name: "Hector",
        books: ["12345ONE","12345TWO"]
    },
    {
        id: 2,
        name: "SH",
        books: ["12345NEW","12345ONE"]
    }
];

module.exports = {books,authors,publications};