const express = require("express");
const {connectDB} = require("./config/database.js");
const app = express();
const User = require("./models/user.js")
app.use(express.json());

app.post("/signup", async (req, res)=>{
    console.log(req.body);
    const userObj = req.body;

    const user = new User(userObj);
    try{
        await user.save();
        res.send("User saved successfully");
    }
    catch (err){
        res.status(400).send("error saving the user:" + err.message);
    }

})


connectDB()
    .then(()=>{
        console.log("Database connected");
        app.listen(3000, ()=>{
            console.log("Server started at port : 3000");
        });
    }).catch(err=>{
        console.error("Database is not connected");
    });
