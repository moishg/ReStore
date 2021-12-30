import { TableContainer, Paper, Table, TableBody, TableRow, TableCell, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { BasketItem, BasketSummaryProps } from "../../app/models/basket";

export default function BasketSummary({basketItems}:BasketSummaryProps) {
    const  [subtotal,setSubTotal] = useState(0);
    const  [deliveryFee,setDeliveryFee] = useState(0);
    //let subtotal=0;
     let deliveryPerItem=50;
    useEffect(()=>{
        let totalOrderPrice=0;
        let totalDelivery=0;
        basketItems.map((item,index)=>{
            totalOrderPrice+=item.price*item.quantity/100;
            if(totalOrderPrice<1000)
                totalDelivery+=deliveryPerItem ;
            return totalOrderPrice ;
        });

          
        console.log(totalOrderPrice) ;
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
                            <TableCell align="right">{subtotal}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Delivery fee*</TableCell>
                            <TableCell align="right">{deliveryFee}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">{subtotal + deliveryFee}</TableCell>
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