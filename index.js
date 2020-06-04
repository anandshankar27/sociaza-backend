const express = require("express")
const app = express()
const mongoose = require("mongoose")
require("dotenv").config()

// Routes
const auth = require("./routes/auth")
const profile = require("./routes/profile")
const feed = require("./routes/feed")

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

// Routes Middlewares
app.use("/auth", auth)
app.use("/profile", profile)
app.use("/feed", feed)

// Server
const port = 5000 || process.env.PORT
app.listen(port, console.log(`Server running on http://localhost:${port}`))