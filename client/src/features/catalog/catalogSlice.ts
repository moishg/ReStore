import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Product } from "../../app/models/product";

const productsAdapter = createEntityAdapter<Product>();

export const fetchProductsAsync = createAsyncThunk<Product[]>(
    'catalog/fetchProductsAsync',
    async() => {
        try {
            return await agent.Catalog.list();

        }
        catch (error) {
            console.error(error);
        }
    }
)

export const catalogSlice=createSlice({
    name:'catalog',
    initialState:productsAdapter.getInitialState({
        productsLoaded:false,     
        status:'idle'
    }),
    reducers:{},
    extraReducers:(builder=>{
         //----------------------------------------
        //cases for fetchProductsAsyc async  method
        //-----------------------------------------
        builder.addCase(fetchProductsAsync.pending, (state) => {
            //console.log(action);
            state.status = 'pendingFetchProducts' ;//setting the state status to "pending" state
        });

        builder.addCase(fetchProductsAsync.fulfilled, (state,action ) => {
            productsAdapter.setAll(state,action.payload);
            state.status = 'idle';//setting the state status to "fulfilled" state
            state.productsLoaded=true;
        });
        builder.addCase(fetchProductsAsync.rejected, (state ) => {
            //  console.log(action);
            state.status = 'idle';//setting the state status to "rejected" state
        });
    })
})
