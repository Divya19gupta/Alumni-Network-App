import express from 'express';
import { activeCheck, commentPost, createPost, deleteComment, deletePost, getAllComments, getAllPost, toggleLike } from '../contollers/posts.controller.js';
import { Router } from 'express';
import multer from 'multer';

const router = Router();

const storage = multer.diskStorage({
    destination: (req,file, cb) =>{
        cb(null,'uploads/')
    },
    filename: (req,file,cb) =>{
        cb(null,file.originalname)
    }
})

const upload = multer({storage: storage});

router.route('/').get(activeCheck);
router.route('/post').post(upload.single('media'),createPost);
router.route('/posts').get(getAllPost);
router.route('/delete_post').delete(deletePost);
router.route('/comment').post(commentPost);
router.route('/get_comments').get(getAllComments);
router.route('/delete_comment').delete(deleteComment);
router.route('/toggle_like').post(toggleLike);


export default router;