
export const INCREMENT_COUNTER = "INCREMENT_COUNTER"
export const DECREMENT_COUNTER = "DECREMENT_COUNTER"

export interface CounterState {
    data: number;
    title: string;
}

const initialState: CounterState = {
    data: 42,
    title: 'YARC(yet another redux counter)'
}

export default function counterReducer(state = initialState, action: any) {
    switch (action.type) {
        case INCREMENT_COUNTER:
            //return state.data+1 - its MUTATING STATE - WRONG APPROACH!! -must return a new instance
            //creating new instance(Copy) of the state,with the change and returning it
            return { ...state, data: state.data + 1 }
        case DECREMENT_COUNTER:
            //return state.data-1 - its MUTATING STATE - WRONG APPROACH!! -must return a new instance
            //creating  new instance(Copy) of the state,with the change and returning it
            return { ...state, data: state.data - 1 }
        default:
            return state;//no change, so can return the same state

    } 
}