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

app.delete("/user", async(req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete({_id:userId});
        res.send(user);
    } catch(err){
        res.status(400).send("Cannot delete the user");
    }
})

app.get("/user", async (req, res)=>{
    const userEmail = req.body.emailId;
    try{
        const user = await User.findOne({emailId: userEmail});
        res.send(user);
    } catch(err){
        res.status(400).send("Cannont get the data", err.message);
    }
})

app.get("/feed", async(req,res)=>{
    try{
        const user = await User.find({});
        res.send(user);
    } catch(err){
        res.status(400).send("Cannot fetech all the details");
    }
})


//update the user

app.patch("/user", async(req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndUpdate(userId,{firstName:"DumpaBhargav"});
        res.send("Updated name successfully");
    } catch(err){
        res.status(400).send("Cannot update the user");
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
