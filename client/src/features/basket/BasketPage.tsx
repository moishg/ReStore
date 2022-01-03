import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid,  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import agent from "../../app/api/agent";
 
 
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore"; 
import { removeItem, setBasket } from "./basketSlice";
import BasketSummary from "./BasketSummary";
 
export default function BasketPage() {
    
    //const {basket,setBasket,removeItem}=useStoreContext();     
    //const [loading,setLoading]=useState(false);

    //using redux:
    //1.selecting the "basket" redux state  
    const  {basket} = useAppSelector(state=>state.basket );
    //2.we also need dispatch to set basket after adding and removing the item:
    const dispatch=useAppDispatch();

    
    const [status,setStatus]=useState({
        loading:false,
        name:''
    });

    function handleAddItem(productId:number,name:string){
            
            setStatus({loading:true,name});

            agent.Basket.addItem(productId)
            .then(basket => dispatch(setBasket(basket)))         
            .catch(error=>console.log(error))
            .finally(()=>setStatus({loading:true,name:''}))
    }

    function handleRemoveItem(productId:number,quantity=1,name:string)
    {
       //setLoading(true);
        setStatus({loading:true,name});

        //1.removing the item from the basket requires 2 steps:       
        agent.Basket.removeItem(productId,quantity)//1.1.removing the item from the db
         .then(()=>dispatch(removeItem({productId,quantity})))//1.2.removing the item from the basket ,using the basket's redux
        .catch(error=>console.log(error))
        .finally(()=>setStatus({loading:true,name:''}))
    }
    // const [loading, setLoading] = useState(true);
    // const [basket, setBasket] = useState<Basket | null>(null);

    // useEffect(() => {
    //     agent.Basket.get()
    //         .then(basket => setBasket(basket))
    //         .catch(error => console.log(error))
    //         .finally(() => setLoading(false))
    // }, [])

    // if (loading) return <LoadingComponent message='Loading basket...'></LoadingComponent>

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
                                    <img src={item.pictureUrl} alt={item.name} style={{height:50,marginRight:20}}></img>
                                    <span>{item.name}</span>
                                </Box>                                
                            </TableCell>
                            <TableCell align="right">${item.price/100}</TableCell>
                            <TableCell align="center">
                                <LoadingButton  loading={status.loading && status.name==='rem'+item.productId} onClick={()=>handleRemoveItem(item.productId,1,'rem'+item.productId)}  color='error'>
                                        <Remove />
                                </LoadingButton>
                                    {item.quantity}
                                <LoadingButton  loading={status.loading && status.name==='add'+item.productId} onClick={()=>handleAddItem(item.productId,'add'+item.productId)} color='secondary'>
                                        <Add />
                                </LoadingButton>
                            </TableCell>
                            <TableCell align="right">${(item.price/100 * item.quantity).toFixed(2) }</TableCell>
                            <TableCell align="right">                            
                            </TableCell>
                            <TableCell align="right">
                                {/* removing all the item enttirely =>quantity=all */}
                                <LoadingButton loading={status.loading && status.name==='del'+item.productId} onClick={()=>handleRemoveItem(item.productId,item.quantity,'del'+item.productId)}  color='error'>
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
            <BasketSummary basketItems={basket.items}/>                         
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