const validator = require("validator");
const bcrypt = require("bcrypt");

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

const validateExistingPassword = (req)=>{
    const editablePassword = [
        "password",
        "newPassword",
        "emailId"
    ];
    const ispassword= Object.keys(req.body).every((field)=>editablePassword.includes(field));
    // console.log(ispassword);
    return ispassword;

}

module.exports = {
    validateSignUpData,
    validateEditProfiledata,
    validateExistingPassword
}