const jwt = require('jsonwebtoken');
const Register = require('../schema/schema');

const auth = async (req,res,next)=>{
    try {
        const token = req.cookies.jwt;  //getting the token from the cookies of the user's browser
        const verifyUser = jwt.verify(token,"iAmShanneeAhirwarAndThisIsTheSignatureKey");
        // console.log(verifyUser);
        const user = await Register.findOne({_id:verifyUser._id});  //getting all the information of user from the database
        // console.log(user);
        console.log(user.name+" & "+user.email);
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send("User authentication failed\n"+error);
    }
}

module.exports = auth;