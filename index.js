const express = require("express")
const app = express()
const mongoose = require("mongoose")
require("dotenv").config()


// Connect to Database
mongoose.connect(process.env.DB_URL,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }, () => {
        console.log("Connected to DB")
    })


// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Server
const port = 5000 || process.env.PORT
app.listen(port, console.log(`Server running on http://localhost:${port}`))