import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";
export const getAllPost = createAsyncThunk(
    'posts/getAllPost',
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get('/posts');
            return thunkAPI.fulfillWithValue(response.data);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const createPost = createAsyncThunk(
    'posts/createPost',
    async (postData, thunkAPI) => {
        const {file,body}  = postData;
        try {
            const formData = new FormData();    
            formData.append('token', localStorage.getItem('token'));
            formData.append('body', body);
            if(file) {
                formData.append('media', file);
            }
            const response = await clientServer.post('/post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if(response.status === 200) {
            return thunkAPI.fulfillWithValue(response.data);
            } else {
                return thunkAPI.rejectWithValue({
                    message: 'Failed to create post'
                });
            }   
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const deletePost = createAsyncThunk(
    'posts/deletePost',
    async (post_id, thunkAPI) => {
        try {
            const response = await clientServer.delete('/delete_post', {
                data: {
                    token: localStorage.getItem('token'),
                    post_id: post_id
                }
            });
            if(response.status === 200) {
                return thunkAPI.fulfillWithValue({post_id});
            } else {
                return thunkAPI.rejectWithValue({
                    message: 'Failed to delete post'
                });
            }
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);  

export const toggleLikePost = createAsyncThunk(
  'posts/toggleLike',
  async (post_id, thunkAPI) => {
    try {
      const response = await clientServer.post('/toggle_like', {
        token: localStorage.getItem('token'),
        post_id,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
); 

export const commentPost = createAsyncThunk(
    'posts/commentPost',
    async (commentData, thunkAPI) => {
        const { post_id, comment } = commentData;
        try {
            const response = await clientServer.post('/comment', {
                token: localStorage.getItem('token'),
                post_id: post_id,
                comment: comment
            });
            if(response.status === 200) {
                return thunkAPI.fulfillWithValue(response.data);
            } else {
                return thunkAPI.rejectWithValue({
                    message: 'Failed to add comment'
                });
            }
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);