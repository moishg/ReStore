import { LoadingButton } from "@mui/lab";
import { Avatar, Button, Card, CardActions, CardContent, CardMedia, Typography, CardHeader } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import agent from "../../app/api/agent";
import { useStoreContext } from "../../app/context/StoreContext";
import { Product } from "../../app/models/product";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { currencyFormat } from "../../app/util/util";
import { addBasketItemAsync, setBasket } from "../basket/basketSlice";
interface Props {
    product: Product;
}
export default function ProductCard({ product }: Props) {
   
    //const  {basket} = useAppSelector(state=>state.basket );//selecting the "basket" redux state  
    //- not good (good only for getting data ) cause we need to use actions , so using dispatch instead:
   
    // const [loading, setLoading] = useState(false);        

    const  {status} = useAppSelector(state=>state.basket );   
    const dispatch=useAppDispatch();//using displatch for activating async functions 

        
     
    return (
        <Card>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: 'secondary.main' }} >
                        {product.name.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={product.name}
                titleTypographyProps={{
                    sx: { fontWeight: 'bold', color: 'primary.main' }
                }}
            />
            <CardMedia
                sx={{ height: 140, backgroundSize: 'contain', bgcolor: 'primary.light' }}
                image={product.pictureUrl}
                title={product.name}
            />
            <CardContent>
                <Typography gutterBottom color='secondary' variant="h5" >
                    {currencyFormat(product.price)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.brand} /{product.type}
                </Typography>
            </CardContent>
            <CardActions>
                <LoadingButton loading={status.includes('pendingAddItem'+product.id)} size="small" onClick={() => dispatch(addBasketItemAsync({productId:product.id,quantity:1}))} >Add to cart</LoadingButton>
                {/* <Button size="small">Add to cart</Button> */}
                <Button component={Link} to={`/catalog/${product.id}`} size="small">View</Button>
            </CardActions>
        </Card>
    )
}