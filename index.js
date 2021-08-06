// Frame work
const express = require("express");
const database = require();

// Initializing
const bookwallet = express();

// configration
bookwallet.use(express.json());

bookwallet.get("/",(req,res) => {
    return res.json()
});