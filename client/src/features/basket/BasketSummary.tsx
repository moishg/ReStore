import { TableContainer, Paper, Table, TableBody, TableRow, TableCell, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useStoreContext } from "../../app/context/StoreContext";
import { BasketItem, BasketSummaryProps } from "../../app/models/basket";
import { useAppSelector } from "../../app/store/configureStore";
import { currencyFormat } from "../../app/util/util";

export default function BasketSummary({basketItems}:BasketSummaryProps) {
   // const {basket}=useStoreContext();
   const  {basket} = useAppSelector(state=>state.basket );//selecting the "basket" redux state 
    const  [subtotal,setSubTotal] = useState(0);
    const  [deliveryFee,setDeliveryFee] = useState(0);
    //let subtotal=0;
     let deliveryPerItem=50;
    useEffect(()=>{
        let totalOrderPrice=0;
        let totalDelivery=0;
        basket?.items.map((item,index)=>{
            totalOrderPrice+=item.price*item.quantity;
            if(totalOrderPrice<1000)
                totalDelivery+=deliveryPerItem ;
            return totalOrderPrice ;
        });

          
       // console.log(totalOrderPrice) ;
        setSubTotal(totalOrderPrice);
        setDeliveryFee(totalDelivery);

      })

    return (
        <>
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="left"> {currencyFormat(subtotal)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Delivery fee*</TableCell>
                            <TableCell align="left">{currencyFormat(deliveryFee)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="left">{currencyFormat(subtotal+deliveryFee)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <span style={{ fontStyle: 'italic' }}>*Orders over $100 qualify for free delivery</span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}