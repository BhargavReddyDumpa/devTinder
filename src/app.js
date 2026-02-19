const express = require("express");
const {connectDB} = require("./config/database.js");
const app = express();
const User = require("./models/user.js")
const { validateSignUpData } = require("./utils/validation.js")
const bcrypt = require("bcrypt");
app.use(express.json());

app.post("/signup", async (req, res)=>{
    //validation of data
    try{
        validateSignUpData(req)
        //encrypt the password
        const {firstName, lastName, emailId, password} = req.body;
        const passwordHash = await bcrypt.hash(password,10);
        console.log(passwordHash);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });
            await user.save();
            res.send("User saved successfully");
    }
    catch (err){
        res.status(400).send("error saving the user:" + err.message);
    }

})

app.post("/login", async(req,res)=>{
    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }
        const passwordHash = await bcrypt.compare(password, user.password);
        if(passwordHash){
            res.send("Login Successfull");
        }
        else{
            throw new Error("Invalid Credentails");
        }
    }
    catch(err){
        res.status(400).send("Cannot Login user"+err.message);
    }
});

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

app.patch("/user/:userId", async(req,res)=>{
    const userId = req.params?.userId;
    const data = req.body;
    try{
        const ALLOWED_UPDATES = ["about","gender","age","skills"];
        const isUpdateAllowed = Object.keys(data).every((k)=>
            ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        if(data?.skills.length > 10){
            throw new Error("Skills cannont be more that ten");
        }
        const user = await User.findByIdAndUpdate(userId,data,{runValidators:true});
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
