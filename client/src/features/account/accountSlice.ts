import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { stringify } from "querystring";
import { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import { User } from "../../app/models/user";


interface AccountState {
    user: User | null
}

const initialState: AccountState = {
    user: null
}

export const signInUser = createAsyncThunk<User, { data: FieldValues }>(
    'account/signInUser',
    async (data, thunkAPI) => {
        try {
            const user=await agent.Account.login(data);
            localStorage.setItem('user',JSON.stringify(user));
            return user;
        }
        catch (error:any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }

    }
)

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {}
})