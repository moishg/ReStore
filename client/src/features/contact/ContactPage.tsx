import { Button, ButtonGroup, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { decrement, increment } from "./counterSlice";
 
export default function ContactPage() {
     
    const dispatch=useAppDispatch(); 
    //gettin the data from the reducer
    const { data, title } = useAppSelector(state=>state.counter);  //selecting the specific "counter" named state from the store
                                                                // and destructering its data
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
                <Button onClick={()=>dispatch(decrement(1))} variant='contained' color='error' >Decrement</Button>
                <Button onClick={()=>dispatch(increment(1))} variant='contained' color='primary' >Increment</Button>
                <Button onClick={()=>dispatch(increment(6))} variant='contained' color='secondary' >Increment by 6</Button>
            </ButtonGroup>
        </>
    )
}