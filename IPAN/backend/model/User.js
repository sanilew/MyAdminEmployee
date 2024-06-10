const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    first_name: {
        type:String,
        required:true
    },
    last_name: {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    dob:{
        type:Date,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now
    }
});

const User = mongoose.model("user",UserSchema);
module.exports = User;