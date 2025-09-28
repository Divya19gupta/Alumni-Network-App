import { registerUser, loginUser, getAboutUser } from "../../action/authAction";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    loggedIn: false,
    message: '',
    profileFetched: false,
    connections: [],
    connectionRequest: [],
    isRegistered: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        handleLoginUser: (state) => {
            state.message = 'hello';
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(loginUser.pending, (state) => {
            state.isRegistered = false;
            state.isLoading = true;
            state.message = 'Logging in...';
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.isRegistered = false;
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.loggedIn = true;
            state.message = {message: 'Logged in successfully'};
            state.user = action.payload;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.isRegistered = false;
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.loggedIn = false;
            state.message = action.payload ? action.payload : 'Login failed';
        })
        .addCase(registerUser.pending, (state) => {
            state.isRegistered = false;
            state.isLoading = true;
            state.message = 'Registering...';
            
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.isRegistered = true;
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.loggedIn = true;
            state.message = {message: 'Registered successfully. Please login now.'};
            state.user = action.payload;
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.isRegistered = false;
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.loggedIn = false;
            state.message = action.payload ? action.payload : 'Register failed';
        })
        .addCase(getAboutUser.pending, (state) => {
            state.isLoading = true;
            state.message = 'Fetching user and profile...';
        })
        .addCase(getAboutUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.message = 'User and profile fetched successfully';
            state.user = action.payload;
            state.profileFetched = true;
        })
        .addCase(getAboutUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload ? action.payload : 'Fetching user and profile failed';
            state.user = [];
            state.profileFetched = false;
        }) 
    }
})

export default authSlice.reducer;