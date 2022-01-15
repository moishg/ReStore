import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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

        }
        catch (error) {
            return thunkAPI.rejectWithValue({ error: error.data })
        }

    }
)

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {}
})