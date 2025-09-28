import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import Profile from '../models/profile.model.js';
import crypto from 'crypto';
import PDFDocument from 'pdfkit';
import fs from 'fs';
export const convertUserDataToPDF = async (userData) => {

    const doc = new PDFDocument();
    const outputPath = crypto.randomBytes(32).toString("hex") + '.pdf';
    const stream = fs.createWriteStream('uploads/'+ outputPath);

    /**
     * Think of doc as a pen writing words, and fs.createWriteStream as a sheet of paper.
     * If you never .pipe() them together, the pen writes in the air — nothing gets saved.
     * .pipe() attaches the pen to paper so the writing actually goes somewhere.
     */
    doc.pipe(stream);

    doc.image(`uploads/${userData.userId.profilePicture}`,{align:'center',width:100})
    doc.fontSize(15).text(`Name: ${userData.userId.name}`);
    doc.fontSize(15).text(`Username: ${userData.userId.username}`);
    doc.fontSize(15).text(`Email: ${userData.userId.email}`);
    doc.fontSize(15).text(`Bio: ${userData.bio}`);
    doc.fontSize(15).text(`Current Postion: ${userData.currentPost}`);
    doc.fontSize(15).text('Past Work: ')

    userData.pastWork.forEach((work,index) =>{
        doc.fontSize(15).text(`Company: ${work.company}`);
        doc.fontSize(15).text(`Position: ${work.position}`);
        doc.fontSize(15).text(`Years: ${work.years}`);
    })

    doc.end();
    return outputPath;
}
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

        const { token } = req.query;
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

export const updateProfileData = async(req,res) => {

    try {

        const {token, ...newUserData} = req.body;

        const userProfile = await User.findOne({token});
        if(!userProfile){
            return res.status(404).json({message: "User profile not found"});
        }
        const profileToUpdate = await Profile.findOne({userId: userProfile._id})

        /**
         * const target = {a=1,b=2}
         * const source = {b=4,c=1}
         * b key is same and hence it will be updated but a and c will not be affected. It's like merging two arrays.
         * Object.assign(target,source) {a=1,b=4,c=1}
         */
        Object.assign(profileToUpdate, newUserData);

        profileToUpdate.save();
        return res.status(200).json({message:"Profile updated successfuly"});


    } catch(error) {
        return res.status(500).json({message: error.message});
    }
}

export const getAllUserProfile = async(req,res) => {
    /**
     * // Without populate
        const profile = await Profile.findOne();
        console.log(profile.userId); // just ObjectId("650ff9...")

        // With populate
        const profile = await Profile.findOne().populate("userId");
        console.log(profile.userId.username); // "john_doe"

    * So in short:
        find() → gets the raw document(s).
        populate() → replaces ref fields with the actual documents from the referenced collection.
     */

    try {
        const profiles = await Profile.find({}).populate('userId','name username email profilePicture');
        return res.status(200).json({profiles});
    }   
    catch(error) {
        return res.status(500).json({message: error.message});
    }
    
}

/**
 * So while downloaing the profile, we can use the userId directly as when you navigate to the UI, you'll 
 * see the username of the users, token is something private to them. So we can exploit the userId directly. 
 */
export const downloadProfile = async(req,res) => {
    try {
        const userId = req.query.id;
        const userProfile = await Profile.findOne({userId: userId})
        .populate('userId','name email username profilePicture');

        let outputPath = await convertUserDataToPDF(userProfile);

        return res.json({"message": outputPath})

    }   
    catch(error) {
        return res.status(500).json({message: error.message});
    }
}