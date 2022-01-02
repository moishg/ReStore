
//redux "boilerplate" cumbersome config example:
//1.action types:
export const INCREMENT_COUNTER = "INCREMENT_COUNTER"
export const DECREMENT_COUNTER = "DECREMENT_COUNTER"

//2.state:
export interface CounterState {
    data: number;
    title: string;
}

//when creating reducer state - we need to create initialState
const initialState: CounterState = {
    data: 42,
    title: 'YARC(yet another redux counter)'
}

//3.action creators:
export function increment(amount=1){
    return{
        type:INCREMENT_COUNTER,
        payload: amount
    }
}

export function decrement(amount=1){
    return{
        type:DECREMENT_COUNTER,
        payload: amount
    }
}

//creating reducer function -  setting data of the reducer state
export default function counterReducer(state = initialState, action: any) {
    switch (action.type) {
        case INCREMENT_COUNTER:
            //return state.data+1 - its MUTATING STATE - WRONG APPROACH!! -must return a new instance
            //creating new instance(Copy) of the state,with the change and returning it
            return { ...state, data: state.data + action.payload }
        case DECREMENT_COUNTER:
            //return state.data-1 - its MUTATING STATE - WRONG APPROACH!! -must return a new instance
            //creating  new instance(Copy) of the state,with the change and returning it
            return { ...state, data: state.data - action.payload }
        default:
            return state;//no change, so can return the same state
                            //must return the state no matter what!!

    } 
}