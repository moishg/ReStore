import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector,TypedUseSelectorHook } from "react-redux";
import { createStore } from "redux"; 
import { accountSlice } from "../../features/account/accountSlice";
import { basketSlice } from "../../features/basket/basketSlice";
import { catalogSlice } from "../../features/catalog/catalogSlice";
import { counterSlice } from "../../features/contact/counterSlice";
 
//using he buildin configuration instead:
export const store=configureStore({
    reducer:{         
        counter:counterSlice.reducer,//"counter" is the name we giving to the reducer,
                                    //of type "counterSlice" reducer.
        basket:basketSlice.reducer,
        catalog:catalogSlice.reducer ,
        account : accountSlice.reducer                        
    }
});

//setting types: 
export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch =typeof store.dispatch;

export const useAppDispatch=()=> useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState>=useSelector;