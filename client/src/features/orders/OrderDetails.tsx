import { Remove, Add, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";
import { BasketItem } from "../../app/models/basket";
import { Order, OrderItem } from "../../app/models/order";
import { removeBasketItemAsync, addBasketItemAsync } from "../basket/basketSlice";

interface OrderDetailsProps {
    order: Order;    
}

export default function OrderDetails({ order }: OrderDetailsProps) {
    return (
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
                    {order?.orderItems?.map(item => (

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

                            <TableCell align="right">${(item.price / 100 * item.quantity).toFixed(2)}</TableCell>
                            <TableCell align="right">
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}