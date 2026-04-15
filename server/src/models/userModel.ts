import mongoose from "mongoose";
// import validator from 'validator';

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Please provide your email"],
        validator:{
            
        }
    }
});

const User = mongoose.model("users", UserSchema);

export default User;
