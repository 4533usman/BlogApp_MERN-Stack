const mongoose = require('mongoose');

const mongoConnection = () => {

    mongoose.connect("mongodb://localhost:27017/Blog");
    console.log("Database connection established");
    
    }
module.exports = mongoConnection ;