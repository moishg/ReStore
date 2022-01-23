 import {   Button, Grid,  Typography } from "@mui/material"; 
import { Link } from "react-router-dom"; 
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore"; 
import BasketSummary from "./BasketSummary";
import BasketTable from "./BasketTable";

export default function BasketPage() {

    //const {basket,setBasket,removeItem}=useStoreContext();     
    //const [loading,setLoading]=useState(false);

    //using redux:
    //1.selecting the "basket" redux state  
    const { basket, status } = useAppSelector(state => state.basket);
    //2.we also need dispatch to set basket after adding and removing the item:
    const dispatch = useAppDispatch();


    if (!basket) return <Typography variant='h3'>Your basket is empty</Typography>

    return (
        <>
            <BasketTable items={basket.items} />
            <Grid container>
                <Grid item xs={6} />
                <Grid item xs={6} >
                    <BasketSummary basketItems={basket.items} />
                    <Button
                        component={Link}
                        to='/checkout'
                        variant='contained'
                        size='large'
                        fullWidth
                    >
                        Checkout
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}