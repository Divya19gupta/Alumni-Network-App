import { Router } from 'express';
import { downloadProfile, getAllUserProfile, getUserAndProfile, login, register, updateProfileData, updateUserProfile, uploadProfilePicture, getUserProfileBasedOnUsername } from '../contollers/user.controller.js';
import multer from 'multer';

const router = Router();
/**
 * Express cannot handle multipart/form-data (the encoding type used when uploading files via forms). Multer is middleware that parses that data and makes uploaded files accessible to your server.
 * You can configure where to store files:
    In memory (buffer, useful if you want to process before saving).
    On disk (save directly to a folder).
    Or even custom storage (e.g., AWS S3, Cloudinary).
* Restrict file types (e.g., only images). Restrict file size.
 */
const storage = multer.diskStorage({
    destination: (req,file, cb) =>{
        cb(null,'uploads/')
    },
    filename: (req,file,cb) =>{
        cb(null,file.originalname)
    }
})

const upload = multer({storage: storage})

router.route('/upload_profile_picture').post(
    upload.single('profile_picture'),
    uploadProfilePicture
);

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/update_profile').post(updateUserProfile);
router.route('/get_user_and_profile').get(getUserAndProfile)
router.route('/update_profile_data').post(updateProfileData);
router.route('/user/get_all_user_profile').get(getAllUserProfile);
router.route('/user/download_profile').get(downloadProfile);
router.route('/user/get_profile_based_on_username').get(getUserProfileBasedOnUsername);
export default router;