import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Product } from "../../app/models/product";
import { RootState } from "../../app/store/configureStore";

const productsAdapter = createEntityAdapter<Product>();

export const fetchProductsAsync = createAsyncThunk<Product[]>(
    'catalog/fetchProductsAsync',
    async (_,thunkAPI) => {
        try {
            return await agent.Catalog.list();//getting the products lists 
        }
        catch (error:any) {
            //console.log(error); 
            return thunkAPI.rejectWithValue({error:error.data}); /// if a problem accurs , "reject" case happen (and not "fulfilled")          
        }
    }
)

export const fetchProductAsync = createAsyncThunk<Product,number>(
    'catalog/fetchProductAsync',
    async (productId,thunkAPI) => {
        try {
            return await agent.Catalog.details(productId);//getting the products lists 
        }
        catch (error:any) {
           // console.log(error);
            return thunkAPI.rejectWithValue({error:error.data}); /// if a problem accurs , "reject" case happen (and not "fulfilled")
        }
    }
)

export const catalogSlice = createSlice(
    {
        name: 'catalog',
        initialState: productsAdapter.getInitialState({
            productsLoaded: false,
            status: 'idle'
        }
        ),
        reducers: {},
        extraReducers: (builder => {
            //----------------------------------------------------------
            //cases for fetchProductsAsyc async  method -"products list"
            //----------------------------------------------------------
            builder.addCase(fetchProductsAsync.pending, (state) => {
                //console.log(action);
                state.status = 'pendingFetchProducts';//setting the state status to "pending" state
            });

            builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
                productsAdapter.setAll(state, action.payload);//needed action for the "products" paylod list
                state.status = 'idle';//setting the state status to "fulfilled" state
                state.productsLoaded = true;                 
            });
            builder.addCase(fetchProductsAsync.rejected, (state,action) => {
                  console.log(action.payload);
                state.status = 'idle';//setting the state status to "rejected" state
            });
            
             //-----------------------------------------------------------
            //cases for - fetchProductAsyc async  method - single "product"
            //------------------------------------------------------------
            builder.addCase(fetchProductAsync.pending, (state) => {
                //console.log(action);
                state.status = 'pendingFetchProduct';//setting the state status to "pending" state
            });

            builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
                productsAdapter.upsertOne(state, action.payload);//needed action for the "product" paylod 
                state.status = 'idle';//setting the state status to "fulfilled" state    
                state.productsLoaded = false;               
            });

            builder.addCase(fetchProductAsync.rejected, (state,action) => {
                  console.log(action);
                state.status = 'idle';//setting the state status to "rejected" state
            });


        })
    })

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);//selecting the "catalog" slice 
