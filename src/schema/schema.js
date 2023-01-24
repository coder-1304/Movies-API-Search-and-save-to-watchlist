const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const user= new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    watchlist: {
        type: Array
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
});

user.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString()}, "iAmShanneeAhirwarAndThisIsTheSignatureKey")
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        console.log('token is generated: ' + token);
        return token;
    } catch (error) {
        // res.send(error);
        console.log('token not generated' + error);
    }
}

// Converting Password=>Hash
//middleware for hashing
//this will be executed before calling save method .pre()
// 'save' is event that is before save function is called

user.pre('save', async function (next) {
    // Since the hashing should only be applied when password is being modified :
    if (this.isModified('password')) {
        // console.log('Current Password: ' + this.password);
        this.password = await bcrypt.hash(this.password, 10);   // hashing with 10 rounds more rounds = more time for algorithm to create hash password and longer it will take
        // console.log('Current Password: ' + this.password);
    }
    next();  //means now save method will be called
})

const User = new mongoose.model('User',user);
module.exports = User;