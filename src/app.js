const express = require("express");

const app = express();

const {auth1} = require("./middlewares/auth.js");

// // app.use("/route", [(r1),(r2),(r3)],(r4),(r5)
// app.use("/test",(req,res, next) =>{
//     // res.send("Hello, from the server");
//     // res.send("response");
//     next();
// }, (req,res, next) =>{
//     // res.send("Response 3");
//     next();
// },
// (req,res, next) =>{
//     next();
// }, (req,res, next) =>{
//     next();
// },
// (req, res) => {
//     res.send("This is what it is");
// })

// app.use("/ss",(req,res) =>{
//     res.send("Hello, from the Hello");
// })

// app.get("/acd",(req,res)=>{
//     res.send({firstname: "nani", lastname:"reddy"});
// })

// app.delete('/user', (req,res) =>{
//     res.send("You have deleted the msg");
// })

// app.post('/user',(req,res) =>{
//     res.send("You have updated the msg");
// }) 

// app.patch('/user', (req,res)=>{
//     res.send("You have ")
// })


// app.use("/user1",(req,res,next)=>{
//     // res.send("I am outer function caled by inner function");
//     next();
// })
// app.use("/user1", (req,res,next) =>{
//     next();
// });

// app.get("/Admin/getalldata", (req, res)=>{
//     res.send("Sent all the data");
// })


app.use("/admin", auth1);

app.get("/admin/getuser", (req,res)=>{
    res.send("accessed the data");
})

app.get("/admin/deleteuser", (req,res)=>{
    res.send("deleted the user");
})

app.listen(3000, ()=>{
    console.log("Server started:");
});