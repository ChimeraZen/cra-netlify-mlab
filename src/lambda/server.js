// server.js
import mongoose from 'mongoose'
const dotenv = require('dotenv').config()

// Initialize connection to database
const dbUrl = 'mongodb://'
        + process.env.DB_USER + ':'
        + process.env.DB_PASS + '@'
        + process.env.DB_HOST + ':'
        + process.env.DB_PORT + '/'
        + process.env.DB_NAME,
      dbOptions = {
        useNewUrlParser: true,
        useFindAndModify: false
      }

// Set DB from mongoose connection
mongoose.connect(dbUrl, dbOptions)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

export default db