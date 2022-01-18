import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit"
import agent from "../../app/api/agent"
import { Basket } from "../../app/models/basket"
import { getCookie } from "../../app/util/util"

interface BasketState {
    basket: Basket | null, //basket is of type "Basket" , or null 
    status: string   //string status of the state

}

const initialState: BasketState = {
    basket: null,
    status: 'idle'
}
export const fetchBasketAsync = createAsyncThunk<Basket>(
    'basket/fetchBasketAsync',
    async (_, thunkAPI) => {
        try {
            return await agent.Basket.get();
        }
        catch (error:any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    },
    {
        condition: ()=>{
            if(!getCookie('buyerId'))
            {
                return false;
            }
        }
    }
)



//creaing addBasket item ,but wih asynchronic
export const addBasketItemAsync = createAsyncThunk<Basket, { productId: number, quantity?: number }>(
    'basket/addBasketItemAsync',//funnction string identifier(type prefix)
    async ({ productId, quantity = 1 }, thunkAPI) => {
        try {
            return await agent.Basket.addItem(productId, quantity);
        }
        catch (error: any) {
            //console.log(error);
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const removeBasketItemAsync = createAsyncThunk<void, { productId: number, quantity: number, name?: string }>(
    'basket/removeBasketItemAsync',//function string identifier(type prefix)
    async ({ productId, quantity = 1 }, thunkAPI) => {
        try {
            await agent.Basket.removeItem(productId, quantity);
        }
        catch (error: any) {
            //console.log(error);
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {//creating the reducers: - passing the "state" and "action" as arguments:
        setBasket: (state, action) => {
            state.basket = action.payload
        },       
        clearBasket:(state)=>{
            state.basket=null;
        }
    },
    //adding extra reduces:
    extraReducers: (builder => {
        //----------------------------------------
        //cases for :ddBasketItemAsync async  method
        //-----------------------------------------
        builder.addCase(addBasketItemAsync.pending, (state, action) => {
            //console.log(action);
            state.status = 'pendingAddItem' + action.meta.arg.productId;//setting the state status to "pending" state
        });
       
        //------------------------------------------------
        //cases for :removeBasketItemAsync async  method
        //------------------------------------------------
        builder.addCase(removeBasketItemAsync.pending, (state, action) => {
            // console.log(action);
            state.status = 'pendingRemoveItem' + action.meta.arg.productId + action.meta.arg.name;//setting the state status to "pending" state
        });

        builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
            const { productId, quantity } = action.meta.arg;
            if (state.basket != null) {
                const itemIndex = state.basket?.items.findIndex(i => i.productId == productId);
                if (itemIndex === -1 || itemIndex === undefined) return;
                else if (quantity !== undefined) {
                    state.basket.items[itemIndex].quantity -= quantity;
                    if (state.basket.items[itemIndex].quantity === 0) {
                        state.basket.items.splice(itemIndex, 1);//removing the item itself from the items list in the basket
                    }
                }
            }

            state.status = 'idle';

        });

        builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
            state.status = 'idle';//setting the state status to "idle" state
            // console.log(action.payload);
        });

        builder.addMatcher(isAnyOf(addBasketItemAsync.fulfilled,fetchBasketAsync.fulfilled) ,(state, action) => {
            // console.log(action);
            state.basket = action.payload;
            state.status = 'idle';//setting the state status to "fulfilled" state
        });
        builder.addMatcher(isAnyOf(addBasketItemAsync.rejected,fetchBasketAsync.rejected), (state, action) => {             
            state.status = 'idle';//setting the state status to "rejected" state
            console.log(action.payload);
        });
    })
})


export const { setBasket ,clearBasket} = basketSlice.actions;
