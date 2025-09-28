/**
* Promise = “I’ll give you the result later.”
* Thunk = “Here’s a recipe (function) you can call when you’re ready. Inside, I might use a promise to get data. Also,
it fullfils or rejects a request which is handled in reducer.”
 */

import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const loginUser = createAsyncThunk(
    'user/login',
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post('/login', 
            {
                email: user.email,
                password: user.password
            });

            if(response.data.token){ 
                localStorage.setItem('token', response.data.token);
            }
            else {
                return thunkAPI.rejectWithValue({
                    message: 'Token not found in response'
                })
            }
            return thunkAPI.fulfillWithValue(response.data);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const registerUser = createAsyncThunk(
    'user/register',
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.post('/register', 
            {
                name: user.name,
                email: user.email,
                password: user.password,
                username: user.username
            });
            return thunkAPI.fulfillWithValue(response.data);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getAboutUser = createAsyncThunk(
    'user/getAboutUser',
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.get('/get_user_and_profile', 
                {
                    params: {
                        token: user.token
                    }
                }
            );
            return thunkAPI.fulfillWithValue(response.data);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getAllUsers = createAsyncThunk(
    'user/getAllUsers',
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get('/get_all_users');
            return thunkAPI.fulfillWithValue(response.data);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    });    
