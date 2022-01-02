import { createSlice } from "@reduxjs/toolkit"
import { Basket } from "../../app/models/basket"

interface BasketState {
    basket: Basket | null //basket is of type "Basket" , or null 
}

const initialState: BasketState = {
    basket: null
}

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {//creating the reducers: - passing the "state" and "action" as arguments:
        setBasket: (state, action) => {
            state.basket = action.payload
        },
        removeItem: (state, action) => {
            const { productId, quantity } = action.payload;
            const itemIndex = state.basket?.items.findIndex(i => i.productId == productId);
            if (itemIndex === -1 || itemIndex === undefined) return;
            else {
                state.basket!.items[itemIndex].quantity -= quantity;
                if (state.basket?.items[itemIndex].quantity === 0)//no quantity in the item,i.e item quwantity =0
                {
                    state.basket.items.splice(itemIndex, 1);//removing the item itself from the items list in the basket
                }
            }
        }
    }
})


export const { setBasket, removeItem } = basketSlice.actions;
