const express = require("express");
const {connectDB} = require("./config/database.js");
const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");
const app = express();

app.use(express.json());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);



connectDB()
    .then(()=>{
        console.log("Database connected");
        app.listen(3000, ()=>{
            console.log("Server started at port : 3000");
        });
    }).catch(err=>{
        console.error("Database is not connected");
    });
