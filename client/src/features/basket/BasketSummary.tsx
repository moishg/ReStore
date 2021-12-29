import { TableContainer, Paper, Table, TableBody, TableRow, TableCell, Typography } from "@mui/material";
import { useEffect } from "react";
import { BasketItem, BasketSummaryProps } from "../../app/models/basket";

export default function BasketSummary({basketItems}:BasketSummaryProps) {
    let subtotal = 0;
    const deliveryFee = 0;
    useEffect(()=>{
        basketItems.map((item,index)=>subtotal+=item.price*item.quantity);

      },[])

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