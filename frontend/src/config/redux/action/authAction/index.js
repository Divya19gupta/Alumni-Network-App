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

export const getAllUserProfiles = createAsyncThunk(
    'user/getAllUserProfiles',
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get('/user/get_all_user_profile');
            return thunkAPI.fulfillWithValue(response.data);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);      

export const downloadProfile = createAsyncThunk(
  'user/downloadProfile',
  async (id, thunkAPI) => {
  try {
    const response = await clientServer.get(`/user/download_profile?id=${id}`);
    return thunkAPI.fulfillWithValue(response.data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
}
);
// You can add more user-related actions here, such as logout, update profile, etc.

export const updateUserProfile = createAsyncThunk()


// export const uploadProfilePicture = createAsyncThunk(
//   "user/uploadProfilePicture",
//   async ({ file, token }, thunkAPI) => {
//     try {
//       const formData = new FormData();
//       formData.append("profile_picture", file); // File object from <input>
//       formData.append("token", token);

//       const response = await clientServer.post(`/upload_profile_picture`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       return thunkAPI.fulfillWithValue(response.data);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data || { message: "Upload failed" }
//       );
//     }
//   }
// );