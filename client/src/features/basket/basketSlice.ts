import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import agent from "../../app/api/agent"
import { Basket } from "../../app/models/basket"

interface BasketState {
    basket: Basket | null, //basket is of type "Basket" , or null 
    status: string   //string status of the state

}

const initialState: BasketState = {
    basket: null,
    status: 'idle'
}

//creaing addBasket item ,but wih asynchronic
export const addBasketItemAsync = createAsyncThunk<Basket, { productId: number, quantity?: number }>(
    'basket/addBasketItemAsync',//funnction string identifier(type prefix)
    async ({ productId, quantity = 1 }) => {
        try {
            return await agent.Basket.addItem(productId, quantity);
        }
        catch (error) {
            console.log(error);
        }
    }
)

export const removeBasketItemAsync = createAsyncThunk<void, { productId: number, quantity: number,name?:string }>(
    'basket/removeBasketItemAsync',//function string identifier(type prefix)
    async ({ productId, quantity = 1 }) => {
        try {
            await agent.Basket.removeItem(productId, quantity);
        }
        catch (error) {
            console.log(error);
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
        // removeItem: (state, action) => {
        //     const { productId, quantity } = action.payload;
        //     const itemIndex = state.basket?.items.findIndex(i => i.productId == productId);
        //     if (itemIndex === -1 || itemIndex === undefined) return;
        //     else {
        //         state.basket!.items[itemIndex].quantity -= quantity;
        //         if (state.basket?.items[itemIndex].quantity === 0) {
        //             state.basket.items.splice(itemIndex, 1);//removing the item itself from the items list in the basket
        //         }
        //     }
        // }
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
        builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
            // console.log(action);
            state.basket = action.payload;
            state.status = 'fulfilledAddItem';//setting the state status to "fulfilled" state
        });
        builder.addCase(addBasketItemAsync.rejected, (state, action) => {
            //  console.log(action);
            state.status = 'rejectedAddItem';//setting the state status to "rejected" state
        });
        //------------------------------------------------
        //cases for :removeBasketItemAsync async  method
        //------------------------------------------------
        builder.addCase(removeBasketItemAsync.pending, (state, action) => {
            // console.log(action);
             
                state.status = 'pendingRemoveItem' + action.meta.arg.productId+action.meta.arg.name;//setting the state status to "pending" state
                
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

        builder.addCase(removeBasketItemAsync.rejected, (state) => {
            //  console.log(action);
            state.status = 'idle';//setting the state status to "idle" state
        });
    })
})


export const { setBasket } = basketSlice.actions;
