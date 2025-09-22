import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    active: {
        type: String,
        default: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: 'default.jpg',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    token: {
        type: String,
        default: '',
    }
});

const User = mongoose.model('User', userSchema); 
//'User' written inside the model is actually important and has to be same while exporting to posts.model.js file
export default User;