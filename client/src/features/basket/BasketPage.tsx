import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import agent from "../../app/api/agent";


import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync, setBasket } from "./basketSlice";
import BasketSummary from "./BasketSummary";

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
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}  >
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right">Subtotal</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {basket.items.map(item => (

                            <TableRow
                                key={item.productId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <Box display='flex' alignItems='center'>
                                        <img src={item.pictureUrl} alt={item.name} style={{ height: 50, marginRight: 20 }}></img>
                                        <span>{item.name}</span>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">${item.price / 100}</TableCell>
                                <TableCell align="center">
                                    <LoadingButton loading={status===('pendingRemoveItem' + item.productId+'rem')}
                                        onClick={() => dispatch(removeBasketItemAsync({ productId: item.productId, quantity: 1,name:'rem' }))}
                                        color='error'>
                                        <Remove />
                                    </LoadingButton>
                                    {item.quantity}
                                    <LoadingButton loading={status===('pendingAddItem' + item.productId)}
                                        onClick={() => dispatch(addBasketItemAsync({ productId: item.productId, quantity: 1 }))}
                                        color='secondary'>
                                        <Add />
                                    </LoadingButton>
                                </TableCell>
                                <TableCell align="right">${(item.price / 100 * item.quantity).toFixed(2)}</TableCell>
                                <TableCell align="right">
                                </TableCell>
                                <TableCell align="right">
                                    {/* removing all the item enttirely =>quantity=all */}
                                    <LoadingButton loading={status===('pendingRemoveItem' + item.productId+'del')}
                                        onClick={() => dispatch(removeBasketItemAsync( {productId: item.productId, quantity: item.quantity ,name:'del'  }))}
                                        color='error'>
                                        <Delete />
                                    </LoadingButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

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