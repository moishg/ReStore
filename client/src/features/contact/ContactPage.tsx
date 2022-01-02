import { Button, ButtonGroup, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { CounterState, decrement, increment, } from "./counterReducer";
export default function ContactPage() {
    const dispatch=useDispatch();
    //gettin the data from the reducer
    const { data, title } = useSelector((state: CounterState) => state);

    return (
        <>
            <Typography variant='h2'>
                {title}
            </Typography>
            <Typography variant='h5'>
                data is : {data}
            </Typography>
            <ButtonGroup>

                {/* setting data(state) of reducer by calling the action */}
                <Button onClick={()=>dispatch(decrement())} variant='contained' color='error' >Decrement</Button>
                <Button onClick={()=>dispatch(increment())} variant='contained' color='primary' >Increment</Button>
                <Button onClick={()=>dispatch(increment(6))} variant='contained' color='secondary' >Increment by 6</Button>
            </ButtonGroup>
        </>
    )
}