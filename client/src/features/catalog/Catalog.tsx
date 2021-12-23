import { Avatar, Button, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";

interface Props{
    products:Product[];
    addProduct: ()=>void;//setting signature of method that has not perameters and returns void
}

export default function Catalog({products,addProduct}:Props){
    return (
        <> 
            <ProductList products={products}></ProductList>
            <Button variant='contained' onClick={addProduct} >Add Product</Button>
       </>
    )
}