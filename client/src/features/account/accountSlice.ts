import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { stringify } from "querystring";
import { FieldValues } from "react-hook-form";
import { history } from "../..";
import agent from "../../app/api/agent";
import { User } from "../../app/models/user";


interface AccountState { // interfacfe for account  state
    user: User | null// user can be null 
}

const initialState: AccountState = {
    user: null
}

export const signInUser = createAsyncThunk<User, FieldValues>(
    'account/signInUser',
    async (data, thunkAPI) => {
        try {
            const user = await agent.Account.login(data);
            console.log(user);
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const fetchCurrentUser = createAsyncThunk<User>(
    'account/fetchCurrentUser',
    async (data, thunkAPI) => {
        try {
            const user = await agent.Account.currentUser();
            localStorage.setItem('user', JSON.stringify(user));//replacing the user with updated token from the api
            return user;
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }

    }
)

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        signOut: (state) => {
            state.user = null;
            localStorage.removeItem('user');
            history.push('/');
        }
    },
    extraReducers: (builder => {//using the same case for the 2 different methods - becuase both of thee cases return the same object type("user")  we can use "addMatcher()"
        builder.addMatcher(isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled), (state, action) => {
            state.user = action.payload;
        });
        builder.addMatcher(isAnyOf(signInUser.rejected, fetchCurrentUser.rejected), (state, action) => {
            console.log(action.payload);
        });
    })
})

export const {signOut}=accountSlice.actions;
