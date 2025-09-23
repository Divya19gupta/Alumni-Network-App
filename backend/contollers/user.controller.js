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
        

        return res.json({message: "User registered successfully"});
    }
    catch (error) {
        res.status(500).json({message: "Server Error"});
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
        res.status(500).json({message: "Server Error"});
    }

}
