/**
 * STEPS TO UNDERSTAND STORE SETUP:
 * 1. Create/Submit Actions
 * 2. Create Reducers to handle those actions
 * 3. Register those reducers in the store (this file)
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducer/authReducer';
import postReducer from './reducer/postReducer';

const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer,
    },
});

export default store;

/**
 * For example: We want to login to the application. Now login is an action that we need to perform. So for that we will
 * create an action called loginAction. Whether the login is successful or not, we will handle that in the reducer. So we will create a reducer
 * called authReducer which will handle the loginAction. Now we need to register this authReducer in the store so that
 * whenever we dispatch the loginAction, the authReducer will be called and the state will be updated accordingly.
 */