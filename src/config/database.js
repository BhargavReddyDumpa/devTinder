const mongoose = require('mongoose');

const connectDB = async() =>{
await mongoose.connect(
    "mongodb+srv://bhargavdb:naninani@learningnode.hshh5fb.mongodb.net/devTinder"
);
};

module.exports = {connectDB};
