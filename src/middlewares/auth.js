const auth = (req,res,next) =>{
    const token = "abc";
    const authetication = token === "abc";
    if(!authetication){
        res.status(404).send("Not authorized to enter the app");
    }
    else {
        console.log("you are authorized to enter");
        next();
    }
}


module.exports = { auth1: auth };