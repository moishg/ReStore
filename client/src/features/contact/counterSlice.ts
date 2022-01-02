import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {
    data: number;
    title: string;
}

//when creating reducer state - we need to create initialState
const initialState: CounterState = {
    data: 42,
    title: 'YARC(yet another redux counter)'
}


export const counterSlice=createSlice({
    name:'counter',
    initialState,
    reducers:{//setting  the reducers action and name:
        increment:(state,action)=>{
            state.data+=action.payload;
        },
        decrement:(state,action)=>{
            state.data-=action.payload;
        },

    }
})

//the 2  action functions that will be exported 
export const {increment,decrement} =counterSlice.actions;