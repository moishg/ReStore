 
 
import { LoadingButton } from "@mui/lab";
import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync, setBasket } from "../basket/basketSlice";
import { fetchProductAsync, productSelectors } from "./catalogSlice";
export default function ProductDetails() {

    const { basket,status } = useAppSelector(state => state.basket);//selecting the "basket" redux state       

    const dispatch = useAppDispatch();// for basket redux actions 

    const { id } = useParams<{ id: string }>();
    const product = useAppSelector(state => productSelectors.selectById(state, id));

    const { status: productStatus } = useAppSelector(state => state.catalog);


    const [quantity, setQuantity] = useState(0);///quantity - how many of the product items the user already have in the basket
     
    const [submitting, setSubmitting] = useState(false);//indicator for submitting the item  to api 
    const item = basket?.items.find(item => item.productId === product?.id);
     

    useEffect(() => {//callback
        if (item) {
            setQuantity(item.quantity);
        }

        if (!product) {//if poduct is undefined- i.e ,didnt get the product yet, so dispach for fetching the product
            dispatch(fetchProductAsync(parseInt(id)));
        }
        
    }, [id, item, dispatch, product])//effect wiil be only called if id parameter  changed or product fetched  or using dispatch

    function handleInputChange(event: any) {
        if (event.target.value >= 0) {
            setQuantity(parseInt(event.target.value));
        }
    }

    function handleUpdateCart() {
        setSubmitting(true);//turning on the loading flag
        //1st case: if item not exits or item.quantity==0
        if (!item || quantity > item.quantity) {
            const updatedQuantity = item ? (quantity - item.quantity) : quantity;
            dispatch(addBasketItemAsync({ productId: product?.id!, quantity: updatedQuantity }));


        }
        else //2.item exists : so need to update the quantity
        {
            const updatedQuantity = item.quantity - quantity;
            dispatch(removeBasketItemAsync({ productId: product?.id!, quantity: updatedQuantity }));//1.removing the item from the basket ,using the basket's redux

        }

        setSubmitting(false);
    }


    if (productStatus.includes('pending'))
        return <LoadingComponent message='Loading products..' />
    else if (!product) return <NotFound />
    else
        return (
            <Grid container spacing={6}>
                <Grid item xs={6}>
                    <img src={product.pictureUrl} alt={product.name} style={{ width: '100%' }} />
                </Grid>
                <Grid item xs={6}>
                    <Typography variant='h3' >{product.name}</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant='h4' color='secondary' >${(product.price / 100).toFixed(2)}</Typography>
                    <TableContainer>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Description</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Type</TableCell>
                                    <TableCell>{product.type}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Brand</TableCell>
                                    <TableCell>{product.brand}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Quantity In stock</TableCell>
                                    <TableCell>{product.quantityInStock}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField variant='outlined'
                                onChange={handleInputChange}
                                type='number'
                                label='Quantity in Cart'
                                fullWidth value={quantity}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <LoadingButton
                                disabled={item?.quantity === quantity || (!item && quantity === 0)}
                                loading={status.includes('pending')}
                                onClick={handleUpdateCart}
                                sx={{ height: '55px' }}
                                color='primary'
                                size='large'
                                variant='contained'
                                fullWidth
                            >
                                {item ? 'Update Quantity' : 'Add to Cart'}
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
}