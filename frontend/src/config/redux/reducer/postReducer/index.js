import { createSlice } from "@reduxjs/toolkit";
import { commentPost, getAllPost, toggleLikePost } from "../../action/postAction";
import { createPost } from "../../action/postAction";
import { deletePost } from "../../action/postAction";

const initialState = {
    posts: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    loggedIn: false,
    message: '',
    profileFetched: false,
    comments: [],
    postId: '',
};

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        reset: () => initialState,
        resetPostId: (state) => {
            state.postId = '';
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllPost.pending, (state) => {
            state.isLoading = true;
            state.message = 'Fetching posts...';
        })
        .addCase(getAllPost.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.message = 'Posts fetched successfully';
            state.posts = action.payload.posts.reverse();
        })
        .addCase(getAllPost.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload ? action.payload : 'Fetching posts failed';
            state.posts = [];
        })
        .addCase(createPost.pending, (state) => {
            state.isLoading = true;
            state.message = 'Creating post...';
        })
        .addCase(createPost.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.message = 'Post created successfully';
            state.posts = [action.payload.post, ...state.posts];
        })
        .addCase(createPost.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload ? action.payload : 'Creating post failed';
        })
        .addCase(deletePost.pending, (state) => {
            state.isLoading = true;
            state.message = 'Deleting post...';
        })
        .addCase(deletePost.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.message = 'Post deleted successfully';
            state.posts = state.posts.filter(post => post._id !== action.payload.postId);
        })
        .addCase(deletePost.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload ? action.payload : 'Deleting post failed';
        })
        .addCase(toggleLikePost.pending, (state) => {
            state.isLoading = true;
            state.message = 'Liking post...';
        })
        .addCase(toggleLikePost.fulfilled, (state, action) => {
        const { post_id, likes, liked } = action.payload;
        const postIndex = state.posts.findIndex(post => post._id === post_id);
        if (postIndex !== -1) {
            state.posts[postIndex].likes = likes;
            state.posts[postIndex].likedByUser = liked; // optional flag for UI
        }
        })
        .addCase(toggleLikePost.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload ? action.payload : 'Liking post failed';
        })
        .addCase(commentPost.pending, (state) => {
            state.isLoading = true;
            state.message = 'Adding comment...';
        })
        .addCase(commentPost.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.message = 'Comment added successfully';
            const postIndex = state.posts.findIndex(post => post._id === action.payload.post_id);
            if(postIndex !== -1) {
                state.posts[postIndex].comments.push(action.payload.comment);
            }
        })
        .addCase(commentPost.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload ? action.payload : 'Adding comment failed';
        });
    }
});

// export const { reset, resetPostId } = postSlice.actions;
export default postSlice.reducer;