import Post from "../models/posts.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comments.model.js";
/**
 * Good references to read: https://lawsofux.com/
 * To check the size of bundles: https://bundlephobia.com/
 */
export const activeCheck = async (req,res) => {
    res.status(200).json({message: "Posts route is active"});
}

export const createPost = async(req,res) => {

    const {token} = req.body;
    try {
        const user = await User.findOne({token:token});
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        const post = new Post({
            userId: user._id,
            body: req.body.body,
            media: req.file!= undefined ? req.file.filename : '',
            filetype: req.file!= undefined ? req.file.mimetype.split('/')[1] : ''
        })
        await post.save();
        const populatedPost = await Post.findById(post._id).populate(
            "userId",
            "name username email profilePicture"
        );
        return res.status(200).json({message:"Post created successfuly",  post: populatedPost});
    }
    catch(error) {
        return res.status(500).json({message: error.message});
    }
}

export const getAllPost = async(req,res) => {
    
    try {
        const posts = await Post.find().populate('userId','name username email profilePicture');
        
        return res.status(200).json({posts});

    }
    catch(error) {
        return res.status(500).json({message: error.message});
    } 
}

export const deletePost = async(req,res) => {
    
    const { token, post_id } = req.body;
    try {
        /**
         * using .select('_id') basically for efficiency + safety since all you really need is user._id for the Post mode
         */
        const user = await User.findOne({token}).select('_id');
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        const post = await Post.findOne({_id:post_id});

        if(!post) {
            return res.status(404).json({message: "Post not found"});
        }
        /*
         * Unauthenticated(401): You show up at the club without an ID → they don’t know who you are, so you can’t enter.
         * Unauthorized(403): You got in with an ID, but you don’t have a VIP pass → you can’t enter the VIP section.
        */
        if(post.userId.toString() !== user._id.toString()){
            return res.status(403).json({message: "Unauthorised"});
        }

        await Post.deleteOne({_id: post_id}); //or we can set the active flag to false, and then while fetching the post we can choose the active flag true.
        return res.status(200).json({message: 'Post deleted successfully', postId: post_id});
    }
    catch(error) {
        return res.status(500).json({message: error.message});
    } 
}

export const commentPost = async(req,res) => {
    
    const { token, post_id, commentBody } = req.body;
    try {
        const user = await User.findOne({token}).select('_id');
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        const post = await Post.findOne({_id: post_id});
        if(!post) {
            return res.status(404).json({message: "Post not found"});
        }

        const comment = new Comment({
            userId: user._id,
            postId: post_id,
            body: commentBody
        })
        await comment.save();
        return res.status(200).json({message: 'Added comment on the post'});
    }
    catch(error) {
        return res.status(500).json({message: error.message});
    } 
}

export const deleteComment = async(req,res) => {
 const { token, comment_id } = req.body;
    try {
        const user = await User.findOne({token}).select('_id');
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        const comment = await Comment.findOne({_id: comment_id});
        if(!comment) {
            return res.status(404).json({message: "Comment not found"});
        }

        if(comment.userId.toString() !== user._id.toString()){
            return res.status(403).json({message: "Unauthorised"});
        }

        await Post.deleteComment({_id: comment_id});
         return res.status(200).json({message: 'Comment deleted successfully'});

    }
    catch(error) {
        return res.status(500).json({message: error.message});
    } 
}

/*
To delete any comments, first you have to get the list of comments.
*/
export const getAllComments = async(req,res) => {
    /**
     * we don't need token to get all comments because we can see all the comments irrespective of that.
     * we would need token when we'll delete comment to identify if the user is same or not
     */
    const { post_id } = req.body;

    try {

        const posts = await Post.findOne({_id: post_id});
        if(!posts) {
            return res.status(404).json({message: "Post not found"});
        }

        return res.status(200).json({comments: posts.comments})

    }
    catch(error) {
        return res.status(500).json({message: error.message});
    } 
}

export const toggleLike = async (req, res) => {
  const { token, post_id } = req.body;
  try {
    const user = await User.findOne({ token }).select('_id');
    if (!user) return res.status(404).json({ message: "User not found" });

    const post = await Post.findById(post_id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Ensure likes is an array
    if (!Array.isArray(post.likes)) {
      post.likes = [];
    }

    const userLiked = post.likes.some(id => id.toString() === user._id.toString());

    if (userLiked) {
      post.likes = post.likes.filter(id => id.toString() !== user._id.toString());
    } else {
      post.likes.push(user._id);
    }

    await post.save();
    return res.status(200).json({ post_id, likes: post.likes.length, liked: !userLiked });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
