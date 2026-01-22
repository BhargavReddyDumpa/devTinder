const express = require("express");

const app = express();

app.use("/test",(req,res) =>{
    res.send("Hello, from the server");
})

app.use("/ss",(req,res) =>{
    res.send("Hello, from the Hello");
})

app.get('/user',(req,res)=>{
    res.send({firstname: "nani", lastname:"reddy"});
})

app.delete('/user', (req,res) =>{
    res.send("You have deleted the msg");
})

app.post('/user',(req,res) =>{
    res.send("You have updated the msg");
})

app.patch('/user', (req,res)=>{
    res.send("You have ")
})

app.listen(3000, ()=>{
    console.log("Server started:");
});