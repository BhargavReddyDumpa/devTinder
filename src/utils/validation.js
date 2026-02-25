const validator = require("validator");

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password } = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong");
    }
};

const validateEditProfiledata = (req)=>{
    const editableData = [
        "firstName",
        "lastName",
        "gender",
        "about",
        "skills"
    ];

    const iseditable = Object.keys(req.body).every((field)=>editableData.includes(field));
    return iseditable;
}

module.exports = {
    validateSignUpData,
    validateEditProfiledata
}