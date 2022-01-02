import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector,TypedUseSelectorHook } from "react-redux";
import { createStore } from "redux"; 
import { basketSlice } from "../../features/basket/basketSlice";
import { counterSlice } from "../../features/contact/counterSlice";
 
//using he buildin configuration instead:
export const store=configureStore({
    reducer:{         
        counter:counterSlice.reducer,//"counter" is the name we giving to the reducer,
                                    //of type "counterSlice" reducer.
        basket:basketSlice.reducer                            
    }
});

//setting types: 
export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch =typeof store.dispatch;

export const useAppDispatch=()=> useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState>=useSelector;