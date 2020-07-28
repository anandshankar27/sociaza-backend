const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

const uri = process.env.DB_URI
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
mongoose.connection.once('open', () => console.log('Connected to DB'))

const users = require('./routes/users')
const posts = require('./routes/posts')

app.use('/users', users)
app.use('/posts', posts)

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})