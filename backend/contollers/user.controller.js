import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import Profile from '../models/profile.model.js';
import crypto from 'crypto';
export const register = async(req,res) => {

    const { name, email, password, username } = req.body;

    try 
    {
        if(!name || !email || !password || !username){
            res.status(400).json({message: "Please fill all the fields"});
        }

        const user = await User.findOne({email});
        if(user){
            res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username,
        });
        
        await newUser.save();
        const profile = new Profile({userId: newUser._id});
        await profile.save();

        return res.json({message: "User registered successfully"});
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const login = async(req,res) => {
const { name, email, password, username } = req.body;

    try 
    {
        if(!email || !password){
            res.status(400).json({message: "Please fill all the fields"});
        }

        const user = await User.findOne({email});
        if(!user) {
            res.status(404).json({message: "user doesnot exist"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({message: "Invalid Credentials"});

        const token = crypto.randomBytes(32).toString("hex");
        await User.updateOne({_id: user._id},{token});

        return res.json({token})
    }
    catch (e) {
        res.status(500).json({message: e.message});
    }

}

export const uploadProfilePicture = async(req,res) => {

    const { token } = req.body;

    try {

        const user = await User.findOne({ token });
        if(!user) return res.status(404).json({message: "User not found"});

        user.profilePicture = req.file.filename;
        await user.save();

        return res.json({message: "Profile picture updated"});
    }
    catch(e) {
        return res.status(500).json({message: e.message});
    }
}

export const updateUserProfile = async(req,res) => {
    try {

        const {token, ...newUserData} = req.body;

        const user = await User.findOne({token});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        /**
         * In MongoDB (and Mongoose), the $or operator is used when you want to match documents where at least one condition is true (logical OR).
         * db.collection.find({
            $or: [
                    { field1: value1 },
                    { field2: value2 }
                ]
            })
         */
        const existingUser = await User.findOne({ $or: [{username}, {email}] })

        if(existingUser) { 
            if(existingUser || String(existingUser._id) !== String(user._id)) {
                return res.status(400).json({message: "User already exists"});
            }
        }
        Object.assign(user, newUserData);

        await user.save();
        return res.status(200).json({message:"User profile updated successfuly"});


    } catch(error) {
        return res.status(500).json({message: error.message});
    }
}

export const getUserAndProfile = async(req,res) => {
    try {

        const { token } = req.body;
        const user = await User.findOne({token});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const userProfile = await Profile.findOne({userId: user._id})
        .populate("userId" , "name email password profilePicture")

        // await userProfile.save();
        return res.json(userProfile);


    } catch(error) {
        return res.status(500).json({message: error.message});
    }
}
